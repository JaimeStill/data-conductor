import {
    HubConnection,
    HubConnectionBuilder
} from '@microsoft/signalr';

import { BehaviorSubject } from 'rxjs';
import { MigrationOutput } from './migration-output';
import { environment } from '../../../environments/environment';

interface SocketState {
    connected: boolean;
    error: any | null;
}

export class MigrationSocket {
    private endpoint = `${environment.server}migration-socket`;
    private connection: HubConnection;
    private output = new BehaviorSubject<MigrationOutput>(null);
    private state = new BehaviorSubject<SocketState>({
        connected: false,
        error: null
    });

    output$ = this.output.asObservable();
    state$ = this.state.asObservable();

    constructor() {
        this.connection = new HubConnectionBuilder()
            .withAutomaticReconnect()
            .withUrl(this.endpoint, {
                withCredentials: false
            })
            .build();

        this.connection.on(
            'output',
            (data: MigrationOutput) => this.output.next(data)
        );

        this.connection
            .start()
            .then(() => this.state.next({
                connected: true,
                error: null
            }))
            .catch((error: any) => this.state.next({
                connected: false,
                error
            }));
    }
}
