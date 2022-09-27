import {
    FormBuilder,
    FormGroup,
    Validators
} from '@angular/forms';

import { Entity } from './base';
import { Connector } from './connector';

export interface Statement extends Entity {
    connectorId: number;
    value: string;

    connector?: Connector;
}

export const GenerateStatementForm = (statement: Statement, fb: FormBuilder): FormGroup =>
    fb.group({
        id: [statement?.id],
        connectorId: [statement?.connectorId, Validators.required],
        name: [statement?.name, Validators.required],
        value: [statement?.value, Validators.required]
    })