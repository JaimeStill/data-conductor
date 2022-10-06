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

import { Router } from '@angular/router';
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
    private router: Router,
    public connectorApi: ConnectorApi
  ) { }

  ngOnInit(): void {
    this.connectorSrc = this.connectorApi.query();
  }

  ngOnDestroy(): void {
    this.connectorSrc.unsubscribe();
  }

  add = () => this.dialog.open(ConnectorDialog, {
    data: this.connectorApi.init(),
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

  remove = (connector: Connector) => this.dialog.open(ConfirmDialog, {
    data: {
      title: 'Delete Connector?',
      content: `Are you sure you want to delete Connector ${connector.name}?`
    },
    autoFocus: false,
    disableClose: true
  })
  .afterClosed()
  .subscribe(async (result: boolean) => {
    if (result) {
      const res = await this.connectorApi.remove(connector);
      res && this.connectorSrc.refresh();
    }
  })

  view = (connector: Connector) =>
    this.router.navigate(['connector', connector.url]);
}
