import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DefaultComponent } from './dashboards/default/default.component';
import {UsersComponent} from "./users/users.component";
import {AuthGuard} from "../core/guards/auth.guard";
import {PackageListComponent} from "../modules/bbs/packages/package-list/package-list.component";
import {SubscriptionListComponent} from "../modules/bbs/subscriptions/subscription-list/subscription-list.component";
import {MyClientsComponent} from "../modules/bbs/clients/my-clients/my-clients.component";
import {ProfileComponent} from "../modules/bbs/profile/profile/profile.component";
import {MyProjectsComponent} from "../modules/bbs/projects/my-projects/my-projects.component";
import {PesaPallOrderRequestComponent} from "./pesa-pall-order-request/pesa-pall-order-request.component";

const routes: Routes = [
  { path: '', redirectTo: 'dashboard' },
  { path: 'dashboard', component: DefaultComponent, canActivate: [AuthGuard] },
  { path: 'users', component: UsersComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'projects', component: MyProjectsComponent, canActivate: [AuthGuard] },
  { path: 'clients', component: MyClientsComponent, canActivate: [AuthGuard] },
  { path: 'packages', component: PackageListComponent, canActivate: [AuthGuard] },
  { path: 'subscriptions', component: SubscriptionListComponent, canActivate: [AuthGuard] },
  { path: 'subscriptions/order-request', component: PesaPallOrderRequestComponent, canActivate: [AuthGuard] },
  //{ path: 'packages', loadChildren: () => import('../modules/bbs/packages/packages.module').then(m => m.PackagesModule), canActivate: [AuthGuard] },
  { path: 'dashboards', loadChildren: () => import('./dashboards/dashboards.module').then(m => m.DashboardsModule) },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
