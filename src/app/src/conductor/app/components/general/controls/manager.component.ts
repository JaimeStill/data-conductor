import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
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
    controlLayout: string = 'row';
    controlAlignment: string = 'space-between center';
    controlOptions: string = 'background-default rounded-bottom p4';

    private multipleControls = (): boolean => (
        (this.editable && this.viewable)
        || (this.editable && this.removable)
        || (this.viewable && this.removable)
    );

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
        if (changes.orientation) {
            this.updateLayout();
        }

        if (changes.editable || changes.removable || changes.viewable) {
            this.updateControlAlignment()
        }
    }
}