import {
    Component,
    EventEmitter,
    Input,
    Output
} from '@angular/core';

import {
    Connector,
    QuerySource,
    Query
} from '../../models';

@Component({
    selector: 'query-list',
    templateUrl: 'query-list.component.html',
    host: {
        'class': 'full-height'
    }
})
export class QueryListComponent {
    @Input() connector: Connector;
    @Input() querySrc: QuerySource<Query>;
    @Input() current: Query;

    @Output() editConnector = new EventEmitter<Connector>();

    @Output() add = new EventEmitter();
    @Output() download = new EventEmitter<Query>();
    @Output() fork = new EventEmitter<Query>();
    @Output() remove = new EventEmitter<Query>();
    @Output() select = new EventEmitter<Query>();
    @Output() upload = new EventEmitter<string>();

    selected = (q: Query) => q?.id === this.current?.id;
}