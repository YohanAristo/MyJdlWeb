import { Component, OnInit, Inject } from '@angular/core';
import { ReimburseService } from 'src/app/service/reimburse.service';
import { GetReimburseReq } from 'src/app/entity/reimburse/get-reimburse-req';
import { GetReimburseResp } from 'src/app/entity/reimburse/get-reimburse-resp';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { DataFormatterService } from 'src/app/service/data-formatter.service';
import { NotificationService } from 'src/app/service/notification.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-detail-reimburse',
  templateUrl: './detail-reimburse.component.html',
  styleUrls: ['./detail-reimburse.component.css']
})
export class DetailReimburseComponent implements OnInit {
  
  selectedFileArray: Array<File> = [];

  enable: boolean;
  form: FormGroup;
  imgUrl: any;
  urls = [];
  receivedRow;
  getReimburseReq = new GetReimburseReq();
  getReimburseResp: GetReimburseResp;

  constructor(
    private fb: FormBuilder,
    private reimburseService: ReimburseService,
    private dataFormatterService: DataFormatterService,
    private notificationService: NotificationService,
    public dialogRef: MatDialogRef<DetailReimburseComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.receivedRow = data;
     }

  ngOnInit(): void {
    this.postReimburse();
    this.loadReimburse();
  }

  loadReimburse(){
    this.getReimburseReq.pk_id = this.receivedRow.pk_id;
    this.reimburseService.getReimburseByPkId(this.getReimburseReq)
      .subscribe(data => {
        this.getReimburseResp = data;
        this.setValueForm(this.getReimburseResp);

        console.log(data);

        if(this.getReimburseResp.img_id != null){
          if(Array.isArray(this.getReimburseResp.img_id)){
            let imgIdArray = this.getReimburseResp.img_id;

            for(var index in imgIdArray){
              this.getImage(imgIdArray[index]);
            }
          }
        }
      })
  }

  setValueForm(input){
    if(input.keterangan == null){
      this.enable = false;
    }
    else{
      this.enable = true;
    }

    this.form.setValue({
      lunasDate : new Date(this.dataFormatterService.formatTimestampToDate2(input.lunas_date)), 
      sentDate : new Date(this.dataFormatterService.formatTimestampToDate2(input.sent_date)),
      item: input.item,
      nominal: input.nominal,
      keterangan: input.keterangan
    });
  }

  postReimburse(){
    this.form = this.fb.group({
      item: ['',[Validators.required]],
      nominal: ['',[Validators.required]],
      lunasDate: ['',[Validators.required]],
      sentDate: ['',[Validators.required]],
      keterangan: ['']
    });
  }

  get f() { 
    return this.form.controls; 
  }

  getImage(id){
    this.reimburseService.getReimburseImage(id)
      .subscribe((val) => {
        this.createImageFromBlob(val);
      });
  }

  createImageFromBlob(image: Blob){
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      // this.imgUrl = reader.result;
      this.urls.push(reader.result); 
    }, false);

    if(image){
      reader.readAsDataURL(image);
    }
  }

  openImage(file, i){
    console.log(file);
    this.imgUrl = file;
    var modal = document.getElementById("myModal");
    modal.style.display = "block";
  }

  close(){
    var modal = document.getElementById("myModal");
    modal.style.display = "none";
  }

  onClose(){
    this.dialogRef.close();
  }
}
