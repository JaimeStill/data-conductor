import {
    GetPersonOptions,
    MigrationOutput,
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
    loading: boolean = false;
    people: Person[];

    getOptions: GetPersonOptions = {
        skip: 0,
        size: 200
    };

    searchOptions: SearchPersonOptions = {
        lastName: '',
        firstName: ''
    };

    socket: MigrationSocket = new MigrationSocket();

    constructor(
        private conductor: ConductorService,
        private personApi: PersonApi
    ) { }

    get = async () => {
        if (this.getOptions.size > 0) {
            this.loading = true;
            this.people = await this.conductor.getPeople(this.getOptions);
            this.loading = false;
        }
    }

    search = async () => {
        if (this.searchOptions.lastName && this.searchOptions.firstName) {
            this.loading = true;
            this.people = await this.conductor.searchPeople(this.searchOptions);
            this.loading = false;
        }
    }

    migrate = async () => {
        this.loading = true;
        await this.personApi.migrate(this.people);
        this.loading = false;
    }
}
