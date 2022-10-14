import {
    Component,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChanges
} from '@angular/core';

import {
    Observable,
    Subscription
} from 'rxjs';

import { Person } from '../../models';
import { PersonApi } from '../../services';

@Component({
    selector: 'person-card',
    templateUrl: 'person-card.component.html',
    providers: [ PersonApi ]
})
export class PersonCardComponent implements OnChanges, OnInit, OnDestroy {
    private sub: Subscription;

    migrating: boolean = false;
    isMigrated: boolean = false;

    @Input() person: Person;
    @Input() loading: boolean = false;
    @Input() trigger: Observable<boolean>;

    private checkMigration = async () =>
        this.isMigrated = await this.personApi.isMigrated(this.person);

    constructor(
        private personApi: PersonApi
    ) { }

    async ngOnChanges(changes: SimpleChanges): Promise<void> {
        if (changes.person) {
            await this.checkMigration();
        }
    }

    ngOnInit(): void {
        this.sub = this.trigger?.subscribe(async (res: boolean) => {
            if (res)
                await this.checkMigration()
        });
    }

    ngOnDestroy(): void {
        this.sub?.unsubscribe();
    }

    display = (): string => `${this.person?.lastName}, ${this.person?.firstName} ${this.person?.middleName}`.trim()

    migrate = async () => {
        this.migrating = this.loading = true;
        await this.personApi.save(this.person);
        await this.checkMigration();
        this.migrating = this.loading = false;
    }
}
