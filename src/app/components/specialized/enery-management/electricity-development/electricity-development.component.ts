import { Component, OnInit, ViewChild, ElementRef, Injector } from '@angular/core';
import { FormControl } from '@angular/forms';
import {  MatPaginator, MatTable, MatTableDataSource } from '@angular/material';
import { ElectricityDevelopment35KVModel } from 'src/app/_models/APIModel/electric-management.module';
import { EnergyService } from 'src/app/_services/APIService/energy.service';
import { ExcelService } from 'src/app/_services/excelUtil.service';
import { BaseComponent } from '../../specialized-base.component';

@Component({
  selector: 'app-electricity-development',
  templateUrl: './electricity-development.component.html',
  styleUrls: ['/../../special_layout.scss'],
})
export class ElectricDevelopmentManagementComponent extends BaseComponent {
  //ViewChild 
  // @ViewChild(MatAccordion, { static: true }) accordion: MatAccordion;
  @ViewChild('TABLE', { static: false }) table: ElementRef;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  ExportTOExcel(filename: string, sheetname: string) {
    this.excelService.exportDomTableAsExcelFile(filename, sheetname, this.table.nativeElement);
  }

  //Constant variable
  public readonly displayedColumns: string[] = ['index', 'ten_huyen_thi', 'trung_ap_3p', 'trung_ap_1p', 'ha_ap_3p', 'ha_ap_1p', 'so_tram_bien_ap', 'cong_xuat_bien_ap'];
  public readonly dsplayMergeColumns: string[] = ['indexM', 'ten_huyen_thiM', 'trung_apM', 'ha_apM', 'bien_apM'];
  //TS & HTML Variable
  public dataSource: MatTableDataSource<ElectricityDevelopment35KVModel> = new MatTableDataSource<ElectricityDevelopment35KVModel>();
  public filteredDataSource: MatTableDataSource<ElectricityDevelopment35KVModel> = new MatTableDataSource<ElectricityDevelopment35KVModel>();
  // public districts: DistrictModel[] = [{ id: 1, ten_quan_huyen: 'Thị xã Phước Long' },
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
  currentYear: number = new Date().getFullYear();

  constructor(
    private injector: Injector,
    public excelService: ExcelService,
    private energyService: EnergyService,
    ) {
      super(injector);
  }

  ngOnInit() {
    // this.initDistricts();
    super.ngOnInit();
    this.years = this.getYears();
    this.getDataQuyHoachDienDuoi35KV();
    this.autoOpen();
  }

  getDataQuyHoachDienDuoi35KV(){
    this.energyService.LayDuLieuQuyHoachDien35KV(this.currentYear).subscribe(res => {
      this.filteredDataSource = new MatTableDataSource<ElectricityDevelopment35KVModel>(res['data']);
      this.caculatorValue();
      this.dataSource = new MatTableDataSource<ElectricityDevelopment35KVModel>(res['data']);
    })
  }

  // initDistricts(){
  //   this.sctService.LayDanhSachQuanHuyen().subscribe(res => {
  //     if(res['success'])
  //       this.districts = res['data']
  //   })
  // }

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
    this.trung_ap_3p = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => x.trung_ap_3_pha).reduce((a, b) => a + b) : 0;
    this.tongSoXa = this.filteredDataSource.data.length;
    this.trung_ap_1p = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => x.trung_ap_1_pha).reduce((a, b) => a + b) : 0;
    this.ha_ap_1p = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => x.ha_ap_1_pha).reduce((a, b) => a + b) : 0;
    this.ha_ap_3p = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => x.ha_ap_3_pha).reduce((a, b) => a + b) : 0;
    this.so_tram_bien_ap = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => x.so_tram).reduce((a, b) => a + b) : 0;
    this.cong_xuat_bien_ap = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => x.cong_suat).reduce((a, b) => a + b) : 0;
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
      dia_ban: new FormControl(''),
      trung_ap_3_pha: new FormControl(''),
      trung_ap_1_pha: new FormControl(''),
      ha_ap_3_pha: new FormControl(''),
      ha_ap_1_pha: new FormControl(''),
      so_tram: new FormControl(''),
      cong_suat: new FormControl(''),
      time_id: new FormControl(''),
      id_trang_thai_hoat_dong: new FormControl(1),
      id_quan_huyen: new FormControl()
    }
  }

  public prepareData(data) {
    data['trung_ap_3_pha'] = Number(data['trung_ap_3_pha']);
    data['trung_ap_1_pha'] = Number(data['trung_ap_1_pha']);
    data['ha_ap_3_pha'] = Number(data['ha_ap_3_pha']);
    data['ha_ap_1_pha'] = Number(data['ha_ap_1_pha']);
    data['so_tram'] = Number(data['so_tram']);
    data['cong_suat'] = Number(data['cong_suat']);
    data['time_id'] = Number(data['time_id']);
    data['id_trang_thai_hoat_dong'] = 1;
    return data;
}

  public callService(data) {
      let list_data = [data];
      // console.log(list_data)
      this.energyService.CapNhatDuLieuQuyHoachDien35KV(list_data).subscribe(res => {
          this.successNotify(res);
      })
  }

  getLinkDefault(){
    //Constant
    this.LINK_DEFAULT = "/specialized/enery-management/35kv_electricity_development";
    this.TITLE_DEFAULT = "Quy hoạch phát triển lưới điện - Công tác phát triển lưới điện 35KV";
    this.TEXT_DEFAULT = "Quy hoạch phát triển lưới điện - Công tác phát triển lưới điện 35KV";
  }
}