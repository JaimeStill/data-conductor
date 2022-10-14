import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { QueryGeneratorService } from '../core';
import { EntityApi } from './base';
import { Person } from '../../models';

@Injectable({
    providedIn: 'root'
})
export class PersonApi extends EntityApi<Person> {
    constructor(
        protected http: HttpClient,
        protected generator: QueryGeneratorService
    ) {
        super('person', generator, http)
    }

    override getBase = () => Object.assign(
        <Person>{
            legacyPersonId: 0,
            firstName: '',
            lastName: '',
            middleName: ''
        },
        this.base()
    )

    migrate = (people: Person[]): Promise<number> =>
        firstValueFrom(
            this.http.post<number>(`${this.api}migrate`, people)
        );
}
