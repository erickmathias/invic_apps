import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {environment} from "../../../environments/environment";
import {UserProfile} from "../models/user-profile";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class BbsProfileService {

  bbsUrl: String = environment.bbsUrl;
  slabUrl: String = environment.slabUrl;
  reportBaseUrl: String = environment.reportsBaseUrl;
  constructor(private http: HttpClient, private router: Router) {}
    getBbsProfile(username: string):Observable<UserProfile> {
      let options = {
        params: {username: username}
      }
      // return this.httpClient.get<UserProfile>(`${this.bbsUrl}/profiles/`, {options});
      return this.http.get<any>(`${this.bbsUrl}/profiles/`,options);

    }

  getBbsProfile2(username: string) {
    let options = {
      params: {username: username}
    }
    return this.http.get<any>(`${this.bbsUrl}/profiles/`,options);

  }

  addProfile(data) {
    if  (data.id > 0){
      return this.http.put<any>(`${this.bbsUrl}/profiles/${data.id}`,data);
    }else{
      return this.http.post<any>(`${this.bbsUrl}/profiles/`,data);
    }
  }

  addClient(data: any) {
    if(data.id > 0){
      return this.http.put<any>(`${this.bbsUrl}/clients/${data.id}`,data);
    }else{
      return this.http.post<any>(`${this.bbsUrl}/clients/`,data);
    }
  }

  addProject(data: any) {
    return this.http.post<any>(`${this.bbsUrl}/projects/`,data);
  }

  updateProject(data: any, projectId) {
    return this.http.put<any>(`${this.bbsUrl}/projects/${projectId}`,data);
  }

  getProjectElements(projectId: number) {
    let options = {
      params: {project: projectId}
    }
    return this.http.get<any[]>(`${this.bbsUrl}/projects/elements/${projectId}`,options);
  }

  getSlabPanelProperties(projectId: number) {
    let options = {
      params: {project: projectId}
    }
    return this.http.get<any[]>(`${this.slabUrl}/projects/sp-properties/${projectId}`,options);
  }

  getElementMembers(projectId: number, elementId: number) {
    let options = {
      params: {project: projectId, element: elementId}
    }
    return this.http.get<any[]>(`${this.bbsUrl}/element/members/${elementId}`, options);
  }

  getStandardCodes() {
    return this.http.get<any[]>(`${this.bbsUrl}/standard-codes/`);
  }

  getSteelType() {
    return this.http.get<any[]>(`${this.bbsUrl}/steel-types/`);
  }

  getPanelSupport() {
    return this.http.get<any[]>(`${this.slabUrl}/panel-support/`);
  }

  getProperties() {
    return this.http.get<any[]>(`${this.slabUrl}/slab-properties/`);
  }

  addElement(data) {
    return this.http.post<any>(`${this.bbsUrl}/elements/`,data);
  }
  addSpProperty(data) {
    return this.http.post<any>(`${this.slabUrl}/slab-panel-properties/`,data);
  }
  updateSpProperty(data, spid) {
    return this.http.put<any>(`${this.slabUrl}/slab-panel-properties/${spid}`,data);
  }
  updateElement(data, elementId) {
    return this.http.put<any>(`${this.bbsUrl}/elements/${elementId}`,data);
  }

  deleteElement(elementId: number) {
    return this.http.delete<any>(`${this.bbsUrl}/elements/${elementId}`);
  }
  addMember(data) {
    return this.http.post<any>(`${this.bbsUrl}/members/`,data);
  }

  deleteMember(memberId: number) {
    return this.http.delete<any>(`${this.bbsUrl}/member/${memberId}`);
  }

  getBssFormulaShapeCodes(param: { stdCode: number; steelType: number }) {
    let options = {
      params: param
    }
    return this.http.get<any[]>(`${this.bbsUrl}/formula/shape-codes/`, options);
  }

  updateMember(id: number, data: any) {
    return this.http.put<any>(`${this.bbsUrl}/member/${id}`,data);
  }


  addMaterialLoadingProperty(data: any, id: number) {
    if (id > 0){
      return this.http.put<any>(`${this.slabUrl}/material-loading/property2/${id}/`,data);
    }else {
      return this.http.post<any>(`${this.slabUrl}/material-loading/property/`,data);
    }
  }

  loadMaterialLoadingProperty(slab_panel_id) {
    return this.http.get<any>(`${this.slabUrl}/material-loading/property/${slab_panel_id}/`);
  }

  downloadCoverPage(id: number) {
    return this.http.get<any>(`${this.reportBaseUrl}/project/print/cover/${id}`, { responseType: 'blob' as 'json'});
  }

  downloadContentPage(id: number) {
    return this.http.get<any>(`${this.reportBaseUrl}/project/print/content/${id}`, { responseType: 'blob' as 'json'});
  }

  downloadSlabReportPdf(id: number) {
    return this.http.get<any>(`${this.slabUrl}/project/print/${id}/`, { responseType: 'blob' as 'json'});
  }

  downloadBbsReportPdf(id: number) {
    return this.http.get<any>(`${this.bbsUrl}/project/print/${id}/`, { responseType: 'blob' as 'json'});
  }
}


