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
import { FormControl } from "@angular/forms";
import { CommerceManagementService } from "src/app/_services/APIService/commerce-management.service";
import { LoginService } from "src/app/_services/APIService/login.service";

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
    public _login: LoginService
  ) {
    super(injecttor);
  }

  authorize: boolean = true

  ngOnInit() {
    super.ngOnInit()
    this.GetDanhSachWebsiteTMDT();

    if (this._login.userValue.user_role_id == 3  || this._login.userValue.user_role_id == 1) {
      this.authorize = false
    }
  }

  GetDanhSachWebsiteTMDT() {
    this.commerceService.LayDanhSachThongBaoWeb().subscribe((response) => {
      this.filteredDataSource.data = [];
      if (response.data && response.data.length > 0) {
        this.dataSource = new MatTableDataSource<InformWebsiteModel>(response.data);
        this.dataSource.data.map(x => {
          if (x.ten_mien) {
            x.ten_mien = x.ten_mien.includes('http')? x.ten_mien : 'http://' + x.ten_mien;
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
      mst: new FormControl(),
      to_chu_ca_nhan: new FormControl(),
      dia_diem: new FormControl(),
      nguoi_dai_dien: new FormControl(),
      dien_thoai: new FormControl(),
      ten_mien: new FormControl(),
      // ma_so_nganh_nghe: new FormControl(),
      nganh_nghe: new FormControl(),
      san_pham_ban_website: new FormControl(),
      ghi_chu: new FormControl(),
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
    }
  }

  prepareData(data) {
    return [data];
  }

  callService(data) {
    this.commerceService.CapNhatDanhSachThongBaoWeb(data).subscribe(res => {
      this.successNotify(res);
    })
  }

  prepareRemoveData(){
    let datas = this.selection.selected.map(element => new Object({ id: element.id }));
    return datas;
  }

  callRemoveService(data){
    this.commerceService.XoaDanhSachWeb(data).subscribe(res => {
      this.successNotify(res);
    })
  }
}
