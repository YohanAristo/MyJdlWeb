import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DialogService } from 'src/app/service/dialog.service';
import { ReimburseService } from 'src/app/service/reimburse.service';
import { DataFormatterService } from 'src/app/service/data-formatter.service';
import { NotificationService } from 'src/app/service/notification.service';
import { ListReimburseSummary } from 'src/app/entity/reimburse/list-reimburse-summary';
import { GetReimburseSummaryResp } from 'src/app/entity/reimburse/get-reimburse-summary-resp';
import { ListReimburseFilter } from 'src/app/entity/reimburse/list-reimburse-filter';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { TooltipPosition } from '@angular/material/tooltip';

@Component({
  selector: 'app-reimburse-summary',
  templateUrl: './reimburse-summary.component.html',
  styleUrls: ['./reimburse-summary.component.css']
})
export class ReimburseSummaryComponent implements OnInit {

  listData: MatTableDataSource<any>;

  displayedColumns: string[] = ['no_reimburse', 'status_reimburse','tanggal_reimburse','pengirim_reimburse','item_reimburse', 'nominal_reimburse', 'action'];

  @ViewChild('sort') sort: MatSort;
  @ViewChild('paging', {read: MatPaginator}) paginator: MatPaginator;

  sortedData: ListReimburseSummary[];

  listReimburseAll: ListReimburseSummary[] = [];
  listReimburseBelumLunas: ListReimburseSummary[] = [];
  listReimburseBelumDikirim: ListReimburseSummary[] = [];
  
  listReimburseUnpaid: ListReimburseFilter[] = [];
  listReimburseUnsent: ListReimburseFilter[] = [];

  searchKey: string;
  pageSizeOptions: number[] = [10, 25, 50, 100];
  pageSize = 25;
  positionOptions: TooltipPosition = 'above';

  countBelumDikirim: number = 0;
  countBelumLunas: number = 0;
  countReimburse: number = 0;

  getReimburseSummary: GetReimburseSummaryResp
  constructor(
    private dialogService: DialogService,
    private reimburseService: ReimburseService,
    private dataFormatterService: DataFormatterService,
    private notificationService: NotificationService) {
      
     }

  ngOnInit(): void {
    this.onLoadData();
  }

  sortData(sort: Sort) {
    const data = this.sortedData;
    
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }

    this.sortedData = data.sort((a, b) => {
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

  onLoadData(){
    this.reimburseService.filterUnfinishedReimburse()
      .subscribe(data => {
        this.getReimburseSummary = data;
        this.listReimburseUnpaid = this.getReimburseSummary.unpaid_list;
        this.listReimburseUnsent = this.getReimburseSummary.unsent_list;
        this.countBelumDikirim = this.getReimburseSummary.unsent_count;
        this.countBelumLunas = this.getReimburseSummary.unpaid_count;
        this.countReimburse = this.getReimburseSummary.unfinished_count;

        this.listReimburseAll = [];
        this.listReimburseBelumDikirim = [];
        this.listReimburseBelumLunas = [];

        for(var i=0; i < this.listReimburseUnsent.length; i++){
          var listTemp = new ListReimburseSummary();
          listTemp.created_date = this.dataFormatterService.formatTimestampToDate(this.listReimburseUnsent[i].created_date);
          listTemp.created_date_sort = this.dataFormatterService.formatDateToTimestamp(this.listReimburseUnsent[i].created_date);
          listTemp.item = this.listReimburseUnsent[i].item;
          listTemp.name = this.listReimburseUnsent[i].name;
          listTemp.nominal = this.listReimburseUnsent[i].nominal;
          listTemp.pk_id = this.listReimburseUnsent[i].pk_id;
          listTemp.status = this.listReimburseUnsent[i].status;
          this.listReimburseBelumDikirim.push(listTemp);
          this.listReimburseAll.push(listTemp);
        }

        for(var i=0; i < this.listReimburseUnpaid.length; i++){
          var listTemp = new ListReimburseSummary();
          listTemp.created_date = this.dataFormatterService.formatTimestampToDate(this.listReimburseUnpaid[i].created_date);
          listTemp.created_date_sort = this.dataFormatterService.formatDateToTimestamp(this.listReimburseUnpaid[i].created_date);
          listTemp.item = this.listReimburseUnpaid[i].item;
          listTemp.name = this.listReimburseUnpaid[i].name;
          listTemp.nominal = this.listReimburseUnpaid[i].nominal;
          listTemp.pk_id = this.listReimburseUnpaid[i].pk_id;
          listTemp.status = this.listReimburseUnpaid[i].status;
          this.listReimburseBelumLunas.push(listTemp);
          this.listReimburseAll.push(listTemp);
        }

        

        this.listData = new MatTableDataSource(this.listReimburseAll);
        this.listData.paginator = this.paginator;
        this.listData.sort = this.sort;
        this.sortedData = this.listReimburseAll;
      })
  }

  onFilterAllReimburse(){
    this.listData = new MatTableDataSource(this.listReimburseAll);
    this.listData.paginator = this.paginator;
    this.listData.sort = this.sort;
    this.sortedData = this.listReimburseAll;
  }

  onFilterBelumDikirim(){
    this.listData = new MatTableDataSource(this.listReimburseBelumDikirim);
    this.listData.paginator = this.paginator;
    this.listData.sort = this.sort;
    this.sortedData = this.listReimburseBelumDikirim;
  }

  onFilterBelumLunas(){
    this.listData = new MatTableDataSource(this.listReimburseBelumLunas);
    this.listData.paginator = this.paginator;
    this.listData.sort = this.sort;
    this.sortedData = this.listReimburseBelumLunas;

  }

  applyFilter(){
    this.listData.filter = this.searchKey.trim();
  }

  onSearchClear(){
    this.searchKey = "";
    this.applyFilter();
  }

  onDetail(row){
    console.log(row.created_date_sort);
    this.dialogService.onDetailReimburse(row);
  }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}