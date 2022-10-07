import {
    Component,
    OnInit,
    OnDestroy
} from '@angular/core';

import {
    FormBuilder,
    FormGroup
} from '@angular/forms';

import {
    ActivatedRoute,
    ParamMap,
    Router
} from '@angular/router';

import {
    ConnectorApi,
    EditorApi,
    QueryApi
} from '../../services';

import {
    Connector,
    Editor,
    GenerateQueryForm,
    IStorage,
    QuerySource,
    Query
} from '../../models';

import {
    ConfirmDialog,
    ConnectorDialog,
    EditorDialog,
    QueryDialog
} from '../../dialogs';

import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'connector-route',
    templateUrl: 'connector.route.html',
    providers: [
        ConnectorApi,
        QueryApi
    ]
})
export class ConnectorRoute implements OnInit, OnDestroy {
    connector: Connector;
    query: Query;
    querySrc: QuerySource<Query>;
    results: any[];

    interpolation: string = '';
    form: FormGroup;
    storage: IStorage<Query>;

    constructor(
        private dialog: MatDialog,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private connectorApi: ConnectorApi,
        public editorApi: EditorApi,
        private queryApi: QueryApi
    ) { }

    async ngOnInit(): Promise<void> {
        this.editorApi.getStoreEditor();
        this.editorApi.getAll();

        this.route.paramMap.subscribe(async (params: ParamMap) => {
            if (params.has('url')) {
                this.connector = await this.connectorApi.getByUrl(params.get('url'));
                this.querySrc = this.queryApi.queryByConnector(this.connector.id);
            } else
                this.router.navigate(['/']);
        })
    }

    ngOnDestroy(): void {
        this.querySrc.unsubscribe();
    }

    //#region Connector

    editConnector = (connector: Connector) => this.dialog.open(ConnectorDialog, {
        data: Object.assign(<Connector>{}, connector),
        disableClose: true
    })
        .afterClosed()
        .subscribe((res: Connector) => {
            if (res)
                this.router.navigate(['connector', res.url]);
        });

    //#endregion

    //#region Query

    private openQueryEditor = (query: Query) => this.dialog.open(QueryDialog, {
        data: query,
        disableClose: true
    });

    selected = (query: Query) => this.query?.id === query.id;

    add = () => this.openQueryEditor(
        Object.assign(
            this.queryApi.getBase(),
            <Query>{ connectorId: this.connector?.id }
        )
    )
        .afterClosed()
        .subscribe((res: Query) => res && this.querySrc.refresh());

    download = (query: Query) => this.queryApi.download(query);

    fork = (query: Query) => this.openQueryEditor(
        Object.assign(
            this.queryApi.getBase(),
            query,
            <Query>{ id: 0, name: '', url: '' }
        )
    )
        .afterClosed()
        .subscribe((res: Query) => res && this.querySrc.refresh());

    remove = (query: Query) => this.dialog.open(ConfirmDialog, {
        data: {
            title: 'Remove Query?',
            content: `Are you sure you want to remove Query ${query.name}?`
        },
        disableClose: true,
        autoFocus: false
    })
        .afterClosed()
        .subscribe(async (result: boolean) => {
            if (result) {
                if (this.selected(query))
                    this.select(query);

                const res = await this.queryApi.remove(query);
                res && this.querySrc.refresh();
            }
        });

    select = (query: Query) => {
        if (this.selected(query)) {
            this.query = null;
            this.form = null;
            this.storage = null;
        } else {
            this.query = query;
            this.storage = this.queryApi.generateStorage(this.query);

            const value = this.storage.hasState
                ? this.storage.get()
                : this.query;

            this.form = GenerateQueryForm(value, this.fb);
        }
    }

    upload = (value: string) => {
        this.openQueryEditor(
            Object.assign(
                this.queryApi.getBase(),
                <Query>{ value, connectorId: this.connector?.id }
            )
        )
        .afterClosed()
        .subscribe((res: Query) => res && this.querySrc.refresh());
    }

    update = (query: Query) => this.storage.set(query);

    clearStorage = () => {
        this.form.reset(this.query);
        this.storage.clear();
    }

    save = async () => {
        if (this.form?.valid) {
            const res = await this.queryApi.save(this.form.value);

            if (res) {
                this.query = res;
                this.clearStorage();
                this.querySrc.refresh();
            }
        }
    }

    clearResults = () => this.results = null;

    execute = async () =>
        this.results = this.form.get('interpolated').value
            ? await this.queryApi.executeWithProps(this.form.value, this.interpolation)
            : await this.queryApi.execute(this.form.value);

    //#endregion

    //#region Editor

    compareEditors = (a: Editor, b: Editor) => a.id === b.id;

    selectEditor = (e: Editor) => this.editorApi.updateStoreEditor(e);

    editorSettings = () => this.dialog.open(EditorDialog, {
        data: this.editorApi,
        disableClose: true
    })
        .afterClosed()
        .subscribe(() => this.editorApi.getAll());

    //#endregion
}