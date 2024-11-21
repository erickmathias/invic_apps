import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class PackagesService {

  authUrl: String = environment.authUrl;
  constructor(private http: HttpClient, private router: Router) {}

  getPackages() {
      return this.http.get<any[]>(`${this.authUrl}/packages`);
  }

  addSubsctiption(data: { total_months: number; package: any }) {
    return this.http.post<any[]>(`${this.authUrl}/packages/subscriptions`, data);
  }

  loadSubscribedPackage() {
    return this.http.get<any>(`${this.authUrl}/packages/subscriptions/tracker`);
  }

  loadPackageSubscriptions(userid: number) {
    return this.http.get<any>(`${this.authUrl}/packages/subscriptions/user/${userid}`);
  }

  loadRegisteredUsers() {
    return this.http.get<any>(`${this.authUrl}/users/`);
  }
}
