import {
    Component,
    Inject,
    OnInit
} from '@angular/core';

import {
    MatDialogRef,
    MAT_DIALOG_DATA
} from '@angular/material/dialog';

import {
    FormBuilder,
    FormGroup
} from '@angular/forms';

import {
    GenerateQueryForm,
    IStorage,
    Query
} from '../../models';

import { QueryApi } from '../../services';

@Component({
    selector: 'query-dialog',
    templateUrl: 'query.dialog.html',
    providers: [ QueryApi ]
})
export class QueryDialog implements OnInit {
    async ngOnInit(): Promise<void> {
        
    }
}