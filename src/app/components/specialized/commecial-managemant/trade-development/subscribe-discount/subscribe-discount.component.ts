import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatOption, MatSelect, MatTable, MatTableDataSource } from '@angular/material';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { SCTService } from 'src/app/_services/APIService/sct.service';
import { MatAccordion } from '@angular/material/expansion';
import { MatPaginator } from '@angular/material/paginator';
import { District } from 'src/app/_models/district.model';
import { SDModel} from 'src/app/_models/APIModel/trade-development.model';

import { ExcelService } from 'src/app/_services/excelUtil.service';
import { CommerceManagementService } from 'src/app/_services/APIService/commerce-management.service';
import { InformationService } from 'src/app/shared/information/information.service';

import moment from 'moment';

@Component({
  selector: 'app-subscribe-discount',
  templateUrl: './subscribe-discount.component.html',
  styleUrls: ['../../../special_layout.scss'],
})
export class SubscribeDiscountComponent implements OnInit {

  displayedColumns: string[] = ['index', 'ten_doanh_nghiep', 'dia_chi_doanh_nghiep', 'mst', 'ten_chuong_trinh_km', 'thoi_gian_bat_dau', 'thoi_gian_ket_thuc',
    'hang_hoa_km', 'dia_diem_km', 'ten_hinh_thuc', 'so_van_ban', 'co_quan_ban_hanh', 'ngay_thang_nam_van_ban',
  ];
  formData = this.formBuilder.group({
    ten_doanh_nghiep: new FormControl(),
    dia_chi_doanh_nghiep: new FormControl(),
    id_phuong_xa: new FormBuilder(),
    mst: new FormControl(),
    ten_chuong_trinh_km: new FormControl(),
    thoi_gian_bat_dau: new FormControl(),
    thoi_gian_ket_thuc: new FormControl(),
    hang_hoa_km: new FormControl(),
    dia_diem_km: new FormControl(),
    ten_hinh_thuc: new FormControl(),
    so_van_ban: new FormControl(),
    co_quan_ban_hanh: new FormControl(),
    ngay_thang_nam_van_ban: new FormControl(),
  });

  dataSource: MatTableDataSource<SDModel> = new MatTableDataSource<SDModel>();
  filteredDataSource: MatTableDataSource<SDModel> = new MatTableDataSource<SDModel>();
  filterComponents = {
    id_phuong_xa: [],
    ten_hinh_thuc: [],
  }
  sumvalues: number = 0;
  years: number[] = [];
  // districts: District[] = [{ id: 1, ten_quan_huyen: 'Thị xã Phước Long' },
  // { id: 2, ten_quan_huyen: 'Thành phố Đồng Xoài' },
  // { id: 3, ten_quan_huyen: 'Thị xã Bình Long' },
  // { id: 4, ten_quan_huyen: 'Huyện Bù Gia Mập' },
  // { id: 5, ten_quan_huyen: 'Huyện Lộc Ninh' },
  // { id: 6, ten_quan_huyen: 'Huyện Bù Đốp' },
  // { id: 7, ten_quan_huyen: 'Huyện Hớn Quản' },
  // { id: 8, ten_quan_huyen: 'Huyện Đồng Phú' },
  // { id: 9, ten_quan_huyen: 'Huyện Bù Đăng' },
  // { id: 10, ten_quan_huyen: 'Huyện Chơn Thành' },
  // { id: 11, ten_quan_huyen: 'Huyện Phú Riềng' }];

  public promotionTypes: string[] = [];
  public errorMessage: any;
  private view = 'list';

  @ViewChild(MatAccordion, { static: false }) accordion: MatAccordion;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('TABLE', { static: false }) table: ElementRef;

  constructor(
    private formBuilder: FormBuilder,
    public _infor: InformationService,
    public sctService: SCTService,
    public commerceManagementService: CommerceManagementService,
    public excelService: ExcelService,) {
  }

  ngOnInit() {
    this.years = this.getYears();
    this.autoOpen();
    this.getPromotionTypes();
    this.getSDList();
  }

  autoOpen() {
    setTimeout(() => this.accordion.openAll(), 1000);
  }

  applyFilter(event) {
    let filterValues = event.target ? event.target.value: event.value;
    if (filterValues instanceof Array) {
      let filteredData = this.filterArray(this.dataSource.data, this.filterComponents);
      if (!filteredData.length) {
        this.filteredDataSource.data = this.filterComponents ? []: this.dataSource.data;
      }
      else {
        this.filteredDataSource.data = filteredData;
      }
    } 
    else {
      this.filteredDataSource.filter = filterValues.trim().toLowerCase();
    }
  }

  filterArray(array, filters) {
    const filterKeys = Object.keys(filters);
    let temp = [...array];
    filterKeys.forEach(key => {
      let temp2 = [];
      switch (key) {
        case 'Id_quan_huyen':
          if (filters[key].length) {
            filters[key].forEach(criteria => {
              temp2 = temp2.concat(temp.filter(x => x[key] == criteria || x[key] == 99));
            });
            temp = [...temp2];
          }
          break;
        default: 
          if (filters[key].length) {
            filters[key].forEach(criteria => {
              temp2 = temp2.concat(temp.filter(x => x[key] == criteria));
            });
            temp = [...temp2];
          }
          break;
      }
    })
    return temp;
  }

  getPromotionTypes(): void {
    this.commerceManagementService.getSubcribeDiscountTypeData().subscribe(
      result => {
        if (result.data && result.data.length > 0) {
          result.data.map((element, index) => { 
            this.promotionTypes.push(element.ten_hinh_thuc);
          })
        }
      },
      error => this.errorMessage = <any>error
    );
  }

  getSDList(): void {
    this.commerceManagementService.getSubcribeDiscountData().subscribe(
      result => {
        if (result.data && result.data.length > 0) {
          this.dataSource = new MatTableDataSource<SDModel>(result.data);
          this.filteredDataSource = new MatTableDataSource<SDModel>(result.data);
          this.filteredDataSource.paginator = this.paginator;
          // this.sdtypes = [...new Set(this.dataSource.data.map(x => x.ten_hinh_thuc))];
          // this.paginator._intl.itemsPerPageLabel = "Số hàng";
          // this.paginator._intl.firstPageLabel = "Trang Đầu";
          // this.paginator._intl.lastPageLabel = "Trang Cuối";
          // this.paginator._intl.previousPageLabel = "Trang Trước";
          // this.paginator._intl.nextPageLabel = "Trang Tiếp";
        }
      },
      error => this.errorMessage = <any>error
    );
  }

  getYears() {
    return Array(5).fill(1).map((element, index) => new Date().getFullYear() - index);
  }

  countBusiness(): number {
    return [...new Set(this.dataSource.data.map(x => x.mst))].length;
  }

  ExportTOExcel(filename: string, sheetname: string) {
    this.excelService.exportDomTableAsExcelFile(filename, sheetname, this.table.nativeElement);
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
    }};
    this.commerceManagementService.postSubcribeDiscountData([data]).subscribe(
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
    this.autoOpen();
  }
}
