import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PackagesRoutingModule } from './packages-routing.module';
import { PackageListComponent } from './package-list/package-list.component';
import {UIModule} from "../../../shared/ui/ui.module";
import { PackageOrderSummaryComponent } from './package-order-summary/package-order-summary.component';
import {NgSelectModule} from "@ng-select/ng-select";
import {NgbAlertModule, NgbDatepickerModule} from "@ng-bootstrap/ng-bootstrap";
import {ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    PackageListComponent,
    PackageOrderSummaryComponent
  ],
  imports: [
    CommonModule,
    PackagesRoutingModule,
    UIModule,
    NgSelectModule,
    NgbAlertModule,
    NgbDatepickerModule,
    ReactiveFormsModule
  ]
})
export class PackagesModule { }
