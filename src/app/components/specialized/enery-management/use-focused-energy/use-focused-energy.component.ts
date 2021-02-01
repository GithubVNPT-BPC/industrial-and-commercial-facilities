import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatAccordion, MatPaginator, MatTable, MatTableDataSource } from '@angular/material';
import { DistrictModel } from 'src/app/_models/APIModel/domestic-market.model';
import { UserForcusEnergy } from 'src/app/_models/APIModel/electric-management.module';
import { LinkModel } from 'src/app/_models/link.model';
import { BreadCrumService } from 'src/app/_services/injectable-service/breadcrums.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-use-focused-energy',
  templateUrl: './use-focused-energy.component.html',
  styleUrls: ['/../../special_layout.scss'],
})
export class UseFocusedEnergyComponent implements OnInit {
  //ViewChild 
  @ViewChild(MatAccordion, { static: true }) accordion: MatAccordion;
  @ViewChild('TABLE', { static: false }) table: ElementRef;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  exportExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table.nativeElement);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Tiết kiệm năng lượng');

    XLSX.writeFile(wb, 'Tiết kiệm năng lượng.xlsx');

  }
  //Constant variable
  private readonly LINK_DEFAULT: string = "/specialized/enery-management/countryside_electric";
  private readonly TITLE_DEFAULT: string = "Tiết kiệm năng lượng";
  private readonly TEXT_DEFAULT: string = "Tiết kiệm năng lượng";
  public readonly displayedColumns: string[] = ['index', 'ten_doanh_nghiep', 'dia_chi', 'nganh_nghe', 'nang_luong_tieu_thu', 'nang_luong_quy_doi', 'suat_tieu_hao'];
  public readonly displayMergeColumns: string[] = ['indexM', 'ten_doanh_nghiepM', 'nganh_ngheM', 'nang_luong_trong_diemM'];
  //TS & HTML Variable
  public dataSource: MatTableDataSource<UserForcusEnergy> = new MatTableDataSource<UserForcusEnergy>();
  public filteredDataSource: MatTableDataSource<UserForcusEnergy> = new MatTableDataSource<UserForcusEnergy>();
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
  public data: Array<UserForcusEnergy> = [{ mst: '111', ten_doanh_nghiep: 'CÔNG TY TNHH SHYANG TA', dia_chi: 'Xã Thành Tâm, H. Chơn Thành, T. Bình Phước', ma_huyen_thi: 10, nganh_nghe: 'Thuộc da, sơ chế da, giày dép', nang_luong_tieu_thu: null, nang_luong_quy_doi: 153215, suat_tieu_hao: 20463000 },
  { mst: '122211', ten_doanh_nghiep: 'CÔNG TY CỔ PHẦN GỖ MDF VRG DONGWHA', dia_chi: 'KCN Minh Hưng III, Xã. Minh Hưng, H. Chơn Thành, T. Bình Phước', ma_huyen_thi: 10, nganh_nghe: 'Chế biến gỗ và các sản phẩm từ gỗ, tre', nang_luong_tieu_thu: null, nang_luong_quy_doi: 324617, suat_tieu_hao: 36765700 },
  { mst: '3333', ten_doanh_nghiep: 'CÔNG TY TNHH SẢN XUẤT GIÀY DÉP GRAND GIAN', dia_chi: 'KCN Đồng Xoài II, P. Tiến Thành, Tp. Đồng Xoài, T. Bình Phước', ma_huyen_thi: 2, nganh_nghe: 'Thuộc da, sơ chế da, giày dép', nang_luong_tieu_thu: null, nang_luong_quy_doi: 342367, suat_tieu_hao: 5535400 },
  { mst: '144411', ten_doanh_nghiep: 'CÔNG TY TNHH MỘT THÀNH VIÊN C&T VINA ', dia_chi: 'KCN Minh Hưng - Hàn Quốc, Xã Minh Hưng, H.Chơn Thành, T.Bình Phước', ma_huyen_thi: 10, nganh_nghe: 'Sản xuất trang phục, nhuộm', nang_luong_tieu_thu: null, nang_luong_quy_doi: 256856, suat_tieu_hao: 23653000 },
  { mst: '5555', ten_doanh_nghiep: 'CÔNG TY TNHH BEESCO VINA ', dia_chi: 'KCN Chơn Thành II , Xã Thành Tâm, H. Chơn Thành, T. Bình Phước', ma_huyen_thi: 10, nganh_nghe: 'Thuộc da, sơ chế da, giày dép', nang_luong_tieu_thu: null, nang_luong_quy_doi: 798675, suat_tieu_hao: 16312000 }]
  //Only TS Variable
  years: number[] = [];
  nangLuongTieuThu: number;
  nangLuongQuyDoi: number;
  congXuat: number;
  doanhNghiep: number;
  isChecked: boolean;
  private _linkOutput: LinkModel = new LinkModel();
  constructor(private _breadCrumService: BreadCrumService) { }


  ngOnInit() {
    this.years = this.getYears();
    this.dataSource.data = this.data;
    this.filteredDataSource.data = [...this.dataSource.data];
    this.caculatorValue();
    this.paginatorAgain();
    this.autoOpen();
    this.sendLinkToNext(true);
  }

  public sendLinkToNext(type: boolean) {
    this._linkOutput.link = this.LINK_DEFAULT;
    this._linkOutput.title = this.TITLE_DEFAULT;
    this._linkOutput.text = this.TEXT_DEFAULT;
    this._linkOutput.type = type;
    this._breadCrumService.sendLink(this._linkOutput);
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
    this.nangLuongQuyDoi = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => x.nang_luong_quy_doi).reduce((a, b) => a + b) : 0;
    this.nangLuongTieuThu = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => x.nang_luong_tieu_thu).reduce((a, b) => a + b) : 0;
    this.doanhNghiep = this.filteredDataSource.data.length;
    this.congXuat = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => x.suat_tieu_hao).reduce((a, b) => a + b) : 0;
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