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

  loadPackageSubscriptions(companyId: number, status: number) {
    return this.http.get<any>(`${this.authUrl}/packages/subscriptions/user/${companyId}/${status}`);
  }

  loadRegisteredUsers() {
    return this.http.get<any>(`${this.authUrl}/users/`);
  }

  makeOrderSubscriptionRequest(subscription_id: string) {
    return this.http.post<any[]>(`${this.authUrl}/packages/subscription/order-request`, {trans_id: subscription_id});
  }

  checkOrderPaymentStatus(data: { OrderTrackingId: string; OrderMerchantReference: string }) {
    return this.http.post<any[]>(`${this.authUrl}/packages/subscription/order-request-status`, data);
  }

  pushManualSettlement(data: { subscriptionId: number; receiptNumber: string }) {
    return this.http.post<any[]>(`${this.authUrl}/packages/subscription/order-manual-settlement`, data);
  }
}
