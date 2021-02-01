//Import Library
import { Component, ViewChild, ElementRef, OnInit, AfterViewInit, ViewChildren, QueryList } from '@angular/core';
import * as XLSX from 'xlsx';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl, NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map, isEmpty } from 'rxjs/operators';
import { MatTableFilter } from 'mat-table-filter';
import { MatAccordion } from '@angular/material/expansion';
import { MatPaginator } from '@angular/material/paginator';
//Import Component

//Import Model
import { HeaderMerge, ReportAttribute, ReportDatarow, ReportIndicator, ReportOject, ReportTable, ToltalHeaderMerge } from '../../../../../_models/APIModel/report.model';
//Import Service
import { ExcelService } from 'src/app/_services/excelUtil.service';
import { ControlService } from '../../../../../_services/APIService/control.service';
import { ReportDirective } from 'src/app/shared/report.directive';
import { KeyboardService } from 'src/app/shared/services/keyboard.service';
import { InformationService } from 'src/app/shared/information/information.service';
import { ReportService } from 'src/app/_services/APIService/report.service';
import * as moment from 'moment';
import { CompanyDetailModel } from 'src/app/_models/APIModel/domestic-market.model';
import { TreeviewConfig, TreeviewItem, TreeviewModule } from 'ngx-treeview';
import { AnnualReportRow } from 'src/app/_models/APIModel/annual-report-row.model';

interface HashTableNumber<T> {
  [key: string]: T;
}

@Component({
  selector: 'total-retail-sales-commecial',
  templateUrl: './total-retail-sales.component.html',
  styleUrls: ['../../../special_layout.scss'],
})

export class TRSManagementComponent implements OnInit {
  //Constant-------------------------------------------------------------------------

  //Viewchild & Input-----------------------------------------------------------------------
  @ViewChildren(ReportDirective) inputs: QueryList<ReportDirective>
  @ViewChild(MatAccordion, { static: false }) accordion: MatAccordion;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  //Variable for HTML&TS-------------------------------------------------------------------------
  //Variable for only TS-------------------------------------------------------------------------

  items: TreeviewItem[] = [];
  values: number[] = [];
  config = TreeviewConfig.create({
    hasAllCheckBox: false,
    hasFilter: true,
    hasCollapseExpand: true,
    decoupleChildFromParent: false,
    maxHeight: 400
  });

  dataSource: MatTableDataSource<AnnualReportRow>;

  public tableMergeHader: Array<ToltalHeaderMerge> = [];
  public mergeHeadersColumn: Array<string> = [];
  public indexOftableMergeHader: number = 0;

  columns: number = 1;
  displayedColumns: string[] = ['index', 'ind_name', 'thang_1', 'thang_2', 'thang_3', 'thang_4', 'thang_5', 'thang_6', 'thang_7', 'thang_8', 'thang_9', 'thang_10', 'thang_11', 'thang_12', 'tong'];

  //Angular FUnction --------------------------------------------------------------------
  constructor(
    public excelService: ExcelService,
    public reportSevice: ReportService
  ) { }

  applyFilter1(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnInit(): void {
    let data: any = JSON.parse(localStorage.getItem('currentUser'));
    this.get12MonthData();
    this.autoOpen();
  }

  autoOpen() {
    setTimeout(() => this.accordion.openAll(), 1000);
  }

  get12MonthData() {
    this.reportSevice.Get12MonthReports(10588757, 2020, 'THTKBC').subscribe(
      response => {
        let tempData: AnnualReportRow[] = [];
        for (var i = 0; i < response.data[0].length; i++) {
          let tempRow: AnnualReportRow = new AnnualReportRow();
          tempRow.ind_id = response.data[0][i].ind_id;
          tempRow.ind_name = response.data[0][i].ind_name;
          for (var j = 1; j < 13; j++) {
            tempRow['thang_' + j] = (response.data[j].length != 0) ? response.data[j][i]['thang_' + j] : null;
          }
          tempData.push(tempRow);
        }
        this.dataSource = new MatTableDataSource<AnnualReportRow>(tempData);
        this.dataSource.paginator = this.paginator;
        this.paginator._intl.itemsPerPageLabel = 'Số hàng';
        this.paginator._intl.firstPageLabel = "Trang Đầu";
        this.paginator._intl.lastPageLabel = "Trang Cuối";
        this.paginator._intl.previousPageLabel = "Trang Trước";
        this.paginator._intl.nextPageLabel = "Trang Tiếp";
      }
    )
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    // this.accordion.openAll();
  }

  //Xuất excel
  ExportTOExcel(filename: string, sheetname: string) {
    // this.excelService.exportDomTableAsExcelFile(filename, sheetname, this.table.nativeElement);
  }

  applyFilter(event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}

