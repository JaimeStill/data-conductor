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

    querySrc: QuerySource<Query>;

    constructor(
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
    }
}