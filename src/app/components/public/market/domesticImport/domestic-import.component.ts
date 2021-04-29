import { Component, Injector } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';

import { ImportMarketModel } from 'src/app/_models/APIModel/domestic-market.model';
import { SAVE } from 'src/app/_enums/save.enum';

import { ExcelService } from 'src/app/_services/excelUtil.service';

import { CompanyTopPopup } from '../company-top-popup/company-top-popup.component';

import { FormControl } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import _moment from 'moment';
import { defaultFormat as _rollupMoment, Moment } from 'moment';
import { MarketServicePublic } from 'src/app/_services/APIService/market.service public';
import { BaseComponent } from 'src/app/components/specialized/base.component';

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-domestic-import',
  templateUrl: 'domestic-import.component.html',
  styleUrls: ['../../public_layout.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'vi' },
  ],
})

export class DomesticImportComponent extends BaseComponent {
  public displayedColumns: string[] = ['index', 'ten_san_pham', 'don_vi_tinh2', 'san_luong_thang', 'tri_gia_thang', 'san_luong_thang_tc', 'tri_gia_thang_tc', 'top_nhap_khau', 'id_san_pham'];
  public dataSource: MatTableDataSource<ImportMarketModel>;

  public pickedDate = new FormControl(_moment());
  public EXCEL_NAME = `Thông tin nhập khẩu`; 

  private sumSL: number = 0;
  private sumTG: number = 0;
  private sumSLCT: number = 0;
  private sumTGCT: number = 0;
  
  constructor(
    private injector: Injector,
    public marketService: MarketServicePublic,
    public excelService: ExcelService,
    public router: Router,
    public dialog: MatDialog) {
      super(injector);
    }

  ngOnInit() {
    super.ngOnInit();
    this.getImportlist(this.currentTime.format('YYYYMM'));
  }

  public getImportlist(time: string) {
    this.marketService.GetImportValue(time).subscribe(
      allrecords => {
        this.filteredDataSource.data = [];
        if (allrecords.data && allrecords.data.length > 0) {
          let data = allrecords.data[0];
          this.dataSource = new MatTableDataSource<ImportMarketModel>(data);
          this.filteredDataSource.data = [...this.dataSource.data];
        }
        this._prepareData();
        this.paginatorAgain();
      },
      error => this.errorMessage = <any>error
    );
  }

  _prepareData() {
    let data = this.dataSource.data;
    this.sumSL = data.length ? data.map(item => item.san_luong_thang).reduce((a, b) => a + b) : 0; 
    this.sumTG = data.length ? data.map(item => item.tri_gia_thang).reduce((a, b) => a + b) : 0; 
    this.sumSLCT = data.length ? data.map(item => item.san_luong_thang_tc).reduce((a, b) => a + b) : 0; 
    this.sumTGCT = data.length ? data.map(item => item.tri_gia_thang_tc).reduce((a, b) => a + b) : 0; 
  }

  public chosenYearHandler(normalizedYear: Moment) {
    const ctrlValue = this.pickedDate.value;
    ctrlValue.year(normalizedYear.year());
    this.pickedDate.setValue(ctrlValue);
    this.currentYear = normalizedYear.year();
  }

  public chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.pickedDate.value;
    ctrlValue.month(normalizedMonth.month());
    this.pickedDate.setValue(ctrlValue);
    this.currentMonth = normalizedMonth.month() + 1;
    datepicker.close();

    let currentYearAndMonth = this.currentYear.toString() + (this.currentMonth >= 10 ? this.currentMonth.toString() : '0' + this.currentMonth.toString());
    this.getImportlist(currentYearAndMonth);
  }

  public exportTOExcel() {
    this.EXCEL_NAME = `Thông tin nhập khẩu tháng ${this.currentMonth}-${this.currentYear}`; 
    this.excelService.exportDomTableAsExcelFile(this.EXCEL_NAME, `${this.currentMonth}-${this.currentYear}`, this.table.nativeElement);
  }

  public openCompanyTopPopup(data: any) {
    const dialogRef = this.dialog.open(CompanyTopPopup, {
      height: '70%',
      width: '70%',
      data: {
        message: 'Dữ liệu top doanh nghiệp nhập khẩu',
        import_data: data,
        typeOfSave: SAVE.IMPORT,
      }
    });
  }

}
