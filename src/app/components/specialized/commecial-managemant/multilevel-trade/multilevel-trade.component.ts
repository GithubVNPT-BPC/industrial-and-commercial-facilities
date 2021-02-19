import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTable, MatAccordion, MatPaginator, MatSort } from '@angular/material';
import { MultiLevelTradeModel } from 'src/app/_models/APIModel/mutillevel-trade.model';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

// Services
import { SCTService } from 'src/app/_services/APIService/sct.service';
import { MarketService } from 'src/app/_services/APIService/market.service';
import { BreadCrumService } from 'src/app/_services/injectable-service/breadcrums.service';
import { ExcelService } from 'src/app/_services/excelUtil.service';
import { CommerceManagementService } from 'src/app/_services/APIService/commerce-management.service';
import { InformationService } from 'src/app/shared/information/information.service';

import { LinkModel } from 'src/app/_models/link.model';
import moment from 'moment';

@Component({
  selector: 'app-multilevel-trade',
  templateUrl: './multilevel-trade.component.html',
  styleUrls: ['/../../special_layout.scss'],
})
export class MultilevelTradeComponent implements OnInit {
  //Constant
  private readonly LINK_DEFAULT: string = "/specialized/commecial-management/multilevel-trade";
  private readonly TITLE_DEFAULT: string = "Hoạt động bán hàng đa cấp";
  private readonly TEXT_DEFAULT: string = "Hoạt động bán hàng đa cấp";
  //Variable for only ts
  private _linkOutput: LinkModel = new LinkModel();

  displayedColumns: string[] = ['index', 'ten_doanh_nghiep', 'dia_chi_doanh_nghiep', 'mst','thoi_gian_bat_dau', 'thoi_gian_ket_thuc', 'dia_diem_to_chuc',
    'so_giay_dkbhdc', 'co_quan_ban_hanh_giay_dkbhdc', 'ngay_dang_ky_giay_dkbhdc',
    'so_giay_tchtbhdc', 'co_quan_ban_hanh_giay_tchtbhdc', 'ngay_dang_ky_giay_tchtbhdc']
  
  formData = this.formBuilder.group({
    ten_doanh_nghiep: new FormControl(),
    dia_chi_doanh_nghiep: new FormControl(),
    mst: new FormControl(),
    so_giay_dkbhdc: new FormControl(),
    co_quan_ban_hanh_giay_dkbhdc: new FormControl(),
    ngay_dang_ky_giay_dkbhdc: new FormControl(),
    so_giay_tchtbhdc: new FormControl(),
    co_quan_ban_hanh_giay_tchtbhdc: new FormControl(),
    ngay_dang_ky_giay_tchtbhdc: new FormControl(),
    thoi_gian_bat_dau: new FormControl(),
    thoi_gian_ket_thuc: new FormControl(),
    dia_diem_to_chuc: new FormControl(),
  });

  dataSource: MatTableDataSource<MultiLevelTradeModel> = new MatTableDataSource<MultiLevelTradeModel>();
  dataDialog: any[] = [];
  filteredDataSource: MatTableDataSource<MultiLevelTradeModel> = new MatTableDataSource<MultiLevelTradeModel>();
  years: number[] = [];
  months: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  nhap_khau_chu_yeu = [1, 13, 34, 33, 22, 19, 31, 18, 28, 4, 27, 17, 30, 37, 25, 7, 23];
  pagesize: number = 10;
  isChecked: boolean;
  curentmonth: number = new Date().getMonth() + 1;
  numberCompanyHoldReference:number = 0;

  public errorMessage: any;
  private view = 'list';

  @ViewChild('table', { static: false }) table: ElementRef;
  @ViewChild(MatAccordion, { static: false }) accordion: MatAccordion;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  
  constructor(
    public commerceManagementService: CommerceManagementService,
    public _infor: InformationService,
    public marketService: MarketService,
    public excelService: ExcelService,
    private _breadCrumService: BreadCrumService,
    private formBuilder: FormBuilder,
    
  ) {
  }

  kiem_tra(id_mat_hang) {
    if (this.nhap_khau_chu_yeu.includes(id_mat_hang))
      return true
    return false;
  }

  conferrenceCompany(){
    // TODO: Need to check the element 'so_giay_dkbhdc'
    this.numberCompanyHoldReference = this.dataSource.data.filter(item => item.so_giay_dkbhdc).length
  }

  ngOnInit() {
    this.autoOpen();
    this.getMultiLevelTradeList();
    // this.filteredDataSource.filterPredicate = function (data: multilevel, filter): boolean {
    //     return String(data.is_het_han).includes(filter);
    // };
    this.sendLinkToNext(true);
  }

  public sendLinkToNext(type: boolean) {
    this._linkOutput.link = this.LINK_DEFAULT;
    this._linkOutput.title = this.TITLE_DEFAULT;
    this._linkOutput.text = this.TEXT_DEFAULT;
    this._linkOutput.type = type;
    this._breadCrumService.sendLink(this._linkOutput);
  }

  autoOpen() {
    setTimeout(() => this.accordion.openAll(), 1000);
  }

  // getTotalCost() {
  //   return this.dataSource.data.map(t => t.cost).reduce((acc, value) => acc + value, 0);
  // }

  public getMultiLevelTradeList() {
    this.commerceManagementService.getMultiLevelTradeData().subscribe(
      allrecords => {
        if (allrecords.data && allrecords.data.length > 0) {
          this.dataSource = new MatTableDataSource<MultiLevelTradeModel>(allrecords.data);
          this.filteredDataSource = new MatTableDataSource<MultiLevelTradeModel>(allrecords.data);
          this.filteredDataSource.paginator = this.paginator;
          // this.paginator._intl.itemsPerPageLabel = "Số hàng";
          // this.paginator._intl.firstPageLabel = "Trang Đầu";
          // this.paginator._intl.lastPageLabel = "Trang Cuối";
          // this.paginator._intl.previousPageLabel = "Trang Trước";
          // this.paginator._intl.nextPageLabel = "Trang Tiếp";
        }
      },
      error => this.errorMessage = <any>error
    );
  }

  applyFilter(event: Event) {
    let filterValue = (event.target as HTMLInputElement).value;
    this.filteredDataSource.filter = filterValue.trim().toLowerCase();
  }

  getYears() {
    return Array(5).fill(1).map((element, index) => new Date().getFullYear() - index);
  }

  handelDataDialog(id_mat_hang) {
    let data = this.dataDialog.filter(item => item.id_mat_hang === id_mat_hang);
    return data;
  }

  private switchView() {
    this.view = this.view == 'list' ? 'form': 'list';
  }

  public onCreate(): void {
    // TODO: Check 'id_phuong_xa'
    let data = this.formData.value;
    data['thoi_gian_bat_dau'] = moment(data['thoi_gian_bat_dau']).format('DD/MM/yyyy');
    data['thoi_gian_ket_thuc'] = moment(data['thoi_gian_ket_thuc']).format('DD/MM/yyyy');
    data['ngay_dang_ky_giay_dkbhdc'] = moment(data['ngay_dang_ky_giay_dkbhdc']).format('DD/MM/yyyy');
    data['ngay_dang_ky_giay_tchtbhdc'] = moment(data['ngay_dang_ky_giay_tchtbhdc']).format('DD/MM/yyyy');

    data = {...data, ...{
      id_trang_thai: 1,
    }};
    this.commerceManagementService.postMultiLevelTradeData([data]).subscribe(
      next => {
        if (next.id == -1) {
          this._infor.msgError("Lưu lỗi! Lý do: " + next.message);
        }
        else {
          this._infor.msgSuccess("Dữ liệu được lưu thành công!");
          this.reset2Default();
        }
      },
      error => {
        this._infor.msgError("Không thể thực thi! Lý do: " + error.message);
      }
    );
  }

  private clearTable(event) {
    event.preventDefault();
    this.formData.reset();
  }

  public ExportTOExcel(filename: string, sheetname: string) {
    this.excelService.exportDomTableAsExcelFile(filename, sheetname, this.table.nativeElement);
  }

  public reset2Default(): void {
    this.formData.reset();
    this.switchView();
    this.autoOpen();
  }
}
