import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { OwlOptions } from 'ngx-owl-carousel-o';
import { AuthenticationService } from '../../../core/services/auth.service';
import { environment } from '../../../../environments/environment';
import { first } from 'rxjs/operators';
import { UserProfileService } from '../../../core/services/user.service';
import {Subscription} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-register2',
  templateUrl: './register2.component.html',
  styleUrls: ['./register2.component.scss']
})
export class Register2Component implements OnInit {

  signupForm: FormGroup;
  submitted = false;
  error: HttpErrorResponse | string = '';
  successmsg = false;
  private subscriptions: Subscription[] = [];
  private dialCode = 255;
  showPassword: boolean = false;

  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router, private authenticationService: AuthenticationService,
    private userService: UserProfileService) { }
  // set the currenr year
  year: number = new Date().getFullYear();

  ngOnInit(): void {
    document.body.classList.add('auth-body-bg')

    this.signupForm = this.formBuilder.group({
      // username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.maxLength(12), Validators.minLength(9)]],
      password: ['', Validators.required],
      accountType: ['', Validators.required],
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.signupForm.controls; }

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
  loading: boolean;

  /**
   * On submit form
   */
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.signupForm.invalid) {
      return;
    } else {
      if (environment.defaultauth === 'firebase') {
        this.authenticationService.register(this.f.email.value, this.f.password.value).then((res: any) => {
          this.successmsg = true;
          if (this.successmsg) {
            this.router.navigate(['/dashboard']);
          }
        })
          .catch(error => {
            this.error = error ? error : '';
          });
      } else {
        this.userService.register(this.signupForm.value)
          .pipe(first())
          .subscribe(
            data => {
              this.successmsg = true;
              if (this.successmsg) {
                this.router.navigate(['/account/login']);
              }
            },
            error => {
              this.error = error ? error : '';
            });
      }
    }
  }

  register(value: any) {
    this.loading = true;
    this.error = null;

    /*this.authenticationService.register2(value).then((res: any) => {
      this.successmsg = true;
      if (this.successmsg) {
        this.router.navigate(['/dashboard']);
      }
    })
      .catch(error => {
        this.error = error ? error : '';
      });*/
    console.log('post values..');
    console.log(value);
    this.submitted = true;

    if (this.signupForm.invalid) {
      this.loading = false;
      console.log(this.signupForm.get('phoneNumber').errors);
      return;
    }else{
      this.subscriptions.push(
        this.authenticationService.register2({username: value.email, password: value.password, email: value.email, dial_code: this.dialCode, mobile: value.phoneNumber, role: value.accountType}).subscribe(
          (response: any) => {

            console.log(response);
            this.loading = false;
            this.router.navigate([`/account/email-verification/${response.email}/${response.username}`]);
          },
          error=> {
            console.log('Error Responce is ');
            console.log(error)
            this.loading = false;
            this.error = error ? error : '';
            this.loading = false;
          }
        )
      );
    }

  }

  onCountryChange(event: any) {
    console.log(event);
    this.dialCode = event.dialCode;
  }

  numericOnly(event) {
    let patt = /^([0-9])$/;
    let result = patt.test(event.key);
    return result;
  }

  /**
   * Toggle password visibility
   */
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}
