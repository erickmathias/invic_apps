import {Component, OnInit, TemplateRef} from '@angular/core';
import {HttpErrorResponse} from "@angular/common/http";
import {Subscription} from "rxjs";
import {PackagesService} from "../../../../shared/services/packages.service";
import {FormBuilder, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {BbsProfileService} from "../../../../shared/services/bbs-profile.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {NotificationService} from "../../../../shared/services/notification.service";
import {InvicCommonService} from "../../../../shared/services/invic-common.service";
import {PackageSubscription} from "../../../../shared/models/package-subscription.model";
import {Packages} from "../../../../shared/models/packages.model";

class Term{
  id: number;
  period: number;
  factor: number;
  label: string;
  price: number;
  currency: string;
  tax: number;
  price_og: number;
}

@Component({
  selector: 'app-package-list',
  templateUrl: './package-list.component.html',
  styleUrls: ['./package-list.component.scss']
})
export class PackageListComponent implements OnInit {
  breadCrumbItems: Array<{}>;
  private subscriptions: Subscription[] = [];
   error: string;
  packages: Packages[];
  orderForm: FormGroup;
  successmsg: string;
  submitted: boolean;
  term: Term[] = [];
  term0: Term[] = [
    {
      id: 1,
      period: 1,
      factor: 1,
      label: 'Weeks',
      price: null,
      price_og: null,
      currency: 'TZS',
      tax: null,
    },
    {
      id: 2,
      period: 2,
      factor: 2,
      label: 'Weeks',
      price: null,
      price_og: null,
      currency: 'TZS',
      tax: null,
    },
  ];
  term2: Term[] = [
    {
    id: 1,
    period: 1,
    factor: 1,
    label: 'Month',
    price: null,
    price_og: null,
    currency: 'TZS',
    tax: null,
    },
    {
      id: 2,
      period: 3,
      factor: 3,
      label: 'Month',
      price: null,
      price_og: null,
      currency: 'TZS',
      tax: null,
    },
    {
      id: 3,
      period: 6,
      factor: 6,
      label: 'Month',
      price: null,
      price_og: null,
      currency: 'TZS',
      tax: null,
    },
    {
      id: 4,
      period: 12,
      factor: 12,
      label: 'Year',
      price: null,
      price_og: null,
      currency: 'TZS',
      tax: null,
    },
    {
      id: 5,
      period: 24,
      factor: 24,
      label: 'Years',
      price: null,
      price_og: null,
      currency: 'TZS',
      tax: null,
    }
    ];
  selectedPackage: any;
  selectedTerm: Term;
  factor = 1;
  subsctiption: PackageSubscription;
  loading: boolean;
  selectedSubscription: PackageSubscription;
  subscriptionPaymentTitle = "";
  constructor(private packagesService: PackagesService,
  private router: Router,
  private profileService: BbsProfileService,
  private invicCommonService: InvicCommonService,
  private modalService: NgbModal,
  private formBuilder: FormBuilder,
  private notification: NotificationService,) { }

  ngOnInit(): void {
    this.term = this.term2;
    this.breadCrumbItems = [{ label: 'BBS' }, { label: 'Packages', active: true }];
    this.loadPackages();
    // this.loadRegisteredUsers();

    this.orderForm = this.formBuilder.group({
      //company: ['', Validators.required],
      package: [null, Validators.required],
      //user: [null, Validators.required],
      total_months: [null, Validators.required],
      //date_prepared: ['', Validators.required],
      // total_amount_billed: ['', Validators.required],
    });
  }

  get f() { return this.orderForm.controls; }


  loadPackages(){
    this.loading = true;
    this.subscriptions.push(
      this.packagesService.getPackages().subscribe(
        (response: any) => {
          console.log(response);
          // this.service.responceData = response.data;
          this.packages = response.data;

          this.loading = false;
        },
        (error: HttpErrorResponse) => {
          this.error = error.message;
          this.loading = false;
        }
      )
    );
  }

  watermark(watermark: any) {
    if(watermark === 1){
      return 'Watermarks';
    }else {
      return 'No Watermarks';
    }
  }

  openOrderSummary(item: Packages, content: TemplateRef<any>) {
    this.orderForm.reset();
    this.factor = 1;
    this.modalService.open(content, { size: 'l', centered: false });
    this.selectedPackage = item;
    this.orderForm.get('package').setValue(item.id);
    this.orderForm.get('total_months').setValue(1);
    if(item.id == 1){
      this.term = this.term0;
    }else{
      this.term = this.term2;
    }
    this.term.forEach(key =>{
      let cost = this.selectedPackage.cost * key.factor;
      key.tax = cost * 0.18;
      key.price = cost + key.tax;
      key.price_og = cost;

    });

    /*console.log('Hello World..');
    console.log(this.selectedTerm);*/
    this.setOrderSummary()
  }

  setOrderSummary(){
    this.selectedTerm = new Term()
    this.selectedTerm.label = 'Month';
    this.selectedTerm.factor = this.factor;
    this.selectedTerm.price_og = this.selectedPackage.cost * this.factor;
    this.selectedTerm.tax = this.selectedPackage.cost * this.factor * 0.18;
    this.selectedTerm.price = this.selectedTerm.price_og + this.selectedTerm.tax;

    console.log('Order Summary');
    console.log(this.selectedTerm);
  }

  onChangePackage($event: any) {
    this.selectedPackage = this.packages.filter(x=> x.id === $event )[0];

    console.log(this.selectedPackage[0]);
    this.setOrderSummary();

    if(this.selectedPackage[0].id == 1){
      this.term=this.term0;
    }

  }

  onChangeTerm($event: any) {
    this.selectedTerm = this.term.filter(x=>x.id === $event)[0]
    console.log('selected term', this.selectedTerm)
    this.factor = this.selectedTerm.factor;
    this.setOrderSummary();
  }

  comfirmOrder(value: any) {
    const data = {
          'total_months': this.factor,
          'package': this.selectedPackage.id,
          //'total_amount_billed': this.selectedTerm.price,
    }

    console.log('Confirmed Package..');
    console.log(data);

    if(this.orderForm.invalid){
      Object.keys(this.orderForm.controls).forEach(key => {
        const controlErrors: ValidationErrors = this.orderForm.get(key).errors;
        if (controlErrors != null) {
          Object.keys(controlErrors).forEach(keyError => {
            console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
          });
        }
      });
      return;
    }else{
      this.subscriptions.push(
        this.packagesService.addSubsctiption(data).subscribe(
          (response: any) => {
            console.log(response);
            console.log('Success......');
            console.log(response);
            this.error = '';
            this.subsctiption = response.data;
            this.selectedSubscription = response.data;
            console.log('added subsctiption');
            console.log(response.data);
            this.submitted = false;
            this.orderForm.reset();
            this.successmsg = response.message;
          },
          (error: HttpErrorResponse) => {
            this.successmsg = '';
            if (error.error?.message) {
              this.error = error.error?.message;
            } else {
              this.error = 'An Error Occurred Please Try Again Later';
            }
          }
        )
      );
    }

  }

  openSubscriptionPaymentModal(content, subscription: PackageSubscription) {
    // this.action = 0;
    this.subscriptionPaymentTitle = 'SUBSCRIPTIONS - PAYMENT - PROCESS';
    this.selectedSubscription = subscription;
    console.log('selected subscription: ', this.selectedSubscription);

    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', windowClass: 'subscription-payment-modal-class', backdrop: 'static', keyboard: false, centered: false});

  }

  openSubscriptionPaymentRoute(model: PackageSubscription, modal: any) {
    modal.dismiss('Cross click');
    this.router.navigate(['/subscriptions/order-request/2-pay'], { queryParams: { id: model.id } });
  }

  getPeriod(item: Packages) {
    if(item.id == 1){
      return 'Week';
    }
    return "Month";
  }

  getPeriod2(item: Packages) {
    if(item.id == 1){
      return 'Week(s)';
    }
    return "Month(s)";
  }
}
