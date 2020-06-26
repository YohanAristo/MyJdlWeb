import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NotificationService } from 'src/app/service/notification.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InventoryService } from 'src/app/service/inventory.service';
import { PostInventoryReq } from 'src/app/entity/inventory/post-inventory-req';
import { PutInventoryReq } from 'src/app/entity/inventory/put-inventory-req';
import { GetInventoryResp } from 'src/app/entity/inventory/get-inventory-resp';
import { Constant } from 'src/app/entity/common/constant';

@Component({
  selector: 'app-create-inventory',
  templateUrl: './create-inventory.component.html',
  styleUrls: ['./create-inventory.component.css']
})
export class CreateInventoryComponent implements OnInit {

  categories: [];
  satuans: [];
  habisPakais = [
    {state: 'Y', desc: 'Ya'},
    {state: 'N', desc: 'Tidak'}
  ];

  elementType : 'url' | 'canvas' | 'img' = 'url';

  fileName: string;
  kodeBarang: string;
  title: string;
  buttonTxt: string;
  receivedRow;
  form: FormGroup;
  displayQr: boolean;
  href : string;

  receivedData;
  postInventoryReq = new PostInventoryReq();
  putInventoryReq = new PutInventoryReq();
  getInventoryResp: GetInventoryResp;
  
  constructor(
    private fb: FormBuilder,
    private inventoryService: InventoryService,
    private notificationService: NotificationService,
    public dialogRef: MatDialogRef<CreateInventoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.receivedRow = data;
      if(this.receivedRow != null){
        this.title = 'Edit Inventory';
        this.buttonTxt = 'Simpan';
        this.displayQr = true;
        this.kodeBarang = this.receivedRow.kode;
      }
      else{
        this.title = 'Tambah Inventory';
        this.buttonTxt = 'Selesai';
        this.displayQr = false;
      }
     }

  ngOnInit(): void {
    this.postFilter();
    this.loadKategori();
    this.loadSatuan();
    if(this.receivedRow != null){
      this.loadInventory();
    }
  }

  postFilter(){
    this.form = this.fb.group({
      nama_barang: ['', [Validators.required]],
      kategori_barang: ['', [Validators.required]],
      harga_barang: ['', [Validators.required]],
      jumlah_barang: ['', [Validators.required]],
      satuan: ['', [Validators.required]],
      habis_pakai: ['', [Validators.required]],
      keterangan: ['']
    });
  }

  get f() { 
    return this.form.controls; 
  }

  loadKategori(){
    this.inventoryService.getKategoriList()
      .subscribe(data => {
        this.categories = data;
      })
  }

  loadSatuan(){
    this.inventoryService.getSatuanList()
      .subscribe(data => {
        this.satuans = data;
      })
  }

  loadInventory(){
    this.inventoryService.getInventoryByKodeBarang(this.receivedRow.kode)
      .subscribe(data => {
        this.getInventoryResp = data;
        this.fileName = "QR Code - " + this.getInventoryResp.nama_barang;
        this.setValueForm(this.getInventoryResp);
      });
  }

  setValueForm(input){
    this.form.setValue({
      nama_barang: input.nama_barang,
      harga_barang: input.harga_barang,
      kategori_barang: input.kategori_barang,
      jumlah_barang: input.jumlah_barang,
      satuan: input.satuan,
      habis_pakai: input.habis_pakai,
      keterangan: input.keterangan
    });
  }

  onSubmit(){
    var nama_barang_form = this.form.get('nama_barang').value;
    var kategori_barang_form = this.form.get('kategori_barang').value;
    var jumlah_barang_form = this.form.get('jumlah_barang').value;
    var harga_barang_form = this.form.get('harga_barang').value;
    var satuan_form = this.form.get('satuan').value;
    var habis_pakai_form = this.form.get('habis_pakai').value;
    var keterangan_form = this.form.get('keterangan').value;


    if(this.receivedRow == null){
      this.postInventoryReq.nama_barang = nama_barang_form;
      this.postInventoryReq.kategori_barang = kategori_barang_form;
      this.postInventoryReq.jumlah_barang = jumlah_barang_form;
      this.postInventoryReq.satuan = satuan_form;
      this.postInventoryReq.habis_pakai = habis_pakai_form;
      this.postInventoryReq.keterangan = keterangan_form;
      this.postInventoryReq.harga_barang = harga_barang_form;

      this.inventoryService.postInventory(this.postInventoryReq)
        .subscribe(data => {
          this.receivedData = data;

          if(this.receivedData.error_code == Constant.ErrorCode.SUCCESS){
            this.inventoryService.filter(Constant.Statement.DELETE);
            this.notificationService.success(this.receivedData.error_message);
            this.dialogRef.close();
          }
          else{
            this.notificationService.failed(this.receivedData.error_message);
            this.dialogRef.close();
          }
        });
    }
    else{
      this.putInventoryReq.nama_barang = nama_barang_form;
      this.putInventoryReq.kategori_barang = kategori_barang_form;
      this.putInventoryReq.jumlah_barang = jumlah_barang_form;
      this.putInventoryReq.satuan = satuan_form;
      this.putInventoryReq.habis_pakai = habis_pakai_form;
      this.putInventoryReq.keterangan = keterangan_form;
      this.putInventoryReq.harga_barang = harga_barang_form;
      this.putInventoryReq.kode_barang = this.kodeBarang;

      this.inventoryService.putInventory(this.putInventoryReq)
        .subscribe(data => {
          this.receivedData = data;

          if(this.receivedData.error_code == Constant.ErrorCode.SUCCESS){
            this.notificationService.success(this.receivedData.error_message);
            this.dialogRef.close();
          }
          else{
            this.notificationService.failed(this.receivedData.error_message);
            this.dialogRef.close();
          }
        });
    }
  }

  onClose(){
    this.dialogRef.close();
  }

  downloadImage(){
    this.href = document.getElementsByTagName('img')[2].src;
  }

}
