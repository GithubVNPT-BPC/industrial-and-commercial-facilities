import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTable, MatAccordion, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { multilevel } from 'src/app/_models/APIModel/mutillevel.model';
import { District } from 'src/app/_models/district.model';

// Services
import { SCTService } from 'src/app/_services/APIService/sct.service';
import { MarketService } from 'src/app/_services/APIService/market.service';
import { BreadCrumService } from 'src/app/_services/injectable-service/breadcrums.service';
import { ExcelService } from 'src/app/_services/excelUtil.service';

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

  // displayedSumColumns: any[] = ['tong', 'tong_luong_thang', 'tong_gia_tri_thang', 'tong_luong_cong_don', 'tong_gia_tri_cong_don']
  displayedColumns: string[] = ['index', 'ten_doanh_nghiep', 'dia_chi', 'mst', 'vb_xac_nhan_dp', 'co_quan_bh_dp', 'ngay_thang_dp',
    'vb_xac_nhan_tc', 'co_quan_bh_tc', 'ngay_thang_tc', 'tg_hoi_thao', 'dia_diem_hoi_thao']
  dataSource: MatTableDataSource<multilevel> = new MatTableDataSource<multilevel>();
  dataDialog: any[] = [];
  filteredDataSource: MatTableDataSource<multilevel> = new MatTableDataSource<multilevel>();
  years: number[] = [];
  months: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  isChecked: boolean;
  curentmonth: number = new Date().getMonth() + 1;
  @ViewChild('table', { static: false }) table: ElementRef;
  @ViewChild(MatAccordion, { static: true }) accordion: MatAccordion;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  nhap_khau_chu_yeu = [1, 13, 34, 33, 22, 19, 31, 18, 28, 4, 27, 17, 30, 37, 25, 7, 23];
  pagesize: number = 10;

  constructor(
    public sctService: SCTService,
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
    this.numberCompanyHoldReference = this.dataSource.data.filter(item => item.vb_xac_nhan_tc).length
  }

  ngOnInit() {
    // this.years = this.getYears();
    this.getDanhSachBHDaCap(this.curentmonth);
    this.autoOpen();
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
    setTimeout(() => this.accordion.openAll(), 1000)
  }

  // getTotalCost() {
  //   return this.dataSource.data.map(t => t.cost).reduce((acc, value) => acc + value, 0);
  // }

  getDanhSachBHDaCap(thang) {
    let tem = new Date().getFullYear() * 100 + thang;
    this.sctService.GetDanhSachBHDaCap().subscribe(result => {
      this.dataSource = new MatTableDataSource<multilevel>(result.data);
      this.log(this.dataSource)
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.conferrenceCompany();
    });
  }


  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }


  log(any) {
    console.log(any);
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
    // console.log(event);
    // let tem_data = [...this.dataSource.data]
    // event.checked ? this.dataSource.data = tem_data.filter(item => this.nhap_khau_chu_yeu.includes(item.id_mat_hang)) : this.dataSource.data = this.filteredDataSource.data;
  }

  openDialog(id_mat_hang) {

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
