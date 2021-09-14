import {
  Component,
  Injector,
} from "@angular/core";
import {
  MatTableDataSource,
} from "@angular/material";
import { InformWebsiteModel } from "src/app/_models/APIModel/e-commerce.model";
import { ExcelService } from "src/app/_services/excelUtil.service";
import { BaseComponent } from "../../../base.component";
import { CommerceManagementService } from "src/app/_services/APIService/commerce-management.service";
import { LoginService } from "src/app/_services/APIService/login.service";
import { MarketService } from "src/app/_services/APIService/market.service";
import {
  SubDistrictModel,
} from "src/app/_models/APIModel/domestic-market.model";

import { FormControl, Validators } from '@angular/forms';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

@Component({
  selector: "app-informed-ecommerce-website",
  templateUrl: "./informed-ecommerce-website.component.html",
  styleUrls: ["../../../special_layout.scss"],
})
export class InformedEcommerceWebsiteComponent extends BaseComponent {
  DB_TABLE = 'QLTM_TMDT_website'
  displayedColumns: string[] = [
    "select",
    "index",
    "mst",
    "ten_doanh_nghiep",
    "nguoi_dai_dien",
    "dia_chi",
    "dien_thoai",
    "ten_mien",
    "nganh_nghe",
    // "ma_nganh_nghe",
    "san_pham_tren_website",
    "ghi_chu",
    "thoi_gian_chinh_sua_cuoi"
  ];

  dataSource: MatTableDataSource<InformWebsiteModel>;
  filteredDataSource: MatTableDataSource<InformWebsiteModel> = new MatTableDataSource<InformWebsiteModel>();
  filterModel = { id_quan_huyen: [] };
  constructor(
    public excelService: ExcelService,
    public commerceService: CommerceManagementService,
    private injecttor: Injector,
    public _login: LoginService,
    public _Service: MarketService,
  ) {
    super(injecttor);
  }

  authorize: boolean = true

  ngOnInit() {
    super.ngOnInit()
    this.GetDanhSachWebsiteTMDT();
    this.GetAllPhuongXa();

    if (this._login.userValue.user_role_id == 3 || this._login.userValue.user_role_id == 1) {
      this.authorize = false
    }

    this.phuongxafilter.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterPhuongxa();
      });
  }

  public _onDestroy = new Subject<void>();

  GetDanhSachWebsiteTMDT() {
    this.commerceService.LayDanhSachThongBaoWeb().subscribe((response) => {
      this.filteredDataSource.data = [];
      if (response.data && response.data.length > 0) {
        this.dataSource = new MatTableDataSource<InformWebsiteModel>(response.data);
        this.dataSource.data.map(x => {
          if (x.ten_mien) {
            x.ten_mien = x.ten_mien.includes('http') ? x.ten_mien : 'http://' + x.ten_mien;
          }
        });
        this.filteredDataSource.data = [...this.dataSource.data];
      }
      this._prepareData();
      this.paginatorAgain();
    });
  }

  getLinkDefault() {
    //Constant
    this.LINK_DEFAULT = "/specialized/commecial-management/e-commerce/inform-website";
    this.TITLE_DEFAULT = "Thương mại điện tử - Quản lý thông báo website bán hàng";
    this.TEXT_DEFAULT = "Thương mại điện tử - Quản lý thông báo website bán hàng";
  }

  getFormParams() {
    return {
      id: new FormControl(),
      mst: new FormControl('', Validators.required),
      to_chu_ca_nhan: new FormControl('', Validators.required),
      dia_diem: new FormControl(),
      nguoi_dai_dien: new FormControl(),
      dien_thoai: new FormControl(),
      ten_mien: new FormControl(),
      // ma_so_nganh_nghe: new FormControl(),
      nganh_nghe: new FormControl(),
      san_pham_ban_website: new FormControl(),
      ghi_chu: new FormControl(),
      id_phuong_xa: new FormControl('', Validators.required),
    }
  }

  setFormParams() {
    if (this.selection.selected.length) {
      let selectedRecord = this.selection.selected[0];
      this.formData.controls['id'].setValue(selectedRecord.id);
      this.formData.controls['mst'].setValue(selectedRecord.mst);
      this.formData.controls['to_chu_ca_nhan'].setValue(selectedRecord.to_chu_ca_nhan);
      this.formData.controls['nguoi_dai_dien'].setValue(selectedRecord.nguoi_dai_dien);
      this.formData.controls['dien_thoai'].setValue(selectedRecord.dien_thoai);
      this.formData.controls['ten_mien'].setValue(selectedRecord.ten_mien);
      this.formData.controls['nganh_nghe'].setValue(selectedRecord.nganh_nghe);
      this.formData.controls['san_pham_ban_website'].setValue(selectedRecord.san_pham_ban_website);
      this.formData.controls['ghi_chu'].setValue(selectedRecord.ghi_chu);
      this.formData.controls['dia_diem'].setValue(selectedRecord.dia_diem);
      this.formData.controls['id_phuong_xa'].setValue(selectedRecord.id_phuong_xa);
    }
  }

  public subdistrict: Array<SubDistrictModel> = new Array<SubDistrictModel>();
  public filtersubdistrict: ReplaySubject<SubDistrictModel[]> = new ReplaySubject<SubDistrictModel[]>(1);
  GetAllPhuongXa() {
    this._Service.GetAllSubDistrict().subscribe((allrecords) => {
      this.subdistrict = allrecords.data as SubDistrictModel[];
      this.filtersubdistrict.next(this.subdistrict.slice());
      console.log(this.filtersubdistrict)
    });
  }
  public phuongxafilter: FormControl = new FormControl();
  public filterPhuongxa() {
    if (!this.subdistrict) {
      return;
    }
    let search = this.phuongxafilter.value;
    if (!search) {
      this.filtersubdistrict.next(this.subdistrict.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filtersubdistrict.next(
      this.subdistrict.filter(x => x.ten_phuong_xa.toLowerCase().indexOf(search) > -1)
    );
  }

  prepareData(data) {
    return [data];
  }

  callService(data) {
    this.commerceService.CapNhatDanhSachThongBaoWeb(data).subscribe(res => {
      this.successNotify(res);
    })
  }

  prepareRemoveData() {
    let datas = this.selection.selected.map(element => new Object({ id: element.id }));
    return datas;
  }

  callRemoveService(data) {
    this.commerceService.XoaDanhSachWeb(data).subscribe(res => {
      this.successNotify(res);
    })
  }
}
