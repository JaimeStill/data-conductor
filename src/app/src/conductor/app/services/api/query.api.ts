import {
    firstValueFrom,
    Observable
} from 'rxjs';

import {
    QuerySource,
    Query
} from '../../models';

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { QueryGeneratorService } from '../core';
import { EntityApi } from './base';

@Injectable({
    providedIn: 'root'
})
export class QueryApi extends EntityApi<Query> {
    constructor(
        protected http: HttpClient,
        protected generator: QueryGeneratorService
    ) {
        super('statement', generator, http);
    }

    download = (statement: Query) => {
        const link = document.createElement('a');
        link.href = `data:text/plan;charset=utf-8,${encodeURIComponent(statement.value)}`;
        link.download = `${statement.url}.sql`;
        link.click();
    }

    queryByConnectorUrl = (connectorId: number) =>
        `${this.queryUrl}ByConnector/${connectorId}`;

    queryByConnector = (connectorId: number): QuerySource<Query> =>
        this.generator.generateSource<Query>(
            this.queryByConnectorUrl(connectorId)
        );

    getByConnector$ = (connectorId: number): Observable<Query[]> =>
        this.http.get<Query[]>(`${this.api}getByConnector/${connectorId}`);

    getByConnector = (connectorId: number): Promise<Query[]> =>
        firstValueFrom(
            this.getByConnector$(connectorId)
        );

    execute$ = <T>(statement: Query): Observable<T[]> =>
        this.http.post<T[]>(`${this.api}execute`, statement);

    execute = <T>(statement: Query): Promise<T[]> =>
        firstValueFrom(
            this.execute$(statement)
        );

    executeWithProps$ = <T>(statement: Query, props: string): Observable<T[]> =>
        this.http.post<T[]>(`${this.api}executeWithProps/${props}`, statement);

    executeWithProps = <T>(statement: Query, props: string): Promise<T[]> =>
        firstValueFrom(
            this.executeWithProps$(statement, props)
        );
}