import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientsRoutingModule } from './clients-routing.module';
import { MyClientsComponent } from './my-clients/my-clients.component';
import {UIModule} from "../../../shared/ui/ui.module";
import {
    NgbAlertModule,
    NgbDropdownModule,
    NgbNavModule,
    NgbPaginationModule,
    NgbTypeaheadModule
} from "@ng-bootstrap/ng-bootstrap";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgApexchartsModule} from "ng-apexcharts";
import {ClientsSortableService} from "./my-clients/clients-sortable.directive";
import {Ng2TelInputModule} from "ng2-tel-input";


@NgModule({
    declarations: [
        MyClientsComponent,
        ClientsSortableService
    ],
    exports: [
        ClientsSortableService
    ],
    imports: [
        CommonModule,
        ClientsRoutingModule,
        UIModule,
        NgbTypeaheadModule,
        FormsModule,
        NgbPaginationModule,
        NgbNavModule,
        NgApexchartsModule,
        ReactiveFormsModule,
        NgbAlertModule,
        Ng2TelInputModule,
        NgbDropdownModule
    ]
})
export class ClientsModule { }
