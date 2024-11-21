import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile/profile.component';
import {UIModule} from "../../../shared/ui/ui.module";
import {ReactiveFormsModule} from "@angular/forms";
import {NgbAlertModule} from "@ng-bootstrap/ng-bootstrap";
import {Ng2TelInputModule} from "ng2-tel-input";
import { ImageUploadComponent } from './image-upload/image-upload.component';


@NgModule({
    declarations: [
        ProfileComponent,
        ImageUploadComponent
    ],
    exports: [
        ProfileComponent
    ],
    imports: [
        CommonModule,
        ProfileRoutingModule,
        UIModule,
        ReactiveFormsModule,
        NgbAlertModule,
        Ng2TelInputModule
    ]
})
export class ProfileModule { }
