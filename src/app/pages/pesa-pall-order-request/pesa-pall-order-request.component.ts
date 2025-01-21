import {Component, Input, OnInit} from '@angular/core';
import {PackageSubscription} from "../../shared/models/package-subscription.model";
import {DomSanitizer} from "@angular/platform-browser";
import {HttpErrorResponse} from "@angular/common/http";
import {PackagesService} from "../../shared/services/packages.service";
import {Subscription} from "rxjs";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-pesa-pall-order-request',
  templateUrl: './pesa-pall-order-request.component.html',
  styleUrls: ['./pesa-pall-order-request.component.scss']
})
export class PesaPallOrderRequestComponent implements OnInit {
  id: string | null = null;
  OrderTrackingId: string | null = null;
  OrderMerchantReference: string | null = null;

  public subscriptions: Subscription[] = [];

  @Input() packageSubscription: PackageSubscription;
  url: any;
  showPaymentPanel: boolean;
  showSuccessPanel: boolean;
  showFailedPanel: boolean;
  loading: boolean;
  error: string;
  message: string;

  constructor(
    private domSanitizer:DomSanitizer,
    private packageService:PackagesService,
    private route: ActivatedRoute
    ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.id = params['id']; // Get the 'id' query parameter
      this.OrderTrackingId = params['OrderTrackingId']; // Get the 'id' query parameter
      this.OrderMerchantReference = params['OrderMerchantReference']; // Get the 'id' query parameter
      console.log('Received ID:', this.id);
    });

    console.log('incoming subscription');
    console.log(this.id);

    if(this.OrderTrackingId?.length > 0) {
      this.checkOrderPaymentStatus(this.OrderTrackingId, this.OrderMerchantReference);
    }

    if (this.id?.length > 0) {
      this.makeOrderSubscriptionRequest(this.id);
    }
  }

  checkOrderPaymentStatus(OrderTrackingId: string, OrderMerchantReference: string){
    this.showSuccessPanel = false;
    this.loading = true;
    const data = {
      OrderTrackingId: OrderTrackingId,
      OrderMerchantReference: OrderMerchantReference,
    }
    this.subscriptions.push(
      this.packageService.checkOrderPaymentStatus(data).subscribe(
        (response: any) => {
          console.log(response);
          this.packageSubscription = response;
          this.showSuccessPanel = true;
          this.loading = false;
          // this.url = this.domSanitizer.bypassSecurityTrustResourceUrl(this.packageSubscription.gtw_redirect_url);
          // this.url = this.domSanitizer.bypassSecurityTrustResourceUrl("https://pay.pesapal.com/iframe/PesapalIframe3/PaymentConfirmation?Order_Tracking_Id=e3fd34e7-6958-436e-85cd-dc47a4d65549");
        },
        (error: HttpErrorResponse) => {
          this.error = error.message;
          this.showSuccessPanel = false;
          this.loading = false;
        }
      )
    );
  }



  makeOrderSubscriptionRequest(subscription_id: string){
    this.showPaymentPanel = false;
    this.showFailedPanel = false;
    this.loading = true;
    this.subscriptions.push(
      this.packageService.makeOrderSubscriptionRequest(subscription_id).subscribe(
        (response: any) => {
          console.log(response);
          this.packageSubscription = response;
          this.showPaymentPanel = true;
          this.showFailedPanel = false;
          this.loading = false;
          this.url = this.domSanitizer.bypassSecurityTrustResourceUrl(this.packageSubscription.gtw_redirect_url);
          // this.url = this.domSanitizer.bypassSecurityTrustResourceUrl("https://pay.pesapal.com/iframe/PesapalIframe3/PaymentConfirmation?Order_Tracking_Id=e3fd34e7-6958-436e-85cd-dc47a4d65549");
        },
        (error: HttpErrorResponse) => {
          console.log(error);
          this.error = error.error.message;
          this.showPaymentPanel = false;
          this.loading = false;
          this.showFailedPanel = true;
        }
      )
    );
  }

}
