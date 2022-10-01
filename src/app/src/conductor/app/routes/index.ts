import { Route } from '@angular/router';
import { ConnectorRoute } from './connector';
import { HomeRoute } from './home';

export const RouteComponents = [
  ConnectorRoute,
  HomeRoute
]

export const Routes: Route[] = [
  { path: 'connector/:url', component: ConnectorRoute },
  { path: '', component: HomeRoute },
  { path: '**', redirectTo: '', pathMatch: 'full' }
]
