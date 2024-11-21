import {Component, Input, OnInit, QueryList, ViewChildren} from '@angular/core';
import {ProjectsService} from "../../projects/my-projects/projects.service";
import {ElementsService} from "../../elements/project-elements/elements.service";
import {Router} from "@angular/router";
import {BbsProfileService} from "../../../../shared/services/bbs-profile.service";
import {PackagesService} from "../../../../shared/services/packages.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FormBuilder} from "@angular/forms";
import {DomSanitizer} from "@angular/platform-browser";
import {NotificationService} from "../../../../shared/services/notification.service";
import {DatePipe} from "@angular/common";
import {PackageSubscriptionService} from "./subsctiption-service";
import {Observable, Subscription} from "rxjs";
import {Projects} from "../../../../shared/models/projects.model";
import {PackageSubscription} from "../../../../shared/models/package-subscription.model";
import {SortEvent} from "../../clients/my-clients/clients-sortable.directive";
import {ProjectsSortableService} from "../../projects/my-projects/projects-sortable.directive";
import {environment} from "../../../../../environments/environment";
import {HttpErrorResponse} from "@angular/common/http";
import {UserProfile} from "../../../../shared/models/user-profile";

@Component({
  selector: 'app-subscription-list',
  templateUrl: './subscription-list.component.html',
  styleUrls: ['./subscription-list.component.scss']
})
export class SubscriptionListComponent implements OnInit {
  breadCrumbItems: Array<{}>;
  activities$: Observable<PackageSubscription[]>;
  total$: Observable<number>;
  loading: boolean;
  @ViewChildren(ProjectsSortableService) headers: QueryList<ProjectsSortableService>;
  private subscriptions: Subscription[] = [];
  error: string;
  userProfile: UserProfile = JSON.parse(sessionStorage.getItem('user'))

  @Input() userId: number = 0;


  constructor(public service: PackageSubscriptionService,
              private router: Router,
              private packageService: PackagesService,
              private modalService: NgbModal,
              private formBuilder: FormBuilder,
              private domSanitizer:DomSanitizer,
              private notification: NotificationService,
              ) {
    this.activities$ = service.activities$;
    this.total$ = service.total$;
  }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Package' }, { label: 'Subscriptions', active: true }];
    console.log('selected id '+this.userId)
    if(this.userId > 0){
      this.loadPackageSubscriptions(this.userId);
    }else {
      this.loadPackageSubscriptions(this.userProfile.id);
    }
  }

  loadPackageSubscriptions(userid: number){
    this.loading = true;
    this.subscriptions.push(
      this.packageService.loadPackageSubscriptions(userid).subscribe(
        (response: any) => {
          console.log(response);
          this.service.responceData = response.data;
          this.loading = false;
        },
        (error: HttpErrorResponse) => {
          this.error = error.message;
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
}
