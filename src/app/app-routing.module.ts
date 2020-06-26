import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './view/login/login.component';
import { TopBarMenuComponent } from './view/top-bar-menu/top-bar-menu.component';
import { SideBarMenuComponent } from './view/side-bar-menu/side-bar-menu.component';
import { DashboardComponent } from './view/dashboard/dashboard.component';
import { AuthGuard } from './guard/auth.guard';
import { MainMenuComponent } from './view/main-menu/main-menu.component';
import { ReimburseManagementComponent } from './view/reimburse/reimburse-management/reimburse-management.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { UserProfileComponent } from './view/user-profile/user-profile.component';
import { CreateReimburseComponent } from './view/reimburse/create-reimburse/create-reimburse.component';
import { DetailReimburseComponent } from './view/reimburse/detail-reimburse/detail-reimburse.component';
import { InventoryManagementComponent } from './view/inventory/inventory-management/inventory-management.component';
import { ReimburseSummaryComponent } from './view/reimburse/reimburse-summary/reimburse-summary.component';


const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: ReimburseManagementComponent
      },
      // {
      //   path: 'reimburse',
      //   component: ReimburseManagementComponent
      // },
      {
        path: 'reimburse-summary',
        component: ReimburseSummaryComponent
      },
      {
        path: 'inventory',
        component: InventoryManagementComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [
  TopBarMenuComponent,
  LoginComponent,
  SideBarMenuComponent,
  ConfirmDialogComponent,
  DashboardComponent,
  MainMenuComponent,
  ReimburseManagementComponent,
  CreateReimburseComponent,
  UserProfileComponent,
  DetailReimburseComponent
]
