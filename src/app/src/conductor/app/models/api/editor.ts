import {
    FormBuilder,
    FormGroup,
    Validators
} from '@angular/forms';

import { Entity } from './base';

export interface Editor extends Entity {
    font: string;
    fontSize: number;
    tabSpacing: number;
}

export const GenerateEditorForm = (editor: Editor, fb: FormBuilder) =>
    fb.group({
        id: [editor?.id ?? 0],
        name: [editor?.name ?? '', Validators.required],
        font: [editor?.font ?? '', Validators.required],
        fontSize: [editor?.fontSize ?? 14, [
            Validators.required,
            Validators.min(10),
            Validators.max(24)
        ]],
        tabSpacing: [editor?.tabSpacing ?? 4, [
            Validators.required,
            Validators.min(2),
            Validators.max(8)
        ]]
    })