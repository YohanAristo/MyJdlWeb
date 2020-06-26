import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { GetLoginResp } from '../entity/account/get-login-resp';
import { BaseResponse } from '../entity/common/base-response';
import { Observable, Subject } from 'rxjs';
import { GetUserResp } from '../entity/account/get-user-resp';
import { GetLoginRespV2 } from '../entity/account/get-login-resp-v2';
import { GetPrivilegeResp } from '../entity/account/get-privilege-resp';
import { GetPrivilegeByNipResp } from '../entity/account/get-privilege-by-nip-resp';
import { AppConfiguration } from '../config/app-configuration';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  // baseUrl = 'http://localhost:8080';
  // baseUrl = 'https://private-0db805-aristokuliah.apiary-mock.com';
  // baseUrl = 'http://account-service.apps.pcf.dti.co.id';

  private listners = new Subject<any>();

  constructor(
    private http: HttpClient, 
    private router: Router,
    private appConfig: AppConfiguration) { }

  baseUrl = this.appConfig.api_account;

  listen(): Observable<any>{
    return this.listners.asObservable();
  }
  filter(filterBy: string){
    this.listners.next(filterBy);
  }

  setLoggedIn(data){
    localStorage.setItem('user', data);
  }

  isLoggedIn(){
    return !!localStorage.getItem('user');
  }

  getLoggedIn(){
    return localStorage.getItem('user');
  }

  logout(){
    localStorage.removeItem('user');
    this.router.navigate(['login']);
    // window.location.reload();
  }

  postLoginWeb(postLoginReq){
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    return this.http.post<GetLoginResp>(this.baseUrl + '/v2rest/login', postLoginReq, { headers: headers})
  }

  postAccount(postAccountReq){
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    return this.http.post<BaseResponse>(this.baseUrl + '/v2rest/login', postAccountReq, { headers: headers})
  }

  getUser(id): Observable<GetUserResp>{
    return this.http.get<GetUserResp>(this.baseUrl + '/v2rest/user/' + id);
  }

  putPassword(putPassword){
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    return this.http.post<BaseResponse>(this.baseUrl + '/v2rest/user/password', putPassword, { headers: headers})
  }

  putResetPassword(putResetPasswordReq){
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    return this.http.post<BaseResponse>(this.baseUrl + '/v2rest/user/password/reset', putResetPasswordReq, { headers: headers})
  }

  postLoginV2(postLoginReq){
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    return this.http.post<GetLoginRespV2>(this.baseUrl + '/v2rest/v2/login', postLoginReq, { headers: headers})
  }

  getPrivilege(getPrivilegeReq){
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    return this.http.post<GetPrivilegeResp>(this.baseUrl + '/v2/privilege/privilege', getPrivilegeReq, { headers: headers})
  }

  getPrivilegeByNip(id){
    return this.http.get<GetPrivilegeByNipResp>(this.baseUrl + '/v2/privilege/privilege/' + id);
  }
}
