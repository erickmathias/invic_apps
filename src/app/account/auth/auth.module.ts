import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import {NgbAlertModule, NgbDropdownModule, NgbPaginationModule, NgbTypeaheadModule} from '@ng-bootstrap/ng-bootstrap';
import { CarouselModule } from 'ngx-owl-carousel-o';

import { UIModule } from '../../shared/ui/ui.module';
import { LoginComponent } from './login/login.component';
import { Login2Component } from './login2/login2.component';
import { SignupComponent } from './signup/signup.component';
import { Register2Component } from './register2/register2.component';
import { Recoverpwd2Component } from './recoverpwd2/recoverpwd2.component';

import { AuthRoutingModule } from './auth-routing';
import { PasswordresetComponent } from './passwordreset/passwordreset.component';
import {Ng2TelInputModule} from "ng2-tel-input";
import {LaddaModule} from "angular2-ladda";
import { UsersComponent } from '../../pages/users/users.component';
import {ElementsModule} from "../../modules/bbs/elements/elements.module";
import {ProfileModule} from "../../modules/bbs/profile/profile.module";
import {SubscriptionsModule} from "../../modules/bbs/subscriptions/subscriptions.module";
import { PasswordResetConfirmationComponent } from './password-reset-confirmation/password-reset-confirmation.component';

@NgModule({
  declarations: [LoginComponent, Login2Component, SignupComponent, PasswordresetComponent, Register2Component, Recoverpwd2Component, UsersComponent, PasswordResetConfirmationComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbAlertModule,
    UIModule,
    AuthRoutingModule,
    CarouselModule,
    Ng2TelInputModule,
    LaddaModule,
    NgbTypeaheadModule,
    ElementsModule,
    NgbDropdownModule,
    NgbPaginationModule,
    ProfileModule,
    SubscriptionsModule
  ]
})
export class AuthModule { }
