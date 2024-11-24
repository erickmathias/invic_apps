import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AuthGuard} from "../../core/guards/auth.guard";
import {BbsHomeComponent} from "./bbs-home/bbs-home.component";
const routes: Routes = [
  { path: '', component: BbsHomeComponent, canActivate: [AuthGuard] },
  { path: 'profile', loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule), canActivate: [AuthGuard] },
  { path: 'clients', loadChildren: () => import('./clients/clients.module').then(m => m.ClientsModule), canActivate: [AuthGuard] },
  { path: 'projects', loadChildren: () => import('./projects/projects.module').then(m => m.ProjectsModule), canActivate: [AuthGuard] },
  { path: 'packages', loadChildren: () => import('./packages/packages.module').then(m => m.PackagesModule), canActivate: [AuthGuard] },
  // { path: 'subscriptions', loadChildren: () => import('./subscriptions/subscriptions.module').then(m => m.SubscriptionsModule), canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BbsRoutingModule { }
