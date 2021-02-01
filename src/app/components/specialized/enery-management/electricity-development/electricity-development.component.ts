import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatAccordion, MatPaginator, MatTable, MatTableDataSource } from '@angular/material';
import { DistrictModel } from 'src/app/_models/APIModel/domestic-market.model';
import { ElectricityDevelopmentModel, HydroElectricManagementModel } from 'src/app/_models/APIModel/electric-management.module';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-electricity-development',
  templateUrl: './electricity-development.component.html',
  styleUrls: ['/../../special_layout.scss'],
})
export class ElectricDevelopmentManagementComponent implements OnInit {
  //ViewChild 
  @ViewChild(MatAccordion, { static: true }) accordion: MatAccordion;
  @ViewChild('TABLE', { static: false }) table: ElementRef;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  exportExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table.nativeElement);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Phát triển điện');

    XLSX.writeFile(wb, 'Phát triển điện.xlsx');

  }

  //Constant variable
  public readonly displayedColumns: string[] = ['index', 'ten_huyen_thi', 'trung_ap_3p', 'trung_ap_1p', 'ha_ap_3p', 'ha_ap_1p', 'so_tram_bien_ap', 'cong_xuat_bien_ap'];
  public readonly dsplayMergeColumns: string[] = ['indexM', 'ten_huyen_thiM', 'trung_apM', 'ha_apM', 'bien_apM'];
  //TS & HTML Variable
  public dataSource: MatTableDataSource<ElectricityDevelopmentModel> = new MatTableDataSource<ElectricityDevelopmentModel>();
  public filteredDataSource: MatTableDataSource<ElectricityDevelopmentModel> = new MatTableDataSource<ElectricityDevelopmentModel>();
  public districts: DistrictModel[] = [{ id: 1, ten_quan_huyen: 'Thị xã Phước Long' },
  { id: 2, ten_quan_huyen: 'Thành phố Đồng Xoài' },
  { id: 3, ten_quan_huyen: 'Thị xã Bình Long' },
  { id: 4, ten_quan_huyen: 'Huyện Bù Gia Mập' },
  { id: 5, ten_quan_huyen: 'Huyện Lộc Ninh' },
  { id: 6, ten_quan_huyen: 'Huyện Bù Đốp' },
  { id: 7, ten_quan_huyen: 'Huyện Hớn Quản' },
  { id: 8, ten_quan_huyen: 'Huyện Đồng Phú' },
  { id: 9, ten_quan_huyen: 'Huyện Bù Đăng' },
  { id: 10, ten_quan_huyen: 'Huyện Chơn Thành' },
  { id: 11, ten_quan_huyen: 'Huyện Phú Riềng' }];
  public data: Array<ElectricityDevelopmentModel> = [{ chi_tieu: "Công tác phát triển điện", ten_huyen_thi: "Thành phố đồng xoài", ma_huyen_thi: 2, trung_ap_3p: 61.91, trung_ap_1p: 31.72, ha_ap_3p: 58.6, ha_ap_1p: 225.53, so_tram_bien_ap: 472, cong_xuat_bien_ap: 114257 },
  { chi_tieu: "Công tác phát triển điện", ten_huyen_thi: "Huyện Đồng Phú", ma_huyen_thi: 8, trung_ap_3p: 42.57, trung_ap_1p: 22.51, ha_ap_3p: 1.42, ha_ap_1p: 25.26, so_tram_bien_ap: 254, cong_xuat_bien_ap: 129763 },
  { chi_tieu: "Công tác phát triển điện", ten_huyen_thi: "Huyện Chơn Thành", ma_huyen_thi: 10, trung_ap_3p: 62.72, trung_ap_1p: 41.17, ha_ap_3p: 1.6, ha_ap_1p: 58.01, so_tram_bien_ap: 549, cong_xuat_bien_ap: 356536 },
  ]
  //Only TS Variable
  years: number[] = [];
  trung_ap_3p: number;
  tongSoXa: number;
  trung_ap_1p: number;
  ha_ap_1p: number;
  ha_ap_3p: number;
  so_tram_bien_ap: number;
  cong_xuat_bien_ap: number;
  isChecked: boolean;

  constructor() {
  }

  ngOnInit() {
    this.years = this.getYears();
    this.dataSource.data = this.data;
    this.filteredDataSource.data = [...this.dataSource.data];
    this.caculatorValue();
    this.autoOpen();
  }

  autoOpen() {
    setTimeout(() => this.accordion.openAll(), 1000);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filteredDataSource.filter = filterValue.trim().toLowerCase();
  }

  get(time_id: number) {

  }

  log(any) {
    console.log(any);
  }

  getYears() {
    return Array(5).fill(1).map((element, index) => new Date().getFullYear() - index);
  }
  getValueOfHydroElectric(value: any) {

  }
  applyDistrictFilter(event) {
    let filteredData = [];

    event.value.forEach(element => {
      this.dataSource.data.filter(x => x.ma_huyen_thi == element).forEach(x => filteredData.push(x));
    });

    if (!filteredData.length) {
      if (event.value.length)
        this.filteredDataSource.data = [];
      else
        this.filteredDataSource.data = this.dataSource.data;
    }
    else {
      this.filteredDataSource.data = filteredData;
    }
    this.caculatorValue();
    this.paginatorAgain();
  }
  paginatorAgain() {
    if (this.filteredDataSource.data.length) {
      this.filteredDataSource.paginator = this.paginator;
      this.paginator._intl.itemsPerPageLabel = 'Số hàng';
      this.paginator._intl.firstPageLabel = "Trang Đầu";
      this.paginator._intl.lastPageLabel = "Trang Cuối";
      this.paginator._intl.previousPageLabel = "Trang Trước";
      this.paginator._intl.nextPageLabel = "Trang Tiếp";
    }
  }
  caculatorValue() {
    this.trung_ap_3p = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => x.trung_ap_3p).reduce((a, b) => a + b) : 0;
    this.tongSoXa = this.filteredDataSource.data.length;
    this.trung_ap_1p = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => x.trung_ap_1p).reduce((a, b) => a + b) : 0;
    this.ha_ap_1p = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => x.ha_ap_1p).reduce((a, b) => a + b) : 0;
    this.ha_ap_3p = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => x.ha_ap_3p).reduce((a, b) => a + b) : 0;
    this.so_tram_bien_ap = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => x.so_tram_bien_ap).reduce((a, b) => a + b) : 0;
    this.cong_xuat_bien_ap = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => x.cong_xuat_bien_ap).reduce((a, b) => a + b) : 0;
  }
  // isHidden(row : any){
  //     return (this.isChecked)? (row.is_het_han) : false;
  // }

  applyActionCheck(event) {
    this.filteredDataSource.filter = (event.checked) ? "true" : "";
    this.caculatorValue();
    this.paginatorAgain();
  }
}