import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    SimpleChanges
} from '@angular/core';

import { Clipboard } from '@angular/cdk/clipboard';

@Component({
    selector: 'results',
    templateUrl: 'results.component.html'
})
export class ResultsComponent implements OnChanges {
    @Input() results: any[];
    @Input() expanded: boolean = false;
    @Input() spacing: number = 4;
    @Output() clear = new EventEmitter();

    constructor(
        private clipboard: Clipboard
    ) { }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.results) {
            this.expanded = this.results?.length > 0;
        }
    }

    toggleExpanded = () => this.expanded = !this.expanded;

    copy = (data?: any) =>
        this.clipboard.copy(JSON.stringify(data ?? this.results, null, this.spacing));

    disabled = () => !this.results || this.results?.length < 1;
}