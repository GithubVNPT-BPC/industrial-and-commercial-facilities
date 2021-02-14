import {
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
  ElementRef,
} from "@angular/core";
import {
  MatDialog,
  MatDialogConfig,
  MatOption,
  MatSelect,
  MatTableDataSource,
} from "@angular/material";
import {
  ECommerceWebsite,
  ECommerceWebsiteFilterModel,
} from "src/app/_models/APIModel/e-commerce.model";
import { District } from "src/app/_models/district.model";
import { SCTService } from "src/app/_services/APIService/sct.service";
import { notification_management } from "../../../../../_models/APIModel/ecommerce.model";
import { MatAccordion } from "@angular/material/expansion";
import { MatPaginator } from "@angular/material/paginator";
import { LinkModel } from "src/app/_models/link.model";
import { BreadCrumService } from "src/app/_services/injectable-service/breadcrums.service";
import { ExcelService } from "src/app/_services/excelUtil.service";
import { DialogECommerceComponent } from "../dialog-e-commerce/dialog-e-commerce.component";

@Component({
  selector: "app-informed-ecommerce-website",
  templateUrl: "./informed-ecommerce-website.component.html",
  styleUrls: ["../../../special_layout.scss"],
})
export class InformedEcommerceWebsiteComponent implements OnInit {
  //Constant
  private readonly LINK_DEFAULT: string =
    "/specialized/commecial-management/e-commerce/ecommerce-website";
  private readonly TITLE_DEFAULT: string =
    "Quản lý đăng ký website cung cấp dịch vụ TMĐT";
  private readonly TEXT_DEFAULT: string =
    "Quản lý đăng ký website cung cấp dịch vụ TMĐT";
  //Variable for only ts
  private _linkOutput: LinkModel = new LinkModel();
  @ViewChild(MatAccordion, { static: true }) accordion: MatAccordion;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild("TABLE", { static: false }) table: ElementRef;

  ExportTOExcel(filename: string, sheetname: string) {
    this.excelService.exportDomTableAsExcelFile(
      filename,
      sheetname,
      this.table.nativeElement
    );
  }

  displayedColumns: string[] = [
    "index",
    "ten_doanh_nghiep",
    "mst",
    "dia_chi",
    "dien_thoai",
    "ten_mien",
    "loai_hhdv",
    "email",
    "so_gian_hang",
  ];
  dataSource: MatTableDataSource<ECommerceWebsite>;
  filteredDataSource: MatTableDataSource<ECommerceWebsite> = new MatTableDataSource<ECommerceWebsite>();
  filterModel: ECommerceWebsiteFilterModel = { id_quan_huyen: [] };
  constructor(
    public excelService: ExcelService,
    public sctService: SCTService,
    private _breadCrumService: BreadCrumService,
    public matDialog: MatDialog
  ) {}

  ngOnInit() {
    this.GetDanhSachWebsiteTMDT();
    this.autoOpen();
    this.sendLinkToNext(true);
  }

  public sendLinkToNext(type: boolean) {
    this._linkOutput.link = this.LINK_DEFAULT;
    this._linkOutput.title = this.TITLE_DEFAULT;
    this._linkOutput.text = this.TEXT_DEFAULT;
    this._linkOutput.type = type;
    this._breadCrumService.sendLink(this._linkOutput);
  }

  applyFilter1(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filteredDataSource.filter = filterValue.trim().toLowerCase();
  }

  districts: District[] = [
    { id: 1, ten_quan_huyen: "Thị xã Phước Long" },
    { id: 2, ten_quan_huyen: "Thành phố Đồng Xoài" },
    { id: 3, ten_quan_huyen: "Thị xã Bình Long" },
    { id: 4, ten_quan_huyen: "Huyện Bù Gia Mập" },
    { id: 5, ten_quan_huyen: "Huyện Lộc Ninh" },
    { id: 6, ten_quan_huyen: "Huyện Bù Đốp" },
    { id: 7, ten_quan_huyen: "Huyện Hớn Quản" },
    { id: 8, ten_quan_huyen: "Huyện Đồng Phú" },
    { id: 9, ten_quan_huyen: "Huyện Bù Đăng" },
    { id: 10, ten_quan_huyen: "Huyện Chơn Thành" },
    { id: 11, ten_quan_huyen: "Huyện Phú Riềng" },
  ];

  GetDanhSachWebsiteTMDT() {
    this.sctService.GetDanhSachWebTMDT().subscribe((response) => {
      this.dataSource = new MatTableDataSource<ECommerceWebsite>(response.data);
      this.filteredDataSource.data = [...this.dataSource.data];
      // this.filteredDataSource.data = this.filteredDataSource.data.concat(this.filteredDataSource.data);
      // this.filteredDataSource.data = this.filteredDataSource.data.concat(this.filteredDataSource.data);
      // this.filteredDataSource.data = this.filteredDataSource.data.concat(this.filteredDataSource.data);
      this.filteredDataSource.paginator = this.paginator;
      this.paginator._intl.itemsPerPageLabel = "Số hàng";
      this.paginator._intl.firstPageLabel = "Trang Đầu";
      this.paginator._intl.lastPageLabel = "Trang Cuối";
      this.paginator._intl.previousPageLabel = "Trang Trước";
      this.paginator._intl.nextPageLabel = "Trang Tiếp";
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

  public ImportTOExcel() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      saleWebsite: false,
    };
    // dialogConfig.minWidth = window.innerWidth - 100;
    // dialogConfig.minHeight = window.innerHeight - 300;
    this.matDialog.open(DialogECommerceComponent, dialogConfig);
  }
}
