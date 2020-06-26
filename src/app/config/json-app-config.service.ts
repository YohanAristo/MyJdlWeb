import { Injectable } from '@angular/core';
import { AppConfiguration } from './app-configuration';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class JsonAppConfigService extends AppConfiguration{
  constructor(private http: HttpClient){
    super();
  }

  load(){
    return this.http.get<AppConfiguration>('app.config.json')
      .toPromise()
      .then(data => {
        this.api_reimburse = data.api_reimburse;
        this.api_account = data.api_account;
        this.api_inventory = data.api_inventory;
      })
      .catch(() => {
        console.error('Could not load configuration');
      })
  }
}
