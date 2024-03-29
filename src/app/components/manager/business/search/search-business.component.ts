import { Component, ViewChild, ElementRef, OnInit, Injectable } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';

import { CompanyDetailModel } from 'src/app/_models/APIModel/domestic-market.model';
import { MatTableFilter } from 'mat-table-filter';

import { MarketService } from 'src/app/_services/APIService/market.service';
import { ExcelService } from 'src/app/_services/excelUtil.service';
import { InformationService } from 'src/app/shared/information/information.service';
import { MatAccordion } from '@angular/material/expansion';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-search-business',
  templateUrl: './search-business.component.html',
  styleUrls: ['../../manager_layout.scss'],
})

@Injectable()
export class SearchBusinessComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('new_element', { static: false }) ele: ElementRef;
  @ViewChild('TABLE', { static: false }) table: ElementRef;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatAccordion, { static: false }) accordion: MatAccordion;

  public displayedColumns: string[] = ['select', 'index', 'ten_doanh_nghiep', 'mst',
    // 'ten_loai_hinh_hoat_dong', 
    // 'nguoi_dai_dien', 
    'dia_chi_tong_hop',
    // 'dia_chi_day_du', 'so_dien_thoai', 'email',
    'nganh_nghe',
    // 'ma_nganh_nghe', 'ten_nganh_nghe', 'nganh_nghe_kd_chinh',
    // 'so_giay_phep', 'ngay_cap', 'ngay_het_han', 'noi_cap', 'co_quan_cap', 'ghi_chu',
    // 'email_sct', 'ngay_bd_kd', 'von_dieu_le', 'quy_mo_tai_san', 'doanh_thu', 'loi_nhuan', 'cong_suat_thiet_ke', 'cong_suat_thiet_ke_sct',
    // 'so_lao_dong', 'so_lao_dong_sct', 'san_luong', 'san_luong_sct', 'nhu_cau_ban', 'nhu_cau_mua', 'nhu_cau_hop_tac', 'tieu_chuan_san_pham', 
    'hoat_dong'
  ];

  public filterList = [
    { filed_name: 'mst', detail_name: 'Mã số thuế' },
    { filed_name: 'ten_doanh_nghiep_latin', detail_name: 'Tên doanh nghiệp' },
    // { filed_name: 'ten_loai_hinh_hoat_dong', detail_name: 'Tên loại hình hoạt động' },
    { filed_name: 'nguoi_dai_dien_latin', detail_name: 'Người đại diện' },
    { filed_name: 'dia_chi_day_du_latin', detail_name: 'Địa chỉ đầy đủ' },
    { filed_name: 'ma_nganh_nghe', detail_name: 'Mã ngành nghề' },
    { filed_name: 'ten_nganh_nghe_latin', detail_name: 'Ngành nghề' },
    { filed_name: 'nganh_nghe_kd_chinh_latin', detail_name: 'Ngành nghề kinh doanh chính' },
    { filed_name: 'so_giay_phep', detail_name: 'Số giấy phép' },
    { filed_name: 'ngay_cap', detail_name: 'Ngày cấp giấy phép' },
    { filed_name: 'ngay_het_han', detail_name: 'Ngày hết hạn giấy phép' },
    // { filed_name: 'noi_cap', detail_name: 'Nơi cấp giấy phép' },
    // { filed_name: 'co_quan_cap', detail_name: 'Cơ quan cấp' },
    // { filed_name: 'ghi_chu', detail_name: 'Ghi chú giấy phép' },
    { filed_name: 'so_dien_thoai', detail_name: 'Số điện thoại' },
    // { filed_name: 'email', detail_name: 'Email' },
    { filed_name: 'email_sct', detail_name: 'Email (Nguồn: SCT)' },
    { filed_name: 'ngay_bd_kd', detail_name: 'Ngày bắt đầu kinh doanh' },
    // { filed_name: 'von_dieu_le', detail_name: 'Vốn điều lệ' },
    // { filed_name: 'quy_mo_tai_san', detail_name: 'Quy mô tài sản' },
    // { filed_name: 'doanh_thu', detail_name: 'Doanh thu' },
    // { filed_name: 'loi_nhuan', detail_name: 'Lơi nhuận' },
    // { filed_name: 'cong_suat_thiet_ke', detail_name: 'Công suất thiết kế' },
    // { filed_name: 'cong_suat_thiet_ke_sct', detail_name: 'Công suất thiết kế (Nguồn: SCT)' },
    // { filed_name: 'so_lao_dong', detail_name: 'Số lao động' },
    // { filed_name: 'so_lao_dong_sct', detail_name: 'Số lao động (Nguồn: SCT)' },
    // { filed_name: 'san_luong', detail_name: 'Sản lượng' },
    // { filed_name: 'san_luong_sct', detail_name: 'Sản lượng (Nguồn: SCT)' },
    // { filed_name: 'nhu_cau_ban', detail_name: 'Nhu cầu bán' },
    // { filed_name: 'nhu_cau_mua', detail_name: 'Nhu cầu mua' },
    // { filed_name: 'nhu_cau_hop_tac', detail_name: 'Nhu cầu hợp tác' },
    // { filed_name: 'tieu_chuan_san_pham', detail_name: 'Tiêu chuẩn sản phẩm' },
    // { filed_name: 'hoat_dong', detail_name: 'Hoạt động' },
  ];

  constructor(
    public _marketService: MarketService,
    public router: Router,
    public excelService: ExcelService,
    public info: InformationService,
  ) { }

  autoOpen() {
    setTimeout(() => this.accordion.openAll(), 1000);
  }

  ngOnInit(): void {
    this.autoOpen();
    this.GetAllCompany();
    this.filterEntity = new CompanyDetailModel();
    this.tempFilter = new CompanyDetailModel();
    this.filterType = MatTableFilter.ANYWHERE;
  }
  selection = new SelectionModel<CompanyDetailModel>(true, []);

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    // const numRows = this.dataSource.data.length;
    const numRows = this.dataSource.connect().value.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.connect().value.forEach(row => this.selection.select(row));
  }

  checkboxLabel(row?: CompanyDetailModel): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

  removeRows() {
    if (!this.selection.selected.length) {
      this.info.msgError('Bạn chưa chọn doanh nghiệp để xóa')
    } else {
      if (confirm('Bạn Có Chắc Muốn Xóa?')) {
        let datas = this.selection.selected.map(element => new Object({ mst: element.mst }));
        this._marketService.DeleteCompany(datas).subscribe(res => {
          this.info.msgSuccess('Xóa thành công')
          this.ngOnInit();
          this.selection.clear();
          this.paginator.pageIndex = 0;
        })
      }
    }
  }

  // ExportTOExcel(filename: string, sheetname: string) {
  //   const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table.nativeElement);
  //   const wb: XLSX.WorkBook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

  //   /* save to file */
  //   XLSX.writeFile(wb, 'SheetJS.xlsx');

  //   // this.excelService.exportDomTableAsExcelFile(filename, sheetname, this.table.nativeElement)
  // }

  private getExposedTable() {
    let self = this;
    let exposedData = [];
    this.dataSource.filteredData.forEach(function (record, index) {
      let data = {
        "STT": index + 1,
        "Tên doanh nghiệp": record["ten_doanh_nghiep"],
        "Địa chỉ": record["dia_chi_day_du"],
        "Mã số thuế": record["mst"],
        "Email": record["email"],
        "SĐT": record["so_dien_thoai"],
        "Ngành nghề": record["ma_nganh_nghe"] + " - " + record["ten_nganh_nghe"] + " - " + record["nganh_nghe_kd_chinh"],
        "Tình trạng": record["hoat_dong"] ? "Còn hoạt động" : "Ngừng hoạt động",
      };
      exposedData.push(data);
    });
    return exposedData;
  }

  public ExportTOExcel(filename: string, sheetname: string) {
    this.excelService.exportJsonAsExcelFile(filename, sheetname, this.getExposedTable());
  }

  // static toExportFileName(excelFileName: string): string {
  //   return `${excelFileName}_export_${new Date().getTime()}.xlsx`;
  // }

  // public exportAsExcelFile(excelFileName: string): void {
  //   const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.dataSource.data);
  //   const workbook: XLSX.WorkBook = {Sheets: {'data': worksheet}, SheetNames: ['data']};
  //   XLSX.writeFile(workbook, SearchBusinessComponent.toExportFileName(excelFileName));
  // }

  OpenDetailCompany(mst: string) {
    let url = '/#/manager/business/edit/' + mst;
    window.open(url, '_blank');
  }

  AddCompany() {
    let url = '/#/manager/business/edit/';
    window.open(url, '_blank');
  }

  id: string = '2'

  ManageUser(id: string) {
    let url = '/#/manager/manage-user/' + id;
    window.open(url, '_blank');
  }

  AddCertificate() {
    let url = '/#/manager/business/certificate/';
    window.open(url, '_blank');
  }

  selected_field: string = 'mst';
  countNumberCondition: any[] = [{ id: 1, filed_name: 'mst', filed_value: '' }];
  count: number = 1;

  isSearch_Advanced: boolean = true;
  filterEntity: CompanyDetailModel;
  tempFilter: CompanyDetailModel;
  filterType: MatTableFilter;

  applyFilter() {
    this.tempFilter = new CompanyDetailModel();
    let temp = [...this.countNumberCondition];
    for (let i = 0; i < temp.length; i++) {
      let element = temp[i];
      this.tempFilter[element.filed_name] = element.filed_value;
      let temp1 = element.filed_value.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
      this.tempFilter[element.filed_name] = temp1.replace('đ', 'd').toLowerCase();
    }
    this.filterEntity = Object.assign({}, this.tempFilter);
  }

  cancelFilter() {
    this.tempFilter = new CompanyDetailModel();
    this.filterEntity = new CompanyDetailModel();
    this.dataSource.filter = '';
  }

  addCond() {
    this.count++;
    let new_ob = { id: this.count, filed_name: 'mst', filed_value: '' }
    this.countNumberCondition.push(new_ob);
  }

  removeCond(id: number) {
    if (this.countNumberCondition.length === 1) {
      return;
    } else {
      let cloneArray = [...this.countNumberCondition];
      this.countNumberCondition = cloneArray.filter(item => item.id !== id);
    }
  }

  Convertdate(text: string): string {
    return text.substring(6, 8) + "/" + text.substring(4, 6) + "/" + text.substring(0, 4);
  }

  dataSource: MatTableDataSource<CompanyDetailModel> = new MatTableDataSource();
  companyList1: Array<CompanyDetailModel> = new Array<CompanyDetailModel>();
  companyList2: Array<CompanyDetailModel> = new Array<CompanyDetailModel>();
  companyList3: Array<CompanyDetailModel> = new Array<CompanyDetailModel>();
  companyList4: Array<CompanyDetailModel> = new Array<CompanyDetailModel>();
  companyList5: Array<CompanyDetailModel> = new Array<CompanyDetailModel>();
  firstdata: number

  GetAllCompany() {
    this._marketService.GetAllCompany().subscribe(
      allrecords => {
        this.companyList1 = allrecords.data[0]
        this.companyList2 = allrecords.data[1]
        this.companyList3 = allrecords.data[2]

        this.companyList4 = this.companyList1.map(a => {
          let temp = this.companyList2.filter(b => b.mst === a.mst)
          let temp1 = temp.map(c => c.ma_nganh_nghe)
          if (temp1 == undefined || temp1 == null) {
            a.ma_nganh_nghe = null
          }
          else {
            a.ma_nganh_nghe = temp1.join('; ')
          }

          let temp2 = temp.map(c => c.ten_nganh_nghe)
          if (temp2 == undefined || temp2 == null) {
            a.ten_nganh_nghe = null
          }
          else {
            a.ten_nganh_nghe = temp2.join('; ')
          }

          let temp3 = temp.map(c => c.nganh_nghe_kd_chinh)
          if (temp3 == undefined || temp3 == null) {
            a.nganh_nghe_kd_chinh = null
          }
          else {
            a.nganh_nghe_kd_chinh = temp3.join('; ')
          }

          return a
        })

        this.companyList5 = this.companyList4.map(d => {
          let temp = this.companyList3.filter(e => e.mst === d.mst)
          let temp1 = temp.map(f => f.so_giay_phep)
          if (temp1[0] == undefined || temp1[0] == null) {
            d.so_giay_phep = null
          }
          else {
            d.so_giay_phep = temp1.join('; ')
          }

          let temp2 = temp.map(f => f.ngay_cap ? this.Convertdate(f.ngay_cap) : null)
          if (temp2[0] == undefined || temp2[0] == null) {
            d.ngay_cap = null
          }
          else {
            d.ngay_cap = temp2.join('; ')
          }

          let temp3 = temp.map(f => f.ngay_het_han ? this.Convertdate(f.ngay_het_han) : null)
          if (temp3[0] == undefined || temp3[0] == null) {
            d.ngay_het_han = null
          }
          else {
            d.ngay_het_han = temp3.join('; ')
          }

          let temp4 = temp.map(f => f.noi_cap)
          if (temp4[0] == undefined || temp4[0] == null) {
            d.noi_cap = null
          }
          else {
            d.noi_cap = temp4.join('; ')
          }

          let temp5 = temp.map(f => f.co_quan_cap)
          if (temp5[0] == undefined || temp5[0] == null) {
            d.co_quan_cap = null
          }
          else {
            d.co_quan_cap = temp5.join('; ')
          }

          let temp6 = temp.map(f => f.ghi_chu)
          if (temp6[0] == undefined || temp6[0] == null) {
            d.ghi_chu == null
          }
          else {
            d.ghi_chu = temp6.join('; ')
          }

          return d
        })

        let temp = allrecords.data[3]
        this.slqltm = temp[0].slqltm
        this.slqlnl = temp[0].slqlnl
        this.slqlcn = temp[0].slqlcn

        this.companyList5.forEach(x => {
          x.ngay_bd_kd = x.ngay_bd_kd ? this.Convertdate(x.ngay_bd_kd) : ''
          x.ten_doanh_nghiep_latin = x.ten_doanh_nghiep ? x.ten_doanh_nghiep.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() : ''
          x.ten_doanh_nghiep_latin = x.ten_doanh_nghiep_latin ? x.ten_doanh_nghiep_latin.trim().normalize("NFD").replace('đ', 'd').toLowerCase() : ''
          x.nguoi_dai_dien_latin = x.nguoi_dai_dien ? x.nguoi_dai_dien.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() : ''
          x.nguoi_dai_dien_latin = x.nguoi_dai_dien_latin ? x.nguoi_dai_dien_latin.trim().normalize("NFD").replace('đ', 'd').toLowerCase() : ''
          x.dia_chi_day_du_latin = x.dia_chi_day_du ? x.dia_chi_day_du.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() : ''
          x.dia_chi_day_du_latin = x.dia_chi_day_du_latin ? x.dia_chi_day_du_latin.trim().normalize("NFD").replace('đ', 'd').toLowerCase() : ''
          x.ten_nganh_nghe_latin = x.ten_nganh_nghe ? x.ten_nganh_nghe.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() : ''
          x.ten_nganh_nghe_latin = x.ten_nganh_nghe_latin ? x.ten_nganh_nghe_latin.trim().normalize("NFD").replace('đ', 'd').toLowerCase() : ''
          x.nganh_nghe_kd_chinh_latin = x.nganh_nghe_kd_chinh ? x.nganh_nghe_kd_chinh.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() : ''
          x.nganh_nghe_kd_chinh_latin = x.nganh_nghe_kd_chinh_latin ? x.nganh_nghe_kd_chinh_latin.trim().normalize("NFD").replace('đ', 'd').toLowerCase() : ''
        })

        this.dataSource = new MatTableDataSource<CompanyDetailModel>(this.companyList5);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.paginator._intl.itemsPerPageLabel = 'Số hàng';
        this.paginator._intl.firstPageLabel = "Trang Đầu";
        this.paginator._intl.lastPageLabel = "Trang Cuối";
        this.paginator._intl.previousPageLabel = "Trang Trước";
        this.paginator._intl.nextPageLabel = "Trang Tiếp";

      });
  }

  slqltm: number
  slqlnl: number
  slqlcn: number
}