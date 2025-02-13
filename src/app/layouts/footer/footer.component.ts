import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})

/**
 * Footer component
 */
export class FooterComponent implements OnInit {

  // set the currenr year
  year: number = new Date().getFullYear();

  constructor() { }

  ngOnInit() {
  }

  sendEmail(email: string) {
    window.open(`mailto:${email}?subject=Hello&body=I am equiring about INVIC services?`, "_self");
  }

}
