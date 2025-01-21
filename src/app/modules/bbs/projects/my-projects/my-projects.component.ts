import {Component, OnInit, QueryList, ViewChildren} from '@angular/core';
import {ChartType} from "chart.js";
import {Observable, Subscription} from "rxjs";
import {Clients} from "../../../../shared/models/clients.model";
import {ClientsSortableService, SortEvent} from "../../clients/my-clients/clients-sortable.directive";
import {FormBuilder, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {UserProfile} from "../../../../shared/models/user-profile";
import {Router} from "@angular/router";
import {BbsProfileService} from "../../../../shared/services/bbs-profile.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {HttpErrorResponse} from "@angular/common/http";
import {Projects} from "../../../../shared/models/projects.model";
import {ProjectsService} from "./projects.service";
import {DatePipe, formatDate} from "@angular/common";
import {ElementsService} from "../../elements/project-elements/elements.service";
import {DomSanitizer} from "@angular/platform-browser";
import {NotificationService} from "../../../../shared/services/notification.service";
import {environment} from "../../../../../environments/environment";
import {ProjectsSortableService} from "./projects-sortable.directive";
import {PackagesService} from "../../../../shared/services/packages.service";
import {Type} from "../../../../shared/models/type.model";

@Component({
  selector: 'app-my-projects',
  templateUrl: './my-projects.component.html',
  styleUrls: ['./my-projects.component.scss'],
  providers: [DatePipe]
})
export class MyProjectsComponent implements OnInit {


  // breadcrumb items
  breadCrumbItems: Array<{}>;
  OveviewChart: ChartType;

  activities$: Observable<Projects[]>;
  total$: Observable<number>;

  @ViewChildren(ProjectsSortableService) headers: QueryList<ProjectsSortableService>;
  private subscriptions: Subscription[] = [];
  error = '';
  projectsForm: FormGroup;
  successmsg: string;
  submitted: boolean;
  dialCode = 255;
  private company: UserProfile;
  private client: Clients;
  private project: Projects;
  clients: Clients[] = [];
  type: Type[] = [
    {id: 'BBS', name: 'Bar Bending Schedule'},
    {id: 'SLAB', name: 'Slab Design [2 Way]'},
  ];
  selectedProject: Projects;
  private element: Element;
  loader: boolean;
  pdfSrc: any;

  userProfile: UserProfile = JSON.parse(sessionStorage.getItem('user'))
  company_logo = '';
  loading: boolean;
  readonly: boolean;
  packageError = '';
  private subcription: any;
  public action: number = 0;

  constructor(public service: ProjectsService,
              public service2: ElementsService,
              private router: Router,
              private profileService: BbsProfileService,
              private packageService: PackagesService,
              private modalService: NgbModal,
              private formBuilder: FormBuilder,
              private domSanitizer:DomSanitizer,
              private notification: NotificationService,
              private datePipe: DatePipe) {
    this.activities$ = service.activities$;
    this.total$ = service.total$;
  }


  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'BBS' }, { label: 'Clients', active: true }];

    // this.loadUserProfile('erickmathias34@gmail.com');
    this.loadUserProfile(this.userProfile.username);
    //this.loadSubscribedPackage();

    this.projectsForm = this.formBuilder.group({
      company: ['', Validators.required],
      name: ['', Validators.required],
      type: [null, Validators.required],
      client: [null, Validators.required],
      prepared_by: ['', Validators.required],
      date_prepared: ['', Validators.required],
      checked_by: ['', Validators.required],
      date_checked: ['', Validators.required],
      reviewed_by: ['', Validators.required],
      date_reviewed: ['', Validators.required],
    });

  }

  get f() { return this.projectsForm.controls; }


  loadUserProfile(username: string){
    this.loading = true;
    this.subscriptions.push(
      this.profileService.getBbsProfile(username).subscribe(
        (response: any) => {
          console.log(response);
          this.service.responceData = response.data.projects;
          this.company = response.data;
          this.clients = this.company.clients;
          this.company_logo = environment.baseUrl+this.company.logo;

          console.log('Clients...');
          console.log(this.clients);

          this.projectsForm.get('company').setValue(this.company.id);

          this.loading = false;
        },
        error=> {
          this.error = error ? error : '';
          this.loading = false;
        }
      )
    );
  }

  loadSubscribedPackage(){
    this.subscriptions.push(
      this.packageService.loadSubscribedPackage().subscribe(
        (response: any) => {
          console.log(response);
         this.subcription = response.data;
          this.packageError = '';
        },
        error=> {
          this.packageError = error.error.message;
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
    this.action = 0;
    this.modalService.open(content, { size: 'xl', centered: false });

    if([3,4].includes(this.userProfile.role)){
      this.projectsForm.get('prepared_by').setValue(this.company.name);
      this.readonly = true;
    }
  }

  openProjectModal(content, project: Projects) {
    this.selectedProject = project;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', windowClass: 'manage-projects-modal-class', backdrop: 'static', keyboard: false, centered: false});
  }

  addProject(value: any) {
    console.log('data fpr submission...');
    console.log(value);

    value.date_checked = new Date(value.date_checked.year+'-'+value.date_checked.month+'-'+value.date_checked.day);
    value.date_prepared = new Date(value.date_prepared.year+'-'+value.date_prepared.month+'-'+value.date_prepared.day);
    value.date_reviewed = new Date(value.date_reviewed.year+'-'+value.date_reviewed.month+'-'+value.date_reviewed.day);
    this.submitted = true;

    if(this.projectsForm.invalid){
      Object.keys(this.projectsForm.controls).forEach(key => {
        const controlErrors: ValidationErrors = this.projectsForm.get(key).errors;
        if (controlErrors != null) {
          Object.keys(controlErrors).forEach(keyError => {
            console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
          });
        }
      });
      return;
    }else{
      this.subscriptions.push(
        this.profileService.addProject(value).subscribe(
          (response: any) => {
            console.log(response);
            this.successmsg = response.message;
            console.log('Success......');
            console.log(response);
            this.error = '';
            this.project = response.data;
            this.service.responceData.push(this.project);
            this.submitted = false;
            this.projectsForm.reset();

            if([3,4].includes(this.userProfile.role)){
              this.projectsForm.get('prepared_by').setValue(this.company.name);
              this.readonly = true;
            }
            this.projectsForm.get('company').setValue(this.company.id);

          },
          error=> {
            this.successmsg = '';
            this.error = error ? error : '';
          }
        )
      );
    }

  }

  updateProject(value: any) {

    value.date_checked = new Date(value.date_checked.year+'-'+value.date_checked.month+'-'+value.date_checked.day);
    value.date_prepared = new Date(value.date_prepared.year+'-'+value.date_prepared.month+'-'+value.date_prepared.day);
    value.date_reviewed = new Date(value.date_reviewed.year+'-'+value.date_reviewed.month+'-'+value.date_reviewed.day);
    this.submitted = true;

    if(this.projectsForm.invalid){
      Object.keys(this.projectsForm.controls).forEach(key => {
        const controlErrors: ValidationErrors = this.projectsForm.get(key).errors;
        if (controlErrors != null) {
          Object.keys(controlErrors).forEach(keyError => {
            console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
          });
        }
      });
      return;
    }else{
      this.subscriptions.push(
        this.profileService.updateProject(value, this.selectedProject.id).subscribe(
          (response: any) => {

            const index = this.service.responceData.findIndex(x => x.id === this.selectedProject.id);
            this.selectedProject = response.data;
            this.service.responceData[index] = this.selectedProject;

            console.log('indexed data');
            this.service.responceData[index];
            this.successmsg = response.message;
            console.log('Updated Project..');
            console.log(response);
            this.error = '';
            //this.service.responceData.push(this.project);
            this.submitted = false;
            //this.projectsForm.reset();


          },
          error=> {
            this.successmsg = '';
            this.error = error ? error : '';
          }
        )
      );
    }

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

  onChangeClient(event) {

  }


  printProject() {

  }

  downloadCoverPage(content, projectId: number) {
    this.loader = true;
    this.pdfSrc = null;
    this.modalService.open(content, { ariaLabelledBy: 'project-report-modal-class', windowClass: 'manage-projects-modal-class', backdrop: 'static', keyboard: false, centered: false});

    this.profileService.downloadCoverPage(projectId)
      .subscribe((res) => {
          this.pdfSrc = this.domSanitizer.bypassSecurityTrustResourceUrl(
            URL.createObjectURL(res)
          );
          this.loader = false;
        },
        () => {
          this.loader = false;
          // this.notification.showNotification('danger', 'Error downloading student id card !');
        }
      );
  }

  downloadContentPage(content, project: Projects) {
    this.loader = true;
    this.pdfSrc = null;
    this.modalService.open(content, { ariaLabelledBy: 'project-report-modal-class', windowClass: 'manage-projects-modal-class', backdrop: 'static', keyboard: false, centered: false});

    if (project.type == 'BBS'){
      this.profileService.downloadBbsReportPdf(project.id)
        .subscribe((res) => {
            this.pdfSrc = this.domSanitizer.bypassSecurityTrustResourceUrl(
              URL.createObjectURL(res)
            );
            this.loader = false;
          },
          error=> {
            this.loader = false;
            // this.notification.showNotification('danger', 'Error downloading student id card !');
            this.error = "Report Download Failed, Make sure you have the active Package Subscription and reliable Internet Connection";
          }
        );
    }else if (project.type == 'SLAB') {
      this.profileService.downloadSlabReportPdf(project.id)
        .subscribe((res) => {
            this.pdfSrc = this.domSanitizer.bypassSecurityTrustResourceUrl(
              URL.createObjectURL(res)
            );
            this.loader = false;
          },
          error=> {
            this.loader = false;
            // this.notification.showNotification('danger', 'Error downloading student id card !');
            this.error = "Report Download Failed, Make sure you have the active Package Subscription and reliable Internet Connection";
          }
        );
    }

  }

  editProject(content: any, table: Projects) {
    this.selectedProject = table;
    this.action = 1;
    this.projectsForm.get('name').setValue(table.name);
    this.projectsForm.get('company').setValue(table.company);
    this.projectsForm.get('client').setValue(table.client.id);
    this.projectsForm.get('prepared_by').setValue(table.prepared_by);
    this.projectsForm.get('checked_by').setValue(table.checked_by);
    this.projectsForm.get('date_checked').setValue(table.date_checked);
    this.projectsForm.get('reviewed_by').setValue(table.reviewed_by);
    this.projectsForm.get('date_reviewed').setValue(table.date_reviewed);

    this.projectsForm.get('company').disable()
    this.projectsForm.get('client').disable()
    this.projectsForm.get('prepared_by').disable()
    this.projectsForm.get('checked_by').disable()
    // this.projectsForm.get('reviewed_by').disable()


    this.modalService.open(content, { ariaLabelledBy: 'project-report-modal-class', windowClass: 'manage-projects-modal-class', backdrop: 'static', keyboard: false, centered: false});
  }

  downloadPdf() {
    const link = document.createElement('a');
    link.href = this.pdfSrc;
    link.target = '_blank';
    link.download = 'document.pdf'; // Replace with your desired file name
    link.click();
  }
}
