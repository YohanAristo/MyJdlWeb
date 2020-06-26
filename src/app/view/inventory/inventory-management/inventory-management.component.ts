import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Sort, MatSort } from '@angular/material/sort';
import { BaseResponse } from 'src/app/entity/common/base-response';
import { GetInventoryRespList } from 'src/app/entity/inventory/get-inventory-resp-list';
import { ListInventory } from 'src/app/entity/inventory/list-inventory';
import { ListInventoryTable } from 'src/app/entity/inventory/list-inventory-table';
import { TooltipPosition } from '@angular/material/tooltip';
import { InventoryService } from 'src/app/service/inventory.service';
import { NotificationService } from 'src/app/service/notification.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PostFilterInventoryReq } from 'src/app/entity/inventory/post-filter-inventory-req';
import { GetInventorySearchRespList } from 'src/app/entity/inventory/get-inventory-search-resp';
import { ListInventorySearch } from 'src/app/entity/inventory/list-inventory-search';
import { GetInventoryResp } from 'src/app/entity/inventory/get-inventory-resp';
import { DialogService } from 'src/app/service/dialog.service';
import { Constant } from 'src/app/entity/common/constant';

@Component({
  selector: 'app-inventory-management',
  templateUrl: './inventory-management.component.html',
  styleUrls: ['./inventory-management.component.css']
})
export class InventoryManagementComponent implements OnInit {

  listData: MatTableDataSource<any>;
  displayedColumns: string[] = ['no_inventory', 'kode_inventory', 'nama_inventory', 'jumlah_inventory','harga_inventory', 'action']
  
  filterForm: FormGroup;

  @ViewChild('sort') sort: MatSort;
  
  positionOptions: TooltipPosition = 'above';
  panelOpenState = false;
  
  temp: number;
  searchKey: string;
  lastCode: string = "0";
  lastCodeTemp;
  jumlahInquiry = "20";
  endOfFile: string;
  loadMoreCheck: boolean = false;

  categories: [];

  sortedData: ListInventoryTable[];

  postFilterInventoryReq = new PostFilterInventoryReq();
  baseResponse: BaseResponse;
  getInventoryResp: GetInventoryResp;
  getInventoryRespList: GetInventoryRespList;
  getInventorySearchRespList: GetInventorySearchRespList;
  listInventory: ListInventory[];
  listInventoryTable: ListInventoryTable[] = [];
  listInventorySeacrh: ListInventorySearch[];
  reicevedData;

  constructor(
    private fb: FormBuilder,
    private dialogService: DialogService,
    private notificationService: NotificationService, 
    private inventoryService: InventoryService) {
      this.inventoryService.listen().subscribe((m:any) => {
        if(this.temp == 0){
          this.loadData(this.postFilterInventoryReq, this.lastCodeTemp, this.jumlahInquiry);
        }
        else if(this.temp == 1){
          this.applySearch();
        }
      });
     }

  ngOnInit(): void {
    this.postFilter();
    this.loadKategori();
  }

  postFilter(){
    this.filterForm = this.fb.group({
      kategori: [''],
      barang: [''],
      stock: ['']
    });
  }

  loadKategori(){
    this.inventoryService.getKategoriList()
      .subscribe(data => {
        this.categories = data;
      })
  }

  onFilter(){
    this.onSearchClear();
    this.listInventoryTable = [];
    this.postFilterInventoryReq.kategori = "";
    this.postFilterInventoryReq.nama_barang = "";
    this.postFilterInventoryReq.stock_less_than = 0;

    var kategori = this.filterForm.get("kategori").value;
    var barang = this.filterForm.get("barang").value;
    var stock = this.filterForm.get("stock").value;

    if(kategori != "" ){
      this.postFilterInventoryReq.kategori = kategori;
    }

    if(barang != "" ){
      this.postFilterInventoryReq.nama_barang = barang;
    }

    if(stock != null && stock != ""){
      this.postFilterInventoryReq.stock_less_than = stock;
    }

    this.loadData(this.postFilterInventoryReq, this.lastCode, this.jumlahInquiry);
    this.temp = 0;
  }

  loadData(postFilterReq, lastCode, jumlahInquiry){
    this.inventoryService.postFilterInventory(postFilterReq, lastCode, jumlahInquiry)
    .subscribe(data => {
      this.getInventoryRespList = data;
      this.listInventory = this.getInventoryRespList.list_inventory;
      this.endOfFile = this.getInventoryRespList.end_of_file;
      if(this.getInventoryRespList.error_code == Constant.ErrorCode.SUCCESS){
        for(var i=0; i < this.listInventory.length; i++){
          var listTemp = new ListInventoryTable();
          listTemp.kode = this.listInventory[i].kode;
          listTemp.nama = this.listInventory[i].nama;
          listTemp.harga = this.listInventory[i].harga;
          listTemp.jumlah = this.listInventory[i].jumlah.toString() +" "+ this.listInventory[i].satuan;
          this.listInventoryTable.push(listTemp);
          this.lastCode = listTemp.kode;
        }
  
        if(this.listInventory.length != 0){
          if(this.getInventoryRespList.end_of_file == "N"){
            this.loadMoreCheck = true;
          }
          else{
            this.loadMoreCheck = false;
          }
        }
        else{
          this.loadMoreCheck = false;
        }
  
        this.listData = new MatTableDataSource(this.listInventoryTable);
        this.listData.sort = this.sort;
        this.sortedData = this.listInventoryTable;
      }
      else{
        this.notificationService.failed(this.getInventoryRespList.error_message);
      }
      
    })
  }

  loadMore(){
    this.postFilterInventoryReq.kategori = "";
    this.postFilterInventoryReq.nama_barang = "";
    this.postFilterInventoryReq.stock_less_than = 0;

    var kategori = this.filterForm.get("kategori").value;
    var barang = this.filterForm.get("barang").value;
    var stock = this.filterForm.get("stock").value;

    if(kategori != "" ){
      this.postFilterInventoryReq.kategori = kategori;
    }

    if(barang != "" ){
      this.postFilterInventoryReq.nama_barang = barang;
    }

    if(stock != 0 ){
      this.postFilterInventoryReq.stock_less_than = stock;
    }

    this.loadData(this.postFilterInventoryReq, this.lastCode, this.jumlahInquiry);
  }

  sortData(sort: Sort){
    const data = this.sortedData;
    
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }

    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'kode': return compare(a.kode, b.kode, isAsc);
        case 'nama': return compare(a.nama, b.nama, isAsc);
        case 'harga': return compare(a.harga, b.harga, isAsc);
        case 'jumlah': return compare(a.jumlah, b.jumlah, isAsc);
        default: return 0;
      }
    }); 
  }

  onCreate(){
    this.dialogService.onCreateInventory();
  }

  onEdit(row){
    console.log(row);
    this.dialogService.onEditInventory(row);
  }

  onDelete(row, i){
    if(i!=0){
      var indexBefore = i-1;
      this.lastCodeTemp = this.listInventoryTable[indexBefore].kode;
    }
    else{
      this.lastCodeTemp = this.listInventoryTable[i].kode;
    }
    

    this.dialogService.openConfirmDialog('Apakah anda yakin menghapus inventory?')
    .afterClosed().subscribe(response => {
      if(response){
          this.inventoryService.deleteInventory(row.pk_id)
          .subscribe(data => {
            this.reicevedData = data;
            this.inventoryService.filter(Constant.Statement.DELETE);
        
          if(this.reicevedData.error_code == Constant.ErrorCode.SUCCESS){
            this.notificationService.success(this.reicevedData.error_message);
          }
          else{
            this.notificationService.failed(this.reicevedData.error_message);
          }
        }
        );
      }
    });
  }

  onSearchClear(){
    this.searchKey = "";
  }

  applySearch(){
    this.filterForm.reset();
    this.loadMoreCheck = false;
    this.inventoryService.getSeacrhSuggestion(this.searchKey)
      .subscribe(data => {
        this.listInventoryTable = [];
        this.listData = new MatTableDataSource(this.listInventoryTable);

        this.getInventorySearchRespList = data;
        this.listInventorySeacrh = this.getInventorySearchRespList.list_search_suggestion;
        
        for(var i=0; i < this.listInventorySeacrh.length; i++){
          this.getInventoryToList(this.listInventorySeacrh[i].kode);
        }

        this.temp = 1;

      });
  }

  getInventoryToList(kode){
    this.inventoryService.getInventoryByKodeBarang(kode)
      .subscribe(data => {
        this.getInventoryResp = data;
        var listTemp = new ListInventoryTable();
        listTemp.kode = this.getInventoryResp.kode_barang;
        listTemp.harga = this.getInventoryResp.harga_barang;
        listTemp.nama = this.getInventoryResp.nama_barang;
        listTemp.jumlah = this.getInventoryResp.jumlah_barang.toString() +" "+ this.getInventoryResp.satuan;
        this.listInventoryTable.push(listTemp);

        this.listData = new MatTableDataSource(this.listInventoryTable);
        this.listData.sort = this.sort;
        this.sortedData = this.listInventoryTable;
      })
  }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}