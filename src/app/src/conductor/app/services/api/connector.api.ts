import {
    firstValueFrom,
    Observable
} from 'rxjs';

import {
    Connector,
    ValidationResult
} from '../../models';

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { QueryGeneratorService } from '../core';
import { EntityApi } from './base';

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

    test$ = (connector: Connector): Observable<ValidationResult> =>
        this.http.post<ValidationResult>(`${this.api}test`, connector);

    test = (connector: Connector): Promise<ValidationResult> =>
        firstValueFrom(
            this.test$(connector)
        );

    testByUrl$ = (url: string): Observable<ValidationResult> =>
        this.http.get<ValidationResult>(`${this.api}test/${url}`);

    testByUrl = (url: string): Promise<ValidationResult> =>
        firstValueFrom(
            this.testByUrl$(url)
        );

    validateDatabase$ = (connector: Connector): Observable<boolean> =>
        this.http.post<boolean>(`${this.api}validateDatabase`, connector);

    validateDatabase = (connector: Connector): Promise<boolean> =>
        firstValueFrom(
            this.validateDatabase$(connector)
        );
}