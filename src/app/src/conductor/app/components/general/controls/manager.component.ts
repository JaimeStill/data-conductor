import {
    Component,
    EventEmitter,
    Input,
    Output
} from '@angular/core';

@Component({
    selector: 'manager',
    templateUrl: 'manager.component.html'
})
export class ManagerComponent<T> {
    @Input() data: T;
    @Output() edit = new EventEmitter<T>();
    @Output() remove = new EventEmitter<T>();
}