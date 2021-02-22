import { Component, OnInit, ViewChild, ElementRef, Injector } from '@angular/core';
import { MatAccordion, MatPaginator, MatTable, MatTableDataSource } from '@angular/material';
import { DistrictModel } from 'src/app/_models/APIModel/domestic-market.model';
import { UserForcusEnergy } from 'src/app/_models/APIModel/electric-management.module';
import { LinkModel } from 'src/app/_models/link.model';
import { BreadCrumService } from 'src/app/_services/injectable-service/breadcrums.service';
import { ExcelService } from 'src/app/_services/excelUtil.service';
import { FormControl } from '@angular/forms';
import { EnergyService } from 'src/app/_services/APIService/energy.service';
import { BaseComponent } from '../../specialized-base.component';


@Component({
  selector: 'app-use-focused-energy',
  templateUrl: './use-focused-energy.component.html',
  styleUrls: ['/../../special_layout.scss'],
})
export class UseFocusedEnergyComponent extends BaseComponent {
  //ViewChild 
  // @ViewChild(MatAccordion, { static: true }) accordion: MatAccordion;
  @ViewChild('TABLE', { static: false }) table: ElementRef;
  // @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('district', {static: false}) district: ElementRef
  ExportTOExcel(filename: string, sheetname: string) {
    this.excelService.exportDomTableAsExcelFile(filename, sheetname, this.table.nativeElement);
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
  public data: Array<UserForcusEnergy> = [
  { mst: '122211', ten_doanh_nghiep: 'CÔNG TY CỔ PHẦN GỖ MDF VRG DONGWHA', dia_diem: 'KCN Minh Hưng III, Xã. Minh Hưng, H. Chơn Thành, T. Bình Phước', ma_huyen_thi: 10, nganh_nghe_san_xuat: 'Chế biến gỗ và các sản phẩm từ gỗ, tre', nang_luong_tieu_thu: null, nang_luong_quy_doi: 324617, suat_tieu_hao_1_dv_sp: 36765700 },
  { mst: '3333', ten_doanh_nghiep: 'CÔNG TY TNHH SẢN XUẤT GIÀY DÉP GRAND GIAN', dia_diem: 'KCN Đồng Xoài II, P. Tiến Thành, Tp. Đồng Xoài, T. Bình Phước', ma_huyen_thi: 2, nganh_nghe_san_xuat: 'Thuộc da, sơ chế da, giày dép', nang_luong_tieu_thu: null, nang_luong_quy_doi: 342367, suat_tieu_hao_1_dv_sp: 5535400 },
  { mst: '144411', ten_doanh_nghiep: 'CÔNG TY TNHH MỘT THÀNH VIÊN C&T VINA ', dia_diem: 'KCN Minh Hưng - Hàn Quốc, Xã Minh Hưng, H.Chơn Thành, T.Bình Phước', ma_huyen_thi: 10, nganh_nghe_san_xuat: 'Sản xuất trang phục, nhuộm', nang_luong_tieu_thu: null, nang_luong_quy_doi: 256856, suat_tieu_hao_1_dv_sp: 23653000 },
  { mst: '5555', ten_doanh_nghiep: 'CÔNG TY TNHH BEESCO VINA ', dia_diem: 'KCN Chơn Thành II , Xã Thành Tâm, H. Chơn Thành, T. Bình Phước', ma_huyen_thi: 10, nganh_nghe_san_xuat: 'Thuộc da, sơ chế da, giày dép', nang_luong_tieu_thu: null, nang_luong_quy_doi: 798675, suat_tieu_hao_1_dv_sp: 16312000 }]
  //Only TS Variable
  years: number[] = [];
  nangLuongTieuThu: number;
  nangLuongQuyDoi: number;
  congXuat: number;
  doanhNghiep: number;
  isChecked: boolean;
  currentYear: number = new Date().getFullYear();
  private _linkOutput: LinkModel = new LinkModel();
  constructor(
    private _breadCrumService: BreadCrumService,
    private injector: Injector,
    public excelService: ExcelService,
    private energyService: EnergyService,
  ) {
    super(injector);
  }


  ngOnInit() {
    super.ngOnInit();
    this.years = this.getYears();
    // this.dataSource.data = this.data;
    // this.filteredDataSource.data = [...this.dataSource.data];
    this.getDataSaveElectric();
    this.sendLinkToNext(true);
    this.initWards();
  }

  getDataSaveElectric(){
    this.energyService.LayDuLieuTietKiemNangLuong(this.currentYear).subscribe(res => {
      this.filteredDataSource.data = [...res['data']];
      this.dataSource.data = [...res['data']];
      this.caculatorValue();
    })
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
  }

  getYears() {
    return Array(5).fill(1).map((element, index) => new Date().getFullYear() - index);
  }
  getValueOfHydroElectric(value: any) {

  }
  applyDistrictFilter(event) {
    let filteredData = [];

    event.value.forEach(element => {
      this.dataSource.data.filter(x => x.id_quan_huyen == element).forEach(x => filteredData.push(x));
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
  caculatorValue() {
    this.nangLuongQuyDoi = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => x.nang_luong_quy_doi).reduce((a, b) => a + b) : 0;
    this.nangLuongTieuThu = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => x.nang_luong_tieu_thu).reduce((a, b) => a + b) : 0;
    this.doanhNghiep = this.filteredDataSource.data.length;
    this.congXuat = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => x.suat_tieu_hao_1_dv_sp).reduce((a, b) => a + b) : 0;
  }
  // isHidden(row : any){
  //     return (this.isChecked)? (row.is_het_han) : false;
  // }

  applyActionCheck(event) {
    this.filteredDataSource.filter = (event.checked) ? "true" : "";
    this.caculatorValue();
    this.paginatorAgain();
  }

  getFormParams() {
    return {
      ten_doanh_nghiep: new FormControl(''),
      dia_diem: new FormControl(''),
      nganh_nghe_san_xuat: new FormControl(''),
      nang_luong_tieu_thu: new FormControl(0),
      nang_luong_quy_doi: new FormControl(0),
      suat_tieu_hao_1_dv_sp: new FormControl(0),
      time_id: new FormControl(this.currentYear),
      id_quan_huyen: new FormControl(''),
    }
  }

  public prepareData(data) {
    data['dia_diem'] = data['dia_diem'] ? data['dia_diem'].concat(' , ', this.address) : data['dia_diem'].concat(this.address);
    data['nang_luong_tieu_thu'] = Number(data['nang_luong_tieu_thu']);
    data['suat_tieu_hao_1_dv_sp'] = Number(data['suat_tieu_hao_1_dv_sp']);
    data['nang_luong_quy_doi'] = Number(data['nang_luong_quy_doi']);
  }

  public callService(data) {
    let list_data = [data];
    // console.log(list_data)
    this.energyService.CapNhatDuLieutietKiemNL(list_data).subscribe(res => {
      this.successNotify(res);
    })
  }
  id_quan_huyen: number;
  autoDistric(event){
    // console.log(event)
    this.id_quan_huyen = event.value['id_quan_huyen'];
    this.concatAddress(event.value['ten_phuong_xa'], this.id_quan_huyen);
  }
  name_ward: string = '';
  address: string = '';
  concatAddress(ten_phuong_xa: string, id_quan_huyen: number){
    
    let item = this.districts.find(district => 
      district.id == id_quan_huyen
    )
    this.address = ten_phuong_xa + " , " + item['ten_quan_huyen']; 
    console.log(this.address)
  }
}