import {
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    Output
} from '@angular/core';

import {
    ApiValidator,
    ConnectorApi,
    QueryApi
} from '../services';

import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Query } from '../models';

@Component({
    selector: 'query-form',
    templateUrl: 'query.form.html',
    providers: [
        ApiValidator,
        ConnectorApi,
        QueryApi
    ]
})
export class QueryForm implements OnDestroy {
    private subs: Subscription[] = new Array<Subscription>();
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

    ngOnDestroy(): void {
        this.unsubscribe();
    }
}