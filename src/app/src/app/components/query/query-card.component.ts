import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    SimpleChanges
} from '@angular/core';

import { Query } from '../../models';

@Component({
    selector: 'query-card',
    templateUrl: 'query-card.component.html'
})
export class QueryCardComponent implements OnChanges {
    @Input() query: Query;
    @Input() selected: boolean;

    @Output() download = new EventEmitter<Query>();
    @Output() fork = new EventEmitter<Query>();
    @Output() remove = new EventEmitter<Query>();
    @Output() select = new EventEmitter<Query>();

    private baseOptions = `background-card rounded`;
    private deselectedOptions = `${this.baseOptions} card-outline-divider`;
    private selectedOptions = `${this.baseOptions} card-outline-primary`;

    options = this.deselectedOptions;
    selectedIcon = 'radio_button_unchecked';

    private updateSelected = () => {
        if (this.selected) {
            this.options = this.selectedOptions;
            this.selectedIcon = 'radio_button_checked';
        } else {
            this.options = this.deselectedOptions;
            this.selectedIcon = 'radio_button_unchecked';
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.selected)
            this.updateSelected();
    }
}