import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {AuthenticationService} from "../../../core/services/auth.service";

@Component({
  selector: 'app-password-reset-confirmation',
  templateUrl: './password-reset-confirmation.component.html',
  styleUrls: ['./password-reset-confirmation.component.scss']
})
export class PasswordResetConfirmationComponent implements OnInit {

  uid: string = '';
  token: string = '';
  year: number = new Date().getFullYear();

  resetForm: FormGroup;
  submitted = false;
  error = '';
  success = '';
  loading = false;
  private subscriptions: Subscription[] = [];

  constructor(private route: ActivatedRoute, private formBuilder: FormBuilder, private authenticationService: AuthenticationService, private router: Router) {}

  ngOnInit() {
    // Extract parameters from URL
    this.route.paramMap.subscribe(params => {
      this.uid = params.get('uid') || '';
      this.token = params.get('token') || '';
      console.log("UID:", this.uid, "Token:", this.token);
    });

    this.resetForm = this.formBuilder.group({
      password: ['', [Validators.required]],
    });
  }

  get f() { return this.resetForm.controls; }


  onSubmit() {
    this.success = '';
    this.error = '';
    this.submitted = true;
    this.loading = true;

    // stop here if form is invalid
    if (this.resetForm.invalid) {
      return;
    }
    /*if (environment.defaultauth === 'firebase') {
      this.authenticationService.resetPassword(this.f.email.value)
        .catch(error => {
          this.error = error ? error : '';
        });
    }*/
    this.subscriptions.push(
      this.authenticationService.resetPassword2Confirmation({password: this.f.password.value}, this.uid, this.token).subscribe(
        (response: any) => {
          this.success = response.message;
          this.loading = false;
          // this.router.navigate(['/dashboard']);
          // Wait for 5 seconds before redirecting
          setTimeout(() => {
            this.router.navigate(['/account/login-2']); // Redirect to login page
          }, 5000);

          alert("Password reset successfully! Now Log in with your new credentials.");
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
