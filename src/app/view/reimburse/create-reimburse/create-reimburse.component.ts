import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { GetFilterReimburseResp } from 'src/app/entity/reimburse/get-filter-reimburse-resp';
import { BaseResponse } from 'src/app/entity/common/base-response';
import { UserSession } from 'src/app/entity/common/user-session';
import { ListReimburse } from 'src/app/entity/reimburse/list-reimburse';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AccountService } from 'src/app/service/account.service';
import { ReimburseService } from 'src/app/service/reimburse.service';
import { NotificationService } from 'src/app/service/notification.service';
import { CryptoService } from 'src/app/service/crypto.service';
import { Constant } from 'src/app/entity/common/constant';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GetReimburseReq } from 'src/app/entity/reimburse/get-reimburse-req';
import { GetReimburseResp } from 'src/app/entity/reimburse/get-reimburse-resp';
import { DataFormatterService } from 'src/app/service/data-formatter.service';
import { PostReimburseReq } from 'src/app/entity/reimburse/post-reimburse-req';
import { PutReimburseReq } from 'src/app/entity/reimburse/put-reimburse-req';
import { DomSanitizer } from '@angular/platform-browser';

export interface imgDetail{
 id: any;
 file: any;
}


@Component({
  selector: 'app-create-reimburse',
  templateUrl: './create-reimburse.component.html',
  styleUrls: ['./create-reimburse.component.css']
})
export class CreateReimburseComponent implements OnInit {

  imgId: string;
  imgUrl: any;
  public message: string;
  selectedFile: File = null;
  selectedFileArray: Array<File> = [];
  selectedFileImg = [];
  @ViewChild('imgId') attachment: any;

  imgOnload = [];
  imgOndelete = [];

  urls = [];

  checked = false;
  readonly: boolean;
  enable: boolean;
  nama: string;
  email: string;
  nip: string;
  title:string;
  buttonTxt:string;
  receivedRow;

  form: FormGroup;

  getReimburseResp: GetReimburseResp;
  getReimburseReq = new GetReimburseReq();
  postReimburseReq = new PostReimburseReq();
  putReimburseReq = new PutReimburseReq();
  userSession = new UserSession();
  baseRespone: BaseResponse;

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private dataFormatterService: DataFormatterService,
    private reimburseService: ReimburseService,
    private notificationService: NotificationService,
    public dialogRef: MatDialogRef<CreateReimburseComponent>,
    private cryptoService: CryptoService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.receivedRow = data;
      if(this.receivedRow != null){
        this.title = 'Edit Reimburse';
        this.buttonTxt = 'Simpan';
        this.enable = true;
      }
      else{
        this.title = 'Tambah Reimburse';
        this.buttonTxt = 'Selesai';
        this.enable = false;
        this.readonly = false;
      }
     }

  ngOnInit(): void {
    this.loadUser();
    this.postReimburse();
    if(this.receivedRow != null){
      this.loadReimburse();
      this.onDisable();
    }
  }

  loadUser(){
    var session = this.accountService.getLoggedIn()
    this.userSession = this.cryptoService.decryptAES(session);

    try{
      this.nama = this.userSession.nama;
      this.nip = this.userSession.nip;
      this.email = this.userSession.email;
    }
    catch (e) {
      this.accountService.logout();
    }
  }

  loadReimburse(){
    this.getReimburseReq.pk_id = this.receivedRow.pk_id;
    this.reimburseService.getReimburseByPkId(this.getReimburseReq)
      .subscribe(data => {
        this.getReimburseResp = data;
        this.setValueForm(this.getReimburseResp);
        
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
    this.form.setValue({
      lunasDate : new Date(this.dataFormatterService.formatTimestampToDate2(input.lunas_date)),
      sentDate : new Date(this.dataFormatterService.formatTimestampToDate2(input.sent_date)),
      item: input.item,
      nominal: input.nominal,
      keterangan: input.keterangan,
      imgId: '' 
    });
  }

  getImage(id){
    this.reimburseService.getReimburseImage(id)
      .subscribe((val) => {
        this.createImageFromBlob(val, id);
      });
  }

  createImageFromBlob(image: Blob, id){
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      this.urls.push(reader.result); 

      var imgDetail = { idImage: id, file: reader.result}

      this.imgOnload.push(imgDetail);

    }, false);

    if(image){
      reader.readAsDataURL(image);
    }
  }

  onEditable(){
    if(this.checked){
      this.onEnable();
    }
    else{
      this.onDisable();
    }
  }

  onDisable(){
    this.form.get('imgId').disable();
    this.readonly = true;
  }

  onEnable(){
    this.form.get('lunasDate').enable();
    this.form.get('sentDate').enable();
    this.form.get('nominal').enable();
    this.form.get('keterangan').enable();
    this.form.get('item').enable();
    this.form.get('imgId').enable();
    this.readonly = false;
  }

  get f() { 
    return this.form.controls; 
  }

  postReimburse(){
    this.form = this.fb.group({
      item: ['',[Validators.required]],
      nominal: ['',[Validators.required]],
      lunasDate: [''],
      sentDate: [''],
      keterangan: [''],
      imgId: [''] 
      
    })
  }

  uploadFile(event) {
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
              this.selectedFileArray.push(event.target.files[i])
              this.selectedFile = event.target.files[i];
              var reader = new FileReader();

              reader.onload = (event:any) => {
                this.urls.push(event.target.result); 
                this.selectedFileImg.push(event.target.result);
              }
              reader.readAsDataURL(event.target.files[i]);
      }
      this.attachment.nativeElement.value = '';
    }
  }


  // uploadFile(file) {
  //   this.selectedFile = file.target.files[0];
  // }

  // preview(files){
  //   if(files.length === 0)
  //     return;
    
  //   var mimeType = files[0].type;
  //   if(mimeType.match(/image\/*/) == null){
  //     this.message = "Only image are support";
  //     return;
  //   }

  //   var reader = new FileReader();
  //   reader.readAsDataURL(files[0]);
  //   reader.onload = (_event) => {
  //       console.log("tests")
  //       this.imgUrl = reader.result;
  //   }
    
    
  // }

  onSubmit(){
    let formData = new FormData();

    this.postReimburseReq.lunas_date = lunasDateConvert;
    this.postReimburseReq.sent_date = sentDateConvert;

    var imgId = this.form.get('imgId').value;
    var nominal = this.form.get('nominal').value;
    var item = this.form.get('item').value;
    var keterangan = this.form.get('keterangan').value;
    var lunasDateForm = this.form.get('lunasDate').value
    var sentDateForm = this.form.get('sentDate').value

    if(lunasDateForm != ""){
      var lunasDateConvert = this.dataFormatterService.formatDate(lunasDateForm);
    }

    if(sentDateForm != ""){
      var sentDateConvert = this.dataFormatterService.formatDate(sentDateForm);
    }

    if(this.receivedRow == null){
      this.postReimburseReq.nip = this.nip;
      this.postReimburseReq.nominal = nominal;
      this.postReimburseReq.item = item;
      this.postReimburseReq.keterangan = keterangan;
      this.postReimburseReq.lunas_date = lunasDateConvert;
      this.postReimburseReq.sent_date = sentDateConvert;

      if(this.selectedFileArray && this.selectedFileArray.length){
        // formData.append("files",JSON.stringify(this.selectedFileArray));
        // console.log(JSON.stringify(this.selectedFileArray));
        // console.log(new Blob ([JSON.stringify(this.selectedFileArray)]));

        for(const index in this.selectedFileArray){
          formData.append("file", this.selectedFileArray[index]);
        }
      }

      // if(this.selectedFile == null){
      //   imgId = '';
      // }
      // else{
      //   formData.append("file", this.selectedFile, this.selectedFile.name);
      //   formData.append("file", this.selectedFile);

      // }

      formData.append("input", JSON.stringify(this.postReimburseReq));
      this.reimburseService.postReimburse(formData)
        .subscribe(data => {
          this.baseRespone = data;

          if(this.baseRespone.error_code == Constant.ErrorCode.SUCCESS){
            this.notificationService.success(this.baseRespone.error_message);
            this.reimburseService.filter(Constant.Statement.POST);
            this.dialogRef.close();
          }
          else{
            this.notificationService.failed(this.baseRespone.error_message);
          }
          this.reimburseService.filter(Constant.Statement.POST);
          this.dialogRef.close();
        })
    }
    else{
      this.putReimburseReq.pk_id = this.receivedRow.pk_id;
      this.putReimburseReq.nip = this.nip;
      this.putReimburseReq.nominal = nominal;
      this.putReimburseReq.item = item;
      this.putReimburseReq.keterangan = keterangan;
      this.putReimburseReq.lunas_date = lunasDateConvert;
      this.putReimburseReq.sent_date = sentDateConvert;

      if(this.selectedFileArray && this.selectedFileArray.length){
        for(const index in this.selectedFileArray){
          formData.append("file", this.selectedFileArray[index]);
        }
      }

      formData.append("input", JSON.stringify(this.putReimburseReq));

      this.reimburseService.putReimburse(formData)
        .subscribe(data => {
          this.baseRespone = data;

          if(this.baseRespone.error_code == Constant.ErrorCode.SUCCESS){
            this.notificationService.success(this.baseRespone.error_message);
            this.reimburseService.filter(Constant.Statement.POST);
            this.dialogRef.close();

            if(this.imgOndelete && this.imgOndelete.length){
              for(const index1 in this.imgOndelete){
                this.reimburseService.deleteReimburseImage(this.imgOndelete[index1])
                .subscribe();
              }
            }
            
          }
          else{
            this.notificationService.failed(this.baseRespone.error_message);
          }
          this.reimburseService.filter(Constant.Statement.POST);
          this.dialogRef.close();
        })
    }
  }

  openImage(file, i){
    this.imgUrl = file;
    var modal = document.getElementById("myModal");
    modal.style.display = "block";
  }

  removeImage(file, i){
    if(this.receivedRow == null){
      this.urls.splice(i, 1);
      this.selectedFileArray.splice(i, 1);
    }
    else{
      for(const index in this.imgOnload){
        if(this.imgOnload[index].file === file){
          this.imgOndelete.push(this.imgOnload[index].idImage);
          this.urls.splice(i, 1);
        }
      }

      for(var index1 = 0; index1 < this.selectedFileArray.length; index1++){
        if(this.selectedFileImg[index1] === file){
          this.selectedFileArray.splice(index1, 1);
          this.selectedFileArray.splice(index1, 1);
          this.urls.splice(i, 1);
        }
      }
    }

  }
  
  close(){
    var modal = document.getElementById("myModal");
    modal.style.display = "none";
  }

  onClose(){
    this.dialogRef.close();
  }

}