import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConfiguration } from '../config/app-configuration';
import { Subject, Observable } from 'rxjs';
import { PostInventoryReq } from '../entity/inventory/post-inventory-req';
import { PostFilterInventoryReq } from '../entity/inventory/post-filter-inventory-req';
import { GetInventoryRespList } from '../entity/inventory/get-inventory-resp-list';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  // baseUrl = 'http://inventory-jdl-uat.apps.pcf.dti.co.id';

  private listners = new Subject<any>();
  
  constructor(
    private http: HttpClient,
    private appConfig: AppConfiguration) { }
  
  baseUrl = this.appConfig.api_inventory;
  
  listen(): Observable<any>{
    return this.listners.asObservable();
  }
  filter(filterBy: string){
    this.listners.next(filterBy);
  }

  postInventory(postInventory){
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    return this.http.post<any>(this.baseUrl + '/addInventory', postInventory, { headers: headers})
  }

  putInventory(putInventory){
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    return this.http.put<any>(this.baseUrl + '/editInventory', putInventory, { headers: headers})
  }

  deleteInventory(deleteInventoryReq){
    return this.http.delete<any>(this.baseUrl + '/deleteInventory/' + deleteInventoryReq);
  }

  
  getInventoryByKodeBarang(getInventoryReq){
    return this.http.get<any>(this.baseUrl + '/getInventory/' + getInventoryReq)
  }

  postFilterInventory(postFilterInventory, lastCode, jumlahInquiry){
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    return this.http.post<GetInventoryRespList>(this.baseUrl + '/getInventoryList/' +lastCode +'/'+ jumlahInquiry, postFilterInventory, { headers: headers})
  }

  // MOCK
  // postFilterInventory(postFilterInventory, lastCode, jumlahInquiry){
  //   let headers = new HttpHeaders();
  //   headers = headers.set('Content-Type', 'application/json; charset=utf-8');
  //   return this.http.post<GetInventoryRespList>('https://private-0db805-aristokuliah.apiary-mock.com' + '/getInventoryList', postFilterInventory, { headers: headers})
  // }

  // getInventoryByKodeBarang(getInventoryReq){
  //   return this.http.get<any>('https://private-0db805-aristokuliah.apiary-mock.com' + '/getInventory/' + getInventoryReq)
  // }
// 

  getKategoriList(){
    return this.http.get<any>(this.baseUrl + '/getKategoriList');
  }

  getSatuanList(){
    return this.http.get<any>(this.baseUrl + '/getSatuanList');
  }

  getSeacrhSuggestion(key){
    return this.http.get<any>(this.baseUrl + '/getSearchSuggestion/' + key);
  }

}
