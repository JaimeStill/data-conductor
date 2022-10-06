import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    Output,
    SimpleChanges
} from '@angular/core';

import {
    ApiValidator,
    EditorApi
} from '../services';

import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Editor } from '../models';

@Component({
    selector: 'editor-form',
    templateUrl: 'editor.form.html',
    providers: [
        ApiValidator,
        EditorApi
    ]
})
export class EditorForm implements OnChanges, OnDestroy {
    private subs: Subscription[] = new Array<Subscription>();
    @Input() form: FormGroup;
    @Output() preview = new EventEmitter<Editor>();

    get color() { return this.form?.get('color') }
    get name() { return this.form?.get('name') }
    get font() { return this.form?.get('font') }
    get fontSize() { return this.form?.get('fontSize') }
    get padding() { return this.form?.get('padding') }
    get tabSpacing() { return this.tabSpacing?.get('tabSpacing') }

    private unsubscribe = () => this.subs?.forEach(sub => sub?.unsubscribe());

    private init = async () => {
        if (this.subs?.length > 0) {
            this.unsubscribe();
            this.subs = new Array<Subscription>();
        }

        this.subs.push(
            await this.validator.registerValidator(
                this.editorApi.validateName,
                this.form,
                this.name
            ),
            this.form
                .valueChanges
                .subscribe({
                    next: (editor: Editor) => this.preview.emit(editor)
                })
        )
    }

    constructor(
        private validator: ApiValidator,
        private editorApi: EditorApi
    ) { }

    async ngOnChanges(changes: SimpleChanges): Promise<void> {
        if (changes.form)
            await this.init();
    }

    ngOnDestroy(): void {
        this.unsubscribe();
    }
}