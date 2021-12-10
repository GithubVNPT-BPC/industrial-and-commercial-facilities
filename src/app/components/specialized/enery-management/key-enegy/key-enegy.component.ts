import { Component, Injector, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatTableDataSource } from '@angular/material';
import { DialogContainerYearComponent } from 'src/app/shared/dialog/dialog-container/dialog-container-year.component';
import { DialogContainerComponent } from 'src/app/shared/dialog/dialog-container/dialog-container.component';
import { KeyEnergyModel } from 'src/app/_models/APIModel/electric-management.module';
import { EnergyService } from 'src/app/_services/APIService/energy.service';
import { LoginService } from 'src/app/_services/APIService/login.service';
import { DialogService } from 'src/app/_services/injectable-service/dialog.service';
import { BaseComponent } from '../../base.component';

@Component({
  selector: 'app-key-enegy',
  templateUrl: './key-enegy.component.html',
  styleUrls: ['../../special_layout.scss']
})
export class KeyEnegyComponent extends BaseComponent {

  DB_TABLE = 'QLNL_NANG_LUONG_TRONG_DIEM'
  constructor(
    private injector: Injector,
    private energyService: EnergyService,
    public _login: LoginService,
    public matDialog: MatDialog,
    private dialogService: DialogService,
  ) {
    super(injector);
  }

  //Constant variable
  public readonly displayedColumns: string[] = ['select', 'index', 'ten_khach_hang', 'dia_chi', 'nganh_nghe', 'dien', 'than',
    'DO', 'FO', 'xang', 'LPG', 'go', 'nang_luong_quy_doi', 'thoi_gian_chinh_sua_cuoi', 'ghi_chu'];

  //TS & HTML Variable
  public dataSource: MatTableDataSource<KeyEnergyModel>;
  public filteredDataSource: MatTableDataSource<KeyEnergyModel> = new MatTableDataSource<KeyEnergyModel>();

  //Only TS Variable
  TongNangLuongQuyDoi: number = 0;
  TongDienTieuThu: number = 0;
  soLuongDoanhNghiep: number = 0;
  isChecked: boolean;

  authorize: boolean = true

  currentYear: number = new Date().getFullYear() - 1;
  ngOnInit() {
    super.ngOnInit();
    this.laydulieuNLTD();

    if (this._login.userValue.user_role_id == 4 || this._login.userValue.user_role_id == 1) {
      this.authorize = false
    }
  }

  getLinkDefault() {
    this.LINK_DEFAULT = "/specialized/enery-management/key_enegy";
    this.TITLE_DEFAULT = "Hiện trạng các nguồn điện sơ cấp - Năng lượng trọng điểm";
    this.TEXT_DEFAULT = "Hiện trạng các nguồn điện sơ cấp - Năng lượng trọng điểm";
  }

  laydulieuNLTD() {
    this.energyService.LayDuLieuNangLuongTrongDiem(this.currentYear).subscribe(res => {
      this.filteredDataSource.data = [];
      if (res.data && res.data.length) {
        this.dataSource = new MatTableDataSource<KeyEnergyModel>(res.data);
        this.filteredDataSource = new MatTableDataSource<KeyEnergyModel>(res.data);
      }

      this._prepareData();
      this.paginatorAgain();
    })
  }

  _prepareData() {
    let data = this.filteredDataSource.data;
    this.soLuongDoanhNghiep = data.length;
    this.TongDienTieuThu = data.length ? data.map(item => item.dien).reduce((a, b) => a + b) : 0;
    this.TongNangLuongQuyDoi = data.length ? data.map(item => item.nang_luong_quy_doi).reduce((a, b) => a + b) : 0;
  }

  getFormParams() {
    return {
      id: new FormControl(),
      ten_khach_hang: new FormControl('', Validators.required),
      dia_chi: new FormControl('', Validators.required),
      nganh_nghe: new FormControl('', Validators.required),
      dien: new FormControl('', Validators.required),
      than: new FormControl('', Validators.required),
      DO: new FormControl('', Validators.required),
      FO: new FormControl('', Validators.required),
      xang: new FormControl('', Validators.required),
      LPG: new FormControl('', Validators.required),
      _go: new FormControl('', Validators.required),
      nang_luong_quy_doi: new FormControl('', Validators.required),
      time_id: new FormControl('', Validators.required),
      ghi_chu: new FormControl('')
    }
  }
  setFormParams() {
    if (this.selection.selected.length) {
      let selectedRecord = this.selection.selected[0];
      this.formData.controls['ten_khach_hang'].setValue(selectedRecord.ten_khach_hang);
      this.formData.controls['dia_chi'].setValue(selectedRecord.dia_chi);
      this.formData.controls['nganh_nghe'].setValue(selectedRecord.nganh_nghe);
      this.formData.controls['dien'].setValue(selectedRecord.dien);
      this.formData.controls['than'].setValue(selectedRecord.than);
      this.formData.controls['DO'].setValue(selectedRecord.DO);
      this.formData.controls['FO'].setValue(selectedRecord.FO);
      this.formData.controls['xang'].setValue(selectedRecord.xang);
      this.formData.controls['LPG'].setValue(selectedRecord.LPG);
      this.formData.controls['_go'].setValue(selectedRecord._go);
      this.formData.controls['nang_luong_quy_doi'].setValue(selectedRecord.nang_luong_quy_doi);
      this.formData.controls['time_id'].setValue(selectedRecord.time_id);
      this.formData.controls['id'].setValue(selectedRecord.id);
      this.formData.controls['ghi_chu'].setValue(selectedRecord.ghi_chu);
    }
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filteredDataSource.filter = filterValue.trim().toLowerCase();
  }

  callService(data) {
    this.energyService.ThemDuLieuNangLuongTrongDiem([data]).subscribe(response => this.successNotify(response), error => this.errorNotify(error));
  }

  prepareRemoveData(data) {
    let datas = data.map(element => new Object({ id: element.id }));
    return datas;
  }

  callRemoveService(IDs: any) {
    this.energyService.XoaDuLieuNangLuongTrongDiem(IDs).subscribe(response => this.successNotify(response), error => this.errorNotify(error));
  }

  uploadExcel(e) {
    // open dialog upload excel file 
    this.openDialog("Năng lượng trọng điểm");
  }

  openDialog(nameSheet) {
    const dialogConfig = new MatDialogConfig();
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
      if (res) {
        const body = this.handleData(res);
        // console.log(body);
        this.energyService.ThemDuLieuNangLuongTrongDiem(body).subscribe(res => this.successNotify(res), err => this.errorNotify(err));
      }

    })
  }

  handleData(time_id) {
    let ls: any[] = [];
    let dataExcel = this.dialogService.getDataTransform();
    for (let i = 1; i < dataExcel.length; i++) {
      let body: any = {};
      body['ten_khach_hang'] = dataExcel[i]['__EMPTY'];
      body['dia_chi'] = dataExcel[i]['__EMPTY_1'];
      body['nganh_nghe'] = dataExcel[i]['__EMPTY_2'];
      body['dien'] = dataExcel[i]['__EMPTY_3'];
      body['than'] = dataExcel[i]['__EMPTY_4'];
      body['DO'] = dataExcel[i]['__EMPTY_5'];
      body['FO'] = dataExcel[i]['__EMPTY_6'];
      body['xang'] = dataExcel[i]['__EMPTY_7'];
      body['LPG'] = dataExcel[i]['__EMPTY_8'];
      body['_go'] = dataExcel[i]['__EMPTY_9'];
      body['nang_luong_quy_doi'] = dataExcel[i]['__EMPTY_10'];
      body['time_id'] = time_id;
      body['ghi_chu'] = dataExcel[i]['__EMPTY_11'];
      ls.push(body)
    }
    return ls;
  }

}