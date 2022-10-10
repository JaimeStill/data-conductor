import {
    FormBuilder,
    FormGroup,
    Validators
} from '@angular/forms';

import { Entity } from './base';

export interface Product extends Entity {
    legacyProductId: number;
    legacyModelId: number;
    legacySubCategoryId: number;
    legacyCategoryId: number;
    category: string;
    model: string;
    name: string;
    productNumber: string;
    subCategory: string;
}

export const GenerateProductForm = (product: Product, fb: FormBuilder): FormGroup =>
    fb.group({
        id: [product?.id ?? 0],
        legacyProductId: [product?.legacyProductId ?? 0],
        legacyModelId: [product?.legacyModelId ?? 0],
        legacySubCategoryId: [product?.legacySubCategoryId ?? 0],
        legacyCategoryId: [product?.legacyCategoryId ?? 0],
        category: [product?.category ?? '', Validators.required],
        model: [product?.model ?? '', Validators.required],
        name: [product?.name ?? '', Validators.required],
        productNumber: [product?.productNumber ?? '', Validators.required],
        subCategory: [product?.subCategory ?? '', Validators.required]
    });
