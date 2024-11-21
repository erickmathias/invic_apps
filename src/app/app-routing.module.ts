import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './core/guards/auth.guard';
import { LayoutComponent } from './layouts/layout.component';
import { Page404Component } from './extrapages/page404/page404.component';
import {BbsLayoutComponent} from "./modules/bbs/layouts/bbs-layout/bbs-layout.component";
import {SlabLayoutComponent} from "./modules/slub/layout/slab-layout/slab-layout.component";

const routes: Routes = [
  { path: 'account', loadChildren: () => import('./account/account.module').then(m => m.AccountModule)},
  // tslint:disable-next-line: max-line-length
  { path: '', component: LayoutComponent, loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule), canActivate: [AuthGuard] },
  { path: 'pages', loadChildren: () => import('./extrapages/extrapages.module').then(m => m.ExtrapagesModule), canActivate: [AuthGuard] },
  {
    path: 'bbs',
    component: BbsLayoutComponent,
    loadChildren: () => import('./modules/bbs/bbs.module').then(m => m.BbsModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'slab',
    component: SlabLayoutComponent,
    loadChildren: () => import('./modules/slub/slub.module').then(m => m.SlubModule),
    canActivate: [AuthGuard]
  },

  { path: '**', component: Page404Component },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top', relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})

export class AppRoutingModule { }
