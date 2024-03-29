import { Component, Injector } from '@angular/core';
import { MatDialog, MatDialogConfig, MatTableDataSource } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';

import { BlockElectricModel } from 'src/app/_models/APIModel/electric-management.module';

import { EnergyService } from 'src/app/_services/APIService/energy.service';

import { BaseComponent } from 'src/app/components/specialized/base.component';
import { LoginService } from 'src/app/_services/APIService/login.service';
import { DialogService } from 'src/app/_services/injectable-service/dialog.service';
import { DialogContainerComponent } from 'src/app/shared/dialog/dialog-container/dialog-container.component';
import { DialogContainerYearComponent } from 'src/app/shared/dialog/dialog-container/dialog-container-year.component';

@Component({
  selector: 'app-block-electric',
  templateUrl: './block-electric.component.html',
  styleUrls: ['/../../special_layout.scss']
})
export class BlockElectricComponent extends BaseComponent {
  DB_TABLE = 'QLNL_DSK'
  //Constant variable
  public readonly displayedColumns: string[] = ['select', 'index', 'ten_du_an', 'ten_doanh_nghiep','ten_quan_huyen', 'cong_suat_thiet_ke', 'san_luong_6_thang',
   'san_luong_nam', 'doanh_thu_6_thang', 'doanh_thu_nam','id_trang_thai_hoat_dong', 'thoi_gian_chinh_sua_cuoi'];
  //TS & HTML Variable
  public dataSource: MatTableDataSource<BlockElectricModel> = new MatTableDataSource<BlockElectricModel>();
  public filteredDataSource: MatTableDataSource<BlockElectricModel> = new MatTableDataSource<BlockElectricModel>();

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
    public _login: LoginService,
    public matDialog: MatDialog,
    private dialogService: DialogService 
  ) {
    super(injector);
  }

  authorize: boolean = true

  ngOnInit() {
    super.ngOnInit();
    // this.getDataBlockElectric(this.currentYear);
    this.getDataBlockElectric(0);

    if (this._login.userValue.user_role_id == 4  || this._login.userValue.user_role_id == 1) {
      this.authorize = false
    }
  }

  getLinkDefault() {
    this.LINK_DEFAULT = "/specialized/enery-management/block_electric";
    this.TITLE_DEFAULT = "Hiện trạng các nguồn điện sơ cấp - Điện sinh khối";
    this.TEXT_DEFAULT = "Hiện trạng các nguồn điện sơ cấp - Điện sinh khối";
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
      id_quan_huyen: new FormControl('', Validators.required),
      cong_suat_thiet_ke: new FormControl(0, Validators.required),
      san_luong_6_thang: new FormControl(0, Validators.required),
      san_luong_nam: new FormControl(0, Validators.required),
      doanh_thu_6_thang: new FormControl(0, Validators.required),
      doanh_thu_nam: new FormControl(0, Validators.required),
      time_id: new FormControl(this.currentYear, Validators.required),
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

  prepareData(data) {
    return data;
  }

  callService(data) {
    this.energyService.PostBlockElectricData([data], this.currentYear).subscribe(response => this.successNotify(response), error => this.errorNotify(error));
  }

  prepareRemoveData(data) {
    let datas = data.map(element => new Object({ id: element.id }));
    return datas;
  }

  callRemoveService(data) {
    this.energyService.DeleteBlockElectric(data).subscribe(response => this.successNotify(response), error => this.errorNotify(error));
  }

  getDataBlockElectric(time_id: any) {
    this.energyService.LayDuLieuDienSinhKhoi(time_id).subscribe(res => {
      this.filteredDataSource.data = [];
      if (res.data && res.data.length > 0) {
        this.filteredDataSource = new MatTableDataSource<BlockElectricModel>(res['data']);
        this.dataSource = new MatTableDataSource<BlockElectricModel>(res['data']);
      }
      this.caculatorValue();
      this.paginatorAgain();
    })
  }
  
  caculatorValue() {
    this.doanhThu = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => x.doanh_thu_nam).reduce((a, b) => a + b) : 0;
    this.soLuongDoanhNghiep = this.filteredDataSource.data.length;
    this.congXuat = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => x.cong_suat_thiet_ke).reduce((a, b) => a + b) : 0;
    this.sanluongnam = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => x.san_luong_nam).reduce((a, b) => a + b) : 0;

    this.doanhThu6t = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => x['doanh_thu_6_thang']).reduce((a, b) => a + b) : 0;
    this.sanluong6t = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => x.san_luong_6_thang).reduce((a, b) => a + b) : 0;
  }

  applyActionCheck(event) {
    event.checked
      ? this.filteredDataSource.data = this.filteredDataSource.data.filter(item => item.id_trang_thai_hoat_dong = 0)
      : this.filteredDataSource.data = this.dataSource.data;
    // this.filteredDataSource.filter = (event.checked) ? "true" : "";
    this.caculatorValue();
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

  uploadExcel(e) {
    // open dialog upload excel file 
    this.openDialog("Điện sinh khối");
  }

  openDialog(nameSheet) {
    const dialogConfig = new MatDialogConfig();
    console.log(window.innerWidth);
    dialogConfig.width = window.innerWidth * 0.5 + 'px';
    // if (window.innerWidth > 375) {
    //   dialogConfig.width = window.innerWidth * 0.7 + 'px';
    //   dialogConfig.height = window.innerHeight * 0.4 + 'px';
    // } else {
    //   dialogConfig.width = window.innerWidth * 0.8 + 'px';
    //   dialogConfig.height = window.innerHeight * 0.2 + 'px';
    // }
    dialogConfig.data = {
      nameSheet: nameSheet,
    };
    let dialogRef = this.matDialog.open(DialogContainerYearComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(res => {
      console.log(res);
      if (res) {
        console.log(this.handleData(res));
        const body = this.handleData(res);
        
        this.energyService.PostBlockElectricData(body).subscribe(res => this.successNotify(res), err => this.errorNotify(err));
      }

    })
  }

  handleData(time_id) {
    let ls: any[] = [];
    let dataExcel = this.dialogService.getDataTransform();
    for (let i = 1; i < dataExcel.length; i++) {
      let body: any = {};
      body['ten_doanh_nghiep'] = dataExcel[i]['__EMPTY'];
      body['ten_du_an'] = dataExcel[i]['__EMPTY_1'];
      body['dia_diem'] = dataExcel[i]['__EMPTY_2'];
      body['cong_suat_thiet_ke'] = dataExcel[i]['__EMPTY_5'];
      body['san_luong_6_thang'] = dataExcel[i]['__EMPTY_6'];
      body['doanh_thu_6_thang'] = dataExcel[i]['__EMPTY_7'];
      body['san_luong_nam'] = dataExcel[i]['__EMPTY_8'];
      body['doanh_thu_nam'] = dataExcel[i]['__EMPTY_9'];
      body['time_id'] = time_id;
      body['id_trang_thai_hoat_dong'] = 1;
      body['id_quan_huyen'] = dataExcel[i]['__EMPTY_3'];
      ls.push(body)
    }
    return ls;
  }

}
