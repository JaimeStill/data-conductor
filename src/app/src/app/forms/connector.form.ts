import {
    Component,
    Input,
    OnChanges,
    OnDestroy,
    SimpleChanges
} from '@angular/core';

import {
    ApiValidator,
    ConnectorApi
} from '../services';

import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
    selector: 'connector-form',
    templateUrl: 'connector.form.html',
    providers: [
        ApiValidator,
        ConnectorApi
    ]
})
export class ConnectorForm implements OnChanges, OnDestroy {
    private subs: Subscription[] = new Array<Subscription>;
    @Input() form: FormGroup;

    get name() { return this.form?.get('name') }
    get database() { return this.form?.get('database') }
    get server() { return this.form?.get('server') }

    private unsubscribe = () =>
        this.subs.forEach(sub => sub.unsubscribe());

    private init = async () => {
        if (this.subs.length > 0) {
            this.unsubscribe();
            this.subs = new Array<Subscription>();
        }
        
        this.subs.push(
            await this.validator.registerValidator(
                this.connectorApi.validateName,
                this.form,
                this.name                
            ),
            await this.validator.registerValidator(
                this.connectorApi.validateDatabase,
                this.form,
                this.database
            )
        )
    }

    constructor(
        private validator: ApiValidator,
        private connectorApi: ConnectorApi
    ) { }

    async ngOnChanges(changes: SimpleChanges): Promise<void> {
        if (changes.form)
            await this.init();
    }

    ngOnDestroy(): void {
        this.unsubscribe();
    }
}