import {
    Component,
    ElementRef,
    Input,
    OnInit,
    OnDestroy,
    ViewChild
} from '@angular/core';

import {
    Observable,
    Subscription
} from 'rxjs';

import { MigrationOutput } from '../../../models';

@Component({
    selector: 'console',
    templateUrl: 'console.component.html',
    styleUrls: ['console.component.scss']
})
export class ConsoleComponent implements OnInit {
    private sub: Subscription;

    messages: MigrationOutput[] = new Array<MigrationOutput>();

    @Input() height: number = 250;
    @Input() expanded: boolean = true;
    @Input() consoleStyle: string = 'p8';
    @Input() messageStyle: string = 'm4';
    @Input() output: Observable<MigrationOutput>;

    @ViewChild('console') console: ElementRef;

    private delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    private scrollConsole = () => {
        if (this.console?.nativeElement) {
            this.console.nativeElement.scrollTop = this.console.nativeElement.scrollHeight + 100;
        }
    }

    barStyle = (): string => this.expanded
        ? 'background-app-bar'
        : `background-app-bar rounded-bottom`;

    ngOnInit(): void {
        this.sub = this.output?.subscribe(async (message: MigrationOutput) => {
            if (message) {
                this.messages.push(message);
                await this.delay(10);
                this.scrollConsole();
            }
        })
    }

    ngOnDestroy(): void {
        this.sub?.unsubscribe();
    }

    clear = () => this.messages = new Array<MigrationOutput>();

    toggleExpanded = () => this.expanded = !this.expanded;
}
