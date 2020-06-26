import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';
import { BaseResponse } from '../entity/common/base-response';
import { GetFilterReimburseResp } from '../entity/reimburse/get-filter-reimburse-resp';
import { GetReimburseResp } from '../entity/reimburse/get-reimburse-resp';
import { AppConfiguration } from '../config/app-configuration';

@Injectable({
  providedIn: 'root'
})  
export class ReimburseService {

  // baseUrl = 'http://localhost:8080';
  // baseUrl = 'https://private-0db805-aristokuliah.apiary-mock.com';
  // baseUrl = 'http://reimburse-jdl-uat.apps.pcf.dti.co.id';
  // baseUrl = 'http://ireimburse-service.apps.pcf.dti.co.id';


  private listners = new Subject<any>();
  
  constructor(
    private http: HttpClient,
    private appConfig: AppConfiguration) { }

  baseUrl = this.appConfig.api_reimburse;
  
  listen(): Observable<any>{
    return this.listners.asObservable();
  }
  filter(filterBy: string){
    this.listners.next(filterBy);
  }

  postReimburse(formData){
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'multipart/form-data');
    return this.http.post<BaseResponse>(this.baseUrl + '/addReimburse', formData)
  }

  deleteReimburse(deleteReimburseReq){
    return this.http.delete<any>(this.baseUrl + '/v2/reimburse/' + deleteReimburseReq);
  }

  putReimburse(formData){
    return this.http.put<BaseResponse>(this.baseUrl + '/editReimburse', formData)
  }

  filterReimburse(postFilterReimburseReq){
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    return this.http.post<GetFilterReimburseResp>(this.baseUrl + '/filterReimburse', postFilterReimburseReq, { headers: headers})
  }

  filterUnfinishedReimburse(){
    return this.http.get<any>(this.baseUrl + '/v2/reimburses/unfinished')
  }

  getReimburseByPkId(getReimburseReq){
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    return this.http.post<GetReimburseResp>(this.baseUrl + '/getReimburseByPkId', getReimburseReq, { headers: headers})
  }

  getReimburseImage(getReimburseReq){
    let headers = new HttpHeaders({
      'Content-Type' : 'application/json',
      'Accept' : 'application/json'
    });
    return this.http.get<any>(this.baseUrl + '/downloadFile/' + getReimburseReq, { headers: headers,  responseType: 'blob' as 'json'});
  }

  deleteReimburseImage(deleteReimburseReq){
    return this.http.delete<any>(this.baseUrl + '/deleteFile/' + deleteReimburseReq);
  }

}
