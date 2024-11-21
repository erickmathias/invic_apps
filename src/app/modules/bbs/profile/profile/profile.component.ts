import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {UserProfile} from "../../../../shared/models/user-profile";
import {AuthenticationService} from "../../../../core/services/auth.service";
import {BbsProfileService} from "../../../../shared/services/bbs-profile.service";
import {HttpErrorResponse} from "@angular/common/http";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  showProfileForm: boolean;
  showProfile: boolean;
  breadCrumbItems: Array<{}>;
  profileForm: FormGroup;
  successmsg = '';
  error = '';
  submitted: boolean;
  private dialCode = 255;
  userProfile: UserProfile = JSON.parse(sessionStorage.getItem('user'))
  @Input() username:string = '';
  phoneNumber = '';
  userId: number;
  private subscriptions: Subscription[] = []
  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router, private profileService: BbsProfileService) { }

  ngOnInit(): void {
    // console.log('Selected Username: '+this.username);
    this.userId = this.userProfile.id;
    console.log(this.userProfile);
    this.breadCrumbItems = [{ label: 'Bbs' }, { label: 'Company / Individual Profile', active: true }];

    this.profileForm = this.formBuilder.group({
      user: [this.userId, Validators.required],
      name: ['', Validators.required],
      email: [this.userProfile.username, [Validators.required, Validators.email]],
      mobile: [this.userProfile.mobile, [Validators.required, Validators.maxLength(9), Validators.minLength(9)]],
      // mobile: ['+255764998855', [Validators.required, Validators.minLength(10)]],
      main_activity: ['', Validators.required],
      fax: [''],
      website: [''],
      country: ['', Validators.required],
      region: ['', Validators.required],
      municipal: ['', Validators.required],
      postal_address: ['', Validators.required],
      dial_code: [this.dialCode, Validators.required],
    });

    this.dialCode = this.userProfile.dial_code;

    //this.profileForm.controls.user.disable();

    if (this.username.length > 0){
      this.loadUserProfile(this.username);
    }else {
      this.loadUserProfile(this.userProfile.username);
    }
  }

  loadUserProfile(username: string){
    this.showProfileForm = false;
    this.showProfile = false;
    this.subscriptions.push(
      this.profileService.getBbsProfile(username).subscribe(
        (response: any) => {

          this.successmsg = 'Profile Found';
          this.userProfile = response.data;
          this.userId = this.userProfile.user;
          this.showProfileForm = false;
          this.showProfile = true;
        },
        (error: HttpErrorResponse) => {
          this.error = error.message;
          this.showProfileForm = true;
        }
      )
    );
  }

  addProfile(value) {
    //value.mobile = value.mobile.perseInt();
    console.log(value);
   this.submitted = true;
    if(this.profileForm.invalid){
      Object.keys(this.profileForm.controls).forEach(key => {
        const controlErrors: ValidationErrors = this.profileForm.get(key).errors;
        if (controlErrors != null) {
          Object.keys(controlErrors).forEach(keyError => {
            console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
          });
        }
      });
      return;
    }else {
      this.subscriptions.push(
        this.profileService.addProfile(value).subscribe(
          (response: any) => {
            console.log(response);
            this.successmsg = response.message;
            this.error = '';

            this.showProfileForm = false;
            this.showProfile = true;
            this.userProfile = response.data;
          },
          (error: HttpErrorResponse) => {
            this.successmsg = '';
            this.error = error.message;
          }
        )
      );
    }
  }

  underlineToCamelCase(string) {
    return string.replace(/(\_[a-z])/g, function(match) {
      return match.toUpperCase().replace("_", "");
    });
  }

  get f() { return this.profileForm.controls; }


  editProfile(userProfile: UserProfile) {
    this.showProfileForm = true;
    this.showProfile = false;

    this.profileForm = this.formBuilder.group({
      id: [userProfile.id, Validators.required],
      user: [userProfile.user, Validators.required],
      name: [userProfile.name, Validators.required],
      email: [userProfile.email, [Validators.required, Validators.email]],
      mobile: [userProfile.mobile, [Validators.required, Validators.minLength(9), Validators.maxLength(9)]],
      // mobile: ['+255764998855', [Validators.required, Validators.minLength(10)]],
      main_activity: [userProfile.main_activity, Validators.required],
      fax: [userProfile.fax],
      website: [userProfile.website],
      country: [userProfile.country, Validators.required],
      region: [userProfile.region, Validators.required],
      municipal: [userProfile.municipal, Validators.required],
      postal_address: [userProfile.postal_address, Validators.required],
      dial_code: [userProfile.dial_code, Validators.required],
    });

    // this.profileForm.controls.name.disable();
    // this.profileForm.controls.main_activity.disable();
    // this.profileForm.controls.user.disable();
  }
}
