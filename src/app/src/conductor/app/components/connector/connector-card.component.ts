import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    SimpleChanges
} from '@angular/core';

import { Connector } from '../../models';

export type ConnectorOrientation = 'vertical' | 'horizontal';

@Component({
    selector: 'connector-card',
    templateUrl: 'connector-card.component.html'
})
export class ConnectorCardComponent implements OnChanges {
    @Input() connector: Connector;
    @Input() orientation: ConnectorOrientation = 'vertical';
    @Input() editable: boolean = true;
    @Input() removable: boolean = true;
    @Input() testable: boolean = true;
    @Input() viewable: boolean = true;
    @Output() edit = new EventEmitter<Connector>();
    @Output() remove = new EventEmitter<Connector>();
    @Output() test = new EventEmitter<Connector>();
    @Output() view = new EventEmitter<Connector>();

    layout: string = 'column';
    alignment: string = 'start stretch';
    controlLayout: string = 'row';
    controlAlignment: string = 'space-between center';
    controlOptions: string = 'background-default rounded-bottom p4';

    private multipleControls = (): boolean => {
        if (this.editable) {
            if (!(this.removable || this.testable || this.viewable))
                return false;
        }

        if (this.removable) {
            if (!(this.editable || this.testable || this.viewable))
                return false;
        }

        if (this.testable) {
            if (!(this.editable || this.removable || this.viewable))
                return false;
        }

        if (this.viewable) {
            if (!(this.editable || this.removable || this.testable))
                return false;
        }

        return true;
    }

    private updateLayout = () => {
        if (this.orientation == 'vertical') {
            this.layout = 'column';
            this.alignment = 'start stretch';
            this.controlLayout = 'row';
            this.controlOptions = 'background-default rounded-bottom p4';
        } else {
            this.layout = 'row';
            this.alignment = 'space-between stretch';
            this.controlLayout = 'column';
            this.controlOptions = 'background-default rounded-right p4'
        }
    }

    private updateControlAlignment = () => {
        if (this.multipleControls())
            this.controlAlignment = 'space-between center'
        else
            this.controlAlignment = this.orientation === 'horizontal'
                ? 'center center'
                : 'end center';
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.orientation)
            this.updateLayout();

        if (changes.editable || changes.removable || changes.testable || changes.viewable)
            this.updateControlAlignment();
    }
}