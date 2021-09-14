import { Component, Injector } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { SolarEneryManagementModel } from 'src/app/_models/APIModel/electric-management.module';

import { FormControl, Validators } from '@angular/forms';
import { EnergyService } from 'src/app/_services/APIService/energy.service';

import { BaseComponent } from 'src/app/components/specialized/base.component';
import { LoginService } from 'src/app/_services/APIService/login.service';

@Component({
  selector: 'app-solar-enery-management',
  templateUrl: './solor-enery-management.component.html',
  styleUrls: ['/../../special_layout.scss'],
})
export class SolarEneryManagementComponent extends BaseComponent {
  //Constant variable
  DB_TABLE = 'QLNL_DMT';
  public readonly displayedColumns: string[] =
    ['select', 'index', 'ten_du_an', 'ten_doanh_nghiep', 'ten_huyen_thi', 'cong_suat_thiet_ke',
      'san_luong_6_thang', 'san_luong_nam', 'doanh_thu_6_thang' ,'doanh_thu_nam', 'trang_thai', 'thoi_gian_chinh_sua_cuoi'];
  //TS & HTML Variable
  public dataSource: MatTableDataSource<SolarEneryManagementModel> = new MatTableDataSource<SolarEneryManagementModel>();
  public filteredDataSource: MatTableDataSource<SolarEneryManagementModel> = new MatTableDataSource<SolarEneryManagementModel>();

  //Only TS Variable
  doanhThu: number;
  congXuat: number;
  sanluongnam: number;
  soLuongDoanhNghiep: number;
  isChecked: boolean;
  doanhThu6t: number;
  sanluong6t: number;


  constructor(
    private injector: Injector,
    private energyService: EnergyService,
    public _login: LoginService
  ) {
    super(injector);
  }

  authorize: boolean = true

  ngOnInit() {
    super.ngOnInit();
    this.getSolarEnergyData(this.currentYear);

    if (this._login.userValue.user_role_id == 4  || this._login.userValue.user_role_id == 1) {
      this.authorize = false
    }
  }

  getLinkDefault() {
    this.LINK_DEFAULT = "/specialized/enery-management/solarelectric";
    this.TITLE_DEFAULT = "Hiện trạng các nguồn điện sơ cấp - Điện mặt trời";
    this.TEXT_DEFAULT = "Hiện trạng các nguồn điện sơ cấp - Điện mặt trời";
  }

  getSolarEnergyData(time_id) {
    this.energyService.LayDuLieuDienMatTroi(time_id).subscribe(res => {
      this.dataSource = new MatTableDataSource<SolarEneryManagementModel>(res.data);
      this.filteredDataSource = new MatTableDataSource<SolarEneryManagementModel>(res.data);
      this.initPaginator();
      this.caculatorValue();
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filteredDataSource.filter = filterValue.trim().toLowerCase();
  }

  getFormParams() {
    return {
      id: new FormControl(),
      ten_du_an: new FormControl('', Validators.required),
      ten_doanh_nghiep: new FormControl('', Validators.required),
      dia_diem: new FormControl(),
      cong_suat_thiet_ke: new FormControl(),
      san_luong_6_thang: new FormControl(),
      doanh_thu_6_thang: new FormControl(),
      san_luong_nam: new FormControl(),
      doanh_thu_nam: new FormControl(),
      id_trang_thai_hoat_dong: new FormControl('', Validators.required),
      id_quan_huyen: new FormControl('', Validators.required),
    }
  }

  setFormParams() {
    if (this.selection.selected.length) {
        let selectedRecord = this.selection.selected[0];
        let objectList = this.getFormParams();
        for (let o in objectList) {
          this.formData.controls[o].setValue(selectedRecord[o]);
        }
    }
  }

  prepareData(data) {
    data = {
      ...data, ...{
        time_id: this.currentYear,
      }
    }
    return data;
  }

  callService(data) {
    this.energyService.PostSolarEnergyData([data], this.currentYear).subscribe(response => this.successNotify(response), error => this.errorNotify(error));
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
    this.initPaginator();
  }

  initPaginator() {
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
    this.soLuongDoanhNghiep = this.filteredDataSource.data.length;
    this.doanhThu = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => x.doanh_thu_nam).reduce((a, b) => a + b) : 0;
    this.congXuat = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => x.cong_suat_thiet_ke).reduce((a, b) => a + b) : 0;
    this.sanluongnam = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => x.san_luong_nam).reduce((a, b) => a + b) : 0;

    this.doanhThu6t = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => x.doanh_thu_6_thang).reduce((a, b) => a + b) : 0;
    this.sanluong6t = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => x.san_luong_6_thang).reduce((a, b) => a + b) : 0;
  }

  applyActionCheck(event) {
    event.checked
      ? this.filteredDataSource.data = this.filteredDataSource.data.filter(item => item.id_trang_thai_hoat_dong = 0)
      : this.filteredDataSource.data = this.dataSource.data;
    // this.filteredDataSource.filter = (event.checked) ? "true" : "";
    this.caculatorValue();
    this.initPaginator();
  }

  prepareRemoveData(data) {
    let datas = data.map(element => new Object({ id: element.id }));
    return datas;
  }

  callRemoveService(data) {
    this.energyService.DeleteSolarEnergy(data).subscribe(response => this.successNotify(response), error => this.errorNotify(error));
  }
}