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
        super('query', generator, http);
    }

    download = (query: Query) => {
        const link = document.createElement('a');
        link.href = `data:text/plan;charset=utf-8,${encodeURIComponent(query.value)}`;
        link.download = `${query.url}.sql`;
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

    execute$ = <T>(query: Query): Observable<T[]> =>
        this.http.post<T[]>(`${this.api}execute`, query);

    execute = <T>(query: Query): Promise<T[]> =>
        firstValueFrom(
            this.execute$(query)
        );

    executeWithProps$ = <T>(query: Query, props: string): Observable<T[]> =>
        this.http.post<T[]>(`${this.api}executeWithProps/${props}`, query);

    executeWithProps = <T>(query: Query, props: string): Promise<T[]> =>
        firstValueFrom(
            this.executeWithProps$(query, props)
        );
}