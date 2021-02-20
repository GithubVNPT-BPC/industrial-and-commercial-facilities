import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { consualtantData } from '../dataMGN';
import { MatAccordion, MatPaginator, MatTableDataSource } from '@angular/material';
import { ManageAproveElectronic } from 'src/app/_models/APIModel/electric-management.module';
import { DistrictModel } from 'src/app/_models/APIModel/domestic-market.model';
import * as XLSX from 'xlsx';
import { ExcelService } from 'src/app/_services/excelUtil.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-manufacturing-electronic',
  templateUrl: './manufacturing-electronic.component.html',
  styleUrls: ['../../../special_layout.scss']
})
export class ManufacturingElectronicComponent implements OnInit {

  
  //ViewChild 
  @ViewChild(MatAccordion, { static: true }) accordion: MatAccordion;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('TABLE', { static: false }) table: ElementRef;
  // Input
  @Input('manufacturingData')  input_data: ManageAproveElectronic[];
  exportExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table.nativeElement);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Quản lý cấp phép HĐĐL');

    XLSX.writeFile(wb, 'Quản lý cấp phép HĐĐL.xlsx');

  }

  ExportTOExcel(filename: string, sheetname: string) {
    this.excelService.exportDomTableAsExcelFile(filename, sheetname, this.table.nativeElement);
  }

  //Constant variable
  public readonly displayedColumns: string[] = 
  ['index', 'ten_doanh_nghiep', 'dia_diem', 
  'so_dien_thoai', 'so_giay_phep', 'ngay_cap', 
  'ngay_het_han'];
  //TS & HTML Variable
  public dataSource: MatTableDataSource<ManageAproveElectronic> = new MatTableDataSource<ManageAproveElectronic>();
  public filteredDataSource: MatTableDataSource<ManageAproveElectronic> = new MatTableDataSource<ManageAproveElectronic>();
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
  public data: Array<ManageAproveElectronic> = consualtantData.filter(item => item.id_group === 2)
  //Only TS Variable
  years: number[] = [];
  doanhThu: number;
  congXuat: number;
  sanluongnam: number;
  soLuongDoanhNghiep: number;
  soLuongDoanhNghiepExpired: number = 0;
  isChecked: boolean;
  constructor(
    public excelService: ExcelService,
    ) {
  }

  ngOnInit() {
    this.years = this.getYears();

    this.getDataManufacturing();
    this.autoOpen();
  }

  getDataManufacturing(){
    this.filteredDataSource = new MatTableDataSource<ManageAproveElectronic>(this.input_data);
    this.dataSource = new MatTableDataSource<ManageAproveElectronic>(this.input_data); 
  }

  autoOpen() {
    setTimeout(() => {
      this.accordion.openAll()
      this.paginatorAgain();
      this.caculatorValue();
    }, 1000);
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
    return Array(30).fill(1).map((element, index) => new Date().getFullYear() - 21 + index);
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
    // this.doanhThu = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => x.doanh_thu).reduce((a, b) => a + b) : 0;
    this.soLuongDoanhNghiep = this.filteredDataSource.data.length;
    this.handeldateExpired();
    // this.congXuat = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => x.cong_xuat_thiet_ke).reduce((a, b) => a + b) : 0;
    // this.sanluongnam = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => x.san_luong_nam).reduce((a, b) => a + b) : 0;
  }

  handeldateExpired() {
    this.filteredDataSource.data.filter((item) => {
      let today = new Date();
      Date.parse(item.ngay_het_han) < Date.parse(today.toString())
        ? this.soLuongDoanhNghiepExpired++
        : 0;
    });
  }

  applyActionCheck(event) {
    let today = new Date();

    if(event.checked){
      this.filteredDataSource.data = this.filteredDataSource.data.filter(e => {
        return Date.parse(today.toString()) > Date.parse(e.ngay_het_han)
      })
    }else{
      this.filteredDataSource.data = [...this.dataSource.data];
    }
    // this.caculatorValue();
    this.paginatorAgain();
  }

  LocDulieuTheoNgayCap(year){
    let data_temp = [...this.dataSource.data];
    this.filteredDataSource.data = data_temp;
    if(year){
      this.filteredDataSource.data = this.filteredDataSource.data.filter(item => {
        return item.ngay_cap.includes(year);
      })
    }
  }
}
