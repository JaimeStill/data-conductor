import {
    Component,
    Input
} from '@angular/core';

import { Connector } from '../../models';

@Component({
    selector: 'connector-display',
    templateUrl: 'connector-display.component.html'
})
export class ConnectorDisplayComponent {
    @Input() connector: Connector;
}