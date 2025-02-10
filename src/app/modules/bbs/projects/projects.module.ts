import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectsRoutingModule } from './projects-routing.module';
import { MyProjectsComponent } from './my-projects/my-projects.component';
import {UIModule} from "../../../shared/ui/ui.module";
import {
    NgbAlertModule,
    NgbDatepickerModule, NgbDropdownModule,
    NgbNavModule,
    NgbPaginationModule,
    NgbTypeaheadModule
} from "@ng-bootstrap/ng-bootstrap";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Ng2TelInputModule} from "ng2-tel-input";
import {ProjectsSortableService} from "./my-projects/projects-sortable.directive";
import {NgSelectModule} from "@ng-select/ng-select";
import {ElementsModule} from "../elements/elements.module";
import {SlabpropertiesModule} from "../../slub/slabproperties/slabproperties.module";
import {LaddaModule} from "angular2-ladda";


@NgModule({
  declarations: [
    MyProjectsComponent,
    ProjectsSortableService
  ],
    imports: [
        CommonModule,
        ProjectsRoutingModule,
        UIModule,
        NgbNavModule,
        FormsModule,
        NgbTypeaheadModule,
        NgbPaginationModule,
        ReactiveFormsModule,
        NgbAlertModule,
        Ng2TelInputModule,
        NgbDatepickerModule,
        NgSelectModule,
        NgbDropdownModule,
        ElementsModule,
        SlabpropertiesModule,
        LaddaModule,

    ]
})
export class ProjectsModule { }
