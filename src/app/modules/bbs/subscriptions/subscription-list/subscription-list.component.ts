import {Component, Input, OnInit, QueryList, ViewChildren} from '@angular/core';
import {Router} from "@angular/router";
import {PackagesService} from "../../../../shared/services/packages.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FormBuilder} from "@angular/forms";
import {DomSanitizer} from "@angular/platform-browser";
import {NotificationService} from "../../../../shared/services/notification.service";
import {PackageSubscriptionService} from "./subsctiption-service";
import {Observable, Subscription} from "rxjs";
import {PackageSubscription} from "../../../../shared/models/package-subscription.model";
import {SortEvent} from "../../clients/my-clients/clients-sortable.directive";
import {ProjectsSortableService} from "../../projects/my-projects/projects-sortable.directive";
import {HttpErrorResponse} from "@angular/common/http";
import {UserProfile} from "../../../../shared/models/user-profile";
import {PackageSubscriptionService2} from "./subsctiption-service2";
import {map} from "rxjs/operators";

@Component({
  selector: 'app-subscription-list',
  templateUrl: './subscription-list.component.html',
  styleUrls: ['./subscription-list.component.scss']
})
export class SubscriptionListComponent implements OnInit {
  breadCrumbItems: Array<{}>;
  activities$: Observable<PackageSubscription[]>;
  activities2$: Observable<PackageSubscription[]>;
  total$: Observable<number>;
  total2$: Observable<number>;
  loading: boolean;
  @ViewChildren(ProjectsSortableService) headers: QueryList<ProjectsSortableService>;
  private subscriptions: Subscription[] = [];
  error: string;
  userProfile: UserProfile = JSON.parse(sessionStorage.getItem('user'))

  @Input() userId: number = 0;
  selectedSubscription: PackageSubscription;
  subscriptionPaymentTitle = "";
  url: any;
  safeUrl: any;
   activitiesLength$: Observable<number>;
   activitiesLength2$: Observable<number>;


  constructor(
              public service: PackageSubscriptionService,
              public service2: PackageSubscriptionService2,
              private router: Router,
              private packageService: PackagesService,
              private modalService: NgbModal,
              private formBuilder: FormBuilder,
              private notification: NotificationService,
              ) {
    this.activities$ = service.activities$;
    this.activities2$ = service2.activities$;

    this.activitiesLength$ = this.activities$.pipe(
      map(activities => activities.length)
    );
    this.activitiesLength2$ = this.activities2$.pipe(
      map(activities => activities.length)
    );

    this.total$ = service.total$;
    this.total2$ = service2.total$;
  }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Package' }, { label: 'Subscriptions', active: true }];
    console.log('selected id '+this.userId)
    console.log('user profile '+this.userProfile)
/*    if(this.userId > 0){
      this.loadPendingPackageSubscriptions(this.userId);
      this.loadPaidPackageSubscriptions(this.userId);
    }else {
      this.loadPendingPackageSubscriptions(this.userProfile.id);
      this.loadPaidPackageSubscriptions(this.userProfile.id);
    }*/
    this.loadPendingPackageSubscriptions(this.userId);
    this.loadPaidPackageSubscriptions(this.userId);
  }

  loadPendingPackageSubscriptions(userid: number){
    this.loading = true;
    this.subscriptions.push(
      this.packageService.loadPackageSubscriptions(userid, 0).subscribe(
        (response: any) => {
          console.log(response);
          this.service.responceData = response.data;
          this.loading = false;
        },
        error=> {
          this.error = error ? error : '';
          this.loading = false;
        }
      )
    );
  }

  loadPaidPackageSubscriptions(companyId: number){
    this.loading = true;
    this.subscriptions.push(
      this.packageService.loadPackageSubscriptions(companyId, 1).subscribe(
        (response: any) => {
          console.log(response);
          this.service2.responceData = response.data;
          this.loading = false;
        },
        error=> {
          this.error = error ? error : '';
          this.loading = false;
        }
      )
    );
  }

  onSort({ column, direction }: SortEvent) {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });
    this.service.sortColumn = column;
    this.service.sortDirection = direction;
  }

  getPaidState(paid_status: number) {
    if(paid_status === 1){
      return 'YES';
    }else {
      return 'NO';
    }
  }

  getStatus(status: number) {
    if(status === 1){
      return 'COMPLETED';
    }else if (status === 2){
      return 'OVERDUE';
    }else {
      return 'PENDING';
    }
  }

  openSubscriptionPaymentModal(content, subscription: PackageSubscription) {
    // this.action = 0;
    this.subscriptionPaymentTitle = 'SUBSCRIPTIONS - PAYMENT - PROCESS';
    this.selectedSubscription = subscription;

    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', windowClass: 'subscription-payment-modal-class', backdrop: 'static', keyboard: false, centered: false});

  }

  openSubscriptionPaymentRoute(model: PackageSubscription) {
    console.log("PackageSubscription");
    console.log(model);
    this.router.navigate(['/subscriptions/order-request/2-pay'], { queryParams: { id: model.id } });
  }


}
