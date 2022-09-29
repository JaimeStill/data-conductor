import {
    Component,
    OnChanges,
    EventEmitter,
    Input,
    Output,
    SimpleChanges
} from '@angular/core';

export type ManagerOrientation = 'vertical' | 'horizontal';

@Component({
    selector: 'manager',
    templateUrl: 'manager.component.html'
})
export class ManagerComponent<T> implements OnChanges {
    @Input() data: T;
    @Input() orientation: ManagerOrientation = 'vertical';
    @Input() editable: boolean = true;
    @Input() removable: boolean = true;
    @Input() viewable: boolean = true;
    @Output() edit = new EventEmitter<T>();
    @Output() remove = new EventEmitter<T>();
    @Output() view = new EventEmitter<T>();

    layout: string = 'column';
    alignment: string = 'start stretch';
    controlOptions: string = 'background-default rounded-bottom p4';

    updateLayout = (orientation: ManagerOrientation) => {
        if (orientation == 'vertical') {
            this.layout = 'column';
            this.alignment = 'start stretch';
            this.controlOptions = 'background-default rounded-bottom p4';
        } else {
            this.layout = 'row';
            this.alignment = 'space-between stretch';
            this.controlOptions = 'background-default rounded-right p4'
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.updateLayout(changes.orientation.currentValue)
    }
}