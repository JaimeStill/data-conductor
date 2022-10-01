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

    options = 'background-card rounded card-outline-accent';
    selectedIcon = 'radio_button_unchecked';

    private updateSelected = () => {
        if (this.selected) {
            this.options = 'background-card rounded card-outline-primary';
            this.selectedIcon = 'radio_button_checked';
        } else {
            this.options = 'background-card rounded card-outline-accent';
            this.selectedIcon = 'radio_button_unchecked';
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.selected)
            this.updateSelected();
    }
}