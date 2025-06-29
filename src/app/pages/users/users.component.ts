import {Component, OnInit, QueryList, TemplateRef, ViewChildren} from '@angular/core';
import {Observable, Subscription} from "rxjs";
import {PackageSubscription} from "../../shared/models/package-subscription.model";
import {ProjectsSortableService} from "../../modules/bbs/projects/my-projects/projects-sortable.directive";
import {UserProfile} from "../../shared/models/user-profile";
import {PackageSubscriptionService} from "../../modules/bbs/subscriptions/subscription-list/subsctiption-service";
import {Router} from "@angular/router";
import {PackagesService} from "../../shared/services/packages.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FormBuilder} from "@angular/forms";
import {DomSanitizer} from "@angular/platform-browser";
import {NotificationService} from "../../shared/services/notification.service";
import {HttpErrorResponse} from "@angular/common/http";
import {SortEvent} from "../../modules/bbs/clients/my-clients/clients-sortable.directive";
import {InvicCommonService} from "../../shared/services/invic-common.service";
import {UsersComponentService} from "./users-component.service";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  breadCrumbItems: Array<{}>;
  activities$: Observable<UserProfile[]>;
  total$: Observable<number>;
  loading: boolean;
  @ViewChildren(ProjectsSortableService) headers: QueryList<ProjectsSortableService>;
  private subscriptions: Subscription[] = [];
  error: string;
  userProfile: UserProfile = JSON.parse(sessionStorage.getItem('user'))
  selectedUsername: string;
  selectedUserId: number = 0;
  selectedUserProfileId: number = 0;


  constructor(public service: UsersComponentService,
              private router: Router,
              private invicCommonService: InvicCommonService,
              private modalService: NgbModal,
              private formBuilder: FormBuilder,
              private domSanitizer:DomSanitizer,
              private notification: NotificationService,
  ) {
    this.activities$ = service.activities$;
    this.total$ = service.total$;
  }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'User' }, { label: 'Accounts', active: true }];
    this.loadRegisteredUsers();
  }

  loadRegisteredUsers(){
    this.loading = true;
    this.subscriptions.push(
      this.invicCommonService.loadRegisteredUsers().subscribe(
        (response: any) => {
          console.log(response);
          this.service.responceData = response.data;
          this.loading = false;
        },
        (error: any) => {
          this.error = error ? error : '';
          this.loading = false;
          console.log(error)
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

  viewProfile(username: string, content) {
    this.selectedUsername = username;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', windowClass: 'manage-projects-modal-class', backdrop: 'static', keyboard: false, centered: false});
  }

  viewSubscriptions(userId: number, content) {
    // alert(userId);
    this.selectedUserId = userId;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', windowClass: 'manage-projects-modal-class', backdrop: 'static', keyboard: false, centered: false});
  }

  getRole(role: number) {
    if (role === 1){
      return 'Admin';
    }else if(role === 2){
      return 'Company/Organization/Business';
    }else if (role === 3){
      return 'Individual Person';
    }else if (role === 3){
      return 'Student';
    }else {
      return 'N/A';
    }
  }

  getRoleClass(role: number) {
    if (role === 1){
      return 'role-admin';
    }else if(role === 2){
      return 'role-company';
    }else if (role === 3){
      return 'role-individual';
    }else if (role === 4){
      return 'role-student';
    }else {
      return 'role-unknown';
    }
  }
}
