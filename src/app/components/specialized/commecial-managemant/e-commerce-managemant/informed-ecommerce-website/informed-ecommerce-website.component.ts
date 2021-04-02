import {
  Component,
  ViewChild,
  ElementRef,
  Injector,
} from "@angular/core";
import {
  MatOption,
  MatSelect,
  MatTableDataSource,
} from "@angular/material";
import {
  ECommerceWebsiteFilterModel,
  InformWebsiteModel,
} from "src/app/_models/APIModel/e-commerce.model";
import { District } from "src/app/_models/district.model";
import { ExcelService } from "src/app/_services/excelUtil.service";
import { BaseComponent } from "../../../base.component";
import { FormControl } from "@angular/forms";
import { CommerceManagementService } from "src/app/_services/APIService/commerce-management.service";
import { LoginService } from "src/app/_services/APIService/login.service";
import { subscribeOn } from "rxjs/operators";

@Component({
  selector: "app-informed-ecommerce-website",
  templateUrl: "./informed-ecommerce-website.component.html",
  styleUrls: ["../../../special_layout.scss"],
})
export class InformedEcommerceWebsiteComponent extends BaseComponent {

  @ViewChild("TABLE", { static: false }) table: ElementRef;

  ExportTOExcel(filename: string, sheetname: string) {
    this.excelService.exportDomTableAsExcelFile(
      filename,
      sheetname,
      this.table.nativeElement
    );
  }

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
  filterModel: ECommerceWebsiteFilterModel = { id_quan_huyen: [] };
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
    // this.autoOpen();
    // this.sendLinkToNext(true);
    this.autopaging();
    if (this._login.userValue.user_role_id == 3  || this._login.userValue.user_role_id == 1) {
      this.authorize = false
    }
  }

  applyFilter1(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filteredDataSource.filter = filterValue.trim().toLowerCase();
  }

  districts: District[] = [

  ];

  GetDanhSachWebsiteTMDT() {
    this.commerceService.LayDanhSachThongBaoWeb().subscribe((response) => {
      this.dataSource = new MatTableDataSource<InformWebsiteModel>(response.data);
      this.filteredDataSource.data = [...this.dataSource.data];
    });
  }

  applyFilter() {
    let filteredData = this.filterArray(this.dataSource.data, this.filterModel);
    if (!filteredData.length) {
      if (this.filterModel) this.filteredDataSource.data = [];
      else this.filteredDataSource.data = this.dataSource.data;
    } else {
      this.filteredDataSource.data = filteredData;
    }
  }

  autoOpen() {
    setTimeout(() => this.accordion.openAll(), 1000);
  }

  filterArray(array, filters) {
    const filterKeys = Object.keys(filters);
    let temp = [...array];
    filterKeys.forEach((key) => {
      let temp2 = [];
      if (filters[key].length) {
        filters[key].forEach((criteria) => {
          temp2 = temp2.concat(temp.filter((x) => x[key] == criteria));
        });
        temp = [...temp2];
      }
    });
    return temp;
  }

  @ViewChild("dSelect", { static: false }) dSelect: MatSelect;
  allSelected = false;
  toggleAllSelection() {
    this.allSelected = !this.allSelected; // to control select-unselect

    if (this.allSelected) {
      this.dSelect.options.forEach((item: MatOption) => item.select());
    } else {
      this.dSelect.options.forEach((item: MatOption) => item.deselect());
    }
    this.dSelect.close();
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
