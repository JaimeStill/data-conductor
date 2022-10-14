import {
    Component,
    Input,
    EventEmitter,
    Output
} from '@angular/core';

import {
    GetPersonOptions,
    SearchPersonOptions
} from '../../models';

@Component({
    selector: 'option-tabs',
    templateUrl: 'option-tabs.component.html'
})
export class OptionTabsComponent {
    @Input() loading: boolean = false;
    @Output() get = new EventEmitter<GetPersonOptions>();
    @Output() search = new EventEmitter<SearchPersonOptions>();

    getOptions: GetPersonOptions = {
        skip: 0,
        size: 200
    };

    searchOptions: SearchPersonOptions = {
        lastName: '',
        firstName: ''
    };
}
