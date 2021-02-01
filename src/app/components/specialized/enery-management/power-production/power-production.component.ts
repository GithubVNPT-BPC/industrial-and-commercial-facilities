import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatAccordion, MatPaginator, MatTable, MatTableDataSource } from '@angular/material';
import { DistrictModel } from 'src/app/_models/APIModel/domestic-market.model';
import { ElectricityDevelopmentModel, HydroElectricManagementModel, PowerProductionModel } from 'src/app/_models/APIModel/electric-management.module';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-power-production',
  templateUrl: './power-production.component.html',
  styleUrls: ['/../../special_layout.scss'],
})
export class PowerProductionManagementComponent implements OnInit {
  //ViewChild 
  @ViewChild(MatAccordion, { static: true }) accordion: MatAccordion;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('TABLE', { static: false }) table: ElementRef;

  exportExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table.nativeElement);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Điện thương phẩm');

    XLSX.writeFile(wb, 'Điện thương phẩm.xlsx');

  }
  //Constant variable
  public readonly displayedColumns: string[] = ['index', 'ctcy', 'dvt', 't112019', 'lk11t2019', 'khn2020', 't102020',
    't112020', 'lk11t2020', 'tht11stt', 'tht11sck', 'lktsck', 'lktskh',
  ];
  public readonly dsplayMergeColumns: string[] = ['merge1', 'merge2', 'merge3', 'merge4',];
  //TS & HTML Variable
  public dataSource: MatTableDataSource<PowerProductionModel> = new MatTableDataSource<PowerProductionModel>();
  public filteredDataSource: MatTableDataSource<PowerProductionModel> = new MatTableDataSource<PowerProductionModel>();
  public data: Array<PowerProductionModel> =
    [
      {
        ctcy: 'Điện sản xuất ',
        dvt: '(Tr. KW)',
        t112019: 143,
        lk11t2019: 1291.00,
        khn2020: 1968.00,
        t102020: 130,
        t112020: 133,
        lk11t2020: 1181.00,
        tht11stt: 102.31,
        tht11sck: 93.01,
        lktsck: 91.48,
        lktskh: 60.01
      },
      {
        ctcy: 'Sản lượng điện thương phẩm',
        dvt: '(Tr. KW)',
        t112019: 43.9,
        lk11t2019: 135.60,
        khn2020: 170.00,
        t102020: 45.5,
        t112020: 47.1,
        lk11t2020: 146.90,
        tht11stt: 103.52,
        tht11sck: 107.29,
        lktsck: 108.33,
        lktskh: 86.41
      },
      {
        ctcy: '- Điện phục vụ sản xuất ',
        dvt: null,
        t112019: 35.30,
        lk11t2019: 95.80,
        khn2020: null,
        t102020: 36.40,
        t112020: 37.10,
        lk11t2020: 105.70,
        tht11stt: 101.92,
        tht11sck: 105.10,
        lktsck: 110.33,
        lktskh: null
      },
      {
        ctcy: '- Điện sinh hoạt + Kinh doanh dịch vụ',
        dvt: null,
        t112019: 5.20,
        lk11t2019: 23.10,
        khn2020: null,
        t102020: 5.50,
        t112020: 6.00,
        lk11t2020: 24.30,
        tht11stt: 109.09,
        tht11sck: 115.38,
        lktsck: 105.19,
        lktskh: null
      },
      {
        ctcy: '- Nhu cầu khác (chiếu sáng công cộng)',
        dvt: null,
        t112019: 3.40,
        lk11t2019: 16.70,
        khn2020: null,
        t102020: 3.60,
        t112020: 4.00,
        lk11t2020: 16.90,
        tht11stt: 111.11,
        tht11sck: 117.65,
        lktsck: 101.20,
        lktskh: null
      }
    ]
  //Only TS Variable
  years: number[] = [];
  year: number = 0;
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
    this.year = this.getCurrentSelectedYear()
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
  getCurrentSelectedYear() {
    return 2020;
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
    this.year = value;

  }
  applyDistrictFilter(event) {

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