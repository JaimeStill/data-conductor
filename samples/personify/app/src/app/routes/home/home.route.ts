import {
    BehaviorSubject,
    Observable
} from 'rxjs';

import {
    GetPersonOptions,
    MigrationSocket,
    Person,
    SearchPersonOptions
} from '../../models';

import {
    ConductorService,
    PersonApi
} from '../../services';

import { Component } from '@angular/core';

@Component({
    selector: 'home-route',
    templateUrl: 'home.route.html',
    providers: [
        ConductorService,
        PersonApi
    ]
})
export class HomeRoute {
    private trigger: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    loading: boolean = false;
    people: Person[];
    socket: MigrationSocket = new MigrationSocket();
    trigger$: Observable<boolean> = this.trigger.asObservable();

    constructor(
        private conductor: ConductorService,
        private personApi: PersonApi
    ) { }

    get = async (getOptions: GetPersonOptions) => {
        if (getOptions?.size > 0) {
            this.loading = true;
            this.people = await this.conductor.getPeople(getOptions);
            this.loading = false;
        }
    }

    search = async (searchOptions: SearchPersonOptions) => {
        if (searchOptions?.lastName && searchOptions?.firstName) {
            this.loading = true;
            this.people = await this.conductor.searchPeople(searchOptions);
            this.loading = false;
        }
    }

    clear = () => this.people = null;

    migrate = async () => {
        this.loading = true;
        await this.personApi.migrate(this.people);
        this.trigger.next(true);
        this.loading = false;
    }
}
