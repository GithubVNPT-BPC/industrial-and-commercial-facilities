import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatOption, MatSelect, MatTableDataSource } from '@angular/material';
import { SaleWebsite, SaleWebsiteFilterModel, ECommerceWebsite } from 'src/app/_models/APIModel/e-commerce.model';
import { District } from 'src/app/_models/district.model';
import { SCTService } from 'src/app/_services/APIService/sct.service';
import { registration_management } from "../../../../../_models/APIModel/ecommerce.model";
import { MatAccordion } from '@angular/material/expansion';
import { MatPaginator } from '@angular/material/paginator';
import { BreadCrumService } from 'src/app/_services/injectable-service/breadcrums.service';
import { LinkModel } from 'src/app/_models/link.model';
import * as XLSX from 'xlsx';

@Component({
  selector: 'registered-sale-website',
  templateUrl: './registered-sale-website.component.html',
  styleUrls: ['../../../special_layout.scss'],
})
export class RegisteredSaleWebsiteComponent implements OnInit {

  //Constant
  private readonly LINK_DEFAULT: string = "/specialized/commecial-management/e-commerce/sale-website";
  private readonly TITLE_DEFAULT: string = "Quản lý thông báo website bán hàng";
  private readonly TEXT_DEFAULT: string = "Quản lý thông báo website bán hàng";
  //Variable for only ts
  private _linkOutput: LinkModel = new LinkModel();
  displayedColumns: string[] = ['index', 'ten_tc_cn', 'mst', 'dia_chi', 'dien_thoai', 'ten_mien', 'nganh_nghe', 'ma_so_nganh_nghe'];
  dataSource: MatTableDataSource<SaleWebsite>;
  filteredDataSource: MatTableDataSource<SaleWebsite> = new MatTableDataSource<SaleWebsite>();
  filterModel: SaleWebsiteFilterModel = { id_quan_huyen: [] };
  constructor(
    public sctService: SCTService, 
    private _breadCrumService: BreadCrumService) { }

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

  districts: District[] = [
    { id: 1, ten_quan_huyen: 'Thị xã Phước Long' },
    { id: 2, ten_quan_huyen: 'Thành phố Đồng Xoài' },
    { id: 3, ten_quan_huyen: 'Thị xã Bình Long' },
    { id: 4, ten_quan_huyen: 'Huyện Bù Gia Mập' },
    { id: 5, ten_quan_huyen: 'Huyện Lộc Ninh' },
    { id: 6, ten_quan_huyen: 'Huyện Bù Đốp' },
    { id: 7, ten_quan_huyen: 'Huyện Hớn Quản' },
    { id: 8, ten_quan_huyen: 'Huyện Đồng Phú' },
    { id: 9, ten_quan_huyen: 'Huyện Bù Đăng' },
    { id: 10, ten_quan_huyen: 'Huyện Chơn Thành' },
    { id: 11, ten_quan_huyen: 'Huyện Phú Riềng' }
  ];

  autoOpen() {
    setTimeout(() => this.accordion.openAll(), 1000);
  }

  // ngAfterViewInit(): void {
  //   //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
  //   //Add 'implements AfterViewInit' to the class.
  //   this.accordion.openAll();
  // }


  @ViewChild(MatAccordion, { static: true }) accordion: MatAccordion;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('TABLE', { static: false }) table: ElementRef;

  exportExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table.nativeElement);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Website bán hàng');

    XLSX.writeFile(wb, 'Website bán hàng.xlsx');

  }

  GetDanhSachWebsiteTMDT() {
    this.sctService.GetDanhSachWebBH().subscribe(response => {
      console.log(response)
      this.dataSource = new MatTableDataSource<SaleWebsite>(response.data);
      this.filteredDataSource.data = [...this.dataSource.data];
      this.filteredDataSource.paginator = this.paginator;
      this.paginator._intl.itemsPerPageLabel = 'Số hàng';
      this.paginator._intl.firstPageLabel = "Trang Đầu";
      this.paginator._intl.lastPageLabel = "Trang Cuối";
      this.paginator._intl.previousPageLabel = "Trang Trước";
      this.paginator._intl.nextPageLabel = "Trang Tiếp";
    })
  }

  applyFilter() {
    console.log(this.filterModel)
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

  applyFilter1(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filteredDataSource.filter = filterValue.trim().toLowerCase();
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
  
  @ViewChild('dSelect', { static: false }) dSelect: MatSelect;
  allSelected = false;
  toggleAllSelection() {
      this.allSelected = !this.allSelected;  // to control select-unselect

      if (this.allSelected) {
          this.dSelect.options.forEach((item: MatOption) => item.select());
      } else {
          this.dSelect.options.forEach((item: MatOption) => item.deselect());
      }
      this.dSelect.close();
  }
}
