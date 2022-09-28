import {
  Component,
  OnInit
} from '@angular/core';
import { QuerySource, Statement } from '../../models';

import { StatementApi } from '../../services';

@Component({
  selector: 'home-route',
  templateUrl: 'home.route.html'
})
export class HomeRoute implements OnInit {
  statementSrc: QuerySource<Statement>;

  constructor(
    public statementApi: StatementApi
  ) { }

  ngOnInit() {
    this.statementSrc = this.statementApi.query();
  }

  download = (statement: Statement) =>
    this.statementApi.download(statement);
}
