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
  loading2: boolean;
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
    this.successmsg = '';
    this.error = '';
    this.resetForm();
    this.projectsForm.get('company').setValue(this.company.id);
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
          this.resetForm();

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

  updateProject(value: any) {

    value.date_checked = new Date(value.date_checked.year+'-'+value.date_checked.month+'-'+value.date_checked.day);
    value.date_prepared = new Date(value.date_prepared.year+'-'+value.date_prepared.month+'-'+value.date_prepared.day);
    value.date_reviewed = new Date(value.date_reviewed.year+'-'+value.date_reviewed.month+'-'+value.date_reviewed.day);
    this.submitted = true;

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

  convertBase64ToUrl(base64Data: string) {
    //const pdfData = 'data:application/pdf;base64,' + base64Data;
    this.pdfSrc = this.domSanitizer.bypassSecurityTrustResourceUrl(base64Data);
    this.loader = false;
  }

  downloadContentPage(content, project: Projects) {
    this.loader = true;
    this.loading = true;
    this.pdfSrc = null;
    this.error = '';
    // this.modalService.open(content, { ariaLabelledBy: 'project-report-modal-class', windowClass: 'manage-projects-modal-class', backdrop: 'static', keyboard: false, centered: false});

    if (project.type == 'BBS'){
      this.profileService.downloadBbsReportPdf(project.id)
        .subscribe((res) => {
/*            this.pdfSrc = this.domSanitizer.bypassSecurityTrustResourceUrl(
              URL.createObjectURL(res)
            );

 */
            this.loader = false;
            this.loading = false;
            const base64Pdf = res.pdf_base64 // Replace with your actual base64 string
            // this.convertBase64ToUrl(base64Pdf);
            this.displayPdf(base64Pdf, res.file_name);
          },
          (error)=> {
            this.loader = false;
            this.loading = false;
            // this.notification.showNotification('danger', 'Error downloading student id card !');
            this.error = error ? error : '';
          }
        );
    }else if (project.type == 'SLAB') {
      this.profileService.downloadSlabReportPdf(project.id)
        .subscribe((res) => {
            this.loader = false;
            this.loading = false;
            const base64Pdf = res.pdf_base64 // Replace with your actual base64 string
            // this.convertBase64ToUrl(base64Pdf);
            this.displayPdf(base64Pdf, res.file_name);
          },
          (error)=> {
            this.loader = false;
            this.loading = false;
            // this.notification.showNotification('danger', 'Error downloading student id card !');
            this.error = error ? error : '';
            // this.error = "Report Download Failed, Make sure you have the active Package Subscription and reliable Internet Connection";
          }
        );
    }

  }

  displayPdf(base64String: string, fileName: string) {
    try {
      // Remove Base64 header if present
      const base64Data = base64String.split(',')[1] || base64String;

      // Convert Base64 to Uint8Array
      const byteCharacters = window.atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);

      // Create a Blob instead of a File for download
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(blob);

      // Create a temporary anchor element and trigger download
      const a = document.createElement('a');
      a.href = fileURL;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      // Revoke the Object URL after download
      setTimeout(() => {
        URL.revokeObjectURL(fileURL);
      }, 1000);
    } catch (error) {
      console.error('Error decoding Base64:', error);
    }
  }

/*  displayPdf(base64String: string, fileName: string) {
    try {
      // Remove Base64 header if present
      const base64Data = base64String.split(',')[1] || base64String;

      // Convert Base64 to Uint8Array
      const byteCharacters = window.atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);

      // Create a File instead of a Blob to ensure correct filename
      const file = new File([byteArray], fileName, { type: 'application/pdf' });

      // Create Object URL
      const fileURL = URL.createObjectURL(file);

      // Display in iframe
      const iframe = document.getElementById('pdfFrame') as HTMLIFrameElement;
      if (iframe) {
        iframe.src = fileURL;
      }

      // Optional: Automatically revoke the object URL after a while
      setTimeout(() => {
        URL.revokeObjectURL(fileURL);
      }, 60000); // Revokes after 60 seconds to free memory

    } catch (error) {
      console.error('Error decoding Base64:', error);
    }
  }*/


  resetForm() {
    this.projectsForm.reset(); // Reset the form to its initial state

    // Enable all controls
    Object.keys(this.projectsForm.controls).forEach(key => {
      this.projectsForm.get(key).enable();
    });
  }

  editProject(content: any, table: Projects) {
    this.resetForm();
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
