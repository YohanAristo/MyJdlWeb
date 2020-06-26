import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { CreateReimburseComponent } from '../view/reimburse/create-reimburse/create-reimburse.component';
import { DetailReimburseComponent } from '../view/reimburse/detail-reimburse/detail-reimburse.component';
import { CreateInventoryComponent } from '../view/inventory/create-inventory/create-inventory.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private dialog: MatDialog) { }

  openConfirmDialog(msg){
    return this.dialog.open(ConfirmDialogComponent, {
      width: '30vw',
      panelClass: 'confirm-dialog-container',
      disableClose: true,
      data : {
        message : msg
      }
    });
  }

  onCreateReimburse(){
    return this.dialog.open(CreateReimburseComponent, {
      disableClose: true,
      autoFocus: true,
      width : "45vw",
      data : null,
      panelClass: 'custom-mat-dialog'
    });
  }

  onEditReimburse(row){
    return this.dialog.open(CreateReimburseComponent, {
      disableClose: true,
      autoFocus: true,
      width : "45vw",
      data : row,
      panelClass: 'custom-mat-dialog'
    });
  }

  onDetailReimburse(row){
    return this.dialog.open(DetailReimburseComponent, {
      disableClose: true,
      autoFocus: true,
      width : "45vw",
      data : row,
      panelClass: 'custom-mat-dialog'
    });
  }

  onCreateInventory(){
    return this.dialog.open(CreateInventoryComponent, {
      disableClose: true,
      autoFocus: true,
      width : "45vw",
      data : null,
      panelClass: 'custom-mat-dialog'
    });
  }

  onEditInventory(row){
    return this.dialog.open(CreateInventoryComponent, {
      disableClose: true,
      autoFocus: true,
      width : "45vw",
      data : row,
      panelClass: 'custom-mat-dialog'
    });
  }
}
