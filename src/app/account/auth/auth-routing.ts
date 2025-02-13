import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { Login2Component } from './login2/login2.component';

import { SignupComponent } from './signup/signup.component';
import { PasswordresetComponent } from './passwordreset/passwordreset.component';
import { Register2Component } from './register2/register2.component';
import { Recoverpwd2Component } from './recoverpwd2/recoverpwd2.component';
import {PasswordResetConfirmationComponent} from "./password-reset-confirmation/password-reset-confirmation.component";
import {AccountConfirmationComponent} from "./account-confirmation/account-confirmation.component";
import {EmailVerificationComponent} from "./email-verification/email-verification.component";

const routes: Routes = [
    {
        path: 'login',
        //component: LoginComponent
        component: Login2Component
    },
    {
        path: 'signup',
        component: Register2Component
    },
    {
        path: 'signup-2',
        component: Register2Component
    },
    {
        path: 'reset-password',
        component: PasswordresetComponent
    },
    {
        path: 'recoverpwd-2',
        component: Recoverpwd2Component
    },
    {
        path: 'login-2',
        component: Login2Component
    },
  { path: 'reset-password/:uid/:token', component: PasswordResetConfirmationComponent },
  { path: 'verification/:uid/:token', component: AccountConfirmationComponent },
  { path: 'email-verification/:email/:username', component: EmailVerificationComponent },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AuthRoutingModule { }
