import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class InvicCommonService {
  authUrl: String = environment.authUrl;

  constructor(private http: HttpClient, private router: Router) {}

  loadRegisteredUsers() {
    return this.http.get<any>(`${this.authUrl}/user/accounts/`);
  }
}
