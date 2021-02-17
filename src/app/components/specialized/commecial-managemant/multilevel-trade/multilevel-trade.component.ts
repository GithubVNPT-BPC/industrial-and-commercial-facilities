import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTable, MatAccordion, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { MultiLevelTradeModel } from 'src/app/_models/APIModel/mutillevel-trade.model';

// Services
import { SCTService } from 'src/app/_services/APIService/sct.service';
import { MarketService } from 'src/app/_services/APIService/market.service';
import { BreadCrumService } from 'src/app/_services/injectable-service/breadcrums.service';
import { ExcelService } from 'src/app/_services/excelUtil.service';
import { CommerceManagementService } from 'src/app/_services/APIService/commerce-management.service';

import { LinkModel } from 'src/app/_models/link.model';

@Component({
  selector: 'app-multilevel-trade',
  templateUrl: './multilevel-trade.component.html',
  styleUrls: ['/../../special_layout.scss'],
})
export class MultilevelTradeComponent implements OnInit {
  //Constant
  private readonly LINK_DEFAULT: string = "/specialized/commecial-management/multilevel_trade";
  private readonly TITLE_DEFAULT: string = "Hoạt động bán hàng đa cấp";
  private readonly TEXT_DEFAULT: string = "Hoạt động bán hàng đa cấp";
  //Variable for only ts
  private _linkOutput: LinkModel = new LinkModel();

  displayedColumns: string[] = ['index', 'ten_doanh_nghiep', 'dia_chi_doanh_nghiep', 'mst', 'so_giay_dkbhdc', 'co_quan_ban_hanh_giay_dkbhdc', 'ngay_dang_ky_giay_dkbhdc',
    'so_giay_tchtbhdc', 'co_quan_ban_hanh_giay_tchtbhdc', 'ngay_dang_ky_giay_tchtbhdc', 'thoi_gian_bat_dau', 'thoi_gian_ket_thuc', 'dia_diem_to_chuc']
  dataSource: MatTableDataSource<MultiLevelTradeModel> = new MatTableDataSource<MultiLevelTradeModel>();
  dataDialog: any[] = [];
  filteredDataSource: MatTableDataSource<MultiLevelTradeModel> = new MatTableDataSource<MultiLevelTradeModel>();
  years: number[] = [];
  months: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  nhap_khau_chu_yeu = [1, 13, 34, 33, 22, 19, 31, 18, 28, 4, 27, 17, 30, 37, 25, 7, 23];
  pagesize: number = 10;
  isChecked: boolean;
  curentmonth: number = new Date().getMonth() + 1;
  public errorMessage: any;

  @ViewChild('table', { static: false }) table: ElementRef;
  @ViewChild(MatAccordion, { static: true }) accordion: MatAccordion;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  
  constructor(
    public commerceManagementService: CommerceManagementService,
    public matDialog: MatDialog,
    public marketService: MarketService,
    private _breadCrumService: BreadCrumService,
    public excelService: ExcelService,
  ) {
  }

  numberCompanyHoldReference:number = 0;

  initVariable() {

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
    this.getMultiLevelTradeList();
    // this.autoOpen();
    // this.filteredDataSource.filterPredicate = function (data: multilevel, filter): boolean {
    //     return String(data.is_het_han).includes(filter);
    // };
    // this.sendLinkToNext(true);
  }

  public sendLinkToNext(type: boolean) {
    this._linkOutput.link = this.LINK_DEFAULT;
    this._linkOutput.title = this.TITLE_DEFAULT;
    this._linkOutput.text = this.TEXT_DEFAULT;
    this._linkOutput.type = type;
    this._breadCrumService.sendLink(this._linkOutput);
  }

  autoOpen() {
    setTimeout(() => this.accordion.openAll(), 1000)
  }

  // getTotalCost() {
  //   return this.dataSource.data.map(t => t.cost).reduce((acc, value) => acc + value, 0);
  // }

  public getMultiLevelTradeList() {
    this.commerceManagementService.getMultiLevelTradeData().subscribe(
      allrecords => {
        if (allrecords.data && allrecords.data.length > 0) {
          this.dataSource = new MatTableDataSource<MultiLevelTradeModel>(allrecords.data);
          this.dataSource.paginator = this.paginator;
          this.paginator._intl.itemsPerPageLabel = "Số hàng";
          this.paginator._intl.firstPageLabel = "Trang Đầu";
          this.paginator._intl.lastPageLabel = "Trang Cuối";
          this.paginator._intl.previousPageLabel = "Trang Trước";
          this.paginator._intl.nextPageLabel = "Trang Tiếp";
        }
      },
      error => this.errorMessage = <any>error
    );
  }


  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getYears() {
    return Array(5).fill(1).map((element, index) => new Date().getFullYear() - index);
  }

  applyDistrictFilter(event) {
  }

  // isHidden(row : any){
  //     return (this.isChecked)? (row.is_het_han) : false;
  // }

  applyExpireCheck(event) {
    // let tem_data = [...this.dataSource.data]
    // event.checked ? this.dataSource.data = tem_data.filter(item => this.nhap_khau_chu_yeu.includes(item.id_mat_hang)) : this.dataSource.data = this.filteredDataSource.data;
  }

  handelDataDialog(id_mat_hang) {
    let data = this.dataDialog.filter(item => item.id_mat_hang === id_mat_hang);
    return data;
  }

  openDanh_sach_doanh_nghiep(id_mat_hang, ten_san_pham) {

  }

  public ExportTOExcel(filename: string, sheetname: string) {
    this.excelService.exportDomTableAsExcelFile(filename, sheetname, this.table.nativeElement);
  }
}
