import {
    Component,
    OnInit,
    OnDestroy
} from '@angular/core';

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
    QuerySource,
    Query
} from '../../models';

import {
    ConfirmDialog,
    ConnectorDialog
} from '../../dialogs';

import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'connector-route',
    templateUrl: 'connector.route.html',
    providers: [
        ConnectorApi,
        EditorApi,
        QueryApi
    ]
})
export class ConnectorRoute implements OnInit, OnDestroy {
    connector: Connector;
    query: Query;

    querySrc: QuerySource<Query>;

    constructor(
        private dialog: MatDialog,
        private route: ActivatedRoute,
        private router: Router,
        private connectorApi: ConnectorApi,
        private queryApi: QueryApi
    ) { }

    ngOnInit(): void {
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

    editConnector = (connector: Connector) => this.dialog.open(ConnectorDialog, {
        data: Object.assign({} as Connector, connector),
        disableClose: true
    })
    .afterClosed()
    .subscribe((res: Connector) => {
        if (res)
            this.router.navigate(['connector', res.url]);
    });

    selected = (query: Query) => this.query?.id === query.id;

    add = () => { }

    download = (query: Query) => this.queryApi.download(query);

    fork = () => { }

    remove = () => { }

    select = (query: Query) => this.query = this.selected(query)
        ? null
        : query;
}