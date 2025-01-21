import { Component, OnInit } from '@angular/core';
import {environment} from "../../../../environments/environment";
import {UserProfile} from "../../../shared/models/user-profile";
import {HttpErrorResponse} from "@angular/common/http";
import {UserProfileService} from "../../../core/services/user.service";
import {BbsProfileService} from "../../../shared/services/bbs-profile.service";
import {PackagesService} from "../../../shared/services/packages.service";

@Component({
  selector: 'app-bbs-home',
  templateUrl: './bbs-home.component.html',
  styleUrls: ['./bbs-home.component.scss']
})
export class BbsHomeComponent implements OnInit {
  preview: string;
  userProfile;
  subcription: any;
  packageError = "";

  constructor(
    private profileService: BbsProfileService,
    private packageService: PackagesService,
              ) { }

  ngOnInit(): void {
    this.userProfile = JSON.parse(sessionStorage.getItem('user'));


    this.profileService.getBbsProfile(this.userProfile.username).subscribe(
      (response: any) => {
        this.userProfile = response.data;
        this.preview = environment.baseUrl+this.userProfile.logo;
        console.log(this.userProfile)
      },
      error=> {
      }
    )

    this.loadSubscribedPackage();
  }

  loadSubscribedPackage(){
      this.packageService.loadSubscribedPackage().subscribe(
        (response: any) => {
          console.log(response);
          this.subcription = response.data;
          this.packageError = '';
          console.log(this.subcription)
        },
        error=> {
          this.packageError = error.error.message;
        }
      )
  }

}
