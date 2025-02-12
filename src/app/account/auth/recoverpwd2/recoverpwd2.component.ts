import { Component, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthenticationService } from '../../../core/services/auth.service';
import { environment } from '../../../../environments/environment';
import {UserProfile} from "../../../shared/models/user-profile";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-recoverpwd2',
  templateUrl: './recoverpwd2.component.html',
  styleUrls: ['./recoverpwd2.component.scss']
})
export class Recoverpwd2Component implements OnInit {

   // set the currenr year
   year: number = new Date().getFullYear();

   resetForm: FormGroup;
   submitted = false;
   error = '';
   success = '';
   loading = false;
  private subscriptions: Subscription[] = [];
   constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router, private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
    this.resetForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.resetForm.controls; }

  /**
   * On submit form
   */
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
      this.authenticationService.resetPassword2({email: this.f.email.value}).subscribe(
        (response: any) => {
          this.success = response.message;
          this.loading = false;
          // this.router.navigate(['/dashboard']);
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
}
