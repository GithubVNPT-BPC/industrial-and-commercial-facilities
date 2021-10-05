import { Component, Injector } from '@angular/core';
import { MatDialog, MatDialogConfig, MatTableDataSource } from '@angular/material';
import { HydroEnergyModel } from 'src/app/_models/APIModel/electric-management.module';
import { EnergyService } from 'src/app/_services/APIService/energy.service';

import { FormControl, Validators } from '@angular/forms';

import { BaseComponent } from 'src/app/components/specialized/base.component';
import { LoginService } from 'src/app/_services/APIService/login.service';
import { DialogContainerComponent } from 'src/app/shared/dialog/dialog-container/dialog-container.component';
import { DialogService } from 'src/app/_services/injectable-service/dialog.service';

@Component({
  selector: 'app-hydroelectric',
  templateUrl: './hydroelectric.component.html',
  styleUrls: ['/../../special_layout.scss'],
})
export class HydroelectricComponent extends BaseComponent {

  DB_TABLE = 'QLNL_THUY_DIEN';
  sanluong6t: number;
  doanhThu6t: number;
  constructor(
    private injector: Injector,
    private energyService: EnergyService,
    public _login: LoginService,
    private dialogService: DialogService,
    public matDialog: MatDialog,
  ) {
    super(injector);
  }

  //Constant variable
  public readonly displayedColumns: string[] = ['select', 'index', 'Tdn', 'Dd', 'Cx', 'Lnxbq', 'Dthc', 'Sl6tck',
    'Slnck', 'Dt_6t', 'Dt_n', 'Paupttcctvhd', 'Pdpauptt', 'Paupvthkcdhctd', 'Qtvhhctd', 'Qtdhctd', 'Kdd', 'Ldhtcbvhd',
    'Btct', 'Lcsdlhctd', 'Pabvdhctd', 'Bcdgatdhctd', 'Bchtatdhctd', 'Tkdkatdhctd', 'tinh_trang_hoat_dong_id', 'thoi_gian_chinh_sua_cuoi'
  ];

  //TS & HTML Variable
  public dataSource: MatTableDataSource<HydroEnergyModel>;
  public filteredDataSource: MatTableDataSource<HydroEnergyModel> = new MatTableDataSource<HydroEnergyModel>();;

  //Only TS Variable
  doanhThu: number;
  congXuat: number;
  sanluongnam: number;
  soLuongDoanhNghiep: number;
  isChecked: boolean;

  authorize: boolean = true

  ngOnInit() {
    super.ngOnInit();
    this.laydulieuThuyDien(this.currentYear);
    this.initDistrictWard();
    if (this._login.userValue.user_role_id == 4 || this._login.userValue.user_role_id == 1) {
      this.authorize = false
    }
  }

  getLinkDefault() {
    this.LINK_DEFAULT = "/specialized/enery-management/hydroelectric";
    this.TITLE_DEFAULT = "Hiện trạng các nguồn điện sơ cấp - Thủy điện";
    this.TEXT_DEFAULT = "Hiện trạng các nguồn điện sơ cấp - Thủy điện";
  }

  laydulieuThuyDien(time_id) {
    this.energyService.LayDuLieuThuyDien(time_id).subscribe(res => {
      this.filteredDataSource.data = [];
      if (res.data && res.data.length) {
        res.data.map(x => {
          x.dia_diem = `${x.ten_phuong_xa}, ${x.ten_quan_huyen}`;
        });
        this.dataSource = new MatTableDataSource<HydroEnergyModel>(res.data);
        this.filteredDataSource = new MatTableDataSource<HydroEnergyModel>(res.data);
      }
      this.caculatorValue();
      this.paginatorAgain();
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filteredDataSource.filter = filterValue.trim().toLowerCase();
  }

  getFormParams() {
    return {
      id: new FormControl(),
      ten_doanh_nghiep: new FormControl('', Validators.required),
      cong_suat_thiet_ke: new FormControl(0, Validators.required),
      luong_nuoc_xa_binh_quan: new FormControl(0, Validators.required),
      dung_tich_ho_chua: new FormControl(0, Validators.required),
      san_luong_6_thang: new FormControl(0, Validators.required),
      doanh_thu_6_thang: new FormControl(0, Validators.required),
      san_luong_nam: new FormControl(0, Validators.required),
      doanh_thu_nam: new FormControl(0, Validators.required),
      phuong_an_ung_pho_thien_tai_ha_du: new FormControl(),
      phe_duyet_phuong_an_ung_pho_thien_tai: new FormControl(),
      phuong_an_ung_pho_khan_cap: new FormControl(),
      quy_trinh_van_hanh_ho_chua: new FormControl(),
      quan_trac_dap_ho: new FormControl(),
      kiem_dinh_dap: new FormControl(),
      lap_dat_he_thong_canh_bao_ha_du: new FormControl(),
      bao_trinh_cong_trinh: new FormControl(),
      lap_co_so_du_lieu_ho_chua_thuy_dien: new FormControl(),
      phuong_an_bao_ve_dap_ho_chua_thuy_dien: new FormControl(),
      bao_cao_danh_gia_an_toan: new FormControl(),
      bao_cao_hien_trang_an_toan_dap_ho: new FormControl(),
      to_khai_dang_ky_an_toan_dap_ho: new FormControl(),
      time_id: new FormControl(this.currentYear),
      id_phuong_xa: new FormControl('', Validators.required),
      id_trang_thai_hoat_dong: new FormControl('', Validators.required),
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

  applyDistrictFilter(event) {
    let filteredData = [];

    event.value.forEach(element => {
      this.dataSource.data.filter(x => x['id_quan_huyen'] == element).forEach(x => filteredData.push(x));
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
    this.doanhThu = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => x.doanh_thu_nam).reduce((a, b) => a + b) : 0;
    this.soLuongDoanhNghiep = this.filteredDataSource.data.length;
    // // this.congXuat = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => x.Cx).reduce((a, b) => a + b) : 0;
    this.sanluongnam = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => x.san_luong_nam).reduce((a, b) => a + b) : 0;

    this.doanhThu6t = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => x.doanh_thu_6_thang).reduce((a, b) => a + b) : 0;
    this.sanluong6t = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => x.san_luong_6_thang).reduce((a, b) => a + b) : 0;
  }

  applyActionCheck(event) {
    this.filteredDataSource.data = event.checked ? [...this.dataSource.data.filter(d => d.id_trang_thai_hoat_dong == 2)] : [...this.dataSource.data];
    this.caculatorValue();
    this.paginatorAgain();
  }

  prepareRemoveData(data) {
    let datas = data.map(element => new Object({ id: element.id }));
    return datas;
  }

  callRemoveService(data) {
    this.energyService.DeleteHydro(data).subscribe(response => this.successNotify(response), error => this.errorNotify(error));
  }

  callService(data) {
    this.energyService.PostHydroEnergyData([data], this.currentYear).subscribe(response => this.successNotify(response), error => this.errorNotify(error));
  }

  uploadExcel(e) {
    // open dialog upload excel file 
    this.openDialog("Thủy điện");
  }

  openDialog(nameSheet) {
    const dialogConfig = new MatDialogConfig();
    console.log(window.innerWidth);
    if (window.innerWidth > 375) {
      dialogConfig.width = window.innerWidth * 0.7 + 'px';
      dialogConfig.height = window.innerHeight * 0.4 + 'px';
    } else {
      dialogConfig.width = window.innerWidth * 0.8 + 'px';
      dialogConfig.height = window.innerHeight * 0.2 + 'px';
    }
    dialogConfig.data = {
      nameSheet: nameSheet,
    };
    let dialogRef = this.matDialog.open(DialogContainerComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(res => {
      console.log(res);
      if (res) {
        console.log(this.handleData(res));
        const body = this.handleData(res);
        
        this.energyService.PostHydroEnergyData(body).subscribe(res => this.successNotify(res), err => this.errorNotify(err));
      }

    })
  }

  handleData(time_id) {
    let ls: any[] = [];
    let dataExcel = this.dialogService.getDataTransform();
    for (let i = 1; i < dataExcel.length; i++) {
      let body: any = {};
      body['ten_doanh_nghiep'] = dataExcel[i]['__EMPTY_1'];
      body['cong_suat_thiet_ke'] = dataExcel[i]['__EMPTY_6'];
      body['dung_tich_ho_chua'] = dataExcel[i]['__EMPTY_5'];
      body['san_luong_6_thang'] = dataExcel[i]['__EMPTY_7'];
      body['san_luong_nam'] = dataExcel[i]['__EMPTY_9'];
      body['doanh_thu_6_thang'] = dataExcel[i]['__EMPTY_8'];
      body['doanh_thu_nam'] = dataExcel[i]['__EMPTY_10'];
      body['phuong_an_ung_pho_thien_tai_ha_du'] = dataExcel[i]['__EMPTY_11'];
      body['phe_duyet_phuong_an_ung_pho_thien_tai'] = dataExcel[i]['__EMPTY_12'];
      body['phuong_an_ung_pho_khan_cap'] = dataExcel[i]['__EMPTY_13'];
      body['quy_trinh_van_hanh_ho_chua'] = dataExcel[i]['__EMPTY_14'];
      body['quan_trac_dap_ho'] = dataExcel[i]['__EMPTY_15'];
      body['kiem_dinh_dap'] = dataExcel[i]['__EMPTY_16'];
      body['lap_dat_he_thong_canh_bao_ha_du'] = dataExcel[i]['__EMPTY_17'];
      body['bao_trinh_cong_trinh'] = dataExcel[i]['__EMPTY_18'];
      body['lap_co_so_du_lieu_ho_chua_thuy_dien'] = dataExcel[i]['__EMPTY_19'];
      body['phuong_an_bao_ve_dap_ho_chua_thuy_dien'] = dataExcel[i]['__EMPTY_20'];
      body['bao_cao_danh_gia_an_toan'] = dataExcel[i]['__EMPTY_21'];
      body['bao_cao_hien_trang_an_toan_dap_ho'] = dataExcel[i]['__EMPTY_22'];
      body['to_khai_dang_ky_an_toan_dap_ho'] = dataExcel[i]['__EMPTY_23'];
      body['luong_nuoc_xa_binh_quan'] = dataExcel[i]['__EMPTY_4'];
      body['time_id'] = time_id;
      body['id_trang_thai_hoat_dong'] = 1;
      body['id_phuong_xa'] = dataExcel[i]['__EMPTY_2'];
      ls.push(body)
    }
    return ls;
  }
}