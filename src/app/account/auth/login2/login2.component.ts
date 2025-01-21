import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthenticationService } from '../../../core/services/auth.service';
import { AuthfakeauthenticationService } from '../../../core/services/authfake.service';

import { OwlOptions } from 'ngx-owl-carousel-o';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';
import {HttpErrorResponse} from "@angular/common/http";
import {Subscription} from "rxjs";
import {TokenUserProfile} from "../../../shared/models/token-user-profile";
import {UserProfile} from "../../../shared/models/user-profile";

@Component({
  selector: 'app-login2',
  templateUrl: './login2.component.html',
  styleUrls: ['./login2.component.scss']
})
/**
 * Login-2 component
 */
export class Login2Component implements OnInit {
  private subscriptions: Subscription[] = [];
  loading: boolean;

  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router, private authenticationService: AuthenticationService,
    private authFackservice: AuthfakeauthenticationService) { }
  loginForm: FormGroup;
  submitted = false;
  error = '';
  returnUrl: string;

  // set the currenr year
  year: number = new Date().getFullYear();

  ngOnInit(): void {
    document.body.classList.add('auth-body-bg')
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });

    // reset login status
    // this.authenticationService.logout();
    // get return url from route parameters or default to '/'
    // tslint:disable-next-line: no-string-literal
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  carouselOption: OwlOptions = {
    items: 1,
    loop: false,
    margin: 0,
    nav: false,
    dots: true,
    responsive: {
      680: {
        items: 1
      },
    }
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  /**
   * Form submit
   */
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    } else {
      if (environment.defaultauth === 'firebase') {
        this.authenticationService.login(this.f.email.value, this.f.password.value).then((res: any) => {
          this.router.navigate(['/dashboard']);
        })
          .catch(error => {
            this.error = error ? error : '';
          });
      } else {
        this.authFackservice.login(this.f.email.value, this.f.password.value)
          .pipe(first())
          .subscribe(
            data => {
              this.router.navigate(['/dashboard']);
            },
            error => {
              this.error = error ? error : '';
            });
      }
    }
  }

  signIn(){
    this.error = null;
    this.submitted = true;
    this.loading = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      this.loading = false;
      return;
    } else {
      this.subscriptions.push(
        this.authenticationService.login2({username: this.f.email.value, password: this.f.password.value}).subscribe(
          (response: UserProfile) => {

            console.log(response);
            // const tokenUserProfile: TokenUserProfile = AuthUtil.insertAuthenticationTokenToSessionStorage(response);
            sessionStorage.setItem('user', JSON.stringify(response));
            sessionStorage.setItem('token', JSON.stringify(response.token));
            this.authenticationService.userProfile.next(response);
            // sessionStorage.setItem('token', JSON.stringify(response.token));
            // this.navigateToRespectivePages();
            this.loading = false;
            this.router.navigate(['/dashboard']);
          },
          (error) => {
            console.log('Error Responce is ');
            console.log(error)
            this.error = error ? error : '';
            this.loading = false;
          }
        )
      );
    }
  }
}
