import {Component, Input, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {FileUploadService} from "../../../../shared/services/file-upload.service";
import {HttpEventType, HttpResponse} from "@angular/common/http";
import { UserProfile } from 'src/app/shared/models/user-profile';
import {environment} from "../../../../../environments/environment";

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss']
})
export class ImageUploadComponent implements OnInit {
  selectedFiles?: FileList;
  currentFile?: File;
  progress = 0;
  message = '';
  preview = '';

  imageInfos?: Observable<any>;

  @Input() userProfile: UserProfile;
  @Input() selectedUsername: string = '';

  constructor(private uploadService: FileUploadService) {}

  ngOnInit(): void {
    console.log('------Current User Profile For Uploading Image is --------');
    console.log(this.userProfile);

    if(this.userProfile.logo !== null){
      this.preview = environment.baseUrl+this.userProfile.logo;
      console.log(this.preview)
    }
  }

  selectFile(event: any): void {
    this.message = '';
    this.preview = '';
    this.progress = 0;
    this.selectedFiles = event.target.files;

    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);

      if (file) {
        this.preview = '';
        this.currentFile = file;

        const reader = new FileReader();

        reader.onload = (e: any) => {
          console.log(e.target.result);
          this.preview = e.target.result;
        };

        reader.readAsDataURL(this.currentFile);
      }
    }
  }

  upload(): void {
    this.progress = 0;

    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);

      if (file) {
        this.currentFile = file;

        this.uploadService.upload(this.currentFile, this.userProfile).subscribe({
          next: (event: any) => {
            if (event.type === HttpEventType.UploadProgress) {
              this.progress = Math.round((100 * event.loaded) / event.total);
            } else if (event instanceof HttpResponse) {
              this.message = event.body.message;
              // this.imageInfos = this.uploadService.getFiles();
              this.userProfile = event.body.data;

            }
          },
          error: (err: any) => {
            console.log(err);
            this.progress = 0;

            if (err.error && err.error.message) {
              this.message = err.error.message;
            } else {
              this.message = 'Could not upload the image!';
            }

            this.currentFile = undefined;
          },
        });
      }

      this.selectedFiles = undefined;
    }
  }
}
