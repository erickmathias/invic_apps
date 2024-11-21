import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BbsRoutingModule } from './bbs-routing.module';
import { BbsFooterComponent } from './layouts/bbs-footer/bbs-footer.component';
import { BbsLayoutComponent } from './layouts/bbs-layout/bbs-layout.component';
import { BbsSidebarComponent } from './layouts/bbs-sidebar/bbs-sidebar.component';
import { BbsTopbarComponent } from './layouts/bbs-topbar/bbs-topbar.component';
import {SimplebarAngularModule} from "simplebar-angular";
import {TranslateModule} from "@ngx-translate/core";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import { BbsHomeComponent } from './bbs-home/bbs-home.component';
import {LayoutsModule} from "../../layouts/layouts.module";


@NgModule({
  declarations: [
    BbsFooterComponent,
    BbsLayoutComponent,
    BbsSidebarComponent,
    BbsTopbarComponent,
    BbsHomeComponent,
  ],
    imports: [
        CommonModule,
        BbsRoutingModule,
        SimplebarAngularModule,
        TranslateModule,
        NgbModule,
        LayoutsModule,
    ]
})
export class BbsModule { }
