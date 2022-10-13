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
    private state = new BehaviorSubject<SocketState>({
        connected: false,
        error: null
    });

    output = new Array<MigrationOutput>();
    state$ = this.state.asObservable();

    constructor() {
        this.connection = new HubConnectionBuilder()
            .withUrl(this.endpoint)
            .build();

        this.connection.on(
            'output',
            (data: MigrationOutput) => this.output.push(data)
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
