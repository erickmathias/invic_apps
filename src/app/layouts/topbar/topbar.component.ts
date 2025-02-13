import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { AuthenticationService } from '../../core/services/auth.service';
import { AuthfakeauthenticationService } from '../../core/services/authfake.service';
import { environment } from '../../../environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { LanguageService } from '../../core/services/language.service';
import { TranslateService } from '@ngx-translate/core';
import {HttpErrorResponse} from "@angular/common/http";
import {BbsProfileService} from "../../shared/services/bbs-profile.service";

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})

/**
 * Topbar component
 */
export class TopbarComponent implements OnInit {

  element;
  cookieValue;
  flagvalue;
  countryName;
  valueset;
  preview: string;

  constructor(@Inject(DOCUMENT) private document: any, private router: Router, private authService: AuthenticationService,
              private authFackservice: AuthfakeauthenticationService,
              public languageService: LanguageService,
              public translate: TranslateService,
              public _cookiesService: CookieService,
              public profileService: BbsProfileService,
              ) {
  }

  listLang = [
    { text: 'English', flag: 'assets/images/flags/us.jpg', lang: 'en' },
/*    { text: 'Spanish', flag: 'assets/images/flags/spain.jpg', lang: 'es' },
    { text: 'German', flag: 'assets/images/flags/germany.jpg', lang: 'de' },
    { text: 'Italian', flag: 'assets/images/flags/italy.jpg', lang: 'it' },
    { text: 'Russian', flag: 'assets/images/flags/russia.jpg', lang: 'ru' },*/
  ];

  listSupport = [
    { text: '+255 768 153 310', flag: 'bx bx-phone-call', id: 1 },
    { text: '+255 768 153 310', flag: 'bx bxl-whatsapp', id: 2 },
    { text: 'support@invic.co.tz', flag: 'bx bx-support', id: 3 },
  ];

  userProfile = JSON.parse(sessionStorage.getItem('user'));

  openMobileMenu: boolean;

  @Output() settingsButtonClicked = new EventEmitter();
  @Output() mobileMenuButtonClicked = new EventEmitter();


  ngOnInit() {
    this.openMobileMenu = false;
    this.element = document.documentElement;

    this.cookieValue = this._cookiesService.get('lang');
    const val = this.listLang.filter(x => x.lang === this.cookieValue);
    this.countryName = val.map(element => element.text);
    if (val.length === 0) {
      if (this.flagvalue === undefined) { this.valueset = 'assets/images/flags/us.jpg'; }
    } else {
      this.flagvalue = val.map(element => element.flag);
    }

    this.profileService.getBbsProfile(this.userProfile.username).subscribe(
      (response: any) => {
        this.userProfile = response.data;
        this.preview = environment.baseUrl+this.userProfile.logo;
      },
      error=> {
      }
    )
  }

  setLanguage(text: string, lang: string, flag: string) {
    this.countryName = text;
    this.flagvalue = flag;
    this.cookieValue = lang;
    this.languageService.setLanguage(lang);
  }

  /**
   * Toggles the right sidebar
   */
  toggleRightSidebar() {
    this.settingsButtonClicked.emit();
  }

  /**
   * Toggle the menu bar when having mobile screen
   */
  toggleMobileMenu(event: any) {
    event.preventDefault();
    this.mobileMenuButtonClicked.emit();
  }

  /**
   * Logout the user
   */
  logout() {
    if (environment.defaultauth === 'firebase') {
      this.authService.logout();
    } else {
      this.authFackservice.logout();
    }
    this.router.navigate(['/account/login']);
  }

  /**
   * Fullscreen method
   */
  fullscreen() {
    document.body.classList.toggle('fullscreen-enable');
    if (
      !document.fullscreenElement && !this.element.mozFullScreenElement &&
      !this.element.webkitFullscreenElement) {
      if (this.element.requestFullscreen) {
        this.element.requestFullscreen();
      } else if (this.element.mozRequestFullScreen) {
        /* Firefox */
        this.element.mozRequestFullScreen();
      } else if (this.element.webkitRequestFullscreen) {
        /* Chrome, Safari and Opera */
        this.element.webkitRequestFullscreen();
      } else if (this.element.msRequestFullscreen) {
        /* IE/Edge */
        this.element.msRequestFullscreen();
      }
    } else {
      if (this.document.exitFullscreen) {
        this.document.exitFullscreen();
      } else if (this.document.mozCancelFullScreen) {
        /* Firefox */
        this.document.mozCancelFullScreen();
      } else if (this.document.webkitExitFullscreen) {
        /* Chrome, Safari and Opera */
        this.document.webkitExitFullscreen();
      } else if (this.document.msExitFullscreen) {
        /* IE/Edge */
        this.document.msExitFullscreen();
      }
    }
  }

  supportAction(text: string, id: number) {
    if(id == 1){
      // window.location.href = `tell:${text}`;
      const isMobile = /iPhone|iPad|Android|iPod/i.test(navigator.userAgent);

      if (isMobile) {
        window.location.href = `tel:${text}`;
      } else {
        alert("Calling is only available on mobile devices.");
      }
    }
    if(id == 2){
      const phone = text.replace(/[\s+]+/g, '');
      // alert(phone);
      const url = `https://wa.me/${phone}?text=I'm%20inquiring%20about%20the%20INVIC%20services`;
      window.open(url, '_blank');
    }
    if(id == 3){
      // window.location.href = `mailto:${text}`;
      window.open(`mailto:${text}?subject=Hello&body=I am equiring about INVIC services?`, "_self");
    }
  }
}
