import {
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output
} from '@angular/core';

import {
    Observable,
    Subscription
} from 'rxjs';

import {
    ApiValidator,
    ConnectorApi,
    QueryApi
} from '../services';

import {
    Connector,
    Query
} from '../models';

import { FormGroup } from '@angular/forms';

@Component({
    selector: 'query-form',
    templateUrl: 'query.form.html',
    providers: [
        ApiValidator,
        ConnectorApi,
        QueryApi
    ]
})
export class QueryForm implements OnInit, OnDestroy {
    private subs: Subscription[] = new Array<Subscription>();
    connectors$: Observable<Connector[]>;
    form: FormGroup;

    get connector() { return this.form?.get('connectorId') }
    get name() { return this.form?.get('name') }

    private unsubscribe = () => this.subs.forEach(sub => sub.unsubscribe());

    private register = async () => {
        if (this.subs.length > 0) {
            this.unsubscribe();
            this.subs = new Array<Subscription>();
        }

        this.subs.push(
            await this.validator.registerValidator(
                this.queryApi.validateName,
                this.form,
                this.name
            ),
            this.form
                .valueChanges
                .subscribe((query: Query) => this.update.emit(query))
        );
    }
    
    @Input() set data(data: FormGroup) {        
        this.form = data;
        this.register();
    }
    
    @Output() update = new EventEmitter<Query>();

    constructor(
        private validator: ApiValidator,
        private queryApi: QueryApi,
        public connectorApi: ConnectorApi
    ) { }

    ngOnInit(): void {
        this.connectors$ = this.connectorApi.getAll$();
    }

    ngOnDestroy(): void {
        this.unsubscribe();
    }
}