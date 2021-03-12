import { Component, Injector, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatDatepicker, MatTableDataSource } from '@angular/material';

import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, NativeDateAdapter} from '@angular/material/core';

import { TFEModel } from 'src/app/_models/APIModel/trade-development.model';
import { BaseComponent } from 'src/app/components/specialized/base.component';
import { CommerceManagementService } from 'src/app/_services/APIService/commerce-management.service';
import moment from 'moment';

export const DATE_FORMAT_DATEPICKER = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
}

class CustomDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: Object): string {
    var formatString = 'YYYY';
    return moment(date).format(formatString);
  }
}

@Component({
  selector: 'app-trade-fairs-exhibitions',
  templateUrl: './trade-fairs-exhibitions.component.html',
  styleUrls: ['../../../special_layout.scss'],
  providers: [{
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    {
      provide: MAT_DATE_FORMATS, useValue: DATE_FORMAT_DATEPICKER
    },
    // {
    //   provide: DateAdapter, useClass: CustomDateAdapter
    // }
  ],
})

export class TradeFairsExhibitionsComponent extends BaseComponent {
  displayedColumns: string[] = ['select', 'index'];
  dataSource: MatTableDataSource<TFEModel> = new MatTableDataSource<TFEModel>();
  filteredDataSource: MatTableDataSource<TFEModel> = new MatTableDataSource<TFEModel>();
  @ViewChild(MatDatepicker, {static: true}) filteredDatePicker;
  displayedFields = {
    mst: "Mã số thuế",
    ten_doanh_nghiep: "Tên doanh nghiệp",
    dia_chi_doanh_nghiep: "Địa chỉ",
    ten_hoi_cho: "Tên hội chợ",
    thoi_gian_bat_dau: "Thời gian bắt đầu",
    thoi_gian_ket_thuc: "Thời gian kết thúc",
    dia_diem_to_chuc: "Địa điểm tổ chức",
    so_luong_gian_hang: "Số lượng gian hàng",
    san_pham: "Sản phẩm bán tại hội chợ",
    so_van_ban: "Số văn bản",
    co_quan_ban_hanh: "Cơ quan ban hành",
    ngay_thang_nam_van_ban: "Ngày tháng năm",
    // id_trang_thai: "Tình trạng",

}
  
  // Modify to get districts from API
  sanLuongBanRa: number;
  soLuongDoanhNghiep: number;
  isChecked: boolean;
  filteredDate = new FormControl(new Date());
  
  constructor(
    private injector: Injector,
    public commerceManagementService: CommerceManagementService,
    
    ) {
      super(injector);
      this._breadCrumService.sendLink(this._linkOutput);
  }

  ngOnInit() {
    super.ngOnInit();
    this.displayedColumns = this.displayedColumns.concat(Object.keys(this.displayedFields));
    this.getTFEList(new Date().getFullYear());
    this.initWards();
  }

  getLinkDefault(){
    this.LINK_DEFAULT = "/specialized/commecial-management/trade-development/TFE";
    this.TITLE_DEFAULT = "Hội chợ triển lãm";
    this.TEXT_DEFAULT = "Hội chợ triển lãm";
  }

  getFormParams() {
    return {
      ten_doanh_nghiep: new FormControl(),
      dia_chi_doanh_nghiep: new FormControl(),
      id_phuong_xa: new FormBuilder(),
      mst: new FormControl(),
      ten_hoi_cho: new FormControl(),
      thoi_gian_bat_dau: new FormControl(),
      thoi_gian_ket_thuc: new FormControl(),
      dia_diem_to_chuc: new FormControl(),
      so_luong_gian_hang: new FormControl(),
      san_pham: new FormControl(),
      so_van_ban: new FormControl(),
      co_quan_ban_hanh: new FormControl(),
      ngay_thang_nam_van_ban: new FormControl(),
    }
  }

  private chosenYearHandler(normalizedYear, datepicker) {
    // let ctrlValue = this.filteredDate.value;
    // ctrlValue.year(normalizedYear.year());
    this.filteredDate.setValue(normalizedYear);
    console.log(this.filteredDate.value.getFullYear())
    datepicker.close();
  }

  // private chosenMonthHandler(normalizedMonth, datepicker) {
  //   let ctrlValue = this.filteredDate.value;
  //   ctrlValue.month(normalizedMonth.month());
  //   this.filteredDate.setValue(ctrlValue);
  //   datepicker.close();
  // }

  public onFiltededDateChange(event): void {
    // let filteredDateInput = event.format('yyyy');
    this.getTFEList(event.getFullYear()
    );
  }

  applyFilter(event) {
    let filterValues = event.target ? event.target.value: event.value;
    if (filterValues instanceof Array) {
      let filteredData = [];
      filterValues.forEach(element => {
        this.dataSource.data.filter(x => x.id_phuong_xa == element).forEach(x => filteredData.push(x));
      });
      if (!filteredData.length) {
        this.filteredDataSource.data = filterValues.length ? []: this.dataSource.data;
      }
      else {
        this.filteredDataSource.data = filteredData;
      }
    } 
    else {
      this.filteredDataSource.filter = filterValues.trim().toLowerCase();
    }
  }

  getTFEList(time_id): void {
    this.commerceManagementService.getExpoData(time_id).subscribe(
      result => {
        this.dataSource = new MatTableDataSource<TFEModel>(result.data);
        this.filteredDataSource = new MatTableDataSource<TFEModel>(result.data);
        if (result.data && result.data.length > 0) {
          this.filteredDataSource.paginator = this.paginator;
        }
      },
      error => this.errorMessage = <any>error
    );
  }

  countBusiness(): number {
    return [...new Set(this.filteredDataSource.data.map(x => x.mst))].length;
  }

  // countHappenedFair(): number {
  //   return this.filteredDataSource.data.filter(x => new Date(this.formatMMDDYYYY(x.thoi_gian_bat_dau.split(' ')[x.thoi_gian_bat_dau.split(' ').length - 1])) < new Date()).length;
  // }

  // formatMMDDYYYY(date: string): string {
  //   var datearray = date.split("/");
  //   return datearray[1] + '/' + datearray[0] + '/' + datearray[2];
  // }

  prepareData(data) {
    data['thoi_gian_bat_dau'] = moment(data['thoi_gian_bat_dau']).format('DD/MM/yyyy');
    data['thoi_gian_ket_thuc'] = moment(data['thoi_gian_ket_thuc']).format('DD/MM/yyyy');
    data['ngay_thang_nam_van_ban'] = moment(data['ngay_thang_nam_van_ban']).format('DD/MM/yyyy');

    data = {...data, ...{
      id_trang_thai: 1,
      time_id: 2020,
    }};
    return data;
  }

  callService(data) {
    this.commerceManagementService.postExpoData([data]).subscribe(response => this.successNotify(response), error => this.errorNotify(error));
  }

  prepareRemoveData(){
    let datas = this.selection.selected.map(element => new Object({id: element.id}));
    return datas;
  }

  callRemoveService(data){
    this.commerceManagementService.deleteTradeFairs(data).subscribe(res => {
      this.successNotify(res);
    });
  }

}
