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

    validateDatabase$ = (connector: Connector): Observable<boolean> =>
        this.http.post<boolean>(`${this.api}validateDatabase`, connector);

    validateDatabase = (connector: Connector): Promise<boolean> =>
        firstValueFrom(
            this.validateDatabase$(connector)
        );
}