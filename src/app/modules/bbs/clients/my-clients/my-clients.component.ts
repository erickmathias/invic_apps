import {Component, OnInit, QueryList, ViewChildren} from '@angular/core';
import {ChartType} from "chart.js";
import {Observable, Subscription} from 'rxjs';
import {ClientsService} from "./clients.service";
import {SortEvent, ClientsSortableService} from "./clients-sortable.directive";
import {Router} from "@angular/router";
import {BbsProfileService} from "../../../../shared/services/bbs-profile.service";
import { Clients } from '../../../../shared/models/clients.model';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FormBuilder, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {UserProfile} from "../../../../shared/models/user-profile";
import {Projects} from "../../../../shared/models/projects.model";

@Component({
  selector: 'app-my-clients',
  templateUrl: './my-clients.component.html',
  styleUrls: ['./my-clients.component.scss'],
})
export class MyClientsComponent implements OnInit {


  // breadcrumb items
  breadCrumbItems: Array<{}>;
  OveviewChart: ChartType;

  activities$: Observable<Clients[]>;
  total$: Observable<number>;

  @ViewChildren(ClientsSortableService) headers: QueryList<ClientsSortableService>;
  private subscriptions: Subscription[] = [];
  public error = '';
  clientForm: FormGroup;
  successmsg: string;
  submitted: boolean;
  dialCode = 255;
  private company: UserProfile;
  private client: Clients;
  private project: Projects;

  userProfile: UserProfile = JSON.parse(sessionStorage.getItem('user'))
  private modalRef: any;
  constructor(public service: ClientsService,
              private router: Router,
              private profileService: BbsProfileService,
              private modalService: NgbModal,
              private formBuilder: FormBuilder,) {
    this.activities$ = service.activities$;
    this.total$ = service.total$;
  }


  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'BBS' }, { label: 'Clients', active: true }];

    // this.loadUserProfile('erickmathias34@gmail.com');
    this.loadUserProfile(this.userProfile.username);

    this.clientForm = this.formBuilder.group({
      company: ['', Validators.required],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required, Validators.maxLength(9), Validators.minLength(9)]],
      // mobile: ['+255764998855', [Validators.required, Validators.minLength(10)]],
      street: ['', Validators.required],
      country: ['', Validators.required],
      region: ['', Validators.required],
      municipal: ['', Validators.required],
      postal_address: ['', Validators.required],
      dial_code: [this.dialCode, Validators.required],
    });

    console.log('dial code is '+this.dialCode);
    console.log(this.clientForm.value);
    console.log(this.company);


  }

  get f() { return this.clientForm.controls; }


  loadUserProfile(username: string){
    this.subscriptions.push(
      this.profileService.getBbsProfile(username).subscribe(
        (response: any) => {
          console.log(response);
          this.service.responceData = response.data.clients;
          this.company = response.data;
          this.clientForm.get('dial_code').setValue(this.dialCode);
          this.clientForm.get('company').setValue(this.company.id);
        },
        error=> {
          this.error = error ? error : '';
        }
      )
    );
  }

  /**
   * Sort table data
   * @param param0 sort the column
   *
   */
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

  openModal(content) {
    this.successmsg = "";
    this.error = '';
    this.resetForm();
    this.clientForm.get('dial_code').setValue(this.dialCode);
    this.clientForm.get('company').setValue(this.company.id);
    this.modalRef = this.modalService.open(content, { size: 'xl', centered: false });
  }

  resetForm() {
    this.clientForm.reset(); // Reset the form to its initial state

    // Enable all controls
    Object.keys(this.clientForm.controls).forEach(key => {
      this.clientForm.get(key).enable();
    });
  }

  addClient(value: any) {
    this.successmsg = "";
    this.error = '';
    this.submitted = true;

 /*   if(this.clientForm.invalid){
      Object.keys(this.clientForm.controls).forEach(key => {
        const controlErrors: ValidationErrors = this.clientForm.get(key).errors;
        console.log(controlErrors);
        if (controlErrors != null) {
          Object.keys(controlErrors).forEach(keyError => {
            console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
          });
        }
      });
      return;
    }else{
      this.subscriptions.push(
        this.profileService.addClient(value).subscribe(
          (response: any) => {
            console.log(response);
            this.successmsg = response.message;
            this.error = '';
            this.client = response.data;
            this.submitted = false;

            if(value.id>0){

            }else {
              this.service.responceData.push(this.client);
              this.clientForm.reset();
            }
            this.loadUserProfile(this.userProfile.username);

            // this.modalRef.close();

          },
          error=> {
            this.successmsg = '';
            this.error = error ? error : '';
          }
        )
      );
    }*/
    this.subscriptions.push(
      this.profileService.addClient(value).subscribe(
        (response: any) => {
          console.log(response);
          this.successmsg = response.message;
          this.error = '';
          this.client = response.data;
          this.submitted = false;

          if(value.id>0){

          }else {
            this.service.responceData.push(this.client);
            this.resetForm();
          }
          this.loadUserProfile(this.userProfile.username);

          // this.modalRef.close();

        },
        error=> {
          this.successmsg = '';
          this.error = error ? error : '';
        }
      )
    );

  }

  numericOnly(event) {
    let patt = /^([0-9])$/;
    let result = patt.test(event.key);
    return result;
  }

  onCountryChange(event: any) {
    console.log(event);
    this.dialCode = event.dialCode;
  }

  editClient(content, client: Clients) {
    this.successmsg = "";
    this.error = '';

    this.dialCode = client.dial_code;

    this.clientForm = this.formBuilder.group({
      id: [client.id, Validators.required],
      company: [client.company, Validators.required],
      name: [client.name, Validators.required],
      email: [client.email, [Validators.required, Validators.email]],
      mobile: [client.mobile, [Validators.required, Validators.maxLength(9), Validators.minLength(9)]],
      // mobile: ['+255764998855', [Validators.required, Validators.minLength(10)]],
      street: [client.street, Validators.required],
      country: [client.country, Validators.required],
      region: [client.region, Validators.required],
      municipal: [client.municipal, Validators.required],
      postal_address: [client.postal_address, Validators.required],
      dial_code: [client.dial_code, Validators.required],
    });
    this.modalRef = this.modalService.open(content, { size: 'xl', centered: false });
  }
}
