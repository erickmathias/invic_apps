import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthenticationService} from "../../../core/services/auth.service";

@Component({
  selector: 'app-account-confirmation',
  templateUrl: './account-confirmation.component.html',
  styleUrls: ['./account-confirmation.component.scss']
})
export class AccountConfirmationComponent implements OnInit {

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


  verifyEmail() {
    this.success = '';
    this.error = '';
    this.submitted = true;
    this.loading = true;

    this.subscriptions.push(
      this.authenticationService.accountActivationConfirmation(this.uid, this.token).subscribe(
        (response: any) => {
          this.success = response.message;
          this.loading = false;
          // this.router.navigate(['/dashboard']);
          // Wait for 5 seconds before redirecting
          setTimeout(() => {
            this.router.navigate(['/account/login-2']); // Redirect to login page
          }, 5000);

          alert("Account Activation successfully! Now Log in with your new credentials.");
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
