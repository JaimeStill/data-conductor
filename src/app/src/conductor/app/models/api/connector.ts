import {
    FormBuilder,
    FormGroup,
    Validators
} from '@angular/forms';

import { Entity } from './base';
import { Statement } from './statement'

export interface Connector extends Entity {
    database: string;
    server: string;

    statements?: Statement[];
}

export const GenerateConnectorForm = (connector: Connector, fb: FormBuilder): FormGroup =>
    fb.group({
        id: [connector?.id],
        name: [connector?.name, Validators.required],
        database: [connector?.database, Validators.required],
        server: [connector?.server, Validators.required]
    });