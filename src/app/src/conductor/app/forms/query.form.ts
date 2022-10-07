import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges
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
    Editor,
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
    ],
    host: {
        'class': 'full-height'
    }
})
export class QueryForm implements OnChanges, OnInit, OnDestroy {
    private subs: Subscription[] = new Array<Subscription>();
    connectors$: Observable<Connector[]>;
    @Input() form: FormGroup;

    get connector() { return this.form?.get('connectorId') }
    get name() { return this.form?.get('name') }
    get value() { return this.form?.get('value') }

    private unsubscribe = () => this.subs.forEach(sub => sub.unsubscribe());

    private init = async () => {
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

    @Input() editor: Editor = <Editor>{
        font: 'Courier New',
        fontSize: 14,
        padding: 4,
        tabSpacing: 4,
        resize: false
    };

    @Input() showEditor: boolean = false;

    @Output() update = new EventEmitter<Query>();

    constructor(
        private validator: ApiValidator,
        private queryApi: QueryApi,
        public connectorApi: ConnectorApi
    ) { }

    ngOnInit(): void {
        this.connectors$ = this.connectorApi.getAll$();
    }

    async ngOnChanges(changes: SimpleChanges): Promise<void> {
        if (changes.form)
            this.init();
    }

    ngOnDestroy(): void {
        this.unsubscribe();
    }

    checkInput = (event: KeyboardEvent) => {
        if (event.target instanceof HTMLTextAreaElement) {
            if (event.key === 'Tab') {
                event.preventDefault();

                const start = event.target.selectionStart;
                const end = event.target.selectionEnd;
                const value = event.target.value;
                const spacing = ' '.repeat(this.editor?.tabSpacing ?? 4);

                event.target.value = `${value.substring(0, start)}${spacing}${value.substring(end, value.length)}`;
                event.target.selectionStart = event.target.selectionEnd = start + spacing.length;
                this.value.setValue(event.target.value);
            }
        }
    }
}