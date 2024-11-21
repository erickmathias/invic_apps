import { Injectable } from '@angular/core';
import {HttpClient, HttpEvent, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {UserProfile} from "../models/user-profile";

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  private baseUrl: String = environment.bbsUrl;

  constructor(private http: HttpClient) {}

  upload(file: File, profile: UserProfile): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('logo', file);
    formData.append('name', profile.name);
    formData.append('email', profile.email);
    formData.append('mobile', profile.mobile);
    formData.append('fax', profile.fax);
    formData.append('website', profile.website);
    formData.append('main_activity', profile.main_activity);
    formData.append('postal_address', profile.postal_address);
    formData.append('country', profile.country);
    formData.append('region', profile.region);
    formData.append('municipal', profile.municipal);
    formData.append('user', profile.user);
    formData.append('dial_code', profile.dial_code.toString());

    const req = new HttpRequest('PUT', `${this.baseUrl}/profiles/${profile.id}`, formData, {
      reportProgress: true,
      responseType: 'json',
    });

    return this.http.request(req);
  }

  getFiles(): Observable<any> {
    return this.http.get(`${this.baseUrl}/files`);
  }
}
