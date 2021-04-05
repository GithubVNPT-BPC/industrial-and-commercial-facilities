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
    "ghi_chu"
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
        this.filteredDataSource.data = [...this.dataSource.data];
      }
      this.paginatorAgain();
    });
  }

  _prepareData( ) {}

  applyFilter(event) {
    if (event.target) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.filteredDataSource.filter = filterValue.trim().toLowerCase();
    } else {
      let filteredData = this.filterArray(this.dataSource.data, this.filterModel);

      if (!filteredData.length) {
        if (this.filterModel)
          this.filteredDataSource.data = [];
        else
          this.filteredDataSource.data = this.dataSource.data;
      }
      else {
        this.filteredDataSource.data = filteredData;
      }

    }
    this._prepareData();
    this.paginatorAgain();
  }

  getLinkDefault() {
    //Constant
    this.LINK_DEFAULT = "/specialized/commecial-management/e-commerce/inform-website";
    this.TITLE_DEFAULT = "Thương mại điện tử - Quản lý thông báo website bán hàng";
    this.TEXT_DEFAULT = "Thương mại điện tử - Quản lý thông báo website bán hàng";
  }

  getFormParams() {
    return {
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
