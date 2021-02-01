import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatAccordion, MatPaginator, MatTable, MatTableDataSource } from '@angular/material';
import { DistrictModel } from 'src/app/_models/APIModel/domestic-market.model';
import { ElectricityDevelopmentModel, HydroElectricManagementModel, RuralElectricModel } from 'src/app/_models/APIModel/electric-management.module';
import * as XLSX from 'xlsx';


@Component({
  selector: 'rural-electric-management',
  templateUrl: './rural-electric-management.component.html',
  styleUrls: ['/../../special_layout.scss'],
})

export class RuralElectricManagementComponent implements OnInit {
  //ViewChild 
  @ViewChild(MatAccordion, { static: true }) accordion: MatAccordion;
  @ViewChild('TABLE', { static: false }) table: ElementRef;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  exportExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table.nativeElement);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Số hộ sử dụng điện');

    XLSX.writeFile(wb, 'Số hộ sử dụng điện.xlsx');

  }

  //Constant variable
  public readonly displayedColumns: string[] = ['index', 'db', 't1', 'cd1', 'tl1', 't2', 'cd2', 'ccd2', 'tl2', 'tc4_1', 'tc4_2', 'tc4_3',
  ];
  public readonly dsplayMergeColumns: string[] = ['merge1', 'merge2', 'merge3', 'merge4', 'merge5', 'merge6'];
  //TS & HTML Variable
  public dataSource: MatTableDataSource<RuralElectricModel> = new MatTableDataSource<RuralElectricModel>();
  public filteredDataSource: MatTableDataSource<RuralElectricModel> = new MatTableDataSource<RuralElectricModel>();
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
  public data: Array<RuralElectricModel> =
    [
      {
        db: 'Thành phố Đồng Xoài',
        t1: 25429.00,
        cd1: 25384.00,
        tl1: 99.82,
        t2: null,
        cd2: null,
        ccd2: null,
        tl2: null,
        tc4_1: null,
        tc4_2: null,
        tc4_3: null
      },
      {
        db: 'Xã Tiến Hưng',
        t1: null,
        cd1: null,
        tl1: null,
        t2: 3461.00,
        cd2: 3446.00,
        ccd2: 15.00,
        tl2: 99.57,
        tc4_1: 'Đạt',
        tc4_2: 'Đạt',
        tc4_3: 'Đạt'
      },
      {
        db: 'Xã Tân Thành',
        t1: null,
        cd1: null,
        tl1: null,
        t2: 3246.00,
        cd2: 3228.00,
        ccd2: 18.00,
        tl2: 99.45,
        tc4_1: 'Đạt',
        tc4_2: 'Đạt',
        tc4_3: 'Đạt'
      },
      {
        db: 'Huyện Đồng Phú',
        t1: 25344.00,
        cd1: 25119.00,
        tl1: 99.11,
        t2: null,
        cd2: null,
        ccd2: null,
        tl2: null,
        tc4_1: null,
        tc4_2: null,
        tc4_3: null
      },
      {
        db: 'Xã Tân Tiến',
        t1: null,
        cd1: null,
        tl1: null,
        t2: 2949.00,
        cd2: 2925.00,
        ccd2: 24.00,
        tl2: 99.19,
        tc4_1: 'Đạt',
        tc4_2: 'Đạt',
        tc4_3: 'Đạt'
      },
      {
        db: 'Xã Tân Lập',
        t1: null,
        cd1: null,
        tl1: null,
        t2: 3049.00,
        cd2: 3026.00,
        ccd2: 23.00,
        tl2: 99.25,
        tc4_1: 'Đạt',
        tc4_2: 'Đạt',
        tc4_3: 'Đạt'
      },
      {
        db: 'Xã Tân Hòa',
        t1: null,
        cd1: null,
        tl1: null,
        t2: 1350.00,
        cd2: 1343.00,
        ccd2: 7.00,
        tl2: 99.48,
        tc4_1: 'Đạt',
        tc4_2: 'Đạt',
        tc4_3: 'Đạt'
      },
      {
        db: 'Xã Tân Lợi',
        t1: null,
        cd1: null,
        tl1: null,
        t2: 1168.00,
        cd2: 1160.00,
        ccd2: 8.00,
        tl2: 99.32,
        tc4_1: 'Đạt',
        tc4_2: 'Đạt',
        tc4_3: 'Đạt'
      },
      {
        db: 'Xã Tân Phước',
        t1: null,
        cd1: null,
        tl1: null,
        t2: 2098.00,
        cd2: 2083.00,
        ccd2: 15.00,
        tl2: 99.29,
        tc4_1: 'Đạt',
        tc4_2: 'Đạt',
        tc4_3: 'Đạt'
      },
      {
        db: 'Xã Tân Hưng',
        t1: null,
        cd1: null,
        tl1: null,
        t2: 1300.00,
        cd2: 1291.00,
        ccd2: 9.00,
        tl2: 99.31,
        tc4_1: 'Đạt',
        tc4_2: 'Đạt',
        tc4_3: 'Đạt'
      },
      {
        db: 'Xã Thuận Lợi',
        t1: null,
        cd1: null,
        tl1: null,
        t2: 2434.00,
        cd2: 2430.00,
        ccd2: 4.00,
        tl2: 99.84,
        tc4_1: 'Đạt',
        tc4_2: 'Đạt',
        tc4_3: 'Đạt'
      },
      {
        db: 'Xã Đồng Tâm',
        t1: null,
        cd1: null,
        tl1: null,
        t2: 2108.00,
        cd2: 2087.00,
        ccd2: 21.00,
        tl2: 99.00,
        tc4_1: 'Đạt',
        tc4_2: 'Đạt',
        tc4_3: 'Đạt'
      },
      {
        db: 'Xã Thuận Phú',
        t1: null,
        cd1: null,
        tl1: null,
        t2: 2635.00,
        cd2: 2616.00,
        ccd2: 19.00,
        tl2: 99.28,
        tc4_1: 'Đạt',
        tc4_2: 'Đạt',
        tc4_3: 'Đạt'
      },
      {
        db: 'Xã Đồng Tiến',
        t1: null,
        cd1: null,
        tl1: null,
        t2: 3318.00,
        cd2: 3289.00,
        ccd2: 29.00,
        tl2: 99.13,
        tc4_1: 'Đạt',
        tc4_2: 'Đạt',
        tc4_3: 'Đạt'
      },
      {
        db: 'Huyện Bù Đăng',
        t1: 36812.00,
        cd1: 36221.00,
        tl1: 98.39,
        t2: null,
        cd2: null,
        ccd2: null,
        tl2: null,
        tc4_1: null,
        tc4_2: null,
        tc4_3: null
      },
      {
        db: 'Xã Đoàn Kết',
        t1: null,
        cd1: null,
        tl1: null,
        t2: 1430.00,
        cd2: 1383.00,
        ccd2: 47.00,
        tl2: 96.71,
        tc4_1: 'Đạt',
        tc4_2: 'Chưa',
        tc4_3: 'Chưa'
      },
      {
        db: 'Xã Thọ Sơn',
        t1: null,
        cd1: null,
        tl1: null,
        t2: 1719.00,
        cd2: 1705.00,
        ccd2: 14.00,
        tl2: 99.19,
        tc4_1: 'Đạt',
        tc4_2: 'Đạt',
        tc4_3: 'Đạt'
      },
      {
        db: 'Xã Phú Sơn',
        t1: null,
        cd1: null,
        tl1: null,
        t2: 1792.00,
        cd2: 1778.00,
        ccd2: 14.00,
        tl2: 99.22,
        tc4_1: 'Đạt',
        tc4_2: 'Đạt',
        tc4_3: 'Đạt'
      },
      {
        db: 'Xã Đồng Nai',
        t1: null,
        cd1: null,
        tl1: null,
        t2: 1273.00,
        cd2: 1230.00,
        ccd2: 43.00,
        tl2: 96.62,
        tc4_1: 'Đạt',
        tc4_2: 'Chưa',
        tc4_3: 'Chưa'
      },
      {
        db: 'Xã Phước Sơn',
        t1: null,
        cd1: null,
        tl1: null,
        t2: 1543.00,
        cd2: 1489.00,
        ccd2: 54.00,
        tl2: 96.50,
        tc4_1: 'Đạt',
        tc4_2: 'Chưa',
        tc4_3: 'Chưa'
      },
      {
        db: 'Xã Minh Hưng',
        t1: null,
        cd1: null,
        tl1: null,
        t2: 2577.00,
        cd2: 2572.00,
        ccd2: 5.00,
        tl2: 99.81,
        tc4_1: 'Đạt',
        tc4_2: 'Đạt',
        tc4_3: 'Đạt'
      },
      {
        db: 'Xã Bình Minh',
        t1: null,
        cd1: null,
        tl1: null,
        t2: 2851.00,
        cd2: 2841.00,
        ccd2: 10.00,
        tl2: 99.65,
        tc4_1: 'Đạt',
        tc4_2: 'Đạt',
        tc4_3: 'Đạt'
      },
      {
        db: 'Xã Bom Bo',
        t1: null,
        cd1: null,
        tl1: null,
        t2: 3109.00,
        cd2: 3091.00,
        ccd2: 18.00,
        tl2: 99.42,
        tc4_1: 'Đạt',
        tc4_2: 'Đạt',
        tc4_3: 'Đạt'
      },
      {
        db: 'Xã Đường 10',
        t1: null,
        cd1: null,
        tl1: null,
        t2: 1994.00,
        cd2: 1892.00,
        ccd2: 102.00,
        tl2: 94.88,
        tc4_1: 'Đạt',
        tc4_2: 'Chưa',
        tc4_3: 'Chưa'
      },
      {
        db: 'Xã Đak Nhau',
        t1: null,
        cd1: null,
        tl1: null,
        t2: 2830.00,
        cd2: 2728.00,
        ccd2: 102.00,
        tl2: 96.40,
        tc4_1: 'Đạt',
        tc4_2: 'Chưa',
        tc4_3: 'Chưa'
      },
      {
        db: 'Xã Thống Nhất',
        t1: null,
        cd1: null,
        tl1: null,
        t2: 3369.00,
        cd2: 3265.00,
        ccd2: 104.00,
        tl2: 96.91,
        tc4_1: 'Đạt',
        tc4_2: 'Chưa',
        tc4_3: 'Chưa'
      },
      {
        db: 'Xã Đức Liễu',
        t1: null,
        cd1: null,
        tl1: null,
        t2: 3589.00,
        cd2: 3581.00,
        ccd2: 8.00,
        tl2: 99.78,
        tc4_1: 'Đạt',
        tc4_2: 'Đạt',
        tc4_3: 'Đạt'
      },
      {
        db: 'Xã Nghĩa Bình',
        t1: null,
        cd1: null,
        tl1: null,
        t2: 1345.00,
        cd2: 1334.00,
        ccd2: 11.00,
        tl2: 99.18,
        tc4_1: 'Đạt',
        tc4_2: 'Đạt',
        tc4_3: 'Đạt'
      },
      {
        db: 'Xã Nghĩa Trung',
        t1: null,
        cd1: null,
        tl1: null,
        t2: 2145.00,
        cd2: 2129.00,
        ccd2: 16.00,
        tl2: 99.25,
        tc4_1: 'Đạt',
        tc4_2: 'Đạt',
        tc4_3: 'Đạt'
      },
      {
        db: 'Xã Đăng Hà',
        t1: null,
        cd1: null,
        tl1: null,
        t2: 1825.00,
        cd2: 1764.00,
        ccd2: 61.00,
        tl2: 96.66,
        tc4_1: 'Đạt',
        tc4_2: 'Chưa',
        tc4_3: 'Chưa'
      },
      {
        db: 'Thị xã Phước Long',
        t1: 14520.00,
        cd1: 14501.00,
        tl1: 99.87,
        t2: null,
        cd2: null,
        ccd2: null,
        tl2: null,
        tc4_1: null,
        tc4_2: null,
        tc4_3: null
      },
      {
        db: 'Xã Phước Tín',
        t1: null,
        cd1: null,
        tl1: null,
        t2: 1846.00,
        cd2: 1833.00,
        ccd2: 13.00,
        tl2: 99.30,
        tc4_1: 'Đạt',
        tc4_2: 'Đạt',
        tc4_3: 'Đạt'
      },
      {
        db: 'Xã Long Giang',
        t1: null,
        cd1: null,
        tl1: null,
        t2: 1116.00,
        cd2: 1110.00,
        ccd2: 6.00,
        tl2: 99.46,
        tc4_1: 'Đạt',
        tc4_2: 'Đạt',
        tc4_3: 'Đạt'
      },
      {
        db: 'Huyện Bù Đốp',
        t1: 15873.00,
        cd1: 15615.00,
        tl1: 98.37,
        t2: null,
        cd2: null,
        ccd2: null,
        tl2: null,
        tc4_1: null,
        tc4_2: null,
        tc4_3: null
      },
      {
        db: 'Xã Tân Thành',
        t1: null,
        cd1: null,
        tl1: null,
        t2: 2512.00,
        cd2: 2505.00,
        ccd2: 7.00,
        tl2: 99.72,
        tc4_1: 'Đạt',
        tc4_2: 'Đạt',
        tc4_3: 'Đạt'
      },
      {
        db: 'Xã Tân Tiến',
        t1: null,
        cd1: null,
        tl1: null,
        t2: 2361.00,
        cd2: 2318.00,
        ccd2: 43.00,
        tl2: 98.18,
        tc4_1: 'Đạt',
        tc4_2: 'Đạt',
        tc4_3: 'Đạt'
      },
      {
        db: 'Xã Thanh Hoà',
        t1: null,
        cd1: null,
        tl1: null,
        t2: 2667.00,
        cd2: 2550.00,
        ccd2: 117.00,
        tl2: 95.61,
        tc4_1: 'Đạt',
        tc4_2: 'Chưa',
        tc4_3: 'Chưa'
      },
      {
        db: 'Xã Thiện Hưng',
        t1: null,
        cd1: null,
        tl1: null,
        t2: 3032.00,
        cd2: 3013.00,
        ccd2: 19.00,
        tl2: 99.37,
        tc4_1: 'Đạt',
        tc4_2: 'Đạt',
        tc4_3: 'Đạt'
      },
      {
        db: 'Xã Hưng Phước',
        t1: null,
        cd1: null,
        tl1: null,
        t2: 1503.00,
        cd2: 1450.00,
        ccd2: 53.00,
        tl2: 96.47,
        tc4_1: 'Đạt',
        tc4_2: 'Chưa',
        tc4_3: 'Chưa'
      },
      {
        db: 'Xã Phước Thiện',
        t1: null,
        cd1: null,
        tl1: null,
        t2: 1221.00,
        cd2: 1178.00,
        ccd2: 43.00,
        tl2: 96.48,
        tc4_1: 'Đạt',
        tc4_2: 'Chưa',
        tc4_3: 'Chưa'
      },
      {
        db: 'Huyện Lộc Ninh',
        t1: 34321.00,
        cd1: 33894.00,
        tl1: 98.76,
        t2: null,
        cd2: null,
        ccd2: null,
        tl2: null,
        tc4_1: null,
        tc4_2: null,
        tc4_3: null
      },
      {
        db: 'Xã Lộc Hòa',
        t1: null,
        cd1: null,
        tl1: null,
        t2: 1641.00,
        cd2: 1590.00,
        ccd2: 51.00,
        tl2: 96.89,
        tc4_1: 'Đạt',
        tc4_2: 'Chưa',
        tc4_3: 'Chưa'
      },
      {
        db: 'Xã Lộc An',
        t1: null,
        cd1: null,
        tl1: null,
        t2: 2101.00,
        cd2: 2096.00,
        ccd2: 5.00,
        tl2: 99.76,
        tc4_1: 'Đạt',
        tc4_2: 'Đạt',
        tc4_3: 'Đạt'
      },
      {
        db: 'Xã Lộc Tấn',
        t1: null,
        cd1: null,
        tl1: null,
        t2: 2971.00,
        cd2: 2919.00,
        ccd2: 52.00,
        tl2: 98.25,
        tc4_1: 'Đạt',
        tc4_2: 'Chưa',
        tc4_3: 'Chưa'
      },
      {
        db: 'Xã Lộc Thạnh',
        t1: null,
        cd1: null,
        tl1: null,
        t2: 1051.00,
        cd2: 1036.00,
        ccd2: 15.00,
        tl2: 98.57,
        tc4_1: 'Đạt',
        tc4_2: 'Chưa',
        tc4_3: 'Chưa'
      },
      {
        db: 'Xã Lộc Hiệp',
        t1: null,
        cd1: null,
        tl1: null,
        t2: 2430.00,
        cd2: 2413.00,
        ccd2: 17.00,
        tl2: 99.30,
        tc4_1: 'Đạt',
        tc4_2: 'Đạt',
        tc4_3: 'Đạt'
      },
      {
        db: 'Xã Lộc Thiện',
        t1: null,
        cd1: null,
        tl1: null,
        t2: 2383.00,
        cd2: 2375.00,
        ccd2: 8.00,
        tl2: 99.66,
        tc4_1: 'Đạt',
        tc4_2: 'Đạt',
        tc4_3: 'Đạt'
      },
      {
        db: 'Xã Lộc Thuận',
        t1: null,
        cd1: null,
        tl1: null,
        t2: 2544.00,
        cd2: 2526.00,
        ccd2: 18.00,
        tl2: 99.29,
        tc4_1: 'Đạt',
        tc4_2: 'Đạt',
        tc4_3: 'Đạt'
      },
      {
        db: 'Xã Lộc Quang',
        t1: null,
        cd1: null,
        tl1: null,
        t2: 1782.00,
        cd2: 1731.00,
        ccd2: 51.00,
        tl2: 97.14,
        tc4_1: 'Đạt',
        tc4_2: 'Chưa',
        tc4_3: 'Chưa'
      },
      {
        db: 'Xã Lộc Phú',
        t1: null,
        cd1: null,
        tl1: null,
        t2: 1948.00,
        cd2: 1890.00,
        ccd2: 58.00,
        tl2: 97.02,
        tc4_1: 'Đạt',
        tc4_2: 'Chưa',
        tc4_3: 'Chưa'
      },
      {
        db: 'Xã Lộc Thành',
        t1: null,
        cd1: null,
        tl1: null,
        t2: 1911.00,
        cd2: 1849.00,
        ccd2: 62.00,
        tl2: 96.76,
        tc4_1: 'Đạt',
        tc4_2: 'Chưa',
        tc4_3: 'Chưa'
      },
      {
        db: 'Xã Lộc Thái',
        t1: null,
        cd1: null,
        tl1: null,
        t2: 2193.00,
        cd2: 2177.00,
        ccd2: 16.00,
        tl2: 99.27,
        tc4_1: 'Đạt',
        tc4_2: 'Đạt',
        tc4_3: 'Đạt'
      },
      {
        db: 'Xã Lộc Điền',
        t1: null,
        cd1: null,
        tl1: null,
        t2: 2309.00,
        cd2: 2291.00,
        ccd2: 18.00,
        tl2: 99.22,
        tc4_1: 'Đạt',
        tc4_2: 'Đạt',
        tc4_3: 'Đạt'
      },
      {
        db: 'Xã Lộc Hưng',
        t1: null,
        cd1: null,
        tl1: null,
        t2: 2364.00,
        cd2: 2342.00,
        ccd2: 22.00,
        tl2: 99.07,
        tc4_1: 'Đạt',
        tc4_2: 'Đạt',
        tc4_3: 'Đạt'
      },
      {
        db: 'Xã Lộc Thịnh',
        t1: null,
        cd1: null,
        tl1: null,
        t2: 1190.00,
        cd2: 1180.00,
        ccd2: 10.00,
        tl2: 99.16,
        tc4_1: 'Đạt',
        tc4_2: 'Đạt',
        tc4_3: 'Đạt'
      },
      {
        db: 'Xã Lộc Khánh',
        t1: null,
        cd1: null,
        tl1: null,
        t2: 1856.00,
        cd2: 1841.00,
        ccd2: 15.00,
        tl2: 99.19,
        tc4_1: 'Đạt',
        tc4_2: 'Đạt',
        tc4_3: 'Đạt'
      },
      {
        db: 'Thị xã Bình Long',
        t1: 16453.00,
        cd1: 16406.00,
        tl1: 99.71,
        t2: null,
        cd2: null,
        ccd2: null,
        tl2: null,
        tc4_1: null,
        tc4_2: null,
        tc4_3: null
      },
      {
        db: 'Xã Thanh Phú',
        t1: null,
        cd1: null,
        tl1: null,
        t2: 2931.00,
        cd2: 2921.00,
        ccd2: 10.00,
        tl2: 99.66,
        tc4_1: 'Đạt',
        tc4_2: 'Đạt',
        tc4_3: 'Đạt'
      },
      {
        db: 'Xã Thanh Lương',
        t1: null,
        cd1: null,
        tl1: null,
        t2: 3420.00,
        cd2: 3410.00,
        ccd2: 10.00,
        tl2: 99.71,
        tc4_1: 'Đạt',
        tc4_2: 'Đạt',
        tc4_3: 'Đạt'
      },
      {
        db: 'Huyện Chơn Thành',
        t1: 22358.00,
        cd1: 22260.00,
        tl1: 99.56,
        t2: null,
        cd2: null,
        ccd2: null,
        tl2: null,
        tc4_1: null,
        tc4_2: null,
        tc4_3: null
      },
      {
        db: 'Xã Minh Thành',
        t1: null,
        cd1: null,
        tl1: null,
        t2: 1869.00,
        cd2: 1859.00,
        ccd2: 10.00,
        tl2: 99.46,
        tc4_1: 'Đạt',
        tc4_2: 'Đạt',
        tc4_3: 'Đạt'
      },
      {
        db: 'Xã Nha Bích',
        t1: null,
        cd1: null,
        tl1: null,
        t2: 1674.00,
        cd2: 1670.00,
        ccd2: 4.00,
        tl2: 99.76,
        tc4_1: 'Đạt',
        tc4_2: 'Đạt',
        tc4_3: 'Đạt'
      },
      {
        db: 'Xã Minh Thắng',
        t1: null,
        cd1: null,
        tl1: null,
        t2: 1455.00,
        cd2: 1445.00,
        ccd2: 10.00,
        tl2: 99.31,
        tc4_1: 'Đạt',
        tc4_2: 'Đạt',
        tc4_3: 'Đạt'
      },
      {
        db: 'Xã Minh Lập',
        t1: null,
        cd1: null,
        tl1: null,
        t2: 2349.00,
        cd2: 2345.00,
        ccd2: 4.00,
        tl2: 99.83,
        tc4_1: 'Đạt',
        tc4_2: 'Đạt',
        tc4_3: 'Đạt'
      },
      {
        db: 'Xã Quang Minh',
        t1: null,
        cd1: null,
        tl1: null,
        t2: 1249.00,
        cd2: 1249.00,
        ccd2: null,
        tl2: 100.00,
        tc4_1: 'Đạt',
        tc4_2: 'Đạt',
        tc4_3: 'Đạt'
      },
      {
        db: 'Xã Minh Hưng',
        t1: null,
        cd1: null,
        tl1: null,
        t2: 4816.00,
        cd2: 4810.00,
        ccd2: 6.00,
        tl2: 99.88,
        tc4_1: 'Đạt',
        tc4_2: 'Đạt',
        tc4_3: 'Đạt'
      },
      {
        db: 'Xã Minh Long',
        t1: null,
        cd1: null,
        tl1: null,
        t2: 2065.00,
        cd2: 2055.00,
        ccd2: 10.00,
        tl2: 99.52,
        tc4_1: 'Đạt',
        tc4_2: 'Đạt',
        tc4_3: 'Đạt'
      },
      {
        db: 'Xã Thành Tâm',
        t1: null,
        cd1: null,
        tl1: null,
        t2: 1812.00,
        cd2: 1802.00,
        ccd2: 10.00,
        tl2: 99.45,
        tc4_1: 'Đạt',
        tc4_2: 'Đạt',
        tc4_3: 'Đạt'
      },
      {
        db: 'Huyện Hớn Quản',
        t1: 28364.00,
        cd1: 28071.00,
        tl1: 98.97,
        t2: null,
        cd2: null,
        ccd2: null,
        tl2: null,
        tc4_1: null,
        tc4_2: null,
        tc4_3: null
      },
      {
        db: 'Xã Thanh An',
        t1: null,
        cd1: null,
        tl1: null,
        t2: 2993.00,
        cd2: 2966.00,
        ccd2: 27.00,
        tl2: 99.10,
        tc4_1: 'Đạt',
        tc4_2: 'Đạt',
        tc4_3: 'Đạt'
      },
      {
        db: 'Xã An Khương',
        t1: null,
        cd1: null,
        tl1: null,
        t2: 1843.00,
        cd2: 1794.00,
        ccd2: 49.00,
        tl2: 97.34,
        tc4_1: 'Đạt',
        tc4_2: 'Chưa',
        tc4_3: 'Chưa'
      },
      {
        db: 'Xã An Phú',
        t1: null,
        cd1: null,
        tl1: null,
        t2: 1350.00,
        cd2: 1338.00,
        ccd2: 12.00,
        tl2: 99.11,
        tc4_1: 'Đạt',
        tc4_2: 'Đạt',
        tc4_3: 'Đạt'
      },
      {
        db: 'Xã Tân Lợi',
        t1: null,
        cd1: null,
        tl1: null,
        t2: 2579.00,
        cd2: 2558.00,
        ccd2: 21.00,
        tl2: 99.19,
        tc4_1: 'Đạt',
        tc4_2: 'Đạt',
        tc4_3: 'Đạt'
      },
      {
        db: 'Xã Tân Hưng',
        t1: null,
        cd1: null,
        tl1: null,
        t2: 3318.00,
        cd2: 3205.00,
        ccd2: 113.00,
        tl2: 96.59,
        tc4_1: 'Đạt',
        tc4_2: 'Chưa',
        tc4_3: 'Chưa'
      },
      {
        db: 'Xã Minh Đức',
        t1: null,
        cd1: null,
        tl1: null,
        t2: 1359.00,
        cd2: 1349.00,
        ccd2: 10.00,
        tl2: 99.26,
        tc4_1: 'Đạt',
        tc4_2: 'Đạt',
        tc4_3: 'Đạt'
      },
      {
        db: 'Xã Minh Tâm',
        t1: null,
        cd1: null,
        tl1: null,
        t2: 1467.00,
        cd2: 1415.00,
        ccd2: 52.00,
        tl2: 96.46,
        tc4_1: 'Đạt',
        tc4_2: 'Chưa',
        tc4_3: 'Chưa'
      },
      {
        db: 'Xã Phước An',
        t1: null,
        cd1: null,
        tl1: null,
        t2: 2590.00,
        cd2: 2569.00,
        ccd2: 21.00,
        tl2: 99.19,
        tc4_1: 'Đạt',
        tc4_2: 'Đạt',
        tc4_3: 'Đạt'
      },
      {
        db: 'Xã Thanh Bình',
        t1: null,
        cd1: null,
        tl1: null,
        t2: 1290.00,
        cd2: 1286.00,
        ccd2: 4.00,
        tl2: 99.69,
        tc4_1: 'Đạt',
        tc4_2: 'Đạt',
        tc4_3: 'Đạt'
      },
      {
        db: 'Xã Tân Khai',
        t1: null,
        cd1: null,
        tl1: null,
        t2: 3465.00,
        cd2: 3455.00,
        ccd2: 10.00,
        tl2: 99.71,
        tc4_1: 'Đạt',
        tc4_2: 'Đạt',
        tc4_3: 'Đạt'
      },
      {
        db: 'Xã Đồng Nơ',
        t1: null,
        cd1: null,
        tl1: null,
        t2: 1687.00,
        cd2: 1677.00,
        ccd2: 10.00,
        tl2: 99.41,
        tc4_1: 'Đạt',
        tc4_2: 'Đạt',
        tc4_3: 'Đạt'
      },
      {
        db: 'Xã Tân Hiệp',
        t1: null,
        cd1: null,
        tl1: null,
        t2: 2265.00,
        cd2: 2243.00,
        ccd2: 22.00,
        tl2: 99.03,
        tc4_1: 'Đạt',
        tc4_2: 'Đạt',
        tc4_3: 'Đạt'
      },
      {
        db: 'Xã Tân Quan',
        t1: null,
        cd1: null,
        tl1: null,
        t2: 1443.00,
        cd2: 1431.00,
        ccd2: 12.00,
        tl2: 99.17,
        tc4_1: 'Đạt',
        tc4_2: 'Đạt',
        tc4_3: 'Đạt'
      },
      {
        db: 'Huyện Bù Gia Mập',
        t1: 18955.00,
        cd1: 18655.00,
        tl1: 98.42,
        t2: null,
        cd2: null,
        ccd2: null,
        tl2: null,
        tc4_1: null,
        tc4_2: null,
        tc4_3: null
      },
      {
        db: 'Xã Đức Hạnh',
        t1: null,
        cd1: null,
        tl1: null,
        t2: 1757.00,
        cd2: 1742.00,
        ccd2: 15.00,
        tl2: 99.15,
        tc4_1: 'Đạt',
        tc4_2: 'Đạt',
        tc4_3: 'Đạt'
      },
      {
        db: 'Xã Phú Văn',
        t1: null,
        cd1: null,
        tl1: null,
        t2: 2101.00,
        cd2: 2033.00,
        ccd2: 68.00,
        tl2: 96.76,
        tc4_1: 'Đạt',
        tc4_2: 'Chưa',
        tc4_3: 'Chưa'
      },
      {
        db: 'Xã Phú Nghĩa',
        t1: null,
        cd1: null,
        tl1: null,
        t2: 2732.00,
        cd2: 2728.00,
        ccd2: 4.00,
        tl2: 99.85,
        tc4_1: 'Đạt',
        tc4_2: 'Đạt',
        tc4_3: 'Đạt'
      },
      {
        db: 'Xã Đăk Ơ',
        t1: null,
        cd1: null,
        tl1: null,
        t2: 3252.00,
        cd2: 3165.00,
        ccd2: 87.00,
        tl2: 97.32,
        tc4_1: 'Đạt',
        tc4_2: 'Chưa',
        tc4_3: 'Chưa'
      },
      {
        db: 'Xã Bù Gia Mập',
        t1: null,
        cd1: null,
        tl1: null,
        t2: 1665.00,
        cd2: 1651.00,
        ccd2: 14.00,
        tl2: 99.16,
        tc4_1: 'Đạt',
        tc4_2: 'Đạt',
        tc4_3: 'Đạt'
      },
      {
        db: 'Xã Phước Minh',
        t1: null,
        cd1: null,
        tl1: null,
        t2: 2164.00,
        cd2: 2072.00,
        ccd2: 92.00,
        tl2: 95.75,
        tc4_1: 'Đạt',
        tc4_2: 'Chưa',
        tc4_3: 'Chưa'
      },
      {
        db: 'Xã Đakia',
        t1: null,
        cd1: null,
        tl1: null,
        t2: 2438.00,
        cd2: 2419.00,
        ccd2: 19.00,
        tl2: 99.22,
        tc4_1: 'Đạt',
        tc4_2: 'Đạt',
        tc4_3: 'Đạt'
      },
      {
        db: 'Xã Bình Thắng',
        t1: null,
        cd1: null,
        tl1: null,
        t2: 2410.00,
        cd2: 2392.00,
        ccd2: 18.00,
        tl2: 99.25,
        tc4_1: 'Đạt',
        tc4_2: 'Đạt',
        tc4_3: 'Đạt'
      },
      {
        db: 'Huyện Phú Riềng',
        t1: 24476.00,
        cd1: 23998.00,
        tl1: 98.05,
        t2: null,
        cd2: null,
        ccd2: null,
        tl2: null,
        tc4_1: null,
        tc4_2: null,
        tc4_3: null
      },
      {
        db: 'Xã Long Hà',
        t1: null,
        cd1: null,
        tl1: null,
        t2: 3329.00,
        cd2: 3222.00,
        ccd2: 107.00,
        tl2: 96.79,
        tc4_1: 'Đạt',
        tc4_2: 'Chưa',
        tc4_3: 'Chưa'
      },
      {
        db: 'Xã Long Tân',
        t1: null,
        cd1: null,
        tl1: null,
        t2: 2249.00,
        cd2: 2171.00,
        ccd2: 78.00,
        tl2: 96.53,
        tc4_1: 'Đạt',
        tc4_2: 'Chưa',
        tc4_3: 'Chưa'
      },
      {
        db: 'Xã Bù Nho',
        t1: null,
        cd1: null,
        tl1: null,
        t2: 3150.00,
        cd2: 3145.00,
        ccd2: 5.00,
        tl2: 99.84,
        tc4_1: 'Đạt',
        tc4_2: 'Đạt',
        tc4_3: 'Đạt'
      },
      {
        db: 'Xã Phú Riềng',
        t1: null,
        cd1: null,
        tl1: null,
        t2: 3974.00,
        cd2: 3970.00,
        ccd2: 4.00,
        tl2: 99.90,
        tc4_1: 'Đạt',
        tc4_2: 'Đạt',
        tc4_3: 'Đạt'
      },
      {
        db: 'Xã Phú Trung',
        t1: null,
        cd1: null,
        tl1: null,
        t2: 1353.00,
        cd2: 1310.00,
        ccd2: 43.00,
        tl2: 96.82,
        tc4_1: 'Đạt',
        tc4_2: 'Chưa',
        tc4_3: 'Chưa'
      },
      {
        db: 'Xã Long Bình',
        t1: null,
        cd1: null,
        tl1: null,
        t2: 2421.00,
        cd2: 2339.00,
        ccd2: 82.00,
        tl2: 96.61,
        tc4_1: 'Đạt',
        tc4_2: 'Chưa',
        tc4_3: 'Chưa'
      },
      {
        db: 'Xã Bình Sơn',
        t1: null,
        cd1: null,
        tl1: null,
        t2: 1261.00,
        cd2: 1255.00,
        ccd2: 6.00,
        tl2: 99.52,
        tc4_1: 'Đạt',
        tc4_2: 'Đạt',
        tc4_3: 'Đạt'
      },
      {
        db: 'Xã Phước Tân',
        t1: null,
        cd1: null,
        tl1: null,
        t2: 1855.00,
        cd2: 1839.00,
        ccd2: 16.00,
        tl2: 99.14,
        tc4_1: 'Đạt',
        tc4_2: 'Đạt',
        tc4_3: 'Đạt'
      },
      {
        db: 'Xã Bình Tân',
        t1: null,
        cd1: null,
        tl1: null,
        t2: 2011.00,
        cd2: 1998.00,
        ccd2: 13.00,
        tl2: 99.35,
        tc4_1: 'Đạt',
        tc4_2: 'Đạt',
        tc4_3: 'Đạt'
      },
      {
        db: 'Xã Long Hưng',
        t1: null,
        cd1: null,
        tl1: null,
        t2: 2327.00,
        cd2: 2308.00,
        ccd2: 19.00,
        tl2: 99.18,
        tc4_1: 'Đạt',
        tc4_2: 'Đạt',
        tc4_3: 'Đạt'
      },
      {
        db: 'Tổng cộng',
        t1: 262905.00,
        cd1: 260124.00,
        tl1: 98.94,
        t2: null,
        cd2: null,
        ccd2: null,
        tl2: null,
        tc4_1: null,
        tc4_2: null,
        tc4_3: null
      }
    ]
  //Only TS Variable
  years: number[] = [];
  tongSoHo: number;
  tongSoXa: number;
  tongHoKhongCoDien: number;
  tongHoCoDien: number;
  isChecked: boolean;

  constructor() {
  }

  ngOnInit() {
    this.years = this.getYears();
    this.dataSource.data = this.data;
    this.filteredDataSource.data = [...this.dataSource.data];
    this.caculatorValue();
    this.paginatorAgain();
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
  // applyDistrictFilter(event) {
  //   let filteredData = [];

  //   event.value.forEach(element => {
  //     this.dataSource.data.filter(x => x.ma_huyen_thi == element).forEach(x => filteredData.push(x));
  //   });

  //   if (!filteredData.length) {
  //     if (event.value.length)
  //       this.filteredDataSource.data = [];
  //     else
  //       this.filteredDataSource.data = this.dataSource.data;
  //   }
  //   else {
  //     this.filteredDataSource.data = filteredData;
  //   }
  //   this.caculatorValue();
  //   this.paginatorAgain();
  // }
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
    this.tongSoHo = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => x.t2).reduce((a, b) => a + b) : 0;
    this.tongSoXa = this.filteredDataSource.data.filter(x => x.t2 != null).length;
    this.tongHoKhongCoDien = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => x.ccd2).reduce((a, b) => a + b) : 0;
    this.tongHoCoDien = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => x.cd2).reduce((a, b) => a + b) : 0;
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