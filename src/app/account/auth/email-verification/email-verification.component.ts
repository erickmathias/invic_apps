import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-email-verification',
  templateUrl: './email-verification.component.html',
  styleUrls: ['./email-verification.component.scss']
})
export class EmailVerificationComponent implements OnInit {
  year: number = new Date().getFullYear();
  _email = "";
  _username = "";
  constructor(private router: Router, private route: ActivatedRoute,) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this._email = params.get('email') || '';
      this._username = params.get('username') || '';
    });
  }

}
