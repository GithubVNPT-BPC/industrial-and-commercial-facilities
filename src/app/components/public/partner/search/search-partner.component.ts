//Import library
import { Component, ViewChild, ElementRef, OnInit, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { tap, startWith, map } from 'rxjs/operators';
import { MatTableFilter } from 'mat-table-filter';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
//Import service
import { MarketService } from 'src/app/_services/APIService/market.service';
import { PaginationService } from 'src/app/_services/PaginationService';
import { PagerService } from 'src/app/_services/pagination.service';
import { FilterService } from 'src/app/_services/filter.service';
import { ExcelService } from 'src/app/_services/excelUtil.service';
import { normalizeValue } from "src/app/_services/stringUtils.service";
//Import model
import { CompanyDetailModel, ProductModel } from 'src/app/_models/APIModel/domestic-market.model';
import { CareerModel, DistrictModel } from 'src/app/_models/APIModel/domestic-market.model';

//Interface
interface HashTableNumber<T> {
  [key: string]: T;
}

@Component({
  selector: 'app-search-partner',
  templateUrl: './search-partner.component.html',
  styleUrls: ['../../public_layout.scss'],
})

export class SearchPartnerComponent implements AfterViewInit, OnInit {
  //Declare variable for CONSTANT
  public readonly SEPERATE_FILTER = ";";
  public readonly DEFAULT_IMAGE: string = '../../../../assets/img/brandlogo/company_ph01.jpg';
  //Declare variable for TS & HTML
  public filterType: MatTableFilter;
  public dataSource = new MatTableDataSource<any>();
  public selectedCategory: string = "Tất cả";
  public selectedAddress: string = "";
  public selectedBusiness: string = "";
  public selectedCarrier: string = "";
  public selectedType: string = "Dạng bảng";
  public typeShow: number = 1;
  public displayedColumns: string[] = ['index', 'ten_doanh_nghiep', 'mst', 'dia_chi', 'dien_thoai', 'ten_nganh_nghe', 'chi_tiet_doanh_nghiep'];
  public filteredCareerList: Observable<CareerModel[]>;
  public addresses: Array<any> = [];
  public loading: boolean = false;
  public types = ['Dạng thẻ', 'Dạng bảng'];
  public page: number = 1;
  public pager: any = {};
  //Declare variable for ONLU TS
  public control = new FormControl();
  public _marketService: MarketService;
  public errorMessage: any;
  public careerList: Array<CareerModel> = new Array<CareerModel>();
  public districtList: Array<DistrictModel> = new Array<DistrictModel>();
  public categories = [null];//['Tất cả', 'Hạt điều', 'Hạt tiêu', 'Hạt cà phê', 'Cao su'];
  public pagedItems: any[];
  public pagerService: PagerService;
  public productList: any;

  //Viewchild
  @ViewChild('TABLE', { static: false }) table: ElementRef;
  @ViewChild('scheduledOrdersPaginator', { static: true }) paginator: MatPaginator;
  // @ViewChild('selected_career', { static: false }) careerEle: ElementRef;

  constructor(
    public marketService: MarketService,
    public paginationService: PaginationService,
    public filterService: FilterService,
    public excelService: ExcelService,
    public router: Router,
    public _pagerService: PagerService
  ) {
    this._marketService = marketService;
    this.pagerService = _pagerService;
  }

  ngOnInit(): void {
    this.filterType = MatTableFilter.ANYWHERE;
    this.getAllCompany();
    this.getAllDistrict();
  }

  ngAfterViewInit(): void {
    if (this.typeShow == 1)
      this.paginator.page
        .pipe(
          tap(() => this.loadLessonsPage())
        )
        .subscribe();
  }

  //Function for PROCESS-FLOW   -------------------------------------------------------------------------------
  public getAllDistrict() {
    this._marketService.GetAllDistrict().subscribe(
      allrecords => {
        this.districtList = allrecords.data as DistrictModel[];
        this.districtList.forEach(element => this.addresses.push(element.ten_quan_huyen));
      });
  }

  public getAllNganhNghe() {
    this._marketService.GetAllCareer().subscribe(
      allrecords => {
        this.careerList = allrecords.data as CareerModel[];
        this.careerList.forEach(element => element.ma_nganh_nghe.length > 3 ? this.categories.push(element.ten_kem_ma) : 0);
      });

    this.filteredCareerList = this.control.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }

  public getAllCompany() {
    this._marketService.GetAllCompany().subscribe(
      allrecords => {
        this.dataSource = new MatTableDataSource<CompanyDetailModel>(allrecords.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.paginator = this.paginator;
        this.paginator._intl.itemsPerPageLabel = 'Số hàng';
        this.paginator._intl.firstPageLabel = "Trang Đầu";
        this.paginator._intl.lastPageLabel = "Trang Cuối";
        this.paginator._intl.previousPageLabel = "Trang Trước";
        this.paginator._intl.nextPageLabel = "Trang Tiếp";
        
        // Overrride default filter behaviour of Material Datatable
        this.dataSource.filterPredicate = this.filterService.createFilter();
      },
      error => this.errorMessage = <any>error
    );
  }

  public getAllProduct(allrecords) {
    this.productList = allrecords.data as Array<ProductModel>;
    if (this.typeShow == 1) {
      this.dataSource.paginator = this.paginator;
      this.paginator._intl.itemsPerPageLabel = 'Số hàng';
      this.paginator._intl.firstPageLabel = "Trang Đầu";
      this.paginator._intl.lastPageLabel = "Trang Cuối";
      this.paginator._intl.previousPageLabel = "Trang Trước";
      this.paginator._intl.nextPageLabel = "Trang Tiếp";
    }
  }

  //Function for EVENT HTML     -------------------------------------------------------------------------------
  //Xuất excel
  public exportTOExcel(filename: string, sheetname: string) {
    // TODO: Mofify HEADERS for the excel service
    let hashKeyDataSource: HashTableNumber<number> = {};
    let newDatas: any[] = [];

    //Get key of current filter table in table html
    const elements = this.table.nativeElement.querySelectorAll('.cdk-column-mst');
    elements.forEach(e => {
      hashKeyDataSource[e.textContent.trim()] = 10;
    });
    let data = this.dataSource.data.filter(data => hashKeyDataSource[data.mst] == 10);

    for (let key in data ) {
      newDatas.push({
        'Tên doanh nghiệp': data[key].ten_doanh_nghiep,
        'Ngành nghề': data[key].ten_nganh_nghe,
        'Địa chỉ': data[key].dia_chi_day_du,
        'Ngành nghề Kinh doanh': data[key].nganh_nghe_kd,
        'Người đại diện pháp lý': data[key].nguoi_dai_dien,
        'Điện thoại': data[key].dien_thoai,
        'Mã số thuế': data[key].mst,
        'Số GPKD': data[key].so_giay_cndkkd,
        'Ngày cấp GPKD': data[key].ngay_cap_gcndkkd,
        'Loại hình kinh doanh': data[key].loai_hinh_doanh_nghiep,
        'Vốn kinh doanh': data[key].von_kinh_doanh,
        'Ngày bắt đầu kinh doanh': data[key].ngay_bat_dau_kd,
        'Email': data[key].email,
        'Số lao động': data[key].so_lao_dong,
        'Công suất thiết kế': data[key].cong_suat_thiet_ke,
        'Sản lượng': data[key].san_luong,
        'Tiêu chuẩn sản phẩm': data[key].tieu_chuan_san_pham,
        'Doanh thu': data[key].doanh_thu,
        'Quy mô tài sản': data[key].quy_mo_tai_san,
        'Lợi nhuận': data[key].loi_nhuan,
        'Nhu cầu bán': data[key].nhu_cau_ban,
        'Nhu cầu mua': data[key].nhu_cau_mua,
        'Nhu cầu hợp tác': data[key].nhu_cau_hop_tac
      });
    }

    this.excelService.exportJsonAsExcelFile(filename, sheetname, newDatas)
  }

  public _filter(value: string): CareerModel[] {
    const filterValue = normalizeValue(value);
    return this.careerList.filter(career => normalizeValue(career.ten_kem_ma).includes(filterValue));
  }

  public openDetailCompany(mst: string) {
    let url = this.router.serializeUrl(
      this.router.createUrlTree([encodeURI('#') + '/public/partner/search/' + mst]));
    window.open(url.replace('%23', '#'), "_blank");
  }

  public setPage(page: number) {
    // get pager object from service
    this.pager = this.pagerService.getPager(this.dataSource.data.length, page);
    // get current page of items
    this.pagedItems = this.dataSource.data.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }

  public changeType() {
    if (this.selectedType == this.types[0]) {
      this.typeShow = 0;
      this.setPage(1);
    } else {
      this.typeShow = 1;
      this.ngAfterViewInit();
      this.dataSource.paginator = this.paginator;
      this.paginator._intl.itemsPerPageLabel = 'Số hàng';
      this.paginator._intl.firstPageLabel = "Trang Đầu";
      this.paginator._intl.lastPageLabel = "Trang Cuối";
      this.paginator._intl.previousPageLabel = "Trang Trước";
      this.paginator._intl.nextPageLabel = "Trang Tiếp";
    }
  }
  
  private changeFilter(col, event)  {
    let value = event.target ? event.target.value : event.value;
    this.filterService.addFilter(col, value);
    this.dataSource.filter = this.filterService.getFilters();
  }

  private clearFilter() {
    let resetFields = ['selectedBusiness', 'selectedCarrier', 'selectedAddress'];
    for (let field in resetFields) {
        this[resetFields[field]] = "";
    }
    this.filterService.setFilterVals();
    this.dataSource.filter = this.filterService.getFilters();
  }
  
  //Function for EXTENTION      -------------------------------------------------------------------------------
  public loadLessonsPage() {
    // this.dataSource;
    // this.setPage(1);
  }

}
