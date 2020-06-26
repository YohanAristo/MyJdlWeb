import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { TopBarMenuComponent } from '../top-bar-menu/top-bar-menu.component';
import { SideBarMenuComponent } from '../side-bar-menu/side-bar-menu.component';



@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    TopBarMenuComponent,
    SideBarMenuComponent
  ]
})
export class DashboardModule { }
