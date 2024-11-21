import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SubscriptionsRoutingModule } from './subscriptions-routing.module';
import { SubscriptionListComponent } from './subscription-list/subscription-list.component';
import {ElementsModule} from "../elements/elements.module";
import {NgSelectModule} from "@ng-select/ng-select";
import {
    NgbAlertModule,
    NgbDatepickerModule,
    NgbDropdownModule,
    NgbNavModule,
    NgbPaginationModule, NgbTypeaheadModule
} from "@ng-bootstrap/ng-bootstrap";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {UIModule} from "../../../shared/ui/ui.module";


@NgModule({
    declarations: [
        SubscriptionListComponent
    ],
    exports: [
        SubscriptionListComponent
    ],
    imports: [
        CommonModule,
        SubscriptionsRoutingModule,
        ElementsModule,
        NgSelectModule,
        NgbAlertModule,
        NgbDatepickerModule,
        NgbDropdownModule,
        NgbNavModule,
        NgbPaginationModule,
        NgbTypeaheadModule,
        ReactiveFormsModule,
        UIModule,
        FormsModule
    ]
})
export class SubscriptionsModule { }
