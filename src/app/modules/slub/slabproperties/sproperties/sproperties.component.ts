import {Component, Input, OnInit, QueryList, ViewChildren} from '@angular/core';
import {Projects} from "../../../../shared/models/projects.model";
import {Elements} from "../../../../shared/models/elements.model";
import {ChartType} from "chart.js";
import {Observable, Subscription} from "rxjs";
import {ElementsSortableService} from "../../../bbs/elements/project-elements/elements-sortable.directive";
import {FormBuilder, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {UserProfile} from "../../../../shared/models/user-profile";
import {Clients} from "../../../../shared/models/clients.model";
import {StandardCodes} from "../../../../shared/models/standard_codes.model";
import {SteelTypes} from "../../../../shared/models/steel_types";
import {ElementsService} from "../../../bbs/elements/project-elements/elements.service";
import {Router} from "@angular/router";
import {BbsProfileService} from "../../../../shared/services/bbs-profile.service";
import {PackagesService} from "../../../../shared/services/packages.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {DatePipe} from "@angular/common";
import {HttpErrorResponse} from "@angular/common/http";
import {SortEvent} from "../../../bbs/clients/my-clients/clients-sortable.directive";
import Swal from "sweetalert2";
import {SpPropertiesService} from "./sp-properties.service";
import {SlabPanelProperties} from "../../../../shared/models/slab-panel-properties.model";
import {SpProperties} from "../../../../shared/models/sp_properties.model";
import {PanelSupport} from "../../../../shared/models/panel_support.model";

@Component({
  selector: 'app-sproperties',
  templateUrl: './sproperties.component.html',
  styleUrls: ['./sproperties.component.scss']
})
export class SpropertiesComponent implements OnInit {
  @Input() selectedProject: Projects;

  selectedSlabPanelProperty : SlabPanelProperties;


  // breadcrumb items
  breadCrumbItems: Array<{}>;
  OveviewChart: ChartType;

  activities$: Observable<SlabPanelProperties[]>;
  total$: Observable<number>;

  @ViewChildren(ElementsSortableService) headers: QueryList<ElementsSortableService>;
  private subscriptions: Subscription[] = [];
  public error = '';
  spPropertyForm: FormGroup;
  successmsg: string;
  submitted: boolean;
  dialCode = 255;
  private company: UserProfile;
  private client: Clients;
  private project: Projects;
  private elements: Elements[];
  private element: Elements;

  spProperties: SpProperties[] = [];
  panelSupport: PanelSupport[] = [];
  loading: boolean;
  packageError = '';
  private subcription: any;
  elementFormTitle:string = 'New SP Property';
  public action: number = 0;

  constructor(public service: SpPropertiesService,
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

    this.loadSlabPanelProperties(this.selectedProject.id);
    this.loadPanelSupport();
    this.loadProperties();
    //this.loadSubscribedPackage();

    this.spPropertyForm = this.formBuilder.group({
      project: [this.selectedProject.id, Validators.required],
      panel_support: [null, Validators.required],
      property: [null, Validators.required],
      name: ['', Validators.required],
      long_length: ["", Validators.required],
      short_length: ["", Validators.required],
      thickness: ["", Validators.required],
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

  private loadPanelSupport() {
    this.subscriptions.push(
      this.profileService.getPanelSupport().subscribe(
        (response: any) => {
          console.log(response);
          // this.service.responceData = response.data;
          this.panelSupport = response.data;

          console.log('Panel Support...');
          console.log(this.panelSupport);
        },
        (error: HttpErrorResponse) => {
          this.error = error.message;
        }
      )
    );
  }

  private loadProperties() {
    this.subscriptions.push(
      this.profileService.getProperties().subscribe(
        (response: any) => {
          console.log(response);
          // this.service.responceData = response.data;
          this.spProperties = response.data;

          console.log('Sp Properties...');
          console.log(this.spProperties);
        },
        (error: HttpErrorResponse) => {
          this.error = error.message;
        }
      )
    );
  }

  get f() { return this.spPropertyForm.controls; }
  loadSlabPanelProperties(projectId: number){
    this.loading = true;
    this.subscriptions.push(
      this.profileService.getSlabPanelProperties(projectId).subscribe(
        (response: any) => {
          console.log(response);
          this.service.responceData = response.data;
          this.elements = response.data;

          this.selectedSlabPanelProperty = response.data;

          console.log('Slab Panel Properties...');
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

  updateSpProperty(value: any) {
    console.log('element for post');
    console.log(value);
    if(this.spPropertyForm.invalid){
      Object.keys(this.spPropertyForm.controls).forEach(key => {
        const controlErrors: ValidationErrors = this.spPropertyForm.get(key).errors;
        if (controlErrors != null) {
          Object.keys(controlErrors).forEach(keyError => {
            console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
          });
        }
      });
      return;
    }else{
      this.subscriptions.push(
        this.profileService.updateElement(value, this.selectedSlabPanelProperty.id).subscribe(
          (response: any) => {
            console.log(response);
            this.successmsg = response.message;
            console.log('Success......');
            console.log(response);
            this.error = '';
            this.element = response.data;
            // this.service.responceData.push(this.element);
            this.loadSlabPanelProperties(this.selectedProject.id);
            this.submitted = false;
            /*            this.elementsForm.reset();
                        // this.ngOnInit();
                        this.elementsForm.get('project').setValue(this.selectedProject.id);
                        this.elementsForm.get('density').setValue(7850);*/
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

  addSpProperty(value) {
    console.log('element for post');
    console.log(value);
    if(this.spPropertyForm.invalid){
      Object.keys(this.spPropertyForm.controls).forEach(key => {
        const controlErrors: ValidationErrors = this.spPropertyForm.get(key).errors;
        if (controlErrors != null) {
          Object.keys(controlErrors).forEach(keyError => {
            console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
          });
        }
      });
      return;
    }else{
      this.subscriptions.push(
        this.profileService.addSpProperty(value).subscribe(
          (response: any) => {
            console.log(response);
            this.successmsg = response.message;
            console.log('Success......');
            console.log(response);
            this.error = '';
            this.element = response.data;
            // this.service.responceData.push(this.element);
            this.loadSlabPanelProperties(this.selectedProject.id);
            this.submitted = false;
            this.spPropertyForm.reset();
            // this.ngOnInit();
            this.spPropertyForm.get('project').setValue(this.selectedProject.id);
            //this.spPropertyForm.get('density').setValue(7850);
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

  deleteElement(table: SlabPanelProperties) {
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


  openMadAndLoadPropertyModal(content, elements: SlabPanelProperties) {
    this.action = 0;
    this.elementFormTitle = 'New Element';
    this.selectedSlabPanelProperty = elements;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', windowClass: 'manage-projects-modal-class', backdrop: 'static', keyboard: false, centered: false});

  }

  openEditElementModal(content, table: SlabPanelProperties) {
    this.selectedSlabPanelProperty = table;
    this.action = 1;
    this.elementFormTitle = 'Edit Element: '+table.name;

    this.spPropertyForm.get('name').setValue(table.name);

/*    this.spPropertyForm.get('project').setValue(table.project.id);
    this.spPropertyForm.get('std_code').setValue(table.std_code.id);
    this.spPropertyForm.get('steel_type').setValue(table.steel_type.id);
    this.spPropertyForm.get('density').setValue(table.density);

    this.spPropertyForm.get('std_code').disable();
    this.spPropertyForm.get('density').disable();
    this.spPropertyForm.get('steel_type').disable();
    this.spPropertyForm.get('project').disable();*/

    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', windowClass: 'manage-projects-modal-class', backdrop: 'static', keyboard: false, centered: false});

  }

}
