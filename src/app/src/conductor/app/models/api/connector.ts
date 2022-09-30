import {
    FormBuilder,
    FormGroup,
    Validators
} from '@angular/forms';

import { Entity } from './base';
import { Query } from './query';

export interface Connector extends Entity {
    database: string;
    server: string;

    queries?: Query[];
}

export const GenerateConnectorForm = (connector: Connector, fb: FormBuilder): FormGroup =>
    fb.group({
        id: [connector?.id ?? 0],
        name: [connector?.name ?? '', Validators.required],
        database: [connector?.database ?? '', Validators.required],
        server: [connector?.server ?? '', Validators.required]
    });