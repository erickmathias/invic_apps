import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MembersRoutingModule } from './members-routing.module';
import { ElementMembersComponent } from './element-members/element-members.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {
  NgbAlertModule,
  NgbDropdownModule,
  NgbNavModule,
  NgbPaginationModule,
  NgbTypeaheadModule
} from "@ng-bootstrap/ng-bootstrap";
import {NgSelectModule} from "@ng-select/ng-select";
import {ClientsModule} from "../clients/clients.module";
import {LaddaModule} from "angular2-ladda";


@NgModule({
    declarations: [
        ElementMembersComponent
    ],
    exports: [
        ElementMembersComponent
    ],
  imports: [
    CommonModule,
    MembersRoutingModule,
    ReactiveFormsModule,
    NgbAlertModule,
    NgSelectModule,
    NgbNavModule,
    FormsModule,
    ClientsModule,
    NgbTypeaheadModule,
    NgbDropdownModule,
    NgbPaginationModule,
    LaddaModule,
  ]
})
export class MembersModule { }
