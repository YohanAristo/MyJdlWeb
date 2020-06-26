import { Component, OnInit, ViewChild } from '@angular/core';
import { GetFilterReimburseResp } from 'src/app/entity/reimburse/get-filter-reimburse-resp';
import { ListReimburse } from 'src/app/entity/reimburse/list-reimburse';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AccountService } from 'src/app/service/account.service';
import { ReimburseService } from 'src/app/service/reimburse.service';
import { UserSession } from 'src/app/entity/common/user-session';
import { CryptoService } from 'src/app/service/crypto.service';
import { BaseResponse } from 'src/app/entity/common/base-response';
import { NotificationService } from 'src/app/service/notification.service';
import { Constant } from 'src/app/entity/common/constant';
import { DialogService } from 'src/app/service/dialog.service';
import { DeleteReimburseReq } from 'src/app/entity/reimburse/delete-reimburse-req';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { GetReimburseReq } from 'src/app/entity/reimburse/get-reimburse-req';
import { PostFilterReimburseReq } from 'src/app/entity/reimburse/post-filter-reimburse-req';
import { DataFormatterService } from 'src/app/service/data-formatter.service';
import { HttpHeaders } from '@angular/common/http';
import { TooltipPosition } from '@angular/material/tooltip';
import {DomSanitizer} from '@angular/platform-browser';
import {MatIconRegistry} from '@angular/material/icon';
import { AppConfiguration } from 'src/app/config/app-configuration';

@Component({
  selector: 'app-reimburse-management',
  templateUrl: './reimburse-management.component.html',
  styleUrls: ['./reimburse-management.component.css']
})
export class ReimburseManagementComponent implements OnInit {

  listDataAll: MatTableDataSource<any>;
  listDataByMe: MatTableDataSource<any>;

  displayedColumnsByMe: string[] = ['no_reimburse', 'status_reimburse','tanggal_reimburse','item_reimburse', 'nominal_reimburse', 'action'];
  displayedColumnsAll: string[] = ['no_reimburse', 'status_reimburse','tanggal_reimburse','pengirim_reimburse','item_reimburse', 'nominal_reimburse', 'action'];
  
  @ViewChild('byMe') sortByMe: MatSort;
  @ViewChild('all') sortAll: MatSort;

  @ViewChild('byMe', {read: MatPaginator}) paginatorByMe: MatPaginator;
  @ViewChild('all', {read: MatPaginator}) paginatorAll: MatPaginator;
  
  pageSizeOptions: number[] = [5, 10, 25];
  pageSize = 10;
  positionOptions: TooltipPosition = 'above';
 
  nama: string;
  email: string;
  nip: string;

  countBelumDikirimByMe: number = 0;
  countBelumLunasByMe: number = 0;
  countReimburseByMe: number = 0;

  countBelumDikirimAll: number = 0;
  countBelumLunasAll: number = 0;
  countReimburseAll: number = 0;

  filterByMeForm: FormGroup;
  filterAllForm: FormGroup;
  searchKeyByMe: string;
  searchKeyAll: string;
  
  sortedDataByMe: ListReimburse[];
  sortedDataAll : ListReimburse[];
  listReimburseByMe: ListReimburse[];
  listReimburseAll: ListReimburse[];
  listReimburseByMeFilter: ListReimburse[] = [];
  listReimburseAllFilter: ListReimburse[] = [];

  listReimburseBelumLunasByMe: ListReimburse[] = [];
  listReimburseBelumDikirimByMe: ListReimburse[] = [];

  listReimburseBelumLunasAll: ListReimburse[] = [];
  listReimburseBelumDikirimAll: ListReimburse[] = [];

  getReimburseResp: GetFilterReimburseResp;
  userSession = new UserSession();
  deleteReimburseReq = new DeleteReimburseReq();
  postFilterReimburseReq = new PostFilterReimburseReq();
  baseResponse: BaseResponse;
  reiceveData;
  userIdPattern = "[uU][0-9]{6}";

  constructor(
    private fb: FormBuilder,
    private dialogService: DialogService,
    private accountService: AccountService,
    private reimburseService: ReimburseService,
    private dataFormatterService: DataFormatterService,
    private notificationService: NotificationService, 
    private cryptoService: CryptoService) {
      this.sortedDataAll = this.listReimburseAllFilter;
      this.sortedDataByMe = this.listReimburseByMeFilter;
      this.reimburseService.listen().subscribe((m:any) => {
        this.loadInitData();
      });
     }

  ngOnInit(): void {
    this.loadUser();
    this.loadInitData();
    this.postFilterByMe();
    this.postFilterAll();
  }

  postFilterByMe(){
    this.filterByMeForm = this.fb.group({
      startDate: [''],
      endDate: ['']
    }
    ,{
      validator: [this.dataFormatterService.dateValidator('startDate', 'endDate')]
    }
    );
    
  }

  postFilterAll(){
    this.filterAllForm = this.fb.group({
      startDate: [''],
      endDate: [''],
      nip: ['', [Validators.pattern(this.userIdPattern)]],
    }
    ,{
      validator: [this.dataFormatterService.dateValidator('startDate', 'endDate')]
    }
    );
  }

  get f() { 
    return this.filterByMeForm.controls; 
  }

  get g() { 
    return this.filterAllForm.controls; 
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

  sortDataByMe(sort: Sort) {
    const data = this.listReimburseByMeFilter;
    
    if (!sort.active || sort.direction === '') {
      this.sortedDataByMe = data;
      return;
    }

    this.sortedDataByMe = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'item': return compare(a.item, b.item, isAsc);
        case 'nama': return compare(a.name, b.name, isAsc);
        case 'nominal': return compare(a.nominal, b.nominal, isAsc);
        case 'date': return compare(a.created_date_sort, b.created_date_sort, isAsc);
        default: return 0;
      }
    });    
  }

  sortDataAll(sort: Sort) {
    const data = this.listReimburseAllFilter;
    
    if (!sort.active || sort.direction === '') {
      this.sortedDataAll = data;
      return;
    }

    this.sortedDataAll = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'item': return compare(a.item, b.item, isAsc);
        case 'nama': return compare(a.name, b.name, isAsc);
        case 'nominal': return compare(a.nominal, b.nominal, isAsc);
        case 'date': return compare(a.created_date_sort, b.created_date_sort, isAsc);
        default: return 0;
      }
    });    
  }

  loadInitData(){
    this.postFilterReimburseReq.end_date = "";
    this.postFilterReimburseReq.start_date = "";
    this.postFilterReimburseReq.item = "";
    this.postFilterReimburseReq.nip = "";
    this.loadFilterReimburseAll(this.postFilterReimburseReq);

    this.postFilterReimburseReq.nip = this.nip;
    this.loadFilterReimburseByMe(this.postFilterReimburseReq);
  }

  onFilterByMe(){
    this.postFilterReimburseReq.end_date = "";
    this.postFilterReimburseReq.start_date = "";
    this.postFilterReimburseReq.item = "";
    this.postFilterReimburseReq.nip = this.nip;

    var start_date = this.filterByMeForm.get("startDate").value;
    var end_date = this.filterByMeForm.get("endDate").value;

    if(start_date != ""){
      var start_date_convert = this.dataFormatterService.formatDate(start_date);
      this.postFilterReimburseReq.start_date = start_date_convert;
    }

    if(end_date != ""){
      var end_date_convert = this.dataFormatterService.formatDate(end_date);
      this.postFilterReimburseReq.end_date = end_date_convert;
    }

    this.loadFilterReimburseByMe(this.postFilterReimburseReq);
  }

  onFilterAll(){
    this.postFilterReimburseReq.end_date = "";
    this.postFilterReimburseReq.start_date = "";
    this.postFilterReimburseReq.item = "";
    this.postFilterReimburseReq.nip = "";

    var start_date = this.filterAllForm.get("startDate").value;
    var end_date = this.filterAllForm.get("endDate").value;
    var nip = this.filterAllForm.get("nip").value;

    if(start_date != ""){
      var start_date_convert = this.dataFormatterService.formatDate(start_date);
      this.postFilterReimburseReq.start_date = start_date_convert;
    }

    if(end_date != ""){
      var end_date_convert = this.dataFormatterService.formatDate(end_date);
      this.postFilterReimburseReq.end_date = end_date_convert;
    }

    if(nip != null ||nip != "" ){
      this.postFilterReimburseReq.nip = nip;
    }

    this.loadFilterReimburseAll(this.postFilterReimburseReq);
  }

  loadFilterReimburseByMe(getFilterReimburse){
    this.reimburseService.filterReimburse(getFilterReimburse)
      .subscribe( data => {

        this.countBelumDikirimByMe = 0;
        this.countBelumLunasByMe = 0;
        this.countReimburseByMe = 0;

        this.listReimburseBelumLunasByMe = [];
        this.listReimburseBelumDikirimByMe = [];
        this.listReimburseByMeFilter = [];

        this.getReimburseResp = data;
        this.listReimburseByMe = this.getReimburseResp.list_reimburse;

        for(var i=0; i < this.listReimburseByMe.length; i++){
          var listTemp = new ListReimburse();
          listTemp.created_date = this.dataFormatterService.formatTimestampToDate(this.listReimburseByMe[i].created_date);
          listTemp.created_date_sort = this.dataFormatterService.formatDateToTimestamp(this.listReimburseByMe[i].created_date);
          listTemp.item = this.listReimburseByMe[i].item;
          listTemp.name = this.listReimburseByMe[i].name;
          listTemp.nominal = this.listReimburseByMe[i].nominal;
          listTemp.pk_id = this.listReimburseByMe[i].pk_id;
          listTemp.paid_date = this.listReimburseByMe[i].paid_date;
          listTemp.sent_date = this.listReimburseByMe[i].sent_date;         

          if(listTemp.sent_date == '-' && listTemp.paid_date == '-'){
            this.countBelumDikirimByMe++;
            this.listReimburseBelumDikirimByMe.push(listTemp);
          }
          else if(listTemp.sent_date != '-' && listTemp.paid_date == '-'){
            this.countBelumLunasByMe++;
            this.listReimburseBelumLunasByMe.push(listTemp);
          }

          this.countReimburseByMe++;
          this.listReimburseByMeFilter.push(listTemp);
        }

        this.listDataByMe = new MatTableDataSource(this.listReimburseByMeFilter);
        this.listDataByMe.paginator = this.paginatorByMe;
        this.listDataByMe.sort = this.sortByMe;
      })
  }

  loadFilterReimburseAll(getFilterReimburse){
    this.reimburseService.filterReimburse(getFilterReimburse)
      .subscribe( data => {
        this.getReimburseResp = data;
        this.listReimburseAll = this.getReimburseResp.list_reimburse;
        this.countBelumDikirimAll = 0;
        this.countBelumLunasAll = 0;
        this.countReimburseAll = 0;

        this.listReimburseBelumLunasAll = [];
        this.listReimburseBelumDikirimAll = [];
        this.listReimburseAllFilter = [];

        for(var i=0; i < this.listReimburseAll.length; i++){
          var listTemp = new ListReimburse();
          listTemp.created_date = this.dataFormatterService.formatTimestampToDate(this.listReimburseAll[i].created_date);
          listTemp.created_date_sort = this.dataFormatterService.formatDateToTimestamp(this.listReimburseAll[i].created_date);
          listTemp.item = this.listReimburseAll[i].item;
          listTemp.name = this.listReimburseAll[i].name;
          listTemp.nominal = this.listReimburseAll[i].nominal;
          listTemp.pk_id = this.listReimburseAll[i].pk_id;
          listTemp.paid_date = this.listReimburseAll[i].paid_date;
          listTemp.sent_date = this.listReimburseAll[i].sent_date;

          if(listTemp.sent_date == '-' && listTemp.paid_date == '-'){
            this.countBelumDikirimAll++;
            this.listReimburseBelumDikirimAll.push(listTemp);
          }
          else if(listTemp.sent_date != '-' && listTemp.paid_date == '-'){
            this.countBelumLunasAll++;
            this.listReimburseBelumLunasAll.push(listTemp);
          }

          this.countReimburseAll++;
          this.listReimburseAllFilter.push(listTemp);
        }

        this.listDataAll = new MatTableDataSource(this.listReimburseAllFilter);
        this.listDataAll.paginator = this.paginatorAll;
        this.listDataAll.sort = this.sortAll;
      })
  }

  onFilterAllReimburseByMe(){
    this.listDataByMe = new MatTableDataSource(this.listReimburseByMeFilter);
    this.listDataByMe.paginator = this.paginatorAll;
    this.listDataByMe.sort = this.sortAll;
  }

  onFilterBelumDikirimByMe(){
    this.listDataByMe = new MatTableDataSource(this.listReimburseBelumDikirimByMe);
    this.listDataByMe.paginator = this.paginatorAll;
    this.listDataByMe.sort = this.sortAll;
  }

  onFilterBelumLunasByMe(){
    this.listDataByMe = new MatTableDataSource(this.listReimburseBelumLunasByMe);
    this.listDataByMe.paginator = this.paginatorAll;
    this.listDataByMe.sort = this.sortAll;
  }

  onFilterAllReimburse(){
    this.listDataAll = new MatTableDataSource(this.listReimburseAllFilter);
    this.listDataAll.paginator = this.paginatorAll;
    this.listDataAll.sort = this.sortAll;
  }

  onFilterBelumDikirimAll(){
    this.listDataAll = new MatTableDataSource(this.listReimburseBelumDikirimAll);
    this.listDataAll.paginator = this.paginatorAll;
    this.listDataAll.sort = this.sortAll;
  }

  onFilterBelumLunasAll(){
    this.listDataAll = new MatTableDataSource(this.listReimburseBelumLunasAll);
    this.listDataAll.paginator = this.paginatorAll;
    this.listDataAll.sort = this.sortAll;
  }

  applyFilterAll(){
    this.listDataAll.filter = this.searchKeyAll.trim();
  }

  applyFilterByMe(){
    this.listDataByMe.filter = this.searchKeyByMe.trim();
  }

  onSearchClearByMe(){
    this.searchKeyByMe="";
    this.applyFilterByMe();
  }

  onSearchClearAll(){
    this.searchKeyAll="";
    this.applyFilterAll();
  }

  onDelete(row){
    this.deleteReimburseReq.pk_id = row.pk_id
    this.dialogService.openConfirmDialog('Apakah anda yakin menghapus reimburse?')
    .afterClosed().subscribe(response => {
      if(response){
          this.reimburseService.deleteReimburse(row.pk_id)
          .subscribe(
            data => {
            this.reiceveData = data;
          this.reimburseService.filter(Constant.Statement.DELETE);
        
          if(this.reiceveData.error_code == Constant.ErrorCode.SUCCESS){
            this.notificationService.success(this.reiceveData.error_message);
          }
          else{
            this.notificationService.failed(this.reiceveData.error_message);
          }
        }
        );
      }
    });
  }

  onEdit(row){
    this.dialogService.onEditReimburse(row);
  }

  onDetail(row){
    console.log(row);

    this.dialogService.onDetailReimburse(row);
  }

  onCreate(){
    this.dialogService.onCreateReimburse();
  }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}