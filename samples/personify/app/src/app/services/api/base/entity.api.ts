import {
    firstValueFrom,
    Observable
} from 'rxjs';

import {
    Entity,
    IStorage,
    QuerySource,
    SessionStorage,
    ValidationResult
} from '../../../models';

import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { QueryGeneratorService } from '../../core';

export abstract class EntityApi<T extends Entity> {
    private setEndpoint = (endpoint: string): string =>
        endpoint.endsWith('/')
            ? endpoint
            : `${endpoint}/`;

    protected conductorApi: string;
    protected api: string;
    protected queryUrl: string;

    protected handleError = (err: any) => {
        throw new Error(err);
    }

    constructor(
        protected endpoint: string,
        protected generator: QueryGeneratorService,
        protected http: HttpClient
    ) {
        this.conductorApi = environment.conductorApi;
        this.endpoint = this.setEndpoint(endpoint);
        this.api = `${environment.api}${this.endpoint}`;
        this.queryUrl = `${this.api}query`;
    }

    protected base = () => <T>{
        id: 0
    }

    getBase = () => this.base();

    generateStorage = (entity: T): IStorage<T> =>
        new SessionStorage<T>(
            entity?.id
                ? `conductor-${this.endpoint}-${entity.id}`
                : `conductor-${this.endpoint}-new`
        );

    query = (): QuerySource<T> =>
        this.generator.generateSource<T>(
            this.queryUrl
        );

    isMigrated$ = (entity: T): Observable<boolean> =>
        this.http.post<boolean>(`${this.api}isMigrated`, entity);

    isMigrated = (entity: T): Promise<boolean> =>
        firstValueFrom(
            this.isMigrated$(entity)
        );

    validate$ = (entity: T): Observable<ValidationResult> =>
        this.http.post<ValidationResult>(`${this.api}validate`, entity);

    validate = (entity: T): Promise<ValidationResult> =>
        firstValueFrom(
            this.validate$(entity)
        );

    save = (entity: T): Promise<T> =>
        firstValueFrom(
            this.http.post<T>(`${this.api}save`, entity)
        );

    remove = (entity: T): Promise<number> =>
        firstValueFrom(
            this.http.delete<number>(`${this.api}remove`, { body: entity })
        );
}
