import { Component, Injector } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material';
import { New_RuralElectricModel } from 'src/app/_models/APIModel/electric-management.module';
import { EnergyService } from 'src/app/_services/APIService/energy.service';
import { LoginService } from 'src/app/_services/APIService/login.service';
import { BaseComponent } from '../../base.component';

@Component({
  selector: 'rural-electric-management',
  templateUrl: './rural-electric-management.component.html',
  styleUrls: ['/../../special_layout.scss'],
})

export class RuralElectricManagementComponent extends BaseComponent {
  DB_TABLE = 'QLNL_DNT';
  //Constant variable
  public readonly displayedColumns: string[] = ['select', 'index', 'db', 'thoi_gian_chinh_sua_cuoi', 't1', 'cd1', 'tl1', 't2', 'cd2', 'ccd2', 'tl2', 'tieu_chi_41', 'tieu_chi_42', 'tieu_chi_43',
  ];
  public readonly dsplayMergeColumns: string[] = ['merge1', 'merge2', 'merge3', 'merge4', 'merge5', 'merge6'];
  //TS & HTML Variable
  public dataSource: MatTableDataSource<New_RuralElectricModel> = new MatTableDataSource<New_RuralElectricModel>();
  public filteredDataSource: MatTableDataSource<New_RuralElectricModel> = new MatTableDataSource<New_RuralElectricModel>();

  //Only TS Variable
  tongSoHo: number = 0;
  tongSoXa: number = 0;
  tongHoKhongCoDien: number = 0;
  tongHoCoDien: number = 0;
  rate: number = 0;
  isChecked: boolean;

  tieu_chi = {
    0: 'Không Đạt',
    1: 'Đạt'
  }

  constructor(
    private injector: Injector,
    private energyService: EnergyService,
    public _login: LoginService
  ) {
    super(injector);
  }

  authorize: boolean = true;

  ngOnInit() {
    super.ngOnInit();
    this.getDataRuralElectric();

    if (this._login.userValue.user_role_id == 4 || this._login.userValue.user_role_id == 1) {
      this.authorize = false
    }
  }

  getDataRuralElectric() {
    this.energyService.LayDuLieuQuyHoachDienNongThon().subscribe(res => {
      this.dataSource = new MatTableDataSource<New_RuralElectricModel>(res['data']);
      this.filteredDataSource = new MatTableDataSource<New_RuralElectricModel>(res['data']);
      this._prepareData();
      this.paginatorAgain();
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filteredDataSource.filter = filterValue.trim().toLowerCase();
  }

  _prepareData() {
    // FIX: Hardcode to get the total value
    let data = this.dataSource.data.filter(x => x.dia_ban == 'Tổng cộng');
    this.tongSoHo = data.length ? data[0].tong_so_ho : 0;
    this.tongHoCoDien = data.length ? data[0].tong_so_ho_co_dien : 0;
    this.rate = this.tongSoHo ? (this.tongHoCoDien * 100 / this.tongSoHo) : 0;
    this.tongSoXa = this.filteredDataSource.data.filter(x => x.nong_thon_tong_so_ho != null).length;

    // this.tongSoHo = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => x.nong_thon_tong_so_ho).reduce((a, b) => a + b) : 0;

    // this.tongHoKhongCoDien = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => x.ccd2).reduce((a, b) => a + b) : 0;
    // this.tongHoCoDien = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => x.nong_thon_tong_so_ho_co_dien).reduce((a, b) => a + b) : 0;
  }

  applyActionCheck(event) {
    this.filteredDataSource.filter = (event.checked) ? "true" : "";
    this._prepareData();
    this.paginatorAgain();
  }

  getLinkDefault() {
    this.LINK_DEFAULT = "/specialized/enery-management/rural_electricity";
    this.TITLE_DEFAULT = "Quy hoạch phát triển lưới điện - Điện nông thôn";
    this.TEXT_DEFAULT = "Quy hoạch phát triển lưới điện - Điện nông thôn";
  }

  getFormParams() {
    return {
      id: new FormControl(),
      dia_ban: new FormControl(''),
      is_cap_huyen: new FormControl(1),
      tong_so_ho: new FormControl(0),
      tong_so_ho_co_dien: new FormControl(0),
      nong_thon_tong_so_ho: new FormControl(0),
      nong_thon_tong_so_ho_co_dien: new FormControl(0),
      tieu_chi_41: new FormControl(),
      tieu_chi_42: new FormControl(),
      tieu_chi_43: new FormControl()
    }
  }
  setFormParams() {
    if (this.selection.selected.length) {
      let selectedRecord = this.selection.selected[0];
      this.formData.controls['dia_ban'].setValue(selectedRecord.dia_ban);
      this.formData.controls['is_cap_huyen'].setValue(selectedRecord.is_cap_huyen);
      this.formData.controls['tong_so_ho'].setValue(selectedRecord.tong_so_ho);
      this.formData.controls['tong_so_ho_co_dien'].setValue(selectedRecord.tong_so_ho_co_dien);
      this.formData.controls['nong_thon_tong_so_ho'].setValue(selectedRecord.nong_thon_tong_so_ho);
      this.formData.controls['nong_thon_tong_so_ho_co_dien'].setValue(selectedRecord.nong_thon_tong_so_ho_co_dien);
      this.formData.controls['tieu_chi_41'].setValue(Number(selectedRecord.tieu_chi_41).toString());
      this.formData.controls['tieu_chi_42'].setValue(Number(selectedRecord.tieu_chi_42).toString());
      this.formData.controls['tieu_chi_43'].setValue(Number(selectedRecord.tieu_chi_43).toString());
      this.formData.controls['id'].setValue(selectedRecord.id);
    }
  }

  public prepareData(data) {
    data['tong_so_ho'] = Number(data['tong_so_ho']);
    data['tong_so_ho_co_dien'] = Number(data['tong_so_ho_co_dien']);
    data['nong_thon_tong_so_ho'] = Number(data['nong_thon_tong_so_ho']);
    data['nong_thon_tong_so_ho_co_dien'] = Number(data['nong_thon_tong_so_ho_co_dien']);
    data['tieu_chi_41'] = Number(data['tieu_chi_41']);
    data['tieu_chi_42'] = Number(data['tieu_chi_42']);
    data['tieu_chi_43'] = Number(data['tieu_chi_43']);
    return data;
  }

  prepareRemoveData(data) {
    let datas = data.map(element => new Object({ id: element.id }));
    return datas;
  }

  callService(data) {
    this.energyService.CapNhatDuLieuQuyHoachDienNongThon([data]).subscribe(res => {
      this.successNotify(res);
    })
  }

  callRemoveService(data) {
    this.energyService.DeleteRuralElectric(data).subscribe(response => this.successNotify(response), error => this.errorNotify(error));
  }


}