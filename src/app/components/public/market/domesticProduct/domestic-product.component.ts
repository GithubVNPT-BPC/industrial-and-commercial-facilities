import { Component, Injector} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';

import { ProductValueModel } from 'src/app/_models/APIModel/domestic-market.model';
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

const moment = _rollupMoment || _moment;
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
  selector: 'app-domestic-product',
  templateUrl: 'domestic-product.component.html',
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

export class DomesticProductComponent extends BaseComponent {
  public displayedColumns: string[] = ['index', 'id_san_pham', 'ten_san_pham', 'don_vi_tinh2', 'san_luong', 'tri_gia', 'top_san_xuat'];
  public dataSource: MatTableDataSource<ProductValueModel>;
  
  public pickedDate = new FormControl(_moment());
  public EXCEL_NAME = `Thông tin sản xuất`; 

  private sumSL: number = 0;
  private sumTG: number = 0;

  constructor(
    private injector: Injector,
    public marketService: MarketServicePublic,
    public excelService: ExcelService,
    public router: Router,
    public dialog: MatDialog) {
      super(injector);
  }

  ngOnInit() {
    this.getDomesticMarketProduct(this.currentTime.format('YYYYMM'));
  }

  public getDomesticMarketProduct(time: string) {
    this.marketService.GetProductValue(time).subscribe(
      allrecords => {
        this.filteredDataSource.data = [];
        if (allrecords.data && allrecords.data.length > 0) {
          let data = allrecords.data[0];
          this.dataSource = new MatTableDataSource<ProductValueModel>(data);
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
    this.sumSL = data.length ? data.map(item => item.san_luong).reduce((a, b) => a + b) : 0; 
    this.sumTG = data.length ? data.map(item => item.tri_gia).reduce((a, b) => a + b) : 0; 
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
    this.getDomesticMarketProduct(currentYearAndMonth);
  }

  public exportTOExcel() {
    this.EXCEL_NAME = `Thông tin sản xuất tháng ${this.currentMonth}-${this.currentYear}`; 
    this.excelService.exportDomTableAsExcelFile(this.EXCEL_NAME, `${this.currentMonth}-${this.currentYear}`, this.table.nativeElement);
  }

  public openCompanyTopPopup(data: any) {
    const dialogRef = this.dialog.open(CompanyTopPopup, {
      height: '70%',
      width: '70%',
      data: {
        message: 'Dữ liệu top doanh nghiệp sản xuất',
        product_data: data,
        typeOfSave: SAVE.PRODUCT,
      }
    });
  }
}
