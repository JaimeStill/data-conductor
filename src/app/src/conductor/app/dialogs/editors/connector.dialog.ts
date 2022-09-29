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
    Connector,
    GenerateConnectorForm,
    IStorage
} from '../../models';

import { ConnectorApi } from '../../services';

@Component({
    selector: 'connector-dialog',
    templateUrl: 'connector.dialog.html',
    providers: [ ConnectorApi ]
})
export class ConnectorDialog implements OnInit {
    storage: IStorage<Connector>;
    form: FormGroup;

    constructor(
        private connectorApi: ConnectorApi,
        private dialog: MatDialogRef<ConnectorDialog>,
        private fb: FormBuilder,
        @Inject(MAT_DIALOG_DATA) public connector: Connector
    ) { }

    async ngOnInit(): Promise<void> {
        this.storage = this.connectorApi.generateStorage(this.connector);

        const value = this.storage.hasState
            ? this.storage.get()
            : this.connector;

        this.form = GenerateConnectorForm(value, this.fb);

        this.form
            .valueChanges
            .subscribe((connector: Connector) => this.storage.set(connector));
    }

    clearStorage = () => {
        this.form.reset(this.connector);
        this.storage.clear();
    }

    save = async() => {
        if (this.form?.valid) {
            const res = await this.connectorApi.save(this.form.value);

            if (res) {
                this.clearStorage();
                this.dialog.close(res);
            }
        }
    }
}