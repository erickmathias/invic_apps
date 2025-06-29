import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SlubRoutingModule } from './slub-routing.module';
import { SlabFooterComponent } from './layout/slab-footer/slab-footer.component';
import { SlabLayoutComponent } from './layout/slab-layout/slab-layout.component';
import { SlabSidebarComponent } from './layout/slab-sidebar/slab-sidebar.component';
import { SlabTopbarComponent } from './layout/slab-topbar/slab-topbar.component';
import { SlabHomeComponent } from './slab-home/slab-home.component';
import {NgbDropdownModule} from "@ng-bootstrap/ng-bootstrap";
import {TranslateModule} from "@ngx-translate/core";
import {SimplebarAngularModule} from "simplebar-angular";
import {NgSelectModule} from "@ng-select/ng-select";
import { BbsModule } from '../bbs/bbs.module';


@NgModule({
  declarations: [
    SlabFooterComponent,
    SlabLayoutComponent,
    SlabSidebarComponent,
    SlabTopbarComponent,
    SlabHomeComponent
  ],
  imports: [
    CommonModule,
    SlubRoutingModule,
    NgbDropdownModule,
    TranslateModule,
    SimplebarAngularModule,
    NgSelectModule,
    BbsModule
  ]
})
export class SlubModule { }
