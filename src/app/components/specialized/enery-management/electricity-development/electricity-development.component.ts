import { Component, Injector } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatTableDataSource } from '@angular/material';
import { DialogContainerComponent } from 'src/app/shared/dialog/dialog-container/dialog-container.component';
import { ElectricityDevelopment35KVModel } from 'src/app/_models/APIModel/electric-management.module';
import { EnergyService } from 'src/app/_services/APIService/energy.service';
import { LoginService } from 'src/app/_services/APIService/login.service';
import { DialogService } from 'src/app/_services/injectable-service/dialog.service';
import { BaseComponent } from '../../base.component';

@Component({
  selector: 'app-electricity-development',
  templateUrl: './electricity-development.component.html',
  styleUrls: ['/../../special_layout.scss'],
})
export class ElectricDevelopmentManagementComponent extends BaseComponent {
  DB_TABLE = 'QLNL_35KTROXUONG';
  //Constant variable
  public readonly displayedColumns: string[] = ['select', 'index', 'ten_huyen_thi', 'thoi_gian_chinh_sua_cuoi', 'trung_ap_3p', 'trung_ap_1p', 'ha_ap_3p', 'ha_ap_1p', 'so_tram_bien_ap', 'cong_xuat_bien_ap'];
  public readonly dsplayMergeColumns: string[] = ['indexM', 'ten_huyen_thiM', 'trung_apM', 'ha_apM', 'bien_apM'];
  //TS & HTML Variable
  public dataSource: MatTableDataSource<ElectricityDevelopment35KVModel> = new MatTableDataSource<ElectricityDevelopment35KVModel>();
  public filteredDataSource: MatTableDataSource<ElectricityDevelopment35KVModel> = new MatTableDataSource<ElectricityDevelopment35KVModel>();

  //Only TS Variable
  trung_ap_3p: number;
  tongSoXa: number;
  trung_ap_1p: number;
  ha_ap_1p: number;
  ha_ap_3p: number;
  so_tram_bien_ap: number;
  cong_xuat_bien_ap: number;
  isChecked: boolean;

  constructor(
    private injector: Injector,
    private energyService: EnergyService,
    public _login: LoginService,
    private dialogService: DialogService,
    public matDialog: MatDialog,
  ) {
    super(injector);
  }

  authorize: boolean = true

  ngOnInit() {
    super.ngOnInit();
    this.getDataQuyHoachDienDuoi35KV();

    if (this._login.userValue.user_role_id == 4 || this._login.userValue.user_role_id == 1) {
      this.authorize = false
    }
  }

  getDataQuyHoachDienDuoi35KV() {
    this.energyService.LayDuLieuQuyHoachDien35KV(this.currentYear).subscribe(result => {
      this.filteredDataSource.data = [];
      if (result.data && result.data.length > 0) {
        this.dataSource = new MatTableDataSource<ElectricityDevelopment35KVModel>(result['data']);
        this.filteredDataSource = new MatTableDataSource<ElectricityDevelopment35KVModel>(result['data']);
      }
      this.caculatorValue();
      this.paginatorAgain();
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filteredDataSource.filter = filterValue.trim().toLowerCase();
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
    this.trung_ap_3p = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => x.trung_ap_3_pha).reduce((a, b) => a + b) : 0;
    this.tongSoXa = this.filteredDataSource.data.length;
    this.trung_ap_1p = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => x.trung_ap_1_pha).reduce((a, b) => a + b) : 0;
    this.ha_ap_1p = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => x.ha_ap_1_pha).reduce((a, b) => a + b) : 0;
    this.ha_ap_3p = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => x.ha_ap_3_pha).reduce((a, b) => a + b) : 0;
    this.so_tram_bien_ap = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => x.so_tram).reduce((a, b) => a + b) : 0;
    this.cong_xuat_bien_ap = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => x.cong_suat).reduce((a, b) => a + b) : 0;
  }

  applyActionCheck(event) {
    this.filteredDataSource.filter = (event.checked) ? "true" : "";
    this.caculatorValue();
    this.paginatorAgain();
  }

  getFormParams() {
    return {
      id: new FormControl(),
      dia_ban: new FormControl('', Validators.required),
      trung_ap_3_pha: new FormControl(''),
      trung_ap_1_pha: new FormControl(''),
      ha_ap_3_pha: new FormControl(''),
      ha_ap_1_pha: new FormControl(''),
      so_tram: new FormControl(''),
      cong_suat: new FormControl(''),
      time_id: new FormControl(this.currentYear, Validators.required),
      id_trang_thai_hoat_dong: new FormControl(1, Validators.required),
      id_quan_huyen: new FormControl('', Validators.required)
    }
  }
  setFormParams() {
    if (this.selection.selected.length) {
      let selectedRecord = this.selection.selected[0];
      this.formData.controls['id'].setValue(selectedRecord.id);
      this.formData.controls['dia_ban'].setValue(selectedRecord.dia_ban);
      this.formData.controls['trung_ap_3_pha'].setValue(selectedRecord.trung_ap_3_pha);
      this.formData.controls['trung_ap_1_pha'].setValue(selectedRecord.trung_ap_1_pha);
      this.formData.controls['ha_ap_3_pha'].setValue(selectedRecord.ha_ap_3_pha);
      this.formData.controls['ha_ap_1_pha'].setValue(selectedRecord.ha_ap_1_pha);
      this.formData.controls['so_tram'].setValue(selectedRecord.so_tram);
      this.formData.controls['cong_suat'].setValue(selectedRecord.cong_suat);
      this.formData.controls['id_quan_huyen'].setValue(selectedRecord.id_quan_huyen);
    }
  }
  public prepareData(data) {
    data['trung_ap_3_pha'] = Number(data['trung_ap_3_pha']);
    data['trung_ap_1_pha'] = Number(data['trung_ap_1_pha']);
    data['ha_ap_3_pha'] = Number(data['ha_ap_3_pha']);
    data['ha_ap_1_pha'] = Number(data['ha_ap_1_pha']);
    data['so_tram'] = Number(data['so_tram']);
    data['cong_suat'] = Number(data['cong_suat']);
    data['time_id'] = data['time_id'];
    data['id_trang_thai_hoat_dong'] = 1;
    return data;
  }

  public callService(data) {
    this.energyService.CapNhatDuLieuQuyHoachDien35KV([data]).subscribe(response => this.successNotify(response), error => this.errorNotify(error));
  }

  prepareRemoveData(data) {
    let datas = data.map(element => new Object({ id: element.id }));
    return datas;
  }

  callRemoveService(data) {
    this.energyService.Delete35KV_ElectricalNet(data).subscribe(response => this.successNotify(response), error => this.errorNotify(error));
  }

  getLinkDefault() {
    //Constant
    this.LINK_DEFAULT = "/specialized/enery-management/35kv_electricity_development";
    this.TITLE_DEFAULT = "Quy hoạch phát triển lưới điện - Quy hoạch điện cấp điện áp từ 22kV trở xuống";
    this.TEXT_DEFAULT = "Quy hoạch phát triển lưới điện - Quy hoạch điện cấp điện áp từ 22kV trở xuống";
  }

  uploadExcel(e) {
    // open dialog upload excel file 
    this.openDialog("Quy hoạch điện áp 22kv");
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
        this.energyService.CapNhatDuLieuQuyHoachDien35KV(body).subscribe(res => this.successNotify(res), err => this.errorNotify(err));
      }

    })
  }

  handleData(time_id) {
    let ls: any[] = [];
    let dataExcel = this.dialogService.getDataTransform();
    for (let i = 1; i < dataExcel.length; i++) {
      let body: any = {};
      body['dia_ban'] = dataExcel[i]['__EMPTY'];
      body['trung_ap_3_pha'] = dataExcel[i]['__EMPTY_3'];
      body['trung_ap_1_pha'] = dataExcel[i]['__EMPTY_4'];
      body['ha_ap_3_pha'] = dataExcel[i]['__EMPTY_5'];
      body['ha_ap_1_pha'] = dataExcel[i]['__EMPTY_6'];
      body['so_tram'] = dataExcel[i]['__EMPTY_7'];
      body['cong_suat'] = dataExcel[i]['__EMPTY_8'];
      body['time_id'] = time_id;
      body['id_trang_thai_hoat_dong'] = 1;
      body['id_quan_huyen'] = dataExcel[i]['__EMPTY_1'];
      ls.push(body)
    }
    return ls;
  }
}