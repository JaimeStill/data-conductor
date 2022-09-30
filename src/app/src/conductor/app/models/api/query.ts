import {
    FormBuilder,
    FormGroup,
    Validators
} from '@angular/forms';

import { Entity } from './base';
import { Connector } from './connector';

export interface Query extends Entity {
    connectorId: number;
    value: string;

    connector?: Connector;
}

export const GenerateQueryForm = (query: Query, fb: FormBuilder): FormGroup =>
    fb.group({
        id: [query?.id],
        connectorId: [query?.connectorId, Validators.required],
        name: [query?.name, Validators.required],
        value: [query?.value]
    })