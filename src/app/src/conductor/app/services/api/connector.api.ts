import {
    firstValueFrom,
    Observable
} from 'rxjs';

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { QueryGeneratorService } from '../core';
import { EntityApi } from './base';
import { Connector } from '../../models';

@Injectable({
    providedIn: 'root'
})
export class ConnectorApi extends EntityApi<Connector> {
    constructor(
        protected http: HttpClient,
        protected generator: QueryGeneratorService
    ) {
        super('connector', generator, http);
    }

    override getBase = () => Object.assign(
        <Connector>{
            database: '',
            server: ''
        },
        this.base()
    );

    getAll$ = (sort: string = "Name"): Observable<Connector[]> =>
        this.http.get<Connector[]>(`${this.api}getAll?sort=${sort}`);

    getAll = (sort: string = "Name"): Promise<Connector[]> =>
        firstValueFrom(
            this.getAll$(sort)
        );

    validateDatabase$ = (connector: Connector): Observable<boolean> =>
        this.http.post<boolean>(`${this.api}validateDatabase`, connector);

    validateDatabase = (connector: Connector): Promise<boolean> =>
        firstValueFrom(
            this.validateDatabase$(connector)
        );
}