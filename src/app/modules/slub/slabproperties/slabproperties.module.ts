import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SlabpropertiesRoutingModule } from './slabproperties-routing.module';
import { SpropertiesComponent } from './sproperties/sproperties.component';
import {ElementsModule} from "../../bbs/elements/elements.module";
import {MembersModule} from "../../bbs/members/members.module";
import {NgSelectModule} from "@ng-select/ng-select";
import {
  NgbAlertModule,
  NgbDropdownModule,
  NgbNavModule,
  NgbPaginationModule,
  NgbTypeaheadModule
} from "@ng-bootstrap/ng-bootstrap";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { MaterialLoadingPropertyComponent } from './material-loading-property/material-loading-property.component';
import {UIModule} from "../../../shared/ui/ui.module";
import {ArchwizardModule} from "angular-archwizard";
import {LaddaModule} from "angular2-ladda";


@NgModule({
  declarations: [
    SpropertiesComponent,
    MaterialLoadingPropertyComponent
  ],
  exports: [
    SpropertiesComponent
  ],
  imports: [
    CommonModule,
    SlabpropertiesRoutingModule,
    ElementsModule,
    MembersModule,
    NgSelectModule,
    NgbAlertModule,
    NgbDropdownModule,
    NgbNavModule,
    NgbPaginationModule,
    NgbTypeaheadModule,
    ReactiveFormsModule,
    FormsModule,
    UIModule,
    ArchwizardModule,
    LaddaModule
  ]
})
export class SlabpropertiesModule { }
