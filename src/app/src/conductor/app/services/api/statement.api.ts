import {
    firstValueFrom,
    Observable
} from 'rxjs';

import {
    QuerySource,
    Statement
} from '../../models';

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { QueryGeneratorService } from '../core';
import { EntityApi } from './base';

@Injectable({
    providedIn: 'root'
})
export class StatementApi extends EntityApi<Statement> {
    constructor(
        protected http: HttpClient,
        protected generator: QueryGeneratorService
    ) {
        super('statement', generator, http);
    }

    download = (statement: Statement) => {
        const link = document.createElement('a');
        link.href = `data:text/plan;charset=utf-8,${encodeURIComponent(statement.value)}`;
        link.download = `${statement.url}.sql`;
        link.click();
    }

    queryByConnectorUrl = (connectorId: number) =>
        `${this.queryUrl}ByConnector/${connectorId}`;

    queryByConnector = (connectorId: number): QuerySource<Statement> =>
        this.generator.generateSource<Statement>(
            this.queryByConnectorUrl(connectorId)
        );

    getByConnector$ = (connectorId: number): Observable<Statement[]> =>
        this.http.get<Statement[]>(`${this.api}getByConnector/${connectorId}`);

    getByConnector = (connectorId: number): Promise<Statement[]> =>
        firstValueFrom(
            this.getByConnector$(connectorId)
        );

    execute$ = <T>(statement: Statement): Observable<T[]> =>
        this.http.post<T[]>(`${this.api}execute`, statement);

    execute = <T>(statement: Statement): Promise<T[]> =>
        firstValueFrom(
            this.execute$(statement)
        );

    executeWithProps$ = <T>(statement: Statement, props: string): Observable<T[]> =>
        this.http.post<T[]>(`${this.api}executeWithProps/${props}`, statement);

    executeWithProps = <T>(statement: Statement, props: string): Promise<T[]> =>
        firstValueFrom(
            this.executeWithProps$(statement, props)
        );
}