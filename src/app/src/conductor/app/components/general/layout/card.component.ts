import {
    Component,
    Input
} from '@angular/core';

@Component({
    selector: 'card',
    templateUrl: 'card.component.html'
})
export class CardComponent {
    @Input() width: number | string = 360;
    @Input() layout = 'column';
    @Input() alignment = 'start stretch';
    @Input() options = 'card-outline-accent rounded';
    @Input() padding: number = 0;
    @Input() margin: number = 4;
}
