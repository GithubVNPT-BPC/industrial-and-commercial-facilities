import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatAccordion, MatPaginator, MatTable, MatTableDataSource } from '@angular/material';
import { DistrictModel } from 'src/app/_models/APIModel/domestic-market.model';
import { certificate_regulation } from 'src/app/_models/APIModel/certificate-regulation';
import { LinkModel } from 'src/app/_models/link.model';
import { BreadCrumService } from 'src/app/_services/injectable-service/breadcrums.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-certificate-regulation',
  templateUrl: './certificate-regulation.component.html',
  styleUrls: ['/../../special_layout.scss'],
})
export class CertificateRegulationComponent implements OnInit {

  //ViewChild 
  @ViewChild(MatAccordion, { static: true }) accordion: MatAccordion;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('TABLE', { static: false }) table: ElementRef;

  exportExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table.nativeElement);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Công bố hợp quy');

    XLSX.writeFile(wb, 'Công bố hợp quy.xlsx');

  }
  //Constant variable
  public readonly displayedColumns: string[] = ['index', 'ma_so_thue', 'ten_doanh_nghiep', 'loai_san_pham', 'san_pham_cong_bo',
    'email', 'dien_thoai', 'ban_cong_bo_hop_quy', 'ngay_tiep_nhan_cong_bo', 'nhan_san_pham', 'tieu_chuan_san_pham_ap_dung', 'noi_cap',
  ];
  //TS & HTML Variable
  public dataSource: MatTableDataSource<certificate_regulation> = new MatTableDataSource<certificate_regulation>();
  public filteredDataSource: MatTableDataSource<certificate_regulation> = new MatTableDataSource<certificate_regulation>();
  public districts: DistrictModel[] = [{ id: 1, ten_quan_huyen: 'Thị xã Phước Long' },
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

  public data: Array<certificate_regulation> =
    [
      {
        ma_so_thue: '0316040707',
        ten_doanh_nghiep: 'Công ty TNHH rượu thảo dược Vạn Niên Tùng',
        loai_san_pham: 'THỰC PHẨM',
        san_pham_cong_bo: 'Rượu thảo dược Vạn Niên Tùng: cốt chanh dây; cốt khổ hoa rừng, cốt mè đen, cốt nhàu, cốt tỏi',
        email: 'info@vannientungwine.com',
        dien_thoai: '0972194333',
        ban_cong_bo_hop_quy: 'Số 01/VNT/2020; 02/VNT/2020; 03/VNT/2020; 04/VNT/2020; 05/VNT/2020',
        ngay_tiep_nhan_cong_bo: '17/8/2020',
        nhan_san_pham: 'assets/img/CBHQ/CBHQ1.png',
        tieu_chuan_san_pham_ap_dung: null,
        noi_cap: 'Số KT3 Trung tâm kỹ thuật đo lường chất lượng 3'
      },
      {
        ma_so_thue: '3801068196',
        ten_doanh_nghiep: 'Công ty TNHH MTV SX tinh bột mì Đạt Thành',
        loai_san_pham: 'THỰC PHẨM',
        san_pham_cong_bo: 'Tinh bột mì ướt',
        email: null,
        dien_thoai: '0918649401',
        ban_cong_bo_hop_quy: 'Số 01/CTY-ĐT/2019',
        ngay_tiep_nhan_cong_bo: '21/10/2019',
        nhan_san_pham: null,
        tieu_chuan_san_pham_ap_dung: null,
        noi_cap: 'Trung tâm kỹ thuật đo lường chất lượng 3'
      },
      {
        ma_so_thue: '3800346919',
        ten_doanh_nghiep: 'Công ty cổ phần Ong Mật Bình  Phước',
        loai_san_pham: 'THỰC PHẨM',
        san_pham_cong_bo: 'Mật ong lên men Cashew; Mật ong lên men báo gấm',
        email: null,
        dien_thoai: '0888439479',
        ban_cong_bo_hop_quy: 'Số 01/BP/2020; 02/BP/2020',
        ngay_tiep_nhan_cong_bo: '09/7/2020',
        nhan_san_pham: 'assets/img/CBHQ/CBHQ2.png',
        tieu_chuan_san_pham_ap_dung: null,
        noi_cap: 'Trung tâm chứng nhận phù hộp Quacert'
      },
      {
        ma_so_thue: '3801221461',
        ten_doanh_nghiep: 'Công ty cổ phần đầu tư Sơn Phát Bình Phước',
        loai_san_pham: 'MAY MẶC',
        san_pham_cong_bo: 'Khẩu trang 4 lớp dùng một lần; khẩu trang 3 lớp dùng  một lần',
        email: null,
        dien_thoai: null,
        ban_cong_bo_hop_quy: 'Số3801221461/SPBP/0108143074',
        ngay_tiep_nhan_cong_bo: '01/9/2020',
        nhan_san_pham: 'assets/img/CBHQ/CBHQ3.png',
        tieu_chuan_san_pham_ap_dung: 'TCCS01:2020/SPBP',
        noi_cap: 'TQC.5.1974 ngày 21/8/2020 do TT kiểm nghiệm và chứng  nhận chất lượng TQC'
      }
    ]

  //Only TS Variable
  years: number[] = [];
  doanhThu: number;
  congXuat: number;
  sanluongnam: number;
  soLuongDoanhNghiep: number;
  isChecked: boolean;
  constructor() {
  }

  ngOnInit() {
    this.years = this.getYears();

    this.dataSource.data = this.data;
    this.filteredDataSource.data = [...this.dataSource.data];
    this.caculatorValue();
    this.paginatorAgain();
    this.autoOpen();
  }

  autoOpen() {
    setTimeout(() => this.accordion.openAll(), 1000);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filteredDataSource.filter = filterValue.trim().toLowerCase();
  }

  get(time_id: number) {

  }

  log(any) {
    console.log(any);
  }

  getYears() {
    return Array(5).fill(1).map((element, index) => new Date().getFullYear() - index);
  }

  getValueOfHydroElectric(value: any) {

  }

  // applyDistrictFilter(event) {
  //   let filteredData = [];

  //   event.value.forEach(element => {
  //     this.dataSource.data.filter(x => x.ma_huyen_thi == element).forEach(x => filteredData.push(x));
  //   });

  //   if (!filteredData.length) {
  //     if (event.value.length)
  //       this.filteredDataSource.data = [];
  //     else
  //       this.filteredDataSource.data = this.dataSource.data;
  //   }
  //   else {
  //     this.filteredDataSource.data = filteredData;
  //   }
  //   this.caculatorValue();
  //   this.paginatorAgain();
  // }

  paginatorAgain() {
    if (this.filteredDataSource.data.length) {
      this.filteredDataSource.paginator = this.paginator;
      this.paginator._intl.itemsPerPageLabel = 'Số hàng';
      this.paginator._intl.firstPageLabel = "Trang Đầu";
      this.paginator._intl.lastPageLabel = "Trang Cuối";
      this.paginator._intl.previousPageLabel = "Trang Trước";
      this.paginator._intl.nextPageLabel = "Trang Tiếp";
    }
  }
  caculatorValue() {
    // this.doanhThu = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => x.Dt).reduce((a, b) => a + b) : 0;
    this.soLuongDoanhNghiep = this.filteredDataSource.data.length;
    // this.congXuat = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => x.Cx).reduce((a, b) => a + b) : 0;
    // this.sanluongnam = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => x.Slnck).reduce((a, b) => a + b) : 0;
  }
  isHidden(row: any) {
    return (this.isChecked) ? (row.is_het_han) : false;
  }

  applyActionCheck(event) {
    this.filteredDataSource.filter = (event.checked) ? "true" : "";
    this.caculatorValue();
    this.paginatorAgain();
  }

}
