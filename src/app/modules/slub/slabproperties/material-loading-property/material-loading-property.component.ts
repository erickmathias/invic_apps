import {Component, Input, OnInit} from '@angular/core';
import {SlabPanelProperties} from "../../../../shared/models/slab-panel-properties.model";
import {FormBuilder, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {BbsProfileService} from "../../../../shared/services/bbs-profile.service";
import {PackagesService} from "../../../../shared/services/packages.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {HttpErrorResponse} from "@angular/common/http";
import {MembersService} from "../../../bbs/members/element-members/members.service";
import {MaterialLoadingProperties} from "../../../../shared/models/material-loading-properties.model";

@Component({
  selector: 'app-material-loading-property',
  templateUrl: './material-loading-property.component.html',
  styleUrls: ['./material-loading-property.component.scss']
})
export class MaterialLoadingPropertyComponent implements OnInit {
  @Input() selectedSlabPanelProperty: SlabPanelProperties;
  breadCrumbItems: Array<{}>;
  botTopSize: number[] = [6,8,10,12,16,20,25,32,40,50];
  botTopGap: number[] = [];
  mtpForm: FormGroup;
  loading: boolean;
  public submitted: boolean;
  public updatebtn: boolean;
  public successmsg: any;
  public error: string;
  public selectedMaterialLoadingProperty: MaterialLoadingProperties;

  constructor(    public service: MembersService,
                  private router: Router,
                  private profileService: BbsProfileService,
                  private packageService: PackagesService,
                  private modalService: NgbModal,
                  private formBuilder: FormBuilder,) { }

  ngOnInit(): void {
    console.log('-----selectedSlabPanelProperty-----');
    console.log(this.selectedSlabPanelProperty);
    console.log('-----end of selectedSlabPanelProperty-----');
    this.loadMaterialLoadingProperty(this.selectedSlabPanelProperty.id);
    this.breadCrumbItems = [{ label: 'Forms' }, { label: 'Form Wizard', active: true }];

    const start = 25;
    const end = 400;
    const interval = 25;

    this.botTopGap = this.generateNumberArray(start, end, interval);

    this.mtpForm = this.formBuilder.group({
      project: [this.selectedSlabPanelProperty.project.id, Validators.required],
      slap_panel: [this.selectedSlabPanelProperty.id, Validators.required],
      concrete_strength: ['', Validators.required],
      concrete_steel_cover: ['', Validators.required],
      concrete_density: ['', Validators.required],
      concrete_wc_ratio: ['', Validators.required],
      steel_strength: ['', Validators.required],
      steel_bott1_size: ['', Validators.required],
      steel_bott2_size: ['', Validators.required],
      steel_top1_size: ['', Validators.required],
      steel_top2_size: ['', Validators.required],
      steel_density: ['', Validators.required],
      steel_bott1_gap: ['', Validators.required],
      steel_bott2_gap: ['', Validators.required],
      steel_top1_gap: ['', Validators.required],
      steel_top2_gap: ['', Validators.required],
      dead_loading_finishes: ['', Validators.required],
      dead_loading_partition: ['', Validators.required],
      dead_loading_services: ['', Validators.required],
      live_loading_imposed: ['', Validators.required],
    });
  }

  loadMaterialLoadingProperty(slab_panel_id){
    this.profileService.loadMaterialLoadingProperty(slab_panel_id).subscribe(
      (response: any) => {
        console.log('Selected Material Property..');
        console.log(response)
        this.selectedMaterialLoadingProperty = response.data;

        this.setFormData(this.selectedMaterialLoadingProperty);
      },
      error=> {

      }
    );
  }

  setFormData(data: MaterialLoadingProperties){
    //alert(data.concrete_strength);

    this.mtpForm.reset();
    this.mtpForm.get('project').setValue(this.selectedSlabPanelProperty.project.id);
    this.mtpForm.get('slap_panel').setValue(this.selectedSlabPanelProperty.id);
    this.mtpForm.get('concrete_strength').setValue(data.concrete_strength);
    this.mtpForm.get('concrete_steel_cover').setValue(data.concrete_steel_cover);
    this.mtpForm.get('concrete_density').setValue(data.concrete_density);
    this.mtpForm.get('concrete_wc_ratio').setValue(data.concrete_wc_ratio);
    this.mtpForm.get('steel_strength').setValue(data.steel_strength);
    this.mtpForm.get('steel_bott1_size').setValue(data.steel_bott1_size);
    this.mtpForm.get('steel_bott2_size').setValue(data.steel_bott2_size);
    this.mtpForm.get('steel_top1_size').setValue(data.steel_top1_size);
    this.mtpForm.get('steel_top2_size').setValue(data.steel_top2_size);
    this.mtpForm.get('steel_density').setValue(data.steel_density);
    this.mtpForm.get('steel_bott1_gap').setValue(data.steel_bott1_gap);
    this.mtpForm.get('steel_bott2_gap').setValue(data.steel_bott2_gap);
    this.mtpForm.get('steel_top1_gap').setValue(data.steel_top1_gap);
    this.mtpForm.get('steel_top2_gap').setValue(data.steel_top2_gap);
    this.mtpForm.get('dead_loading_finishes').setValue(data.dead_loading_finishes);
    this.mtpForm.get('dead_loading_partition').setValue(data.dead_loading_partition);
    this.mtpForm.get('dead_loading_services').setValue(data.dead_loading_services);
    this.mtpForm.get('live_loading_imposed').setValue(data.live_loading_imposed);
  }

  // Function to generate an array with numbers from start to end with a specified interval
  generateNumberArray(start: number, end: number, interval: number): number[] {
    const result = [];

    for (let i = start; i <= end; i += interval) {
      result.push(i);
    }

    return result;
  }

  submitMaterialProperties(value: any) {
    this.loading = true;
    this.submitted = true;
    if(this.mtpForm.invalid){
      Object.keys(this.mtpForm.controls).forEach(key => {
        const controlErrors: ValidationErrors = this.mtpForm.get(key).errors;
        if (controlErrors != null) {
          Object.keys(controlErrors).forEach(keyError => {
            console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
          });
          this.loading = false;
        }
      });
      return;
    }else {
      this.updatebtn = false;
      console.log('Form is Valid...');
      this.updatebtn = false;
      console.log('Form is Valid...');
      this.profileService.addMaterialLoadingProperty(value, this.selectedMaterialLoadingProperty?.id).subscribe(
        (response: any) => {
          console.log(response);
          this.successmsg = response.message;
          console.log('Success......');
          console.log(response);
          this.error = '';
          this.selectedMaterialLoadingProperty = response.data;
          // this.service.responceData.push(this.selectedMaterialLoadingProperty);
          // this.loadElementMembers(this.selectedElement.id, this.selectedElement.project.id);
          this.submitted = false;
          this.loading = false;

          this.mtpForm.reset();

          this.mtpForm.get('project').setValue(this.selectedSlabPanelProperty.project.id);
          this.mtpForm.get('slap_panel').setValue(this.selectedSlabPanelProperty.id);

          this.setFormData(this.selectedMaterialLoadingProperty);

        },
        error=> {
          this.loading = false;
          this.successmsg = '';
          this.error = error ? error : '';
        }
      );
    }
  }
}
