import {
    GetPersonOptions,
    Person,
    SearchPersonOptions
} from '../models';

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { SnackerService } from './core';

@Injectable({
    providedIn: 'root'
})
export class ConductorService {
    private api: string;

    constructor(
        private http: HttpClient,
        private snacker: SnackerService
    ) {
        this.api = environment.conductor
    }

    private executeWithProps = <T>(url: string): Promise<T> =>
        firstValueFrom(
            this.http.get<T>(`${this.api}executeWithProps/${url}`)
                .pipe(
                    catchError((err: any) => {
                        this.snacker.sendErrorMessage(err);
                        throw new Error(err)
                    })
                )
        )

    getPeople = (migrate: GetPersonOptions): Promise<Person[]> =>
        this.executeWithProps<Person[]>(
            `get-people/skip:${migrate.skip}/size:${migrate.size}`
        );

    searchPeople = (search: SearchPersonOptions): Promise<Person[]> =>
        this.executeWithProps<Person[]>(
            `search-people/lastName:${search.lastName}/firstName:${search.firstName}`
        );
}
