import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatAccordion, MatOption, MatPaginator, MatSelect, MatTable, MatTableDataSource } from '@angular/material';
import { DistrictModel } from 'src/app/_models/APIModel/domestic-market.model';
import { HydroElectricManagementModel, SolarEneryManagementModel } from 'src/app/_models/APIModel/electric-management.module';
import { LinkModel } from 'src/app/_models/link.model';
import { BreadCrumService } from 'src/app/_services/injectable-service/breadcrums.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-solar-enery-management',
  templateUrl: './solor-enery-management.component.html',
  styleUrls: ['/../../special_layout.scss'],
})
export class SolarEneryManagementComponent implements OnInit {
  //ViewChild 
  @ViewChild(MatAccordion, { static: true }) accordion: MatAccordion;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('TABLE', { static: false }) table: ElementRef;

  exportExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table.nativeElement);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Điện mặt trời');

    XLSX.writeFile(wb, 'Điện mặt trời.xlsx');

  }
  //Constant variable
  public readonly displayedColumns: string[] = ['index', 'ten_du_an', 'ten_doanh_nghiep', 'ten_huyen_thi', 'cong_suat_thiet_ke', 'san_luong_6_thang', 'san_luong_nam', 'doanh_thu', 'trang_thai'];
  //TS & HTML Variable
  public dataSource: MatTableDataSource<SolarEneryManagementModel> = new MatTableDataSource<SolarEneryManagementModel>();
  public filteredDataSource: MatTableDataSource<SolarEneryManagementModel> = new MatTableDataSource<SolarEneryManagementModel>();
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
  public data: Array<SolarEneryManagementModel> = [{ mst : '1', ten_du_an : 'Nhà máy điện mặt trời Thác Mơ', ten_doanh_nghiep : 'Công ty Cổ phần thủy điện Thác Mơ', ten_huyen_thi : 'Huyện Bù Gia Mập', cong_suat_thiet_ke : 50, san_luong_6_thang : 10800000, san_luong_nam : 4665600000000, doanh_thu : 9051264000000000, trang_thai : 'Đang hoạt động', ma_huyen_thi :4},
  { mst : '2', ten_du_an : 'Nhà máy điện mặt trời Lộc Ninh 1', ten_doanh_nghiep : 'Công ty Cổ phần năng lượng Lộc Ninh 1', ten_huyen_thi : 'Xã Lộc Thạnh, huyện Lộc Ninh', cong_suat_thiet_ke : 200, san_luong_6_thang : 43200000, san_luong_nam : 18662400000000, doanh_thu : 36205056000000000, trang_thai : 'Đang hoạt động', ma_huyen_thi :5},
  { mst : '3', ten_du_an : 'Nhà máy điện mặt trời Lộc Ninh 2', ten_doanh_nghiep : 'Công ty Cổ phần năng lượng Lộc Ninh 2', ten_huyen_thi : 'Xã Lộc Thạnh, huyện Lộc Ninh', cong_suat_thiet_ke : 200, san_luong_6_thang : 43200000, san_luong_nam : 18662400000000, doanh_thu : 36205056000000000, trang_thai : 'Đang hoạt động', ma_huyen_thi :5},
  { mst : '4', ten_du_an : 'Nhà máy điện mặt trời Lộc Ninh 3', ten_doanh_nghiep : 'Công ty Cổ phần năng lượng Lộc Ninh 3', ten_huyen_thi : 'Xã Lộc Thạnh, huyện Lộc Ninh', cong_suat_thiet_ke : 150, san_luong_6_thang : 32400000, san_luong_nam : 13996800000000, doanh_thu : 27153792000000000, trang_thai : 'Đang hoạt động', ma_huyen_thi :5},
  { mst : '5', ten_du_an : 'Nhà máy điện mặt trời Lộc Ninh 4', ten_doanh_nghiep : 'Công ty Cổ phần năng lượng Lộc Ninh 4', ten_huyen_thi : 'Xã Lộc Tấn, huyện Lộc Ninh', cong_suat_thiet_ke : 200, san_luong_6_thang : 43200000, san_luong_nam : 18662400000000, doanh_thu : 36205056000000000, trang_thai : 'Đang hoạt động', ma_huyen_thi :5},
  { mst : '6', ten_du_an : 'Nhà máy điện mặt trời Lộc Ninh 5', ten_doanh_nghiep : 'Công ty Cổ phần năng lượng Lộc Ninh 5', ten_huyen_thi : 'Xã Lộc Tấn, huyện Lộc Ninh', cong_suat_thiet_ke : 50, san_luong_6_thang : 10800000, san_luong_nam : 4665600000000, doanh_thu : 9051264000000000, trang_thai : 'Đang hoạt động', ma_huyen_thi :5},
  { mst : '7', ten_du_an : 'Nhà máy điện mặt trời Tân Long', ten_doanh_nghiep : 'Công ty Cổ phần năng lượng Xanh Bình Phước ', ten_huyen_thi : 'Xã Lộc Tấn, huyện Lộc Ninh', cong_suat_thiet_ke : 40, san_luong_6_thang : 8640000, san_luong_nam : 3732480000000, doanh_thu : 7241011200000000, trang_thai : 'Đang hoạt động', ma_huyen_thi :5},
  { mst : '8', ten_du_an : 'Nhà máy điện mặt trời Hải Lý Bình Phước 1', ten_doanh_nghiep : 'Công ty cổ phần Đầu tư xây dựng phát triển Năng Lượng Hải Lý Bình Phước', ten_huyen_thi : 'Xã Lộc Tấn, huyện Lộc Ninh', cong_suat_thiet_ke : 50, san_luong_6_thang : 10800000, san_luong_nam : 4665600000000, doanh_thu : 9051264000000000, trang_thai : 'Đang hoạt động', ma_huyen_thi :5},
  { mst : '9', ten_du_an : 'Nhà máy điện mặt trời Helio Lộc Thịnh 1', ten_doanh_nghiep : 'Công ty cổ phần Helio Lộc Thịnh 1', ten_huyen_thi : 'Xã Lộc Thịnh, huyện Lộc Ninh', cong_suat_thiet_ke : 50, san_luong_6_thang : 10800000, san_luong_nam : 4665600000000, doanh_thu : 9051264000000000, trang_thai : 'Đang hoạt động', ma_huyen_thi :5},
  { mst : '10', ten_du_an : 'Nhà máy điện mặt trời Helio Lộc Thịnh 2', ten_doanh_nghiep : 'Công ty cổ phần Helio Lộc Thịnh 2', ten_huyen_thi : 'Xã Lộc Thịnh, huyện Lộc Ninh', cong_suat_thiet_ke : 50, san_luong_6_thang : 10800000, san_luong_nam : 4665600000000, doanh_thu : 9051264000000000, trang_thai : 'Đang hoạt động', ma_huyen_thi :5},
  { mst : '11', ten_du_an : 'Nhà máy điện mặt trời Helio Lộc Thịnh 3', ten_doanh_nghiep : 'Công ty cổ phần Helio Lộc Thịnh 3', ten_huyen_thi : 'Xã Lộc Thịnh, huyện Lộc Ninh', cong_suat_thiet_ke : 50, san_luong_6_thang : 10800000, san_luong_nam : 4665600000000, doanh_thu : 9051264000000000, trang_thai : 'Đang hoạt động', ma_huyen_thi :5},
  { mst : '12', ten_du_an : 'Nhà máy điện mặt trời Helio Lộc Thịnh 4', ten_doanh_nghiep : 'Công ty cổ phần Helio Lộc Thịnh 4', ten_huyen_thi : 'Xã Lộc Thịnh, huyện Lộc Ninh', cong_suat_thiet_ke : 50, san_luong_6_thang : 10800000, san_luong_nam : 4665600000000, doanh_thu : 9051264000000000, trang_thai : 'Đang hoạt động', ma_huyen_thi :5},
  { mst : '13', ten_du_an : 'Nhà máy điện mặt trời Helio Lộc Thịnh 5', ten_doanh_nghiep : 'Công ty cổ phần Helio Lộc Thịnh 5', ten_huyen_thi : 'Xã Lộc Thịnh, huyện Lộc Ninh', cong_suat_thiet_ke : 50, san_luong_6_thang : 10800000, san_luong_nam : 4665600000000, doanh_thu : 9051264000000000, trang_thai : 'Đang hoạt động', ma_huyen_thi :5},
  { mst : '14', ten_du_an : 'Nhà máy điện mặt trời Helio Lộc Thịnh 6', ten_doanh_nghiep : 'Công ty cổ phần Helio Lộc Thịnh 6', ten_huyen_thi : 'Xã Lộc Thịnh, huyện Lộc Ninh', cong_suat_thiet_ke : 50, san_luong_6_thang : 10800000, san_luong_nam : 4665600000000, doanh_thu : 9051264000000000, trang_thai : 'Đang hoạt động', ma_huyen_thi :5},
  { mst : '15', ten_du_an : 'Nhà máy điện mặt trời Helio Lộc Thịnh 7', ten_doanh_nghiep : 'Công ty cổ phần Helio Lộc Thịnh 7', ten_huyen_thi : 'Xã Lộc Thịnh, huyện Lộc Ninh', cong_suat_thiet_ke : 50, san_luong_6_thang : 10800000, san_luong_nam : 4665600000000, doanh_thu : 9051264000000000, trang_thai : 'Đang hoạt động', ma_huyen_thi :5},
  { mst : '16', ten_du_an : 'Nhà máy điện mặt trời Khang Nam Solar', ten_doanh_nghiep : 'Công ty cổ phần Đầu tư địa ốc Khang Nam', ten_huyen_thi : 'Xã Lộc Thạnh, huyện Lộc Ninh', cong_suat_thiet_ke : 90, san_luong_6_thang : 19440000, san_luong_nam : 8398080000000, doanh_thu : 16292275200000000, trang_thai : 'Đang hoạt động', ma_huyen_thi :5},
  { mst : '17', ten_du_an : 'Nhà máy điện mặt trời Ninh Phước', ten_doanh_nghiep : 'Công ty CP đầu tư kinh doanh Nhà (INTESCO)', ten_huyen_thi : 'Xã Lộc Thạnh, huyện Lộc Ninh', cong_suat_thiet_ke : 200, san_luong_6_thang : 43200000, san_luong_nam : 18662400000000, doanh_thu : 36205056000000000, trang_thai : 'Đang hoạt động', ma_huyen_thi :5},
  { mst : '18', ten_du_an : 'Nhà máy điện mặt trời Lộc Tấn', ten_doanh_nghiep : 'Công ty Cổ phần năng lượng xanh Nam Việt', ten_huyen_thi : 'Xã Lộc Tấn, huyện Lộc Ninh', cong_suat_thiet_ke : 150, san_luong_6_thang : 32400000, san_luong_nam : 13996800000000, doanh_thu : 27153792000000000, trang_thai : 'Đang hoạt động', ma_huyen_thi :5},
  { mst : '19', ten_du_an : 'Nhà máy điện mặt trời Hà Đô Bình Phước', ten_doanh_nghiep : 'Công ty Cổ phần Tập Đoàn Hà Đô', ten_huyen_thi : 'Xã Lộc Tấn, huyện Lộc Ninh', cong_suat_thiet_ke : 200, san_luong_6_thang : 43200000, san_luong_nam : 18662400000000, doanh_thu : 36205056000000000, trang_thai : 'Đang hoạt động', ma_huyen_thi :5},
  { mst : '20', ten_du_an : 'Nhà máy điện mặt trời Lộc Phước', ten_doanh_nghiep : 'Công ty Cổ phần Xây dựng và Thương mại Lam Sơn', ten_huyen_thi : 'Xã Lộc Tấn, huyện Lộc Ninh', cong_suat_thiet_ke : 250, san_luong_6_thang : 54000000, san_luong_nam : 23328000000000, doanh_thu : 45256320000000000, trang_thai : 'Đang hoạt động', ma_huyen_thi :5},
  { mst : '21', ten_du_an : 'Nhà máy điện mặt trời MT1', ten_doanh_nghiep : 'Công ty cổ phần Thương mại Kỹ Thuật MT', ten_huyen_thi : 'Ấp Thạnh Phú, xã Lộc Thạnh', cong_suat_thiet_ke : 30, san_luong_6_thang : 6480000, san_luong_nam : 2799360000000, doanh_thu : 5430758400000000, trang_thai : 'Đang hoạt động', ma_huyen_thi :5},
  { mst : '22', ten_du_an : 'Nhà máy điện mặt trời MT2', ten_doanh_nghiep : 'Công ty cổ phần Thương mại Kỹ Thuật MT', ten_huyen_thi : 'Ấp Thạnh Phú, xã Lộc Thạnh', cong_suat_thiet_ke : 30, san_luong_6_thang : 6480000, san_luong_nam : 2799360000000, doanh_thu : 5430758400000000, trang_thai : 'Đang hoạt động', ma_huyen_thi :5},
  { mst : '23', ten_du_an : 'Nhà máy điện mặt trời MT3', ten_doanh_nghiep : 'Công ty cổ phần Thương mại Kỹ Thuật MT', ten_huyen_thi : 'Ấp Thạnh Phú, xã Lộc Thạnh, Lộc Ninh', cong_suat_thiet_ke : 30, san_luong_6_thang : 6480000, san_luong_nam : 2799360000000, doanh_thu : 5430758400000000, trang_thai : 'Đang hoạt động', ma_huyen_thi :5},
  { mst : '24', ten_du_an : 'Nhà máy điện mặt trời MT4', ten_doanh_nghiep : 'Công ty cổ phần Thương mại Kỹ Thuật MT', ten_huyen_thi : 'Ấp Thạnh Phú, xã Lộc Thạnh, Lộc Ninh', cong_suat_thiet_ke : 50, san_luong_6_thang : 10800000, san_luong_nam : 4665600000000, doanh_thu : 9051264000000000, trang_thai : 'Đang hoạt động', ma_huyen_thi :5},
  { mst : '25', ten_du_an : 'Nhà máy điện mặt trời Tata Bình Phước (đổi thành nhà máy điện mặt trời Fecon)', ten_doanh_nghiep : 'Công ty Cổ phần năng lượng Fecon ', ten_huyen_thi : 'Xã Lộc Tấn, huyện Lộc Ninh', cong_suat_thiet_ke : 48.84, san_luong_6_thang : 10549440, san_luong_nam : 4557358080000, doanh_thu : 8841274675200000, trang_thai : 'Đang hoạt động', ma_huyen_thi :5},
  { mst : '26', ten_du_an : 'Nhà máy điện mặt trời Lộc Thạnh 1-1', ten_doanh_nghiep : 'Công ty Cổ phần năng lượng tái tạo và Nông nghiệp Bình Phước', ten_huyen_thi : 'Xã Lộc Thạnh, huyện Lộc Ninh', cong_suat_thiet_ke : 50, san_luong_6_thang : 10800000, san_luong_nam : 4665600000000, doanh_thu : 9051264000000000, trang_thai : 'Đang hoạt động', ma_huyen_thi :5},
  { mst : '27', ten_du_an : 'Nhà máy điện mặt trời 50MWp Lộc Ninh', ten_doanh_nghiep : 'Công ty Asherlight Energy PTE. Ltd ', ten_huyen_thi : 'xã Lộc Thạnh, huyện Lộc Ninh', cong_suat_thiet_ke : 50, san_luong_6_thang : 10800000, san_luong_nam : 4665600000000, doanh_thu : 9051264000000000, trang_thai : 'Đang hoạt động', ma_huyen_thi :5},
  { mst : '28', ten_du_an : 'Nhà máy điện mặt trời Thanh Lương', ten_doanh_nghiep : 'Công ty cổ phần năng lượng Phú Lương', ten_huyen_thi : 'Xã Thanh Lương thị xã Bình Long', cong_suat_thiet_ke : 50, san_luong_6_thang : 10800000, san_luong_nam : 4665600000000, doanh_thu : 9051264000000000, trang_thai : 'Đang hoạt động', ma_huyen_thi :3},
  { mst : '29', ten_du_an : 'Nhà máy điện mặt trời Đồng Xoài', ten_doanh_nghiep : 'Công ty cổ phần bất động sản Tiến Phước ', ten_huyen_thi : 'Xã Đồng Tiến huyện Đồng Phú', cong_suat_thiet_ke : 48, san_luong_6_thang : 10368000, san_luong_nam : 4478976000000, doanh_thu : 8689213440000000, trang_thai : 'Đang hoạt động', ma_huyen_thi :8},
  { mst : '30', ten_du_an : 'Nhà máy điện mặt trời Đồng Nơ ', ten_doanh_nghiep : 'Công ty TNHH Five Stars Solar ', ten_huyen_thi : 'Xã Đồng Nơ huyện Hớn Quản', cong_suat_thiet_ke : 50, san_luong_6_thang : 10800000, san_luong_nam : 4665600000000, doanh_thu : 9051264000000000, trang_thai : 'Đang hoạt động', ma_huyen_thi :7},
  { mst : '31', ten_du_an : 'Nhà máy điện mặt trời Tân Hưng 1', ten_doanh_nghiep : 'Công ty TNHH Tân Hưng ', ten_huyen_thi : 'Xã Lộc Tấn, huyện Lộc Ninh', cong_suat_thiet_ke : 50, san_luong_6_thang : 10800000, san_luong_nam : 4665600000000, doanh_thu : 9051264000000000, trang_thai : 'Đang hoạt động', ma_huyen_thi :5},
  { mst : '32', ten_du_an : 'Nhà máy điện mặt trời Tân Hưng 2', ten_doanh_nghiep : 'Công ty TNHH Tân Hưng ', ten_huyen_thi : 'Xã Lộc Tấn, huyện Lộc Ninh', cong_suat_thiet_ke : 50, san_luong_6_thang : 10800000, san_luong_nam : 4665600000000, doanh_thu : 9051264000000000, trang_thai : 'Đang hoạt động', ma_huyen_thi :5},
  { mst : '33', ten_du_an : 'Nhà máy điện mặt trời Glden Star Lộc Tấn 1', ten_doanh_nghiep : 'Công ty TNHH điện mặt trời Golden Star Lộc Tấn 1 ', ten_huyen_thi : 'Xã Lộc Tấn, huyện Lộc Ninh', cong_suat_thiet_ke : 50, san_luong_6_thang : 10800000, san_luong_nam : 4665600000000, doanh_thu : 9051264000000000, trang_thai : 'Đang hoạt động', ma_huyen_thi :5},
  { mst : '34', ten_du_an : 'Nhà máy điện mặt trời Glden Star Lộc Tấn 2', ten_doanh_nghiep : 'Công ty TNHH điện mặt trời Golden Star Lộc Tấn 2', ten_huyen_thi : 'Xã Lộc Tấn, huyện Lộc Ninh', cong_suat_thiet_ke : 50, san_luong_6_thang : 10800000, san_luong_nam : 4665600000000, doanh_thu : 9051264000000000, trang_thai : 'Đang hoạt động', ma_huyen_thi :5},
  { mst : '35', ten_du_an : 'Nhà máy điện mặt trờì Hải Lý Bình Phước 2', ten_doanh_nghiep : 'Công ty cổ phần đầu tư xây dựng phát triển năng lượng Hải Lý Bình Phước', ten_huyen_thi : 'Xã Lộc Tấn, huyện Lộc Ninh', cong_suat_thiet_ke : 180, san_luong_6_thang : 38880000, san_luong_nam : 16796160000000, doanh_thu : 32584550400000000, trang_thai : 'Đang hoạt động', ma_huyen_thi :5},
  { mst : '36', ten_du_an : 'Nhà máy điện mặt trời Gainty Group 1', ten_doanh_nghiep : 'Công ty cổ phần Gianty Alpha Group', ten_huyen_thi : 'Xã Lộc Thạnh huyện Lộc Ninh', cong_suat_thiet_ke : 50, san_luong_6_thang : 10800000, san_luong_nam : 4665600000000, doanh_thu : 9051264000000000, trang_thai : 'Đang hoạt động', ma_huyen_thi :5},
  { mst : '37', ten_du_an : 'Nhà máy điện mặt trời Sunsise 1', ten_doanh_nghiep : 'Liên doanh Công ty TNHH Đầu tư và kỹ nghệ điện Sunrise Việt Nam - Công ty TNHH Tân Hưng', ten_huyen_thi : 'Xã Thanh Lương - Bình Long', cong_suat_thiet_ke : 49, san_luong_6_thang : 10584000, san_luong_nam : 4572288000000, doanh_thu : 8870238720000000, trang_thai : 'Đang hoạt động', ma_huyen_thi :3},
  { mst : '38', ten_du_an : 'Nhà máy điện mặt trời Nậm La', ten_doanh_nghiep : 'Công ty Cổ phần thủy điện Nậm La', ten_huyen_thi : 'Xã Lộc Tấn, huyện Lộc Ninh', cong_suat_thiet_ke : 100, san_luong_6_thang : 21600000, san_luong_nam : 9331200000000, doanh_thu : 18102528000000000, trang_thai : 'Đang hoạt động', ma_huyen_thi :5},
  { mst : '39', ten_du_an : 'Nhà máy điện mặt trời Gransolar BP', ten_doanh_nghiep : 'Tập đoàn GranSor', ten_huyen_thi : 'Xã An Khương, huyện Hớn Quản', cong_suat_thiet_ke : 50, san_luong_6_thang : 10800000, san_luong_nam : 4665600000000, doanh_thu : 9051264000000000, trang_thai : 'Đang hoạt động', ma_huyen_thi :7},
  { mst : '40', ten_du_an : 'Nhà máy điện mặt trời Srok Phú Miêng', ten_doanh_nghiep : 'Công ty Cổ phần thủy điện Srok Phú Miêng IDICO', ten_huyen_thi : 'Xã Long Bình, huyện Phú Riềng ', cong_suat_thiet_ke : 49, san_luong_6_thang : 10584000, san_luong_nam : 4572288000000, doanh_thu : 8870238720000000, trang_thai : 'Đang hoạt động', ma_huyen_thi :11},
  { mst : '41', ten_du_an : 'nhà máy điện mặt trời Gelex Bình Phước 1', ten_doanh_nghiep : 'Công ty TNHH MTV năng lượng Gelex ', ten_huyen_thi : 'Xã Đăk Ơ, huyện Bù Gia Mập', cong_suat_thiet_ke : 270, san_luong_6_thang : 58320000, san_luong_nam : 25194240000000, doanh_thu : 48876825600000000, trang_thai : 'Đang hoạt động', ma_huyen_thi :4},
  { mst : '42', ten_du_an : 'Nhà máy điện mặt trời Gelex Bình Phước 2', ten_doanh_nghiep : 'Công ty TNHH MTV năng lượng Gelex ', ten_huyen_thi : 'Xã Đăk Ơ, huyện Bù Gia Mập', cong_suat_thiet_ke : 210, san_luong_6_thang : 45360000, san_luong_nam : 19595520000000, doanh_thu : 38015308800000000, trang_thai : 'Đang hoạt động', ma_huyen_thi :4},
  { mst : '43', ten_du_an : 'Nhà máy điện mặt trời Jaks Bình Phước', ten_doanh_nghiep : 'Tập đoàn Jaks Resources Berhad ', ten_huyen_thi : 'Ấp Thạnh Phú, xã Lộc Thạnh, huyện Lộc Ninh', cong_suat_thiet_ke : 148.8, san_luong_6_thang : 32140800, san_luong_nam : 13884825600000, doanh_thu : 26936561664000000, trang_thai : 'Đang hoạt động', ma_huyen_thi :5},
  { mst : '44', ten_du_an : 'Dự án Nhà máy điện mặt trời Lộc Thiện', ten_doanh_nghiep : 'Công ty Cổ phần kim loại màu Sa Pa', ten_huyen_thi : 'Xã Lộc Thiện, huyện Lộc Ninh, tỉnh Bình Phước', cong_suat_thiet_ke : 250, san_luong_6_thang : 54000000, san_luong_nam : 23328000000000, doanh_thu : 45256320000000000, trang_thai : 'Đang hoạt động', ma_huyen_thi :5},
  { mst : '45', ten_du_an : 'Nhà máy điện mặt trời Đak Glun', ten_doanh_nghiep : 'Công ty CP thiết bị phụ tùng Sài Gòn', ten_huyen_thi : 'Xã đường 10, huyện Bù Đăng', cong_suat_thiet_ke : 49, san_luong_6_thang : 10584000, san_luong_nam : 4572288000000, doanh_thu : 8870238720000000, trang_thai : 'Đang hoạt động', ma_huyen_thi :9},
  { mst : '46', ten_du_an : 'Dự án Nhà máy điện mặt trời Lộc Ninh - giai đoạn 2: Lộc Ninh 6,7,8,9,10,11,12', ten_doanh_nghiep : 'Công ty Cổ phần Tập đoàn Hưng Hải', ten_huyen_thi : 'Xã Lộc Tấn và xã Lộc Thịnh, huyện Lộc Ninh', cong_suat_thiet_ke : 1200, san_luong_6_thang : 259200000, san_luong_nam : 111974400000000, doanh_thu : 217230336000000000, trang_thai : 'Đang hoạt động', ma_huyen_thi :5},
  { mst : '47', ten_du_an : 'Nhà máy điện mặt trời Đức Thắng 1', ten_doanh_nghiep : 'Công ty TNHH Thương mại Xây dựng Đức Thắng', ten_huyen_thi : 'xã Lộc Tấn, huyện Lộc Ninh', cong_suat_thiet_ke : 50, san_luong_6_thang : 10800000, san_luong_nam : 4665600000000, doanh_thu : 9051264000000000, trang_thai : 'Đang hoạt động', ma_huyen_thi :5},
  { mst : '48', ten_du_an : 'Nhà máy điện mặt trời Đức Thắng 2', ten_doanh_nghiep : 'Công ty TNHH Thương mại Xây dựng Đức Thắng', ten_huyen_thi : 'xã Lộc Tấn, huyện Lộc Ninh', cong_suat_thiet_ke : 150, san_luong_6_thang : 32400000, san_luong_nam : 13996800000000, doanh_thu : 27153792000000000, trang_thai : 'Đang hoạt động', ma_huyen_thi :5},
  { mst : '49', ten_du_an : 'Nhà máy điện mặt trời Đức Thắng 3', ten_doanh_nghiep : 'Công ty TNHH Thương mại Xây dựng Đức Thắng', ten_huyen_thi : 'xã Lộc Tấn, huyện Lộc Ninh', cong_suat_thiet_ke : 200, san_luong_6_thang : 43200000, san_luong_nam : 18662400000000, doanh_thu : 36205056000000000, trang_thai : 'Đang hoạt động', ma_huyen_thi :5},
  { mst : '50', ten_du_an : 'Nhà máy điện mặt trời Hero Future ', ten_doanh_nghiep : 'Tập Đoàn Hero Future Energies Asia Pte.Ltd ', ten_huyen_thi : 'Xã Lộc Tấn, huyện Lộc Ninh', cong_suat_thiet_ke : 100, san_luong_6_thang : 21600000, san_luong_nam : 9331200000000, doanh_thu : 18102528000000000, trang_thai : 'Đang hoạt động', ma_huyen_thi :5},
  { mst : '51', ten_du_an : 'Nhà máy điện mặt trời năng lượng Bình Phước (1454/UBND-TH ngày 28/5/2019) Trung Hà Nội', ten_doanh_nghiep : 'Công ty Cổ phần năng lượng Bình Phước', ten_huyen_thi : 'Xã Lộc Tấn, huyện Lộc Ninh', cong_suat_thiet_ke : 200, san_luong_6_thang : 43200000, san_luong_nam : 18662400000000, doanh_thu : 36205056000000000, trang_thai : 'Đang hoạt động', ma_huyen_thi :5},
  { mst : '52', ten_du_an : 'Nhà máy điện mặt trời Phú Minh', ten_doanh_nghiep : 'Công ty Cổ phần Tập đoàn Phú Minh', ten_huyen_thi : 'Xã Lộc Tấn, huyện Lộc Ninh', cong_suat_thiet_ke : 150, san_luong_6_thang : 32400000, san_luong_nam : 13996800000000, doanh_thu : 27153792000000000, trang_thai : 'Đang hoạt động', ma_huyen_thi :5},
  { mst : '53', ten_du_an : 'Nhà máy điện mặt trời Minh Tâm', ten_doanh_nghiep : 'Công ty Cổ phần Điện Sài Gòn Gia Định', ten_huyen_thi : 'Xã Minh Tâm, huyện Hớn Quản, tỉnh Bình Phước', cong_suat_thiet_ke : 350, san_luong_6_thang : 75600000, san_luong_nam : 32659200000000, doanh_thu : 63358848000000000, trang_thai : 'Đang hoạt động', ma_huyen_thi :7},
  { mst : '54', ten_du_an : 'Công ty Cổ phần năng lượng TNPOWER và Công ty Cổ phần bất động sản Hano - VID ', ten_doanh_nghiep : 'Công ty Cổ phần năng lượng TNPOWER và Công ty Cổ phần bất động sản Hano - VID ', ten_huyen_thi : 'Hồ Suối Giai', cong_suat_thiet_ke : 49, san_luong_6_thang : 10584000, san_luong_nam : 4572288000000, doanh_thu : 8870238720000000, trang_thai : 'Đang hoạt động', ma_huyen_thi :8},
  { mst : '55', ten_du_an : 'Nhà máy điện mặt trời Suối Giai Ecoplexus', ten_doanh_nghiep : 'Công ty CP điện mặt trời Suối Giai Ecoplexus', ten_huyen_thi : 'Hồ Suối Giai', cong_suat_thiet_ke : 49, san_luong_6_thang : 10584000, san_luong_nam : 4572288000000, doanh_thu : 8870238720000000, trang_thai : 'Đang hoạt động', ma_huyen_thi :8},
  { mst : '56', ten_du_an : 'Công ty Cổ phần Whaup Nghệ An (Thuận chủ trương tại Thông báo số 180/TB-UBND ngày 25/7/2019) trên hồ Đồng Xoài', ten_doanh_nghiep : 'Công ty Cổ phần Whaup Nghệ An', ten_huyen_thi : 'Hồ Đồng Xoài ', cong_suat_thiet_ke : 200, san_luong_6_thang : 43200000, san_luong_nam : 18662400000000, doanh_thu : 36205056000000000, trang_thai : 'Đang hoạt động', ma_huyen_thi :2},
  { mst : '57', ten_du_an : 'Công ty Cổ phần Hulk Enegry trên (hồ Đồng Xoài)', ten_doanh_nghiep : 'Công ty Cổ phần Hulk Enegry ', ten_huyen_thi : 'Hồ Đồng Xoài ', cong_suat_thiet_ke : 48.8, san_luong_6_thang : 10540800, san_luong_nam : 4553625600000, doanh_thu : 8834033664000000, trang_thai : 'Đang hoạt động', ma_huyen_thi :2},
  { mst : '58', ten_du_an : 'Liên doanh Công ty Cổ phần Phong Tài    Phúc Gia và Công ty TNHH Gia Nam (2220/UBND-TH ngày 30/7/2019 của UBND  hồ Thác Mơ với quy mô công suất khoảng 200MW).', ten_doanh_nghiep : 'Liên doanh Công ty Cổ phần Phong Tài    Phúc Gia và Công ty TNHH Gia Nam', ten_huyen_thi : 'Hồ Thác Mơ', cong_suat_thiet_ke : 200, san_luong_6_thang : 43200000, san_luong_nam : 18662400000000, doanh_thu : 36205056000000000, trang_thai : 'Đang hoạt động', ma_huyen_thi :1},
  { mst : '59', ten_du_an : 'Công ty Cổ phần Xây dựng và Thương mại Lam Sơn', ten_doanh_nghiep : 'Công ty Cổ phần Xây dựng và Thương mại Lam Sơn', ten_huyen_thi : 'Hồ Thác Mơ', cong_suat_thiet_ke : 200, san_luong_6_thang : 43200000, san_luong_nam : 18662400000000, doanh_thu : 36205056000000000, trang_thai : 'Đang hoạt động', ma_huyen_thi :1},
  { mst : '60', ten_du_an : 'Công ty TNHH TNHH POWER Thăng Long.', ten_doanh_nghiep : 'Công ty TNHH TNHH POWER Thăng Long.', ten_huyen_thi : 'Hồ Phước Hòa', cong_suat_thiet_ke : 49, san_luong_6_thang : 10584000, san_luong_nam : 4572288000000, doanh_thu : 8870238720000000, trang_thai : 'Đang hoạt động', ma_huyen_thi :3},
  { mst : '61', ten_du_an : 'Công ty Cổ đầu tư phát triển năng lượng Châu Á - Thái Bình Dương', ten_doanh_nghiep : 'Công ty Cổ đầu tư phát triển năng lượng Châu Á - Thái Bình Dương', ten_huyen_thi : 'Hồ Phước Hòa', cong_suat_thiet_ke : 250, san_luong_6_thang : 54000000, san_luong_nam : 23328000000000, doanh_thu : 45256320000000000, trang_thai : 'Đang hoạt động', ma_huyen_thi :3},
  { mst : '62', ten_du_an : 'Nhà máy điện mặt trời nổi trên hồ thủy điện Srok Phu Miêng ', ten_doanh_nghiep : 'Công ty cổ phần năng lượng DT3', ten_huyen_thi : 'Hồ Srok Phu Mieng', cong_suat_thiet_ke : 126, san_luong_6_thang : 27216000, san_luong_nam : 11757312000000, doanh_thu : 22809185280000000, trang_thai : 'Đang hoạt động', ma_huyen_thi :7},
  { mst : '63', ten_du_an : 'Nhà máy điện mặt trời Srok Phu Miêng giai đoạn 2 ', ten_doanh_nghiep : 'Công ty Cổ phần thủy điện Srok Phú Miêng IDICO', ten_huyen_thi : 'Hồ Srok Phu Mieng', cong_suat_thiet_ke : 125, san_luong_6_thang : 27000000, san_luong_nam : 11664000000000, doanh_thu : 22628160000000000, trang_thai : 'Đang hoạt động', ma_huyen_thi :7},
  
  
  ]
  //Only TS Variable
  years: number[] = [];
  doanhThu: number;
  congXuat: number;
  sanluongnam: number;
  soLuongDoanhNghiep: number;
  isChecked: boolean;
  private _linkOutput: LinkModel = new LinkModel();
  constructor(private _breadCrumService: BreadCrumService) {
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
  applyDistrictFilter(event) {
    let filteredData = [];

    event.value.forEach(element => {
      this.dataSource.data.filter(x => x.ma_huyen_thi == element).forEach(x => filteredData.push(x));
    });

    if (!filteredData.length) {
      if (event.value.length)
        this.filteredDataSource.data = [];
      else
        this.filteredDataSource.data = this.dataSource.data;
    }
    else {
      this.filteredDataSource.data = filteredData;
    }
    this.caculatorValue();
    this.paginatorAgain();
  }
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
    this.doanhThu = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => x.doanh_thu).reduce((a, b) => a + b) : 0;
    this.soLuongDoanhNghiep = this.filteredDataSource.data.length;
    this.congXuat = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => x.cong_suat_thiet_ke).reduce((a, b) => a + b) : 0;
    this.sanluongnam = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => x.san_luong_nam).reduce((a, b) => a + b) : 0;
  }
  // isHidden(row : any){
  //     return (this.isChecked)? (row.is_het_han) : false;
  // }

  applyActionCheck(event) {
    this.filteredDataSource.filter = (event.checked) ? "true" : "";
    this.caculatorValue();
    this.paginatorAgain();
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