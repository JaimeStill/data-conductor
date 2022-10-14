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
    interpolated: boolean;

    connector?: Connector;
}

export const GenerateQueryForm = (query: Query, fb: FormBuilder): FormGroup =>
    fb.group({
        id: [query?.id ?? 0],
        connectorId: [query?.connectorId ?? 0, Validators.required],
        name: [query?.name ?? '', Validators.required],
        url: [query?.url ?? ''],
        value: [query?.value ?? ''],
        interpolated: [query?.interpolated ?? false]
    })