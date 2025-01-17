import {Component, Input, OnInit, QueryList, TemplateRef, ViewChildren} from '@angular/core';
import {Projects} from "../../../../shared/models/projects.model";
import {ChartType} from "chart.js";
import {Observable, Subscription} from "rxjs";
import {ClientsSortableService, SortEvent} from "../../clients/my-clients/clients-sortable.directive";
import {FormBuilder, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {UserProfile} from "../../../../shared/models/user-profile";
import {Clients} from "../../../../shared/models/clients.model";
import {ProjectsService} from "../../projects/my-projects/projects.service";
import {Router} from "@angular/router";
import {BbsProfileService} from "../../../../shared/services/bbs-profile.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {DatePipe} from "@angular/common";
import {HttpErrorResponse} from "@angular/common/http";
import {ElementsService} from "./elements.service";
import {Elements} from "../../../../shared/models/elements.model";
import {ElementsSortableService} from "./elements-sortable.directive";
import {StandardCodes} from "../../../../shared/models/standard_codes.model";
import {SteelTypes} from "../../../../shared/models/steel_types";
import {DomSanitizer} from "@angular/platform-browser";
import {NotificationService} from "../../../../shared/services/notification.service";
import {PackagesService} from "../../../../shared/services/packages.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-project-elements',
  templateUrl: './project-elements.component.html',
  styleUrls: ['./project-elements.component.scss']
})
export class ProjectElementsComponent implements OnInit {
  @Input() selectedProject: Projects;

  selectedElement : Elements;


  // breadcrumb items
  breadCrumbItems: Array<{}>;
  OveviewChart: ChartType;

  activities$: Observable<Elements[]>;
  total$: Observable<number>;

  @ViewChildren(ElementsSortableService) headers: QueryList<ElementsSortableService>;
  private subscriptions: Subscription[] = [];
  public error = '';
  elementsForm: FormGroup;
  successmsg: string;
  submitted: boolean;
  dialCode = 255;
  private company: UserProfile;
  private client: Clients;
  private project: Projects;
  private elements: Elements[];
  private element: Elements;

  standardCodes: StandardCodes[] = [];
  steelTypes: SteelTypes[] = [];
  loading: boolean;
  packageError = '';
  private subcription: any;
  elementFormTitle:string = 'New Element';
  public action: number = 0;

  constructor(public service: ElementsService,
              private router: Router,
              private profileService: BbsProfileService,
              private packageService: PackagesService,
              private modalService: NgbModal,
              private formBuilder: FormBuilder,
              private datePipe: DatePipe) {
    this.activities$ = service.activities$;
    this.total$ = service.total$;
  }


  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'BBS' }, { label: 'Clients', active: true }];

    this.loadProjectElements(this.selectedProject.id);
    this.loadSteelType();
    this.loadStandardCodes();
    //this.loadSubscribedPackage();

    this.elementsForm = this.formBuilder.group({
      project: [this.selectedProject.id, Validators.required],
      std_code: [null, Validators.required],
      steel_type: [null, Validators.required],
      name: ['', Validators.required],
      density: [7850, Validators.required],
    });


  }

  loadSubscribedPackage(){
    this.subscriptions.push(
      this.packageService.loadSubscribedPackage().subscribe(
        (response: any) => {
          console.log(response);
          this.subcription = response.data;
          this.packageError = '';
        },
        (error: HttpErrorResponse) => {
          this.packageError = error.message;
        }
      )
    );
  }

  private loadSteelType() {
    this.subscriptions.push(
      this.profileService.getSteelType().subscribe(
        (response: any) => {
          console.log(response);
          // this.service.responceData = response.data;
          this.steelTypes = response.data;

          console.log('Steel Types...');
          console.log(this.steelTypes);
        },
        (error: HttpErrorResponse) => {
          this.error = error.message;
        }
      )
    );
  }

  private loadStandardCodes() {
    this.subscriptions.push(
      this.profileService.getStandardCodes().subscribe(
        (response: any) => {
          console.log(response);
          // this.service.responceData = response.data;
          this.standardCodes = response.data;

          console.log('Standard Codes...');
          console.log(this.standardCodes);
        },
        (error: HttpErrorResponse) => {
          this.error = error.message;
        }
      )
    );
  }

  get f() { return this.elementsForm.controls; }
  loadProjectElements(projectId: number){
    this.loading = true;
    this.subscriptions.push(
      this.profileService.getProjectElements(projectId).subscribe(
        (response: any) => {
          console.log(response);
          this.service.responceData = response.data;
          this.elements = response.data;

          console.log('Elements...');
          console.log(this.elements);
          this.loading = false;
        },
        (error: HttpErrorResponse) => {
          this.error = error.message;
          this.loading = false;

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
    this.modalService.open(content, { size: 'xl', centered: false });
  }

  updateElement(value: any) {
    console.log('element for post');
    console.log(value);
    if(this.elementsForm.invalid){
      Object.keys(this.elementsForm.controls).forEach(key => {
        const controlErrors: ValidationErrors = this.elementsForm.get(key).errors;
        if (controlErrors != null) {
          Object.keys(controlErrors).forEach(keyError => {
            console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
          });
        }
      });
      return;
    }else{
      this.subscriptions.push(
        this.profileService.updateElement(value, this.selectedElement.id).subscribe(
          (response: any) => {
            console.log(response);
            this.successmsg = response.message;
            console.log('Success......');
            console.log(response);
            this.error = '';
            this.element = response.data;
            // this.service.responceData.push(this.element);
            this.loadProjectElements(this.selectedProject.id);
            this.submitted = false;
/*            this.elementsForm.reset();
            // this.ngOnInit();
            this.elementsForm.get('project').setValue(this.selectedProject.id);
            this.elementsForm.get('density').setValue(7850);*/
          },
          (error: HttpErrorResponse) => {
            console.log(error.message);
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

  addElement(value) {
    console.log('element for post');
    console.log(value);
    if(this.elementsForm.invalid){
      Object.keys(this.elementsForm.controls).forEach(key => {
        const controlErrors: ValidationErrors = this.elementsForm.get(key).errors;
        if (controlErrors != null) {
          Object.keys(controlErrors).forEach(keyError => {
            console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
          });
        }
      });
      return;
    }else{
      this.subscriptions.push(
        this.profileService.addElement(value).subscribe(
          (response: any) => {
            console.log(response);
            this.successmsg = response.message;
            console.log('Success......');
            console.log(response);
            this.error = '';
            this.element = response.data;
            // this.service.responceData.push(this.element);
            this.loadProjectElements(this.selectedProject.id);
            this.submitted = false;
            this.elementsForm.reset();
            // this.ngOnInit();
            this.elementsForm.get('project').setValue(this.selectedProject.id);
            this.elementsForm.get('density').setValue(7850);
          },
          (error: HttpErrorResponse) => {
            this.successmsg = '';
            if (error.error?.detail) {
              this.error = error.error?.message;
            } else {
              this.error = 'An Error Occurred Please Try Again Later';
            }
          }
        )
      );
    }
  }

  deleteElement(table: Elements) {
    Swal.fire({
      title: 'Delete element '+table.name+', Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Yes, delete it!'
    }).then(result => {
      if (result.value) {

        this.profileService.deleteElement(table.id).subscribe(
          (response: any) => {
            this.service.responceData = this.service.responceData.filter(item => item !== table)
            Swal.fire('Deleted!', response.message, 'success');
          },
          (error: HttpErrorResponse) => {
            Swal.fire('Operation Failed: '+error.error.message, 'failed');
          }
        );
      }
    });
  }

  numericOnly(event) {
    let patt = /^([1-9])$/;
    let result = patt.test(event.key);
    return result;
  }

  onCountryChange(event: any) {
    console.log(event);
    this.dialCode = event.dialCode;
  }

  onChangeClient(event) {

  }


  openElementModal(content, elements: Elements) {
    this.action = 0;
    this.elementFormTitle = 'New Element';
    this.selectedElement = elements;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', windowClass: 'manage-projects-modal-class', backdrop: 'static', keyboard: false, centered: false});

  }

  openEditElementModal(content, table: Elements) {
    this.selectedElement = table;
    this.action = 1;
    this.elementFormTitle = 'Edit Element: '+table.name;

    this.elementsForm.get('name').setValue(table.name);

    this.elementsForm.get('project').setValue(table.project.id);
    this.elementsForm.get('std_code').setValue(table.std_code.id);
    this.elementsForm.get('steel_type').setValue(table.steel_type.id);
    this.elementsForm.get('density').setValue(table.density);

    this.elementsForm.get('std_code').disable();
    this.elementsForm.get('density').disable();
    this.elementsForm.get('steel_type').disable();
    this.elementsForm.get('project').disable();

    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', windowClass: 'manage-projects-modal-class', backdrop: 'static', keyboard: false, centered: false});

  }



}
