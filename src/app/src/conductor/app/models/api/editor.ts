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
        id: [editor?.id],
        name: [editor?.name, Validators.required],
        font: [editor?.font, Validators.required],
        fontSize: [editor?.fontSize, [
            Validators.required,
            Validators.min(10),
            Validators.max(24)
        ]],
        tabSpacing: [editor?.tabSpacing, [
            Validators.required,
            Validators.min(2),
            Validators.max(8)
        ]]
    })