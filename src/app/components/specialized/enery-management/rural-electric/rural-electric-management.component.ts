import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatAccordion, MatPaginator, MatTable, MatTableDataSource } from '@angular/material';
import { DistrictModel } from 'src/app/_models/APIModel/domestic-market.model';
import { ElectricityDevelopmentModel, HydroElectricManagementModel, New_RuralElectricModel, RuralElectricModel } from 'src/app/_models/APIModel/electric-management.module';
import { EnergyService } from 'src/app/_services/APIService/energy.service';
import { ExcelService } from 'src/app/_services/excelUtil.service';

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

  ExportTOExcel(filename: string, sheetname: string) {
    this.excelService.exportDomTableAsExcelFile(filename, sheetname, this.table.nativeElement);
  }

  //Constant variable
  public readonly displayedColumns: string[] = ['index', 'db', 't1', 'cd1', 'tl1', 't2', 'cd2', 'ccd2', 'tl2', 'tc4_1', 'tc4_2', 'tc4_3',
  ];
  public readonly dsplayMergeColumns: string[] = ['merge1', 'merge2', 'merge3', 'merge4', 'merge5', 'merge6'];
  //TS & HTML Variable
  public dataSource: MatTableDataSource<New_RuralElectricModel> = new MatTableDataSource<New_RuralElectricModel>();
  public filteredDataSource: MatTableDataSource<New_RuralElectricModel> = new MatTableDataSource<New_RuralElectricModel>();
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
    
  //Only TS Variable
  years: number[] = [];
  tongSoHo: number;
  tongSoXa: number;
  tongHoKhongCoDien: number;
  tongHoCoDien: number;
  isChecked: boolean;

  constructor(public excelService: ExcelService,
    private energyService: EnergyService,
    ) {
  }

  ngOnInit() {
    // this.years = this.getYears();
    this.getDataRuralElectric();
    this.autoOpen();
  }

  getDataRuralElectric(){
    this.energyService.LayDuLieuQuyHoachDienNongThon().subscribe(res => {
      this.filteredDataSource = new MatTableDataSource<New_RuralElectricModel>(res['data']);
      this.caculatorValue();
      this.paginatorAgain();
      this.dataSource = new MatTableDataSource<New_RuralElectricModel>(res['data']);
    })
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
    this.tongSoHo = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => x.nong_thon_tong_so_ho).reduce((a, b) => a + b) : 0;
    this.tongSoXa = this.filteredDataSource.data.filter(x => x.nong_thon_tong_so_ho != null).length;
    this.tongHoKhongCoDien = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => x.ccd2).reduce((a, b) => a + b) : 0;
    this.tongHoCoDien = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => x.nong_thon_tong_so_ho_co_dien).reduce((a, b) => a + b) : 0;
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