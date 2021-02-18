import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatOption, MatSelect, MatTableDataSource } from '@angular/material';
import { SCTService } from 'src/app/_services/APIService/sct.service';
import { MatAccordion } from '@angular/material/expansion';
import { MatPaginator } from '@angular/material/paginator';
import { District } from 'src/app/_models/district.model';
import { TFEModel } from 'src/app/_models/APIModel/trade-development.model';

import { ExcelService } from 'src/app/_services/excelUtil.service';
import { CommerceManagementService } from 'src/app/_services/APIService/commerce-management.service';
import { InformationService } from 'src/app/shared/information/information.service';

import moment from 'moment';

@Component({
  selector: 'app-trade-fairs-exhibitions',
  templateUrl: './trade-fairs-exhibitions.component.html',
  styleUrls: ['../../../special_layout.scss'],
})

export class TradeFairsExhibitionsComponent implements OnInit {
  displayedColumns: string[] = [
    'index', 'ten_doanh_nghiep', 'dia_chi_doanh_nghiep', 'mst', 'ten_hoi_cho', 'thoi_gian_bat_dau', 'thoi_gian_ket_thuc', 
    'dia_diem_to_chuc', 'so_luong_gian_hang', 'san_pham', 'so_van_ban', 
    'co_quan_ban_hanh', 'ngay_thang_nam_van_ban', 'id_trang_thai',];
  formData = this.formBuilder.group({
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
  });

  dataSource: MatTableDataSource<TFEModel> = new MatTableDataSource<TFEModel>();
  filteredDataSource: MatTableDataSource<TFEModel> = new MatTableDataSource<TFEModel>();

  years: number[] = [];
  // Modify to get districts from API
  districts: District[] = [
    { id: 1, ten_quan_huyen: 'Thị xã Phước Long' },
    { id: 2, ten_quan_huyen: 'Thành phố Đồng Xoài' },
    { id: 3, ten_quan_huyen: 'Thị xã Bình Long' },
    { id: 4, ten_quan_huyen: 'Huyện Bù Gia Mập' },
    { id: 5, ten_quan_huyen: 'Huyện Lộc Ninh' },
    { id: 6, ten_quan_huyen: 'Huyện Bù Đốp' },
    { id: 7, ten_quan_huyen: 'Huyện Hớn Quản' },
    { id: 8, ten_quan_huyen: 'Huyện Đồng Phú' },
    { id: 9, ten_quan_huyen: 'Huyện Bù Đăng' },
    { id: 10, ten_quan_huyen: 'Huyện Chơn Thành' },
    { id: 11, ten_quan_huyen: 'Huyện Phú Riềng' }
  ];
  sanLuongBanRa: number;
  soLuongDoanhNghiep: number;
  isChecked: boolean;
  private currentDate = moment().format('yyyyMM');
  public errorMessage: any;
  private view = 'list';

  @ViewChild(MatAccordion, { static: false }) accordion: MatAccordion;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('TABLE', { static: false }) table: ElementRef;

  ExportTOExcel(filename: string, sheetname: string) {
      this.excelService.exportDomTableAsExcelFile(filename, sheetname, this.table.nativeElement);
  }

  constructor(
    private formBuilder: FormBuilder,
    public sctService: SCTService,
    public _infor: InformationService,
    public commerceManagementService : CommerceManagementService,
    public excelService: ExcelService, ) {
  }

  ngOnInit() {
    this.years = this.getYears();
    this.autoOpen();
    this.getTFEList();
  }

  autoOpen() {
    setTimeout(() => this.accordion.openAll(), 1000);
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

  getTFEList(): void {
    this.commerceManagementService.getExpoData(this.currentDate).subscribe(
      result => {
        if (result.data && result.data.length > 0) {
          this.dataSource = new MatTableDataSource<TFEModel>(result.data);
          this.filteredDataSource = new MatTableDataSource<TFEModel>(result.data);
          this.filteredDataSource.paginator = this.paginator;
        }
      },
      error => this.errorMessage = <any>error
    );
  }

  getYears() {
    return Array(5).fill(1).map((element, index) => new Date().getFullYear() - index);
  }

  countBusiness(): number {
    return [...new Set(this.filteredDataSource.data.map(x => x.mst))].length;
  }

  // countHappenedFair(): number {
  //   return this.filteredDataSource.data.filter(x => new Date(this.formatMMDDYYYY(x.thoi_gian_bat_dau.split(' ')[x.thoi_gian_bat_dau.split(' ').length - 1])) < new Date()).length;
  // }

  formatMMDDYYYY(date: string): string {
    var datearray = date.split("/");
    return datearray[1] + '/' + datearray[0] + '/' + datearray[2];
  }

  @ViewChild('dSelect', { static: false }) dSelect: MatSelect;
  allSelected = false;
  toggleAllSelection() {
    this.allSelected = !this.allSelected;  // to control select-unselect

    if (this.allSelected) {
      this.dSelect.options.forEach((item: MatOption) => item.select());
    } else {
      this.dSelect.options.forEach((item: MatOption) => item.deselect());
    }
    this.dSelect.close();
  }

  private switchView() {
    this.view = this.view == 'list' ? 'form': 'list';
  }

  onCreate(): void {
    // TODO: Check 'id_phuong_xa'
    let data = this.formData.value;
    data['thoi_gian_bat_dau'] = moment(data['thoi_gian_bat_dau']).format('DD/MM/yyyy');
    data['thoi_gian_ket_thuc'] = moment(data['thoi_gian_ket_thuc']).format('DD/MM/yyyy');
    data['ngay_thang_nam_van_ban'] = moment(data['ngay_thang_nam_van_ban']).format('DD/MM/yyyy');

    data = {...data, ...{
      id_trang_thai: 1,
      time_id: this.currentDate,
    }};
    this.commerceManagementService.postExpoData([data]).subscribe(
      next => {
        if (next.id == -1) {
          this._infor.msgError("Lưu lỗi! Lý do: " + next.message);
        }
        else {
          this._infor.msgSuccess("Dữ liệu được lưu thành công!");
          this.reset2Default();
        }
      },
      error => {
        this._infor.msgError("Không thể thực thi! Lý do: " + error.message);
      }
    );
  }

  private clearTable(event) {
    event.preventDefault();
    this.formData.reset();
  }

  reset2Default(): void {
    this.formData.reset();
    this.switchView();
    this.ngOnInit();
  }
}
