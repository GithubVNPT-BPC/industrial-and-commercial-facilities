//Import Library
import { Component, ViewChild, ElementRef, OnInit, AfterViewInit, ViewChildren, QueryList } from '@angular/core';
import * as XLSX from 'xlsx';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl, NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map, isEmpty } from 'rxjs/operators';
import { MatTableFilter } from 'mat-table-filter';
//Import Component

//Import Model
import { HeaderMerge, ReportAttribute, ReportDatarow, ReportIndicator, ReportOject, ReportTable, ToltalHeaderMerge } from '../../../../../_models/APIModel/report.model';
//Import Service
import { ControlService } from '../../../../../_services/APIService/control.service';
import { ReportDirective } from 'src/app/shared/report.directive';
import { KeyboardService } from 'src/app/shared/services/keyboard.service';
import { InformationService } from 'src/app/shared/information/information.service';
import { ReportService } from 'src/app/_services/APIService/report.service';
import { ExcelService } from 'src/app/_services/excelUtil.service';

import * as moment from 'moment';
import { CompanyDetailModel } from 'src/app/_models/APIModel/domestic-market.model';
import { TreeviewConfig, TreeviewItem, TreeviewModule } from 'ngx-treeview';
import { element } from 'protractor';
import { FoodCommonModel, FoodFilterModel, MarketCommonModel, StoreCommonModel, SuperMarketCommonModel } from 'src/app/_models/APIModel/commecial-management.model';
import { Data } from 'src/app/components/data-sct/data-sct-type';
import { Time } from 'highcharts';
import { MatAccordion } from '@angular/material/expansion';
import { MatPaginator } from '@angular/material/paginator';
import { District } from 'src/app/_models/district.model';

interface HashTableNumber<T> {
  [key: string]: T;
}

@Component({
  selector: 'app-food-commecial',
  templateUrl: './food-commecial.component.html',
  styleUrls: ['../../../special_layout.scss'],
})

export class FoodManagementComponent implements OnInit {
  //Constant-------------------------------------------------------------------------

  //Viewchild & Input-----------------------------------------------------------------------
  @ViewChildren(ReportDirective) inputs: QueryList<ReportDirective>
  @ViewChild(MatAccordion, { static: false }) accordion: MatAccordion;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild('TABLE', { static: false }) table: ElementRef;

  exportExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table.nativeElement);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'HTTM - Thực phẩm');

    XLSX.writeFile(wb, 'HTTM - Thực phẩm.xlsx');

  }

  applyFilter1(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceHuyenThi.filter = filterValue.trim().toLowerCase();
  }
  //Variable for HTML&TS-------------------------------------------------------------------------
  displayedColumns = ['index', 'tendoanhnghiep', 'diachi', 'scndkkd', 'ngaycap', 'noicap', 'tennddpl', 'sdtnddpl', 'sanphamkinhdoanh'];
  dataHuyenThi: Array<FoodCommonModel> = [{ tendoanhnghiep: 'DNTN Phước Đức', id_quan_huyen: 2, diachi: 'Tổ 4, KP. Phước Tân, phường Tân Thiện, TP. Đồng Xoài', scndkkd: '', ngaycap: null, noicap: '', tennddpl: 'Phan Văn Bế', sdtnddpl: '0271.3862.101', sanphamkinhdoanh: 'Bán buôn thực phẩm' },
  { tendoanhnghiep: 'DNTN TM Phạm Nguyễn', id_quan_huyen: 2, diachi: 'Dẫy I, ấp 6, xã Tiến Hưng, TP.Đồng Xoài', scndkkd: '', ngaycap: null, noicap: '', tennddpl: 'Nguyễn Thị Minh Huệ', sdtnddpl: '0271.3896.478', sanphamkinhdoanh: 'Bán buôn thực phẩm' },
  { tendoanhnghiep: 'DNTN Hữu Bằng', id_quan_huyen: 2, diachi: 'Tổ 1, KP Suối Đá, phường Tân Xuân, TP.Đồng Xoài', scndkkd: '', ngaycap: null, noicap: '', tennddpl: 'Lê Xuân Bằng', sdtnddpl: '0271.3884.628', sanphamkinhdoanh: 'Bán buôn thực phẩm' },
  { tendoanhnghiep: 'Công ty TNHH MTV Sài Gòn - Bình Phước', id_quan_huyen: 2, diachi: 'Đường Phú Riềng Đỏ, phường Tân Bình, TP.Đồng Xoài', scndkkd: '', ngaycap: null, noicap: '', tennddpl: 'Nguyễn Thị Bạch Vân', sdtnddpl: '0911876989', sanphamkinhdoanh: 'Bán buôn bán lẻ thực phẩm' },
  { tendoanhnghiep: 'DNTN Lộc Thọ', id_quan_huyen: 2, diachi: 'số 240, đường Lê Quý Đôn, phường Tân Thiện, TP.Đồng Xoài', scndkkd: '', ngaycap: null, noicap: '', tennddpl: 'Lê Thị Phượng', sdtnddpl: '0271.3884.105', sanphamkinhdoanh: 'Bán buôn thực phẩm' },
  { tendoanhnghiep: 'C.ty TNHH MTV TMDV Thanh Tuyền', id_quan_huyen: 2, diachi: 'Số 23 Nguyễn Huệ, KP Bình Thiện, P. Tân Thiện, TP.Đồng Xoài', scndkkd: '', ngaycap: null, noicap: '', tennddpl: 'Nguyễn Văn Tuyền', sdtnddpl: '0271.3883.068', sanphamkinhdoanh: 'Bán buôn thực phẩm' },
  { tendoanhnghiep: 'C.ty TNHH TMDV Tiến Tài', id_quan_huyen: 2, diachi: 'Ấp 1, xã Tiến Hưng, TP.Đồng Xoài', scndkkd: '', ngaycap: null, noicap: '', tennddpl: 'Phạm Thu Hà', sdtnddpl: '0271.3896.453', sanphamkinhdoanh: 'Bán buôn thực phẩm' },
  { tendoanhnghiep: 'DNTN Quang Vinh Phát', id_quan_huyen: 2, diachi: 'Tổ 4, KP. Phú Xuân, TP.Đồng Xoài', scndkkd: '', ngaycap: null, noicap: '', tennddpl: 'Bùi Thu Hương', sdtnddpl: '0918.670.575', sanphamkinhdoanh: 'Bán buôn thực phẩm' },
  { tendoanhnghiep: 'Công ty TNHH MTV TMDV Đại Đông', id_quan_huyen: 2, diachi: '120 đường Trần Phú, phường Tân Phú, TP.Đồng Xoài', scndkkd: '', ngaycap: null, noicap: '', tennddpl: 'Phan Hoài Đông', sdtnddpl: '0918212165', sanphamkinhdoanh: 'Bán buôn thực phẩm' },
  { tendoanhnghiep: 'Công ty CP TM DV The Gold Mart', id_quan_huyen: 2, diachi: 'Đường Tôn Đức Thắng, Ấp 2, Phường Tiến Thành, TP.Đồng Xoài', scndkkd: '', ngaycap: null, noicap: '', tennddpl: 'Nguyễn Thanh Phương', sdtnddpl: '0913.012.679 ', sanphamkinhdoanh: 'Bán buôn bán lẻ thực phẩm' },
  { tendoanhnghiep: 'Nhà phân phối cám gạo Hùng Oanh', id_quan_huyen: 2, diachi: 'Số 65 Trần Phú, P.Tân Phú, TP.Đồng Xoài', scndkkd: '', ngaycap: null, noicap: '', tennddpl: 'Anh Hùng', sdtnddpl: '0907848113', sanphamkinhdoanh: 'Phân phối gạo' },
  { tendoanhnghiep: 'DNTN TMDV Quang Minh', id_quan_huyen: 1, diachi: 'KP 9, P.Long Phước, Tx.Phước Long', scndkkd: '', ngaycap: null, noicap: '', tennddpl: 'Lê Thị Thảo', sdtnddpl: '0271.3775.348', sanphamkinhdoanh: 'Bán buôn đồ uống' },
  { tendoanhnghiep: 'DNTN Trọng Ngư', id_quan_huyen: 1, diachi: 'Tổ 1, KP.Phước Sơn, P.Phước Bình, Tx Phước Long', scndkkd: '', ngaycap: null, noicap: '', tennddpl: 'Nguyễn Trọng Ngư', sdtnddpl: '0908.990.400', sanphamkinhdoanh: 'Bán buôn thực phẩm' },
  { tendoanhnghiep: 'DNTN Đại Quan', id_quan_huyen: 1, diachi: 'P.Phước Bình, Tx. Phước Long', scndkkd: '', ngaycap: null, noicap: '', tennddpl: 'Quách Hớn Tài', sdtnddpl: '0271.3775.825', sanphamkinhdoanh: 'Bán buôn thực phẩm' },
  { tendoanhnghiep: 'Công ty TNHH TMDV Phương Loan', id_quan_huyen: 1, diachi: 'Tổ 4, KP.7, P.Long Phước, Tx.Phước Long', scndkkd: '', ngaycap: null, noicap: '', tennddpl: 'Phạm Văn Duân', sdtnddpl: '', sanphamkinhdoanh: 'Bán buôn thực phẩm' },
  { tendoanhnghiep: 'Công ty TNHH Đông Doanh', id_quan_huyen: 1, diachi: 'KP.Phước An, P.Phước Bình, Tx.Phước Long', scndkkd: '', ngaycap: null, noicap: '', tennddpl: 'Phan Hoài Hạ', sdtnddpl: '02713773459.', sanphamkinhdoanh: 'Bán buôn thực phẩm' },
  { tendoanhnghiep: 'DNTN Đức Trí', id_quan_huyen: 1, diachi: 'ĐT741, KP5, P.Long Phước, Tx. Phước Long', scndkkd: '', ngaycap: null, noicap: '', tennddpl: 'Nguyễn Đức Thuận', sdtnddpl: '0271.3774.423', sanphamkinhdoanh: 'Bán buôn thực phẩm' },
  { tendoanhnghiep: 'Công ty TNHH TMDV Tổng hợp Thành Bước', id_quan_huyen: 3, diachi: '68 Đinh Tiên Hoàng, KP.Phú Bình, P.An Lộc, Tx. Bình Long', scndkkd: '', ngaycap: null, noicap: '', tennddpl: 'Nguyễn Thành Bước', sdtnddpl: '0271.3680.622', sanphamkinhdoanh: 'Bán buôn thực phẩm' },
  { tendoanhnghiep: 'CÔNG TY TNHH MTV SXTM Hương Giang', id_quan_huyen: 3, diachi: 'Tổ 7, KP.Hưng Thịnh, P.Hưng Chiến, Tx. Bình Long', scndkkd: '', ngaycap: null, noicap: '', tennddpl: 'Hồ Đức Thiện', sdtnddpl: '02713683158', sanphamkinhdoanh: 'Bán buôn thực phẩm' },
  { tendoanhnghiep: 'DNTN An Lạc.', id_quan_huyen: 3, diachi: '124 đường Hùng Vương, P.An Lộc, Tx.Bình Long', scndkkd: '', ngaycap: null, noicap: '', tennddpl: 'Trần Văn Cường', sdtnddpl: '02713680042', sanphamkinhdoanh: 'Bán buôn thực phẩm' },
  { tendoanhnghiep: 'Đại lý gạo Quyết Loan', id_quan_huyen: 3, diachi: 'Phường Hưng Chiến, Tx.Bình Long', scndkkd: '', ngaycap: null, noicap: '', tennddpl: '', sdtnddpl: '', sanphamkinhdoanh: 'Đại lý gạo' },
  { tendoanhnghiep: 'DNTN Quỳnh Trung', id_quan_huyen: 4, diachi: 'đường Nguyễn Huệ, P.An Lộc', scndkkd: '', ngaycap: null, noicap: '', tennddpl: '', sdtnddpl: '', sanphamkinhdoanh: 'Đại lý gạo' },
  { tendoanhnghiep: 'Coopmart Đồng Phú', id_quan_huyen: 8, diachi: 'ĐT 741, KP.Tân An, TT.Tân Phú, Đồng Phú', scndkkd: '', ngaycap: null, noicap: '', tennddpl: 'Chị Khanh', sdtnddpl: '0913942207', sanphamkinhdoanh: 'Siêu thị' },
  { tendoanhnghiep: 'CÔNG TY TNHH MTV TMDV Mạnh Toàn', id_quan_huyen: 10, diachi: 'Ấp 3 xã Minh Hưng, Chơn Thành, Bình Phước', scndkkd: '', ngaycap: null, noicap: '', tennddpl: 'Nguyễn Mạnh Toàn', sdtnddpl: '0978551511', sanphamkinhdoanh: 'Bán buôn thực phẩm' },
  { tendoanhnghiep: 'DNTN Lý Quỳnh', id_quan_huyen: 7, diachi: 'xã Thanh Bình, huyện Hớn Quản', scndkkd: '', ngaycap: null, noicap: '', tennddpl: 'Trần Văn Quỳnh', sdtnddpl: '0271.3680.030', sanphamkinhdoanh: 'Bán buôn đồ uống' },
  { tendoanhnghiep: 'C.ty TNHH MTV Hoàng Gia', id_quan_huyen: 5, diachi: 'Ấp 3, xã Lộc Thái, huyện Lộc Ninh', scndkkd: '', ngaycap: null, noicap: '', tennddpl: 'Trần Thanh Lan', sdtnddpl: '0914.311.321', sanphamkinhdoanh: 'Bán buôn thực phẩm' },
  { tendoanhnghiep: 'C.ty TNHH MTV TMDV Hoàng Kim', id_quan_huyen: 5, diachi: 'KP.Ninh Phước, TT.Lộc Ninh', scndkkd: '', ngaycap: null, noicap: '', tennddpl: 'Nguyễn Thị Cẩm Hiệp', sdtnddpl: '0918.242.816', sanphamkinhdoanh: 'Bán buôn thực phẩm' },
  { tendoanhnghiep: 'CÔNG TY TNHH MTV TM XNK - BÌNH MAI', id_quan_huyen: 5, diachi: 'Số 27 đường 3/2, KP.Ninh Thịnh, TT.Lộc Ninh, huyện Lộc Ninh', scndkkd: '', ngaycap: null, noicap: '', tennddpl: 'Hoàng Ngọc Bình', sdtnddpl: '02713568659', sanphamkinhdoanh: 'Bán buôn thực phẩm' },
  { tendoanhnghiep: 'DNTN QUỐC ANH THU', id_quan_huyen: 5, diachi: 'KP.Ninh Thịnh, TT.Lộc Ninh, huyện Lộc Ninh', scndkkd: '', ngaycap: null, noicap: '', tennddpl: 'Lê Thị Thu', sdtnddpl: '0983379379', sanphamkinhdoanh: 'Bán buôn thực phẩm' },
  { tendoanhnghiep: 'C.ty TNHH MTV Tuấn Dương', id_quan_huyen: 9, diachi: 'KP. Hòa Đồng, thị trấn Đức phong, huyện Bù Đăng, BP', scndkkd: '', ngaycap: null, noicap: '', tennddpl: 'Đặng Văn Tuấn', sdtnddpl: '0376.955.054', sanphamkinhdoanh: 'Bán buôn thực phẩm' },
  { tendoanhnghiep: 'CÔNG TY TNHH MTV ĐÔNG HƯNG', id_quan_huyen: 9, diachi: 'ấp 2, xã Minh Hưng, huyện Bù Đăng', scndkkd: '', ngaycap: null, noicap: '', tennddpl: 'Phan Hoài Hạ', sdtnddpl: '0913720377', sanphamkinhdoanh: 'Bán buôn thực phẩm' }]
  //Variable for only TS-------------------------------------------------------------------------

  items: TreeviewItem[] = [];
  values: number[] = [];
  config = TreeviewConfig.create({
    hasAllCheckBox: false,
    hasFilter: true,
    hasCollapseExpand: true,
    decoupleChildFromParent: false,
    maxHeight: 400
  });

  public tableMergeHader: Array<ToltalHeaderMerge> = [];
  public mergeHeadersColumn: Array<string> = [];
  public indexOftableMergeHader: number = 0;

  columns: number = 1;
  districts: District[] = [{ id: 1, ten_quan_huyen: 'Thị xã Phước Long' },
  { id: 2, ten_quan_huyen: 'Thành phố Đồng Xoài' },
  { id: 3, ten_quan_huyen: 'Thị xã Bình Long' },
  { id: 4, ten_quan_huyen: 'Huyện Bù Gia Mập' },
  { id: 5, ten_quan_huyen: 'Huyện Lộc Ninh' },
  { id: 6, ten_quan_huyen: 'Huyện Bù Đốp' },
  { id: 7, ten_quan_huyen: 'Huyện Hớn Quản' },
  { id: 8, ten_quan_huyen: 'Huyện Đồng Phú' },
  { id: 9, ten_quan_huyen: 'Huyện Bù Đăng' },
  { id: 10, ten_quan_huyen: 'Huyện Chơn Thành' },
  { id: 11, ten_quan_huyen: 'Huyện Phú Riềng' }];
  headerArray: string[] = ['index', 'tenhuyenthi', 'ten_tttm', 'dientich', 'vondautu', 'namdautuxaydung', 'phanloai'];
  isChecked: boolean;
  public tongDoanhNghiep: number;
  //
  filterModel: FoodFilterModel = new FoodFilterModel();
  listProduct : string[] = [];

  //Angular FUnction --------------------------------------------------------------------
  constructor(
    public reportSevice: ReportService,
    public route: ActivatedRoute,
    public keyboardservice: KeyboardService,
    public info: InformationService,
    public excelService: ExcelService,
  ) { }

  ngOnInit(): void {
    let data: any = JSON.parse(localStorage.getItem('currentUser'));
    this.dataSourceHuyenThi.data = this.dataHuyenThi;
    this.filteredDataSource.data = [...this.dataSourceHuyenThi.data];
    this._caculator(this.dataSourceHuyenThi.data);
    this.autoOpen();
    this.listProduct = [...new Set( this.dataHuyenThi.map( x => x.sanphamkinhdoanh))];
  }

  autoOpen() {
    setTimeout(() => this.accordion.openAll(), 1000);
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    // this.accordion.openAll();
    this._paginator();
  }
  dataSourceHuyenThi: MatTableDataSource<FoodCommonModel> = new MatTableDataSource<FoodCommonModel>();
  filteredDataSource: MatTableDataSource<FoodCommonModel> = new MatTableDataSource<FoodCommonModel>();

  //Xuất excel
  ExportTOExcel(filename: string, sheetname: string) {
    this.excelService.exportDomTableAsExcelFile(filename, sheetname, this.table.nativeElement);
  }

  sortHeaderCondition(event) {

  }

  private _caculator(data: FoodCommonModel[]){
    this.tongDoanhNghiep = data.length;
  }
  private _paginator(){
    this.filteredDataSource.paginator = this.paginator;
    this.paginator._intl.itemsPerPageLabel = 'Số hàng';
    this.paginator._intl.firstPageLabel = "Trang Đầu";
    this.paginator._intl.lastPageLabel = "Trang Cuối";
    this.paginator._intl.previousPageLabel = "Trang Trước";
    this.paginator._intl.nextPageLabel = "Trang Tiếp";
  }
  // applyDistrictFilter(event) {

  // }

  // applyExpireCheck(event) {

  // }

  applyFilter() {
    let filteredData = this.filterArray(this.dataSourceHuyenThi.data, this.filterModel);
    this._caculator(filteredData);
    if (!filteredData.length) {
      if (this.filterModel)
        this.filteredDataSource.data = [];
      else
        this.filteredDataSource.data = this.dataSourceHuyenThi.data;
    }
    else {
      this.filteredDataSource.data = filteredData;
    }
    this._paginator();
  }

  filterArray(array, filters) {
    const filterKeys = Object.keys(filters);
    let temp = [...array];
    filterKeys.forEach(key => {
      let temp2 = [];
      if (filters[key].length) {
        filters[key].forEach(criteria => {
          temp2 = temp2.concat(temp.filter(x => x[key] == criteria));
        });
        temp = [...temp2];
      }
    })
    return temp;
  }
}
