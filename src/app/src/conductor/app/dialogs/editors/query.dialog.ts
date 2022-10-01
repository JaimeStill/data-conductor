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
    storage: IStorage<Query>;
    form: FormGroup;

    constructor(
        private queryApi: QueryApi,
        private dialog: MatDialogRef<QueryDialog>,
        private fb: FormBuilder,
        @Inject(MAT_DIALOG_DATA) public query: Query
    ) { }

    async ngOnInit(): Promise<void> {
        this.storage = this.queryApi.generateStorage(this.query);
        
        const value = this.storage.hasState
            ? this.storage.get()
            : this.query;

        this.form = GenerateQueryForm(value, this.fb);
    }

    update = (query: Query) => this.storage.set(query);

    clearStorage = () => {
        this.form.reset(this.query);
        this.storage.clear();
    }

    save = async () => {
        if (this.form?.valid) {
            const res = await this.queryApi.save(this.form.value);

            if (res) {
                this.clearStorage();
                this.dialog.close(res);
            }
        }
    }
}