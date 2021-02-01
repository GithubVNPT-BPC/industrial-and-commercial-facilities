import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatOption, MatSelect, MatTable, MatTableDataSource } from '@angular/material';
import { element } from 'protractor';
import { SCTService } from 'src/app/_services/APIService/sct.service';
import { MatAccordion } from '@angular/material/expansion';
import { MatPaginator } from '@angular/material/paginator';
import { District } from 'src/app/_models/district.model';
import { TFE } from 'src/app/_models/APIModel/trade-development.model';
import * as XLSX from 'xlsx';
import * as moment from 'moment';

@Component({
  selector: 'app-trade-fairs-exhibitions',
  templateUrl: './trade-fairs-exhibitions.component.html',
  styleUrls: ['../../../special_layout.scss'],
})
export class TradeFairsExhibitionsComponent implements OnInit {

  private readonly DataTFE: TFE[] = [
    {
      Ten_doanh_nghiep: 'Công ty CP Đầu tư - BĐS Thành Phương',
      Dia_chi: 'Ấp 2, Phường Tiến Thành, TP.Đồng Xoài, Bình Phước',
      Ma_so_thue: '3702457025-003',
      Ten_Hoi_cho: 'Hội chợ thương mại Xuân Tân Sửu 2021',
      Thoi_gian_to_chuc: '25/01/2021 đến 11/02/2021',
      Dia_diem_to_chuc: 'Khu đô thị The Gold City, KP2, Phường Tiến Thành, TP.Đồng Xoài, Bình Phước',
      Ke_hoach: 'Kế hoạch năm 2021',
      So_luong_gian_hang_du_kien: '150 gian',
      San_pham_ban_tai_hoi_cho: 'Tổng hợp',
      So_Van_ban: '',
      Co_quan_ban_hanh: '',
      Ngay_thang_nam: '',
      Id_quan_huyen: 2
    },
    {
      Ten_doanh_nghiep: 'Công ty TNHH TMDV Văn hóa Sài Gòn Hưng Nguyễn',
      Dia_chi: '323/18 Vườn Lài, P.Phú Thọ Hòa, Q.Tân Phú, TP.HCM',
      Ma_so_thue: '314430236',
      Ten_Hoi_cho: 'Hội chợ thương mại gỗ mỹ nghệ các sản phẩm công nghiệp nông thôn 2020  ',
      Thoi_gian_to_chuc: '10/4/2021 đến 18/4/2021',
      Dia_diem_to_chuc: 'Thị trấn Chơn Thành, huyện Chơn Thành',
      Ke_hoach: 'Kế hoạch năm 2021',
      So_luong_gian_hang_du_kien: '100 gian',
      San_pham_ban_tai_hoi_cho: 'Tổng hợp',
      So_Van_ban: '',
      Co_quan_ban_hanh: '',
      Ngay_thang_nam: '',
      Id_quan_huyen: 10
    },
    {
      Ten_doanh_nghiep: 'Công ty TNHH TMDV Văn hóa Sài Gòn Hưng Nguyễn',
      Dia_chi: '323/18 Vườn Lài, P.Phú Thọ Hòa, Q.Tân Phú, TP.HCM',
      Ma_so_thue: '314430236',
      Ten_Hoi_cho: 'Hội chợ thương mại gỗ mỹ nghệ các sản phẩm công nghiệp nông thôn 2020  ',
      Thoi_gian_to_chuc: '23/4/2021 đến 01/5/2021',
      Dia_diem_to_chuc: 'TP.Đồng Xoài',
      Ke_hoach: 'Kế hoạch năm 2021',
      So_luong_gian_hang_du_kien: '150 gian',
      San_pham_ban_tai_hoi_cho: 'Tổng hợp',
      So_Van_ban: '',
      Co_quan_ban_hanh: '',
      Ngay_thang_nam: '',
      Id_quan_huyen: 2
    },
    {
      Ten_doanh_nghiep: 'Công ty TNHH TMDV Văn hóa Sài Gòn Hưng Nguyễn',
      Dia_chi: '323/18 Vườn Lài, P.Phú Thọ Hòa, Q.Tân Phú, TP.HCM',
      Ma_so_thue: '314430236',
      Ten_Hoi_cho: 'Hội chợ thương mại gỗ mỹ nghệ các sản phẩm công nghiệp nông thôn 2020  ',
      Thoi_gian_to_chuc: '06/5/2021 đến 16/5/2021',
      Dia_diem_to_chuc: 'Thị trấn Tân Khai, huyện Hớn Quản',
      Ke_hoach: 'Kế hoạch năm 2021',
      So_luong_gian_hang_du_kien: '100 gian',
      San_pham_ban_tai_hoi_cho: 'Tổng hợp',
      So_Van_ban: '',
      Co_quan_ban_hanh: '',
      Ngay_thang_nam: '',
      Id_quan_huyen: 7
    },
    {
      Ten_doanh_nghiep: 'Công ty TNHH TMDV Văn hóa Sài Gòn Hưng Nguyễn',
      Dia_chi: '323/18 Vườn Lài, P.Phú Thọ Hòa, Q.Tân Phú, TP.HCM',
      Ma_so_thue: '314430236',
      Ten_Hoi_cho: 'Hội chợ thương mại gỗ mỹ nghệ các sản phẩm công nghiệp nông thôn 2020  ',
      Thoi_gian_to_chuc: '15/5/2021 đến 27/5/2021',
      Dia_diem_to_chuc: 'Đường Lê Văn Sỹ, P.Long Phước, Tx.Phước Long',
      Ke_hoach: 'Kế hoạch năm 2021',
      So_luong_gian_hang_du_kien: '100 gian',
      San_pham_ban_tai_hoi_cho: 'Tổng hợp',
      So_Van_ban: '',
      Co_quan_ban_hanh: '',
      Ngay_thang_nam: '',
      Id_quan_huyen: 1
    },
    {
      Ten_doanh_nghiep: 'Công ty TNHH TMDV Văn hóa Sài Gòn Hưng Nguyễn',
      Dia_chi: '323/18 Vườn Lài, P.Phú Thọ Hòa, Q.Tân Phú, TP.HCM',
      Ma_so_thue: '314430236',
      Ten_Hoi_cho: 'Hội chợ thương mại gỗ mỹ nghệ các sản phẩm công nghiệp nông thôn 2020  ',
      Thoi_gian_to_chuc: '01/6/2021 đến 09/6/2021',
      Dia_diem_to_chuc: 'Huyện Phú Riềng',
      Ke_hoach: 'Kế hoạch năm 2021',
      So_luong_gian_hang_du_kien: '100 gian',
      San_pham_ban_tai_hoi_cho: 'Tổng hợp',
      So_Van_ban: '',
      Co_quan_ban_hanh: '',

      Ngay_thang_nam: '',
      Id_quan_huyen: 11
    },
    {
      Ten_doanh_nghiep: 'Công ty TNHH TMDV Văn hóa Sài Gòn Hưng Nguyễn',
      Dia_chi: '323/18 Vườn Lài, P.Phú Thọ Hòa, Q.Tân Phú, TP.HCM',
      Ma_so_thue: '314430236',
      Ten_Hoi_cho: 'Hội chợ thương mại gỗ mỹ nghệ các sản phẩm công nghiệp nông thôn 2020  ',
      Thoi_gian_to_chuc: '14/6/2021 đến 23/6/2021',
      Dia_diem_to_chuc: 'TT.Tân Phú, huyện Đồng Phú',
      Ke_hoach: 'Kế hoạch năm 2021',
      So_luong_gian_hang_du_kien: '100 gian',
      San_pham_ban_tai_hoi_cho: 'Tổng hợp',
      So_Van_ban: '',
      Co_quan_ban_hanh: '',
      Ngay_thang_nam: '',
      Id_quan_huyen: 8
    },
    {
      Ten_doanh_nghiep: 'Công ty TNHH MTV Phạm Gia Phong',
      Dia_chi: 'Số 45, đường H5, lô MR2, KDC Mỹ Phước 1, Phường Thới Hòa, Thị Xã Bến Cát, Bình Dương',
      Ma_so_thue: '3702015718',
      Ten_Hoi_cho: 'Hội chợ thương mại thị xã Phước Long',
      Thoi_gian_to_chuc: '02/01/2021 đến 09/1/2021',
      Dia_diem_to_chuc: 'đường CMT8, P.Long Thủy, Tx.Phước Long',
      Ke_hoach: 'Kế hoạch năm 2021',
      So_luong_gian_hang_du_kien: '100 gian',
      San_pham_ban_tai_hoi_cho: 'Tổng hợp',
      So_Van_ban: '',
      Co_quan_ban_hanh: '',
      Ngay_thang_nam: '',
      Id_quan_huyen: 1
    },
    {
      Ten_doanh_nghiep: 'Công ty TNHH MTV Phạm Gia Phong',
      Dia_chi: 'Số 45, đường H5, lô MR2, KDC Mỹ Phước 1, Phường Thới Hòa, Thị Xã Bến Cát, Bình Dương',
      Ma_so_thue: '3702015718',
      Ten_Hoi_cho: 'Hội chợ thương mại thị xã Phước Long',
      Thoi_gian_to_chuc: '12/01/2021 đến 19/1/2021',
      Dia_diem_to_chuc: 'P.Long Phước, Tx.Phước Long',
      Ke_hoach: 'Kế hoạch năm 2021',
      So_luong_gian_hang_du_kien: '100 gian',
      San_pham_ban_tai_hoi_cho: 'Tổng hợp',
      So_Van_ban: '',
      Co_quan_ban_hanh: '',
      Ngay_thang_nam: '',
      Id_quan_huyen: 1
    },
    {
      Ten_doanh_nghiep: 'Công ty CP TMDV The Gold Mart',
      Dia_chi: 'Đường Tôn Đức Thắng, KP2, P.Tiến Thành, TP.Đồng Xoài, Bình Phước',
      Ma_so_thue: '3801182999',
      Ten_Hoi_cho: 'Hội chợ xuân Tân Sửu The Gold Mart',
      Thoi_gian_to_chuc: '20/01/2021 đến 31/01/2021',
      Dia_diem_to_chuc: 'Khu chợ đêm The Gold City, đường 37, KP2, P.Tiến Thành, TP.Đồng Xoài',
      Ke_hoach: 'Kế hoạch năm 2021',
      So_luong_gian_hang_du_kien: '35 gian',
      San_pham_ban_tai_hoi_cho: 'Tổng hợp',
      So_Van_ban: '',
      Co_quan_ban_hanh: '',
      Ngay_thang_nam: '',
      Id_quan_huyen: 2
    },
    {
      Ten_doanh_nghiep: 'Công ty CP TMDV The Gold Mart',
      Dia_chi: 'Đường Tôn Đức Thắng, KP2, P.Tiến Thành, TP.Đồng Xoài, Bình Phước',
      Ma_so_thue: '3801182999',
      Ten_Hoi_cho: 'Ngày hội chợ phiên The Gold Mart năm 2021',
      Thoi_gian_to_chuc: '05/11/2021 đến 14/11/2021',
      Dia_diem_to_chuc: 'Khu chợ đêm The Gold City, đường 37, KP2, P.Tiến Thành, TP.Đồng Xoài',
      Ke_hoach: 'Kế hoạch năm 2021',
      So_luong_gian_hang_du_kien: '35 gian',
      San_pham_ban_tai_hoi_cho: 'Tổng hợp',
      So_Van_ban: '',
      Co_quan_ban_hanh: '',
      Ngay_thang_nam: '',
      Id_quan_huyen: 2
    },
    {
      Ten_doanh_nghiep: 'Công ty TNHH Mekong Expo',
      Dia_chi: '464 /70/2D đường Nguyễn Văn Quá, P.Đông Hưng Thuận, Q12, TP.HCM',
      Ma_so_thue: '315662920',
      Ten_Hoi_cho: 'Phiên chợ đầu năm Phước Long 2020',
      Thoi_gian_to_chuc: '12/04/2020 đến 20/04/2020',
      Dia_diem_to_chuc: 'Phường Long Phước, Tx.Phước Long',
      Ke_hoach: 'Đăng ký thực tế năm 2020',
      So_luong_gian_hang_du_kien: '70 gian',
      San_pham_ban_tai_hoi_cho: 'Tổng hợp',
      So_Van_ban: '802/SCT-TM',
      Co_quan_ban_hanh: 'Sở Công Thương',
      Ngay_thang_nam: '24-05-2019',
      Id_quan_huyen: 1
    },
    {
      Ten_doanh_nghiep: 'Công ty TNHH Mekong Expo',
      Dia_chi: '464 /70/2D đường Nguyễn Văn Quá, P.Đông Hưng Thuận, Q12, TP.HCM',
      Ma_so_thue: '315662920',
      Ten_Hoi_cho: 'Hội chợ mua sắm và đồ gỗ mỹ nghệ năm 2020',
      Thoi_gian_to_chuc: '20/6/2020 đến 28/6/2020',
      Dia_diem_to_chuc: 'Trung tâm văn hóa thị xã Bình Long',
      Ke_hoach: 'Đăng ký thực tế năm 2020',
      So_luong_gian_hang_du_kien: '40 đến 80 gian',
      San_pham_ban_tai_hoi_cho: 'Tổng hợp',
      So_Van_ban: '876/SCT-VP',
      Co_quan_ban_hanh: 'Sở Công Thương',
      Ngay_thang_nam: '06-08-2020',
      Id_quan_huyen: 3
    },
    {
      Ten_doanh_nghiep: 'Công ty TNHH Mekong Expo',
      Dia_chi: '464 /70/2D đường Nguyễn Văn Quá, P.Đông Hưng Thuận, Q12, TP.HCM',
      Ma_so_thue: '315662920',
      Ten_Hoi_cho: 'Hội chợ mua sắm và đồ gỗ mỹ nghệ năm 2020',
      Thoi_gian_to_chuc: '02/7/2020 đến 08/7/2020',
      Dia_diem_to_chuc: 'KDC Đại Nam, xã Minh Hưng, huyện Chơn Thành',
      Ke_hoach: 'Đăng ký thực tế năm 2020',
      So_luong_gian_hang_du_kien: '40 đến 80 gian',
      San_pham_ban_tai_hoi_cho: 'Tổng hợp',
      So_Van_ban: '876/SCT-VP',
      Co_quan_ban_hanh: 'Sở Công Thương',
      Ngay_thang_nam: '06-08-2020',
      Id_quan_huyen: 10
    },
    {
      Ten_doanh_nghiep: 'Công ty TNHH Mekong Expo',
      Dia_chi: '464 /70/2D đường Nguyễn Văn Quá, P.Đông Hưng Thuận, Q12, TP.HCM',
      Ma_so_thue: '315662920',
      Ten_Hoi_cho: 'Hội chợ mua sắm và đồ gỗ mỹ nghệ năm 2020',
      Thoi_gian_to_chuc: '08/11/2020 đến 15/11/2020',
      Dia_diem_to_chuc: 'TT.Tân Phú, huyện Đồng Phú',
      Ke_hoach: 'Đăng ký thực tế năm 2020',
      So_luong_gian_hang_du_kien: '60 đến 80 gian',
      San_pham_ban_tai_hoi_cho: 'Tổng hợp',
      So_Van_ban: '1761/SCT-VP',
      Co_quan_ban_hanh: 'Sở Công Thương',
      Ngay_thang_nam: '30-10-2020',
      Id_quan_huyen: 8
    },
    {
      Ten_doanh_nghiep: 'Công ty TNHH Mekong Expo',
      Dia_chi: '464 /70/2D đường Nguyễn Văn Quá, P.Đông Hưng Thuận, Q12, TP.HCM',
      Ma_so_thue: '315662920',
      Ten_Hoi_cho: 'Hội chợ mua sắm và đồ gỗ mỹ nghệ năm 2020',
      Thoi_gian_to_chuc: '18/11/2020 đến 25/11/2020',
      Dia_diem_to_chuc: 'Trung tâm văn hóa thị xã Bình Long',
      Ke_hoach: 'Đăng ký thực tế năm 2020',
      So_luong_gian_hang_du_kien: '60 đến 80 gian',
      San_pham_ban_tai_hoi_cho: 'Tổng hợp',
      So_Van_ban: '1761/SCT-VP',
      Co_quan_ban_hanh: 'Sở Công Thương',
      Ngay_thang_nam: '30-10-2020',
      Id_quan_huyen: 3
    },
    {
      Ten_doanh_nghiep: 'Công ty TNHH TMDV Mega Việt',
      Dia_chi: '53/24 Nguyễn Hồng Đào, P14, Q.Tân Bình, TP.HCM',
      Ma_so_thue: '313724000',
      Ten_Hoi_cho: 'Chợ phiên Saigon Mega sale',
      Thoi_gian_to_chuc: '31/7/2020 đến 02/8/2020',
      Dia_diem_to_chuc: 'Sân siêu thị Coopmart Đồng Xoài, đường Phú Riềng Đỏ, P.Tân Bình, TP.Đồng Xoài',
      Ke_hoach: 'Đăng ký thực tế năm 2020',
      So_luong_gian_hang_du_kien: '80 gian',
      San_pham_ban_tai_hoi_cho: 'Tổng hợp',
      So_Van_ban: '1158/SCT-VP',
      Co_quan_ban_hanh: 'Sở Công Thương',
      Ngay_thang_nam: '20-07-2020',
      Id_quan_huyen: 2
    },
    {
      Ten_doanh_nghiep: 'Công ty TNHH Dương Khang Thịnh',
      Dia_chi: '4A/97 Đường D1 , Cư Xá 307, Phường 25, Quận Bình Thạnh, TP.HCM',
      Ma_so_thue: '315706046',
      Ten_Hoi_cho: 'Hội chợ Thương mại - hàng tiêu dùng, huyện Lộc Ninh năm 2020',
      Thoi_gian_to_chuc: '10/7/2020 đến 17/7/2020',
      Dia_diem_to_chuc: 'Trung tâm văn hóa huyện Lộc Ninh',
      Ke_hoach: 'Đăng ký thực tế năm 2020',
      So_luong_gian_hang_du_kien: '60 đến 80 gian',
      San_pham_ban_tai_hoi_cho: 'Tổng hợp',
      So_Van_ban: '794/SCT-VP',
      Co_quan_ban_hanh: 'Sở Công Thương',
      Ngay_thang_nam: '26-05-2020',
      Id_quan_huyen: 5
    },
    {
      Ten_doanh_nghiep: 'Công ty TNHH Dương Khang Thịnh',
      Dia_chi: '4A/97 Đường D1 , Cư Xá 307, Phường 25, Quận Bình Thạnh, TP.HCM',
      Ma_so_thue: '315706046',
      Ten_Hoi_cho: 'Hội chợ thương mại hàng tiêu dùng huyện Phú Riềng năm 2020',
      Thoi_gian_to_chuc: '22/7/2020 đến 28/7/2020',
      Dia_diem_to_chuc: 'Trung tâm TDTT Cao su Phú Riềng',
      Ke_hoach: 'Đăng ký thực tế năm 2020',
      So_luong_gian_hang_du_kien: '60 đến 80 gian',
      San_pham_ban_tai_hoi_cho: 'Tổng hợp',
      So_Van_ban: '794/SCT-VP',
      Co_quan_ban_hanh: 'Sở Công Thương',
      Ngay_thang_nam: '26-05-2020',
      Id_quan_huyen: 11
    },
    {
      Ten_doanh_nghiep: 'Công ty TNHH Dương Khang Thịnh',
      Dia_chi: '4A/97 Đường D1 , Cư Xá 307, Phường 25, Quận Bình Thạnh, TP.HCM',
      Ma_so_thue: '315706046',
      Ten_Hoi_cho: 'Hội chợ thương mại hàng tiêu dùng phường Long Thủy, Thị xã Phước Long năm 2020',
      Thoi_gian_to_chuc: '01/8/2020 đến 07/8/2020',
      Dia_diem_to_chuc: 'Phường Long Thủy, thị xã Phước Long',
      Ke_hoach: 'Đăng ký thực tế năm 2020',
      So_luong_gian_hang_du_kien: '60 đến 80 gian',
      San_pham_ban_tai_hoi_cho: 'Tổng hợp',
      So_Van_ban: '794/SCT-VP',
      Co_quan_ban_hanh: 'Sở Công Thương',
      Ngay_thang_nam: '26-05-2020',
      Id_quan_huyen: 1
    },
    {
      Ten_doanh_nghiep: 'Công ty TNHH Dương Khang Thịnh',
      Dia_chi: '4A/97 Đường D1 , Cư Xá 307, Phường 25, Quận Bình Thạnh, TP.HCM',
      Ma_so_thue: '315706046',
      Ten_Hoi_cho: 'Hội chợ thương mại hàng tiêu dùng huyện Lộc Ninh năm 2020',
      Thoi_gian_to_chuc: '23/12/2020 đến 31/12/2020',
      Dia_diem_to_chuc: 'Trung tâm văn hóa huyện Lộc Ninh',
      Ke_hoach: 'Đăng ký thực tế năm 2020',
      So_luong_gian_hang_du_kien: '60 đến 100 gian',
      San_pham_ban_tai_hoi_cho: 'Tổng hợp',
      So_Van_ban: '1760/SCT-VP',
      Co_quan_ban_hanh: 'Sở Công Thương',
      Ngay_thang_nam: '30-10-2020',
      Id_quan_huyen: 5
    },
    {
      Ten_doanh_nghiep: 'Công ty TNHH TMDV Văn hóa Sài Gòn Hưng Nguyễn',
      Dia_chi: '323/18 Vườn Lài, P.Phú Thọ Hòa, Q.Tân Phú, TP.HCM',
      Ma_so_thue: '314430236',
      Ten_Hoi_cho: 'Hội chợ thương mại gỗ mỹ nghệ các sản phẩm nông nghiệp nông thôn năm 2020',
      Thoi_gian_to_chuc: '12/11/2020 đến 20/11/2020',
      Dia_diem_to_chuc: 'TT.Tân Khai, huyện Hớn Quản',
      Ke_hoach: 'Đăng ký thực tế năm 2020',
      So_luong_gian_hang_du_kien: '100 gian',
      San_pham_ban_tai_hoi_cho: 'Tổng hợp',
      So_Van_ban: '1759/SCT-VP',
      Co_quan_ban_hanh: 'Sở Công Thương',
      Ngay_thang_nam: '30-10-2020',
      Id_quan_huyen: 7
    }
  ]

  displayedColumns: string[] = ['index', 'Ten_doanh_nghiep', 'Dia_chi', 'Ma_so_thue', 'Ten_Hoi_cho', 'Thoi_gian_to_chuc', 'Dia_diem_to_chuc', 'Ke_hoach', 'So_luong_gian_hang_du_kien', 'San_pham_ban_tai_hoi_cho', 'So_Van_ban', 'Co_quan_ban_hanh', 'Ngay_thang_nam'];
  dataSource: MatTableDataSource<TFE> = new MatTableDataSource<TFE>();
  filteredDataSource: MatTableDataSource<TFE> = new MatTableDataSource<TFE>();

  years: number[] = [];
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
  sanLuongBanRa: number;
  soLuongDoanhNghiep: number;
  isChecked: boolean;

  @ViewChild(MatAccordion, { static: false }) accordion: MatAccordion;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('TABLE', { static: false }) table: ElementRef;

  exportExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table.nativeElement);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Hội chợ triển lãm');

    XLSX.writeFile(wb, 'Hội chợ triển lãm.xlsx');

  }

  constructor(public sctService: SCTService) {
  }

  ngOnInit() {
    this.years = this.getYears();
    this.autoOpen();
    this.getTFEList();
  }

  autoOpen() {
    setTimeout(() => this.accordion.openAll(), 1000);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filteredDataSource.filter = filterValue.trim().toLowerCase();
  }

  applyDistrictFilter(event) {
    let filteredData = [];

    event.value.forEach(element => {
      this.dataSource.data.filter(x => x.Id_quan_huyen == element).forEach(x => filteredData.push(x));
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
  }

  getTFEList(): void {
    this.dataSource = new MatTableDataSource(this.DataTFE);
    this.filteredDataSource.data = [...this.dataSource.data];

    this.dataSource.paginator = this.paginator;
    this.paginator._intl.itemsPerPageLabel = 'Số hàng';
    this.paginator._intl.firstPageLabel = "Trang Đầu";
    this.paginator._intl.lastPageLabel = "Trang Cuối";
    this.paginator._intl.previousPageLabel = "Trang Trước";
    this.paginator._intl.nextPageLabel = "Trang Tiếp";
  }

  log(any) {
    console.log(any);
  }

  getYears() {
    return Array(5).fill(1).map((element, index) => new Date().getFullYear() - index);
  }

  countBusiness(): number {
    return [...new Set(this.filteredDataSource.data.map(x => x.Ma_so_thue))].length;
  }

  countHappenedFair(): number {
    return this.filteredDataSource.data.filter(x => new Date(this.formatMMDDYYYY(x.Thoi_gian_to_chuc.split(' ')[x.Thoi_gian_to_chuc.split(' ').length - 1])) < new Date()).length;
  }

  formatMMDDYYYY(date: string): string {
    var datearray = date.split("/");
    return datearray[1] + '/' + datearray[0] + '/' + datearray[2];
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
