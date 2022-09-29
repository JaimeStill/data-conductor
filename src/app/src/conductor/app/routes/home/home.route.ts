import {
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';

import {
  Connector,
  QuerySource
} from '../../models';

import {
  ConfirmDialog,
  ConnectorDialog
} from '../../dialogs';

import { MatDialog } from '@angular/material/dialog';
import { ConnectorApi } from '../../services';

@Component({
  selector: 'home-route',
  templateUrl: 'home.route.html'
})
export class HomeRoute implements OnInit, OnDestroy {
  connectorSrc: QuerySource<Connector>;

  constructor(
    private dialog: MatDialog,
    public connectorApi: ConnectorApi
  ) { }

  ngOnInit(): void {
    this.connectorSrc = this.connectorApi.query();
  }

  ngOnDestroy(): void {
    this.connectorSrc.unsubscribe();
  }

  add = () => this.dialog.open(ConnectorDialog, {
    data: {
      id: 0,
      name: '',
      database: '',
      server: ''
    } as Connector,
    disableClose: true
  })
  .afterClosed()
  .subscribe((res: Connector) => res && this.connectorSrc.refresh());

  edit = (connector: Connector) => this.dialog.open(ConnectorDialog, {
    data: Object.assign({} as Connector, connector),
    disableClose: true    
  })
  .afterClosed()
  .subscribe((res: Connector) => res && this.connectorSrc.refresh());
}
