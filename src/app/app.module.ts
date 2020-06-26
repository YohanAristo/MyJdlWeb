import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule, routingComponents } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialModule } from './material/material.module';
import { JsonAppConfigService } from './config/json-app-config.service';
import { AppConfiguration } from './config/app-configuration';
import { InventoryManagementComponent } from './view/inventory/inventory-management/inventory-management.component';
import { CreateInventoryComponent } from './view/inventory/create-inventory/create-inventory.component';
import { ReimburseSummaryComponent } from './view/reimburse/reimburse-summary/reimburse-summary.component';
import { NgxQRCodeModule } from 'ngx-qrcode2';

export function initializerFn(jsonAppConfigService: JsonAppConfigService){
  return () => {
    return jsonAppConfigService.load();
  }
}

@NgModule({
  declarations: [
    AppComponent,
    routingComponents,
    InventoryManagementComponent,
    CreateInventoryComponent,
    ReimburseSummaryComponent    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule,
    NgxQRCodeModule
  ],
  providers: [
    {
      provide: AppConfiguration,
      deps: [HttpClient],
      useExisting: JsonAppConfigService
    },
    {
      provide: APP_INITIALIZER,
      multi: true,
      deps: [JsonAppConfigService],
      useFactory: initializerFn
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
