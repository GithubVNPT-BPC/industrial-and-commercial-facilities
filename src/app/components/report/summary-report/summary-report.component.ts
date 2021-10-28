import { Component, OnInit } from "@angular/core";
import { BreadCrumService } from "src/app/_services/injectable-service/breadcrums.service";
import { InformationService } from 'src/app/shared/information/information.service';

import { FormControl } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import _moment from 'moment';
import { defaultFormat as _rollupMoment, Moment } from 'moment';

import { SCTService } from 'src/app/_services/APIService/sct.service';

import { ConfirmationDialogService } from 'src/app/shared/confirmation-dialog/confirmation-dialog.service';

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
  selector: 'app-summary-report',
  templateUrl: './summary-report.component.html',
  styleUrls: ['../report_layout.scss'],
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
export class SummaryReportComponent implements OnInit {

  public date = new FormControl(_moment());
  public newdate = new FormControl(_moment());
  public theYear: number = parseInt(_moment().format('YYYY'));
  public theMonth: number = parseInt(_moment().format('MM'));
  public stringmonth: string
  public time: string
  public timechange: number = parseInt(_moment().format('YYYYMM'));
  public month: string

  private displayedDatas = [];

  constructor(
    public sctService: SCTService,
    public _breadCrumService: BreadCrumService,
    public logger: InformationService,
    public confirmationDialogService: ConfirmationDialogService
    ) { }

  ngOnInit() {
    this.getData();
  }

  public getData() {
    this.displayedDatas = [];
    this.GetDanhSachCSSXCN(this.timechange);
    this.GetDanhSachBLHH(this.timechange);
  }

  GetDanhSachBLHH(time_id: number) {
    this.sctService.GetDanhSachBLHH(time_id).subscribe((result) => {
      if (result && result.data[0] && result.data[0].length) {
        for (let ind of result.data[0]) {
          ind['bao_cao'] = 'Tổng mức bán lẻ hàng hoá';
        }
        this.displayedDatas = [...this.displayedDatas, ...result.data[0]];
      }
    });
  }

  GetDanhSachCSSXCN(time_id: number) {
    this.sctService.GetDanhSachCSSX(time_id).subscribe((result) => {
      result.data[0].filter(x => x.time_id == time_id);
      if (result && result.data[0] && result.data[0].length) {
        for (let ind of result.data[0]) {
          ind['bao_cao'] = 'Chỉ số SXCN';
        }
        this.displayedDatas = [...this.displayedDatas, ...result.data[0]];
      }
    });
  }

  public chosenYearHandler(normalizedYear: Moment) {
    this.date = this.newdate
    const ctrlValue = this.date.value;
    ctrlValue.year(normalizedYear.year());
    this.date.setValue(ctrlValue);
    this.theYear = normalizedYear.year();
  }

  public chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.date.value;
    ctrlValue.month(normalizedMonth.month());
    this.date.setValue(ctrlValue);
    this.theMonth = normalizedMonth.month() + 1;
    datepicker.close();

    if (this.theMonth >= 10) {
        this.stringmonth = this.theMonth.toString();;
    }
    else {
        this.stringmonth = "0" + this.theMonth.toString();
    }
    this.time = this.theYear.toString() + this.stringmonth;
    this.timechange = parseInt(this.time);

    this.getData();

    this.month = this.time.substring(5, 6);
    
  }

  transform(value: any): string {
    if(typeof value === 'number'){
        value = value.toString();
    }
    if(value && value.trim() != "-"){
        value = value.toString().replace(',', '').replace(',', '').replace(',', '');
        return new Intl.NumberFormat('vi-VN', {
            minimumFractionDigits: 0
        }).format(Number(value));
    } else{
        return "-";
    }
  }
}
