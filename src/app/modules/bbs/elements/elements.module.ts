import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ElementsRoutingModule } from './elements-routing.module';
import { ProjectElementsComponent } from './project-elements/project-elements.component';
import {ElementsSortableService} from "./project-elements/elements-sortable.directive";
import {UIModule} from "../../../shared/ui/ui.module";
import {
  NgbAlertModule,
  NgbDropdownModule,
  NgbNavModule,
  NgbPaginationModule,
  NgbTypeaheadModule
} from "@ng-bootstrap/ng-bootstrap";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgSelectModule} from "@ng-select/ng-select";
import {MembersModule} from "../members/members.module";
import {MembersSortableService} from "../members/element-members/members-sortable.directive";
import {LaddaModule} from "angular2-ladda";


@NgModule({
    declarations: [
        ProjectElementsComponent,
      ElementsSortableService,
      MembersSortableService
    ],
    exports: [
        ProjectElementsComponent,
        ElementsSortableService,
        MembersSortableService
    ],
    imports: [
        CommonModule,
        ElementsRoutingModule,
        UIModule,
        NgbNavModule,
        FormsModule,
        NgbTypeaheadModule,
        NgbPaginationModule,
        NgbDropdownModule,
        ReactiveFormsModule,
        NgbAlertModule,
        NgSelectModule,
        MembersModule,
        LaddaModule
    ]
})
export class ElementsModule { }
