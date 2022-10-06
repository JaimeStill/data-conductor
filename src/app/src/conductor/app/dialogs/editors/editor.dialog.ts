import {
    Component,
    OnInit
} from '@angular/core';

import {
    FormBuilder,
    FormGroup
} from '@angular/forms';

import {
    Editor,
    GenerateEditorForm,
    IStorage
} from '../../models';

import { EditorApi } from '../../services';

@Component({
    selector: 'editor-dialog',
    templateUrl: 'editor.dialog.html',
    providers: [ EditorApi ]
})
export class EditorDialog implements OnInit {
    storage: IStorage<Editor>;
    preview: Editor;
    editor: Editor;
    form: FormGroup;

    constructor(
        private fb: FormBuilder,
        public editorApi: EditorApi,
    ) { }

    ngOnInit(): void {
        this.init(this.editorApi.init());
        this.editorApi.getAll();
    }

    isSelected = (e: Editor) => e?.id === this.editor?.id;

    init = (e: Editor) => {
        this.editor = e;

        this.storage = this.editorApi.generateStorage(e);

        const value = this.storage.hasState
            ? this.storage.get()
            : e;

        this.form = GenerateEditorForm(value, this.fb);
    }

    selectEditor = (e: Editor) => this.isSelected(e)
        ? this.init(this.editorApi.init())
        : this.init(e);

    update = (e: { editor: Editor, store: boolean }) => {
        this.preview = e.editor;

        if (e.store)
            this.storage.set(e.editor);
    }

    clearStorage = () => {
        this.form.reset(this.editor);
        this.storage.clear();
    }

    save = async () => {
        if (this.form?.valid) {
            const res = await this.editorApi.save(this.form.value);

            if (res) {
                this.editor = res;
                this.clearStorage();
                this.editorApi.getAll();
            }
        }
    }

    useEditorConfig = () => this.editorApi.updateStoreEditor(this.editor);
}
