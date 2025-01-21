import {Component, Input, OnInit, QueryList, ViewChildren} from '@angular/core';
import {Projects} from "../../../../shared/models/projects.model";
import {Elements} from "../../../../shared/models/elements.model";
import {FormBuilder, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {BbsProfileService} from "../../../../shared/services/bbs-profile.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {HttpErrorResponse} from "@angular/common/http";
import {Observable, Subscription} from "rxjs";
import {BbsFormulas} from "../../../../shared/models/bbs-formulas.model";
import {SortEvent} from "../../clients/my-clients/clients-sortable.directive";
import {ElementsService} from "../../elements/project-elements/elements.service";
import {DatePipe} from "@angular/common";
import {MembersService} from "./members.service";
import {ElementsSortableService} from "../../elements/project-elements/elements-sortable.directive";
import {Members} from "../../../../shared/models/members.model";
import {PackagesService} from "../../../../shared/services/packages.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-element-members',
  templateUrl: './element-members.component.html',
  styleUrls: ['./element-members.component.scss']
})
export class ElementMembersComponent implements OnInit {
  @Input() selectedElement: Elements;
  activities$: Observable<Members[]>;
  total$: Observable<number>;

  @ViewChildren(ElementsSortableService) headers: QueryList<ElementsSortableService>;
  public error = '';
  barSizes = [6, 8, 10, 12, 16, 20, 25, 32, 48, 50];

  memberForm: FormGroup;
  successmsg: string;
  submitted: boolean;

  private subscriptions: Subscription[] = [];
  shapeCodes: BbsFormulas[] = [];
  public scode_id: number;
  show_len_a: boolean;
  show_len_b: boolean;
  show_len_c: boolean;
  show_len_d: boolean;
  show_len_e: boolean;
  show_len_f: boolean;
  show_len_r: boolean;
  public members: Members[];
  updatebtn: boolean;
  public selectedMember: Members;
  loading: boolean;
  loading2: boolean;
  packageError = '';
  private subcription: any;
  constructor(
    public service: MembersService,
    private router: Router,
    private profileService: BbsProfileService,
    private packageService: PackagesService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe
  ) {
    this.activities$ = service.activities$;
    this.total$ = service.total$;
  }

  ngOnInit(): void {
    this.loadShapeCodes(this.selectedElement.steel_type.id, this.selectedElement.std_code.id);
    this.loadElementMembers(this.selectedElement.project.id, this.selectedElement.id);
    //this.loadSubscribedPackage();

    this.memberForm = this.formBuilder.group({
      project: [this.selectedElement.project.id, Validators.required],
      element: [this.selectedElement.id, Validators.required],
      name: ['', Validators.required],
      bar_mark: ['', Validators.required],
      bar_size: ['', Validators.required],
      total_members: ['', Validators.required],
      number_of_bars: ['', Validators.required],
      //total_length_of_bars: [''],
      shape_code: ['', Validators.required],
      length_a: [null],
      length_b: [null],
      length_c: [null],
      length_d: [null],
      length_e: [null],
      length_f: [null],
      length_r: [null],
    });
  }
  get f() { return this.memberForm.controls; }

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

  loadElementMembers(projectId: number, elementId: number){
    this.loading = true;
    this.subscriptions.push(
      this.profileService.getElementMembers(projectId, elementId).subscribe(
        (response: any) => {
          console.log(response);
          this.service.responceData = response.data;
          this.members = response.data;

          console.log('Members...');
          console.log(this.members);
          this.loading = false;
        },
        error=> {
          this.error = error ? error : '';
          this.loading = false;

        }
      )
    );
  }
  loadShapeCodes(steelTypeId: number, stdCodeId: number){
    this.subscriptions.push(
      this.profileService.getBssFormulaShapeCodes({steelType: steelTypeId, stdCode: stdCodeId}).subscribe(
        (response: any) => {
          console.log(response);
          // this.service.responceData = response.data;
          this.shapeCodes = response.data;

          console.log('Steel Types...');
          console.log(this.shapeCodes);
        },
        error=> {
          this.error = error ? error : '';
        }
      )
    );
  }


  onChangeShapeCode(event) {
    const option = event.target.value || 0;
    this.scode_id = option;

    this.showHideBarLength(parseInt(option));
  }

  onSelectShape(item: BbsFormulas, modal: any) {
    this.scode_id = item.id;
    this.showHideBarLength(item.id);
    this.memberForm.get('shape_code').setValue(item.id);
    modal.close('Close click')
  }

  editMember(table: Members) {
    this.scode_id = table.shape_code.id;
    this.showHideBarLength(this.scode_id);
    this.memberForm.get('bar_mark').setValue(table.bar_mark);
    this.memberForm.get('name').setValue(table.name);
    this.memberForm.get('bar_size').setValue(table.bar_size);
    this.memberForm.get('total_members').setValue(table.total_members);
    this.memberForm.get('number_of_bars').setValue(table.number_of_bars);
    this.memberForm.get('shape_code').setValue(table.shape_code.id);
    this.memberForm.get('length_a').setValue(table.length_a);
    this.memberForm.get('length_b').setValue(table.length_b);
    this.memberForm.get('length_c').setValue(table.length_c);
    this.memberForm.get('length_d').setValue(table.length_d);
    this.memberForm.get('length_e').setValue(table.length_e);
    this.memberForm.get('length_f').setValue(table.length_f);
    this.memberForm.get('length_r').setValue(table.length_r);

    this.selectedMember = table;

    this.updatebtn = true;
  }

  private showHideBarLength(option: number) {
    // alert(typeof option);
    if([2,3,4,5,31,32,33,34,1,21,30,50,59,60,89].includes(option)){
      // Box A Only
      this.show_len_a = true; this.memberForm.get(['length_a']).setValidators(Validators.required);

      this.show_len_b = false; this.memberForm.get(['length_b']).clearValidators();
      this.show_len_c = false; this.memberForm.get(['length_c']).clearValidators();
      this.show_len_d = false; this.memberForm.get(['length_d']).clearValidators();
      this.show_len_e = false; this.memberForm.get(['length_e']).clearValidators();
      this.show_len_f = false; this.memberForm.get(['length_f']).clearValidators();
      this.show_len_r = false; this.memberForm.get(['length_r']).clearValidators();

      this.memberForm.get(['length_b']).setValue(null);
      this.memberForm.get(['length_c']).setValue(null);
      this.memberForm.get(['length_d']).setValue(null);
      this.memberForm.get(['length_e']).setValue(null);
      this.memberForm.get(['length_f']).setValue(null);
      this.memberForm.get(['length_r']).setValue(null);

    }else if([20,64,65].includes(option)){
      //Box A and C Only
      this.show_len_a = true; this.memberForm.get(['length_a']).setValidators(Validators.required);
      this.show_len_c = true; this.memberForm.get(['length_c']).setValidators(Validators.required);

      this.show_len_b = false; this.memberForm.get(['length_b']).clearValidators();
      this.show_len_d = false; this.memberForm.get(['length_d']).clearValidators();
      this.show_len_e = false; this.memberForm.get(['length_e']).clearValidators();
      this.show_len_f = false; this.memberForm.get(['length_f']).clearValidators();
      this.show_len_r = false; this.memberForm.get(['length_r']).clearValidators();

      this.memberForm.get(['length_b']).setValue(null);
      //this.memberForm.get(['length_c']).setValue(null);
      this.memberForm.get(['length_d']).setValue(null);
      this.memberForm.get(['length_e']).setValue(null);
      this.memberForm.get(['length_f']).setValue(null);
      this.memberForm.get(['length_r']).setValue(null);

    }else if([6,22,35,51,49,24,25,53,54,61,90,19,48].includes(option)){
      //Box A and B Only
      this.show_len_a = true; this.memberForm.get(['length_a']).setValidators(Validators.required);
      this.show_len_b = true; this.memberForm.get(['length_b']).setValidators(Validators.required);

      this.show_len_c = false; this.memberForm.get(['length_c']).clearValidators();
      this.show_len_d = false; this.memberForm.get(['length_d']).clearValidators();
      this.show_len_e = false; this.memberForm.get(['length_e']).clearValidators();
      this.show_len_f = false; this.memberForm.get(['length_f']).clearValidators();
      this.show_len_r = false; this.memberForm.get(['length_r']).clearValidators();

      //this.memberForm.get(['length_b']).setValue(null);
      this.memberForm.get(['length_c']).setValue(null);
      this.memberForm.get(['length_d']).setValue(null);
      this.memberForm.get(['length_e']).setValue(null);
      this.memberForm.get(['length_f']).setValue(null);
      this.memberForm.get(['length_r']).setValue(null);

    }else if([70].includes(option)){
      //Box A,B and E Only
      this.show_len_a = true; this.memberForm.get(['length_a']).setValidators(Validators.required);
      this.show_len_b = true; this.memberForm.get(['length_b']).setValidators(Validators.required);
      this.show_len_e = true; this.memberForm.get(['length_e']).setValidators(Validators.required);

      this.show_len_c = false; this.memberForm.get(['length_c']).clearValidators();
      this.show_len_d = false; this.memberForm.get(['length_d']).clearValidators();
      this.show_len_f = false; this.memberForm.get(['length_f']).clearValidators();
      this.show_len_r = false; this.memberForm.get(['length_r']).clearValidators();

      //this.memberForm.get(['length_b']).setValue(null);
      this.memberForm.get(['length_c']).setValue(null);
      this.memberForm.get(['length_d']).setValue(null);
      //this.memberForm.get(['length_e']).setValue(null);
      this.memberForm.get(['length_f']).setValue(null);
      this.memberForm.get(['length_r']).setValue(null);

    }else if([14,43,62].includes(option)){
      //Box A, B and R Only
      this.show_len_a = true; this.memberForm.get(['length_a']).setValidators(Validators.required);
      this.show_len_b = true; this.memberForm.get(['length_b']).setValidators(Validators.required);
      this.show_len_r = true; this.memberForm.get(['length_r']).setValidators(Validators.required);

      this.show_len_c = false; this.memberForm.get(['length_c']).clearValidators();
      this.show_len_d = false; this.memberForm.get(['length_d']).clearValidators();
      this.show_len_e = false; this.memberForm.get(['length_e']).clearValidators();
      this.show_len_f = false; this.memberForm.get(['length_f']).clearValidators();

      //this.memberForm.get(['length_b']).setValue(null);
      this.memberForm.get(['length_c']).setValue(null);
      this.memberForm.get(['length_d']).setValue(null);
      this.memberForm.get(['length_e']).setValue(null);
      this.memberForm.get(['length_f']).setValue(null);
      //this.memberForm.get(['length_r']).setValue(null);

    }else if([7,8,12,17,36,37,41,46,66,68,72,73,74,10,39,9,13,38,42,69,71,63,23,52,77,28,57,91].includes(option)){
      //Box A, B and C Only
      this.show_len_a = true; this.memberForm.get(['length_a']).setValidators(Validators.required);
      this.show_len_b = true; this.memberForm.get(['length_b']).setValidators(Validators.required);
      this.show_len_c = true; this.memberForm.get(['length_c']).setValidators(Validators.required);

      this.show_len_d = false; this.memberForm.get(['length_d']).clearValidators();
      this.show_len_e = false; this.memberForm.get(['length_e']).clearValidators();
      this.show_len_f = false; this.memberForm.get(['length_f']).clearValidators();
      this.show_len_r = false; this.memberForm.get(['length_r']).clearValidators();

      //this.memberForm.get(['length_b']).setValue(null);
     // this.memberForm.get(['length_c']).setValue(null);
      this.memberForm.get(['length_d']).setValue(null);
      this.memberForm.get(['length_e']).setValue(null);
      this.memberForm.get(['length_f']).setValue(null);
      this.memberForm.get(['length_r']).setValue(null);
    }else if([15,26,27,67,75,76,80,84,85,87,92].includes(option)){
      //Box A, B, C, and D Only
      this.show_len_a = true; this.memberForm.get(['length_a']).setValidators(Validators.required);
      this.show_len_b = true; this.memberForm.get(['length_b']).setValidators(Validators.required);
      this.show_len_c = true; this.memberForm.get(['length_c']).setValidators(Validators.required);
      this.show_len_d = true; this.memberForm.get(['length_d']).setValidators(Validators.required);

      this.show_len_e = false; this.memberForm.get(['length_e']).clearValidators();
      this.show_len_f = false; this.memberForm.get(['length_f']).clearValidators();
      this.show_len_r = false; this.memberForm.get(['length_r']).clearValidators();

      //this.memberForm.get(['length_b']).setValue(null);
      //this.memberForm.get(['length_c']).setValue(null);
      //this.memberForm.get(['length_d']).setValue(null);
      this.memberForm.get(['length_e']).setValue(null);
      this.memberForm.get(['length_f']).setValue(null);
      this.memberForm.get(['length_r']).setValue(null);

    }else if([78,79,11,40,83].includes(option)){
      //Box A, B, C and E Only
      this.show_len_a = true; this.memberForm.get(['length_a']).setValidators(Validators.required);
      this.show_len_b = true; this.memberForm.get(['length_b']).setValidators(Validators.required);
      this.show_len_c = true; this.memberForm.get(['length_c']).setValidators(Validators.required);
      this.show_len_e = true; this.memberForm.get(['length_e']).setValidators(Validators.required);

      this.show_len_d = false; this.memberForm.get(['length_d']).clearValidators();
      this.show_len_f = false; this.memberForm.get(['length_f']).clearValidators();
      this.show_len_r = false; this.memberForm.get(['length_r']).clearValidators();

      //this.memberForm.get(['length_b']).setValue(null);
      //this.memberForm.get(['length_c']).setValue(null);
      this.memberForm.get(['length_d']).setValue(null);
      //this.memberForm.get(['length_e']).setValue(null);
      this.memberForm.get(['length_f']).setValue(null);
      this.memberForm.get(['length_r']).setValue(null);

    }else if([44,45,55,56].includes(option)){
      //Box A,B,C,D and R Only
      this.show_len_a = true; this.memberForm.get(['length_a']).setValidators(Validators.required);
      this.show_len_b = true; this.memberForm.get(['length_b']).setValidators(Validators.required);
      this.show_len_c = true; this.memberForm.get(['length_c']).setValidators(Validators.required);
      this.show_len_d = true; this.memberForm.get(['length_d']).setValidators(Validators.required);
      this.show_len_r = true; this.memberForm.get(['length_r']).setValidators(Validators.required);

      this.show_len_e = false; this.memberForm.get(['length_e']).clearValidators();
      this.show_len_f = false; this.memberForm.get(['length_f']).clearValidators();

      //this.memberForm.get(['length_b']).setValue(null);
      //this.memberForm.get(['length_c']).setValue(null);
      //this.memberForm.get(['length_d']).setValue(null);
      this.memberForm.get(['length_e']).setValue(null);
      this.memberForm.get(['length_f']).setValue(null);
      //this.memberForm.get(['length_r']).setValue(null);

    }else if([29,47,81,82].includes(option)){
      //Box A,B,C,D,E Only
      this.show_len_a = true; this.memberForm.get(['length_a']).setValidators(Validators.required);
      this.show_len_b = true; this.memberForm.get(['length_b']).setValidators(Validators.required);
      this.show_len_c = true; this.memberForm.get(['length_c']).setValidators(Validators.required);
      this.show_len_d = true; this.memberForm.get(['length_d']).setValidators(Validators.required);
      this.show_len_e = true; this.memberForm.get(['length_e']).setValidators(Validators.required);

      this.show_len_f = false; this.memberForm.get(['length_f']).clearValidators();
      this.show_len_r = false; this.memberForm.get(['length_r']).clearValidators();

      //this.memberForm.get(['length_b']).setValue(null);
      //this.memberForm.get(['length_c']).setValue(null);
      //this.memberForm.get(['length_d']).setValue(null);
      //this.memberForm.get(['length_e']).setValue(null);
      this.memberForm.get(['length_f']).setValue(null);
      this.memberForm.get(['length_r']).setValue(null);
    }else if([16,18,58,93].includes(option)){
      //Box A,B,C,D and E Only
      this.show_len_a = true; this.memberForm.get(['length_a']).setValidators(Validators.required);
      this.show_len_b = true; this.memberForm.get(['length_b']).setValidators(Validators.required);
      this.show_len_c = true; this.memberForm.get(['length_c']).setValidators(Validators.required);
      this.show_len_d = true; this.memberForm.get(['length_d']).setValidators(Validators.required);
      this.show_len_e = true; this.memberForm.get(['length_e']).setValidators(Validators.required);

      this.show_len_f = false; this.memberForm.get(['length_f']).clearValidators();
      this.show_len_r = false; this.memberForm.get(['length_r']).clearValidators();

      //this.memberForm.get(['length_b']).setValue(null);
      //this.memberForm.get(['length_c']).setValue(null);
      //this.memberForm.get(['length_d']).setValue(null);
      //this.memberForm.get(['length_e']).setValue(null);
      this.memberForm.get(['length_f']).setValue(null);
      this.memberForm.get(['length_r']).setValue(null);
    }else if([86,88].includes(option)){
      //Box A,B,C,D,E and F Only
      this.show_len_a = true; this.memberForm.get(['length_a']).setValidators(Validators.required);
      this.show_len_b = true; this.memberForm.get(['length_b']).setValidators(Validators.required);
      this.show_len_c = true; this.memberForm.get(['length_c']).setValidators(Validators.required);
      this.show_len_d = true; this.memberForm.get(['length_d']).setValidators(Validators.required);
      this.show_len_e = true; this.memberForm.get(['length_e']).setValidators(Validators.required);

      this.show_len_f = false; this.memberForm.get(['length_f']).clearValidators();
      this.show_len_r = false; this.memberForm.get(['length_r']).clearValidators();

      //this.memberForm.get(['length_b']).setValue(null);
      //this.memberForm.get(['length_c']).setValue(null);
      //this.memberForm.get(['length_d']).setValue(null);
      //this.memberForm.get(['length_e']).setValue(null);
      this.memberForm.get(['length_f']).setValue(null);
      this.memberForm.get(['length_r']).setValue(null);

    }else{
      //hide all boxex
      // alert('hide all');
      this.show_len_a = false; this.memberForm.get(['length_a']).clearValidators();
      this.show_len_b = false; this.memberForm.get(['length_b']).clearValidators();
      this.show_len_c = false; this.memberForm.get(['length_c']).clearValidators();
      this.show_len_d = false; this.memberForm.get(['length_d']).clearValidators();
      this.show_len_e = false; this.memberForm.get(['length_e']).clearValidators();
      this.show_len_f = false; this.memberForm.get(['length_f']).clearValidators();
      this.show_len_r = false; this.memberForm.get(['length_r']).clearValidators();

      this.memberForm.get(['length_a']).setValue(null);
      this.memberForm.get(['length_b']).setValue(null);
      this.memberForm.get(['length_c']).setValue(null);
      this.memberForm.get(['length_d']).setValue(null);
      this.memberForm.get(['length_e']).setValue(null);
      this.memberForm.get(['length_f']).setValue(null);
      this.memberForm.get(['length_r']).setValue(null);
    }
  }

  registerElementMember(value: any) {
    console.log('element for post');
    console.log(value);
    this.submitted = true;
/*    if(this.memberForm.invalid){
      Object.keys(this.memberForm.controls).forEach(key => {
        const controlErrors: ValidationErrors = this.memberForm.get(key).errors;
        if (controlErrors != null) {
          Object.keys(controlErrors).forEach(keyError => {
            console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
          });
        }
      });
      return;
    }else {

    }*/
    this.updatebtn = false;
    console.log('Form is Valid...');
    this.updatebtn = false;
    console.log('Form is Valid...');
    this.profileService.addMember(value).subscribe(
      (response: any) => {
        console.log(response);
        this.successmsg = response.message;
        console.log('Success......');
        console.log(response);
        this.error = '';
        this.selectedMember = response.data;
        this.service.responceData.push(this.selectedMember);
        // this.loadElementMembers(this.selectedElement.id, this.selectedElement.project.id);
        this.submitted = false;
        this.resetForm();
        this.memberForm.get('project').setValue(this.selectedElement.project.id);
        this.memberForm.get('element').setValue(this.selectedElement.id);
        this.memberForm.get('bar_size').setValue('');
        this.memberForm.get('shape_code').setValue('');
      },
      error=> {
        this.successmsg = '';
        this.error = error ? error : '';
      }
    );
  }


  updateElementMember(value: any) {
    this.submitted = true;
    this.updatebtn = false;
    console.log('Form is Valid...');
    this.profileService.updateMember(this.selectedMember.id, value).subscribe(
      (response: any) => {
        console.log(response);
        this.successmsg = response.message;
        console.log('Success Update Member......');
        console.log(response);
        this.error = '';
        this.selectedMember = response.data;
        //const index = this.service.responceData.indexOf(this.selectedMember);
        const index = this.service.responceData.findIndex(x => x.id === this.selectedMember.id);
        //alert(index)
        // this.service.responceData.splice(index, 1)
        this.service.responceData[index] = this.selectedMember;
        this.submitted = false;
        this.resetForm()
        this.memberForm.get('project').setValue(this.selectedElement.project.id);
        this.memberForm.get('element').setValue(this.selectedElement.id);
        this.memberForm.get('bar_size').setValue('');
        this.memberForm.get('shape_code').setValue('');
      },
      error=> {
        // console.log(error);
        this.successmsg = '';
        this.error = error ? error : '';
      }
    );
  }

  resetMemberForm() {
    this.resetForm();
    this.updatebtn = false;
    this.memberForm.get('project').setValue(this.selectedElement.project.id);
    this.memberForm.get('element').setValue(this.selectedElement.id);
    this.memberForm.get('bar_size').setValue('');
    this.memberForm.get('shape_code').setValue('');
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

  openViewShapes(content) {
    this.modalService.open(content, { size: 'xl', centered: false });
  }

  scrollModal(scrollDataModal: any) {
    this.modalService.open(scrollDataModal, { scrollable: true });
  }


  deleteMember(table: Members) {
    Swal.fire({
      title: 'Delete Member '+table.name+', Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Yes, delete it!'
    }).then(result => {
      if (result.value) {

        this.profileService.deleteMember(table.id).subscribe(
          (response: any) => {
            this.service.responceData = this.service.responceData.filter(item => item !== table)
            Swal.fire('Deleted!', response.message, 'success');
          },
          error=> {
            Swal.fire('Operation Failed: '+error.error.message, 'failed');
          }
        );
      }
    });
  }

  resetForm() {
    this.memberForm.reset(); // Reset the form to its initial state

    // Enable all controls
    Object.keys(this.memberForm.controls).forEach(key => {
      this.memberForm.get(key).enable();
    });
  }
}


