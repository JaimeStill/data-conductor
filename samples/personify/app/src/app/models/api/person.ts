import {
    FormBuilder,
    FormGroup,
    Validators
} from '@angular/forms';

import { Entity } from './base';

export interface Person extends Entity {
    legacyPersonId: number;
    lastName: string;
    firstName: string;
    middleName: string;
}

export const GeneratePersonForm = (person: Person, fb: FormBuilder): FormGroup =>
    fb.group({
        id: [person?.id ?? 0],
        legacyPersonId: [person?.legacyPersonId ?? 0],
        lastName: [person?.lastName ?? '', Validators.required],
        firstName: [person?.firstName ?? '', Validators.required],
        middleName: [person?.middleName ?? '']
    });
