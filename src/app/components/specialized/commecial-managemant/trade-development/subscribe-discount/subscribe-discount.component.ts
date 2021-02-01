import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatOption, MatSelect, MatTable, MatTableDataSource } from '@angular/material';
import { element } from 'protractor';
import { SCTService } from 'src/app/_services/APIService/sct.service';
import { MatAccordion } from '@angular/material/expansion';
import { MatPaginator } from '@angular/material/paginator';
import { District } from 'src/app/_models/district.model';
import { SD, SDFilterModel } from 'src/app/_models/APIModel/trade-development.model';
import * as XLSX from 'xlsx';
import { throwIfEmpty } from 'rxjs/operators';

@Component({
  selector: 'app-subscribe-discount',
  templateUrl: './subscribe-discount.component.html',
  styleUrls: ['../../../special_layout.scss'],
})
export class SubscribeDiscountComponent implements OnInit {

  private readonly DataSD: SD[] = [
    {
      Ten_doanh_nghiep: 'Công ty TNHH xe máy Hưng Phát',
      Dia_chi: 'Ấp 2, TT Lộc Ninh, huyện Lộc Ninh',
      Ma_so_thue: '3800416002',
      Ten_chuong_trinh_KM: 'Honda Hưng Phát - Mua 01 xe trúng 04 xe ',
      Thoi_gian_KM: '10/7/2020 - 30/9/2020',
      Hang_hoa_dung_de_KM: 'Xe máy (Airblade 125, Wave RSX, Wave Blade, Wave Alpha, Quạt điều hòa Kangaroo KG50F62), quạt điều hòa, áo mua, mũ bảo hiểm',
      Dia_diem_KM: '3 địa điểm: KP5, TT Tân Khai, Hớn Quản; ấp 3B, xã Minh Hưng, huyện Chơn Thành; KP Phú Nghĩa, P. Phú Đức, Tx.Bình Long',
      Hinh_thuc_KM: 'Bốc thăm',
      So_Van_ban: '1089/SCT-VP',
      Co_quan_ban_hanh: 'Sở Công Thương',
      Ngay_thang_nam: '07-07-2020',
      Id_quan_huyen: 5
    },
    {
      Ten_doanh_nghiep: 'Công ty TNHH MTV An An Bách Việt Nam',
      Dia_chi: 'Tòa nhà Songdo, 62A Phạm Ngọc Thạch, P6, Q3, TP.HCM',
      Ma_so_thue: '310486541',
      Ten_chuong_trinh_KM: 'Honda Gia Đình',
      Thoi_gian_KM: '25/7/2020 và 01/8/2020',
      Hang_hoa_dung_de_KM: 'xe máy Honda Blade 110cc',
      Dia_diem_KM: '2 địa điểm: Trung tâm huấn luyện và thi đấu TDTT Bình Phước và Nhà văn hóa huyện Bù Đăng',
      Hinh_thuc_KM: 'Rút thăm',
      So_Van_ban: '1113/SCT-VP',
      Co_quan_ban_hanh: 'Sở Công Thương',
      Ngay_thang_nam: '07-09-2020',
      Id_quan_huyen: 9
    },
    {
      Ten_doanh_nghiep: 'Công ty TNHH MTV TMDV Sài Gòn - Bình Phước',
      Dia_chi: 'Đường Phú Riềng Đỏ, Phường Tân Bình, TP.Đồng Xoài',
      Ma_so_thue: '3800357413',
      Ten_chuong_trinh_KM: 'Thỏa thích mua sắm may mắn đồng hành',
      Thoi_gian_KM: '19/5/2020 đến 31/5/2020',
      Hang_hoa_dung_de_KM: 'Máy giặt LG FC1408S4W2, máy massage chân Takashina-TK-402',
      Dia_diem_KM: 'Siêu thị Coopmart Đồng Xoài',
      Hinh_thuc_KM: 'Rút thăm',
      So_Van_ban: '730/SCT-VP',
      Co_quan_ban_hanh: 'Sở Công Thương',
      Ngay_thang_nam: '15-05-2020',
      Id_quan_huyen: 2
    },
    {
      Ten_doanh_nghiep: 'Công ty TNHH xe máy Hưng Phát',
      Dia_chi: 'Ấp 2, TT Lộc Ninh, huyện Lộc Ninh',
      Ma_so_thue: '3800416002',
      Ten_chuong_trinh_KM: 'Nhận quà thả ga, trung 04 xe Honda',
      Thoi_gian_KM: '01/4/2020 đến 30/6/2020',
      Hang_hoa_dung_de_KM: 'Xe máy (Airblade 125, Wave RSX, Wave Blade, Wave Alpha, Quạt điều hòa Kangaroo KG50F62), quạt điều hòa, áo mua, mũ bảo hiểm',
      Dia_diem_KM: '3 địa điểm: KP5, TT Tân Khai, Hớn Quản; ấp 3B, xã Minh Hưng, huyện Chơn Thành; KP Phú Nghĩa, P. Phú Đức, Tx.Bình Long',
      Hinh_thuc_KM: 'Bốc thăm',
      So_Van_ban: '449/SCT-VP',
      Co_quan_ban_hanh: 'Sở Công Thương',
      Ngay_thang_nam: '25-03-2020',
      Id_quan_huyen: 5
    },
    {
      Ten_doanh_nghiep: 'Công ty TNHH xe máy Hưng Phát',
      Dia_chi: 'Ấp 2, TT Lộc Ninh, huyện Lộc Ninh',
      Ma_so_thue: '3800416002',
      Ten_chuong_trinh_KM: 'Mua 01 xe trúng 04 xe',
      Thoi_gian_KM: '15/4/2020 đến 15/7/2020',
      Hang_hoa_dung_de_KM: 'Xe máy (Airblade 125, Wave RSX, Wave Blade, Wave Alpha, Quạt điều hòa Kangaroo KG50F62), quạt điều hòa, áo mua, mũ bảo hiểm',
      Dia_diem_KM: 'KP. Ninh Phú, TT.Lộc Ninh, huyện Lộc Ninh',
      Hinh_thuc_KM: 'Bốc thăm',
      So_Van_ban: '473/SCT-VP',
      Co_quan_ban_hanh: 'Sở Công Thương',
      Ngay_thang_nam: '30-03-2020',
      Id_quan_huyen: 5
    },
    {
      Ten_doanh_nghiep: 'Công ty CP Đầu tư BĐS Thành Phương',
      Dia_chi: 'Ấp 2, Phường Tiến Thành, TP.Đồng Xoài, Bình Phước',
      Ma_so_thue: '3702457025-003',
      Ten_chuong_trinh_KM: 'Bốc thăm may mắn dành cho khách hàng mua nền đất tại Khu đô thị trương mại dịch vụ Tiến hưng',
      Thoi_gian_KM: '27/5/2020 đến 12/7/2020',
      Hang_hoa_dung_de_KM: 'Đồng hồ tự động, bật lửa Cartier, Vàng SIC, Voucher mua hàng tại siêu thị The Gold Mart',
      Dia_diem_KM: 'Khu đô thị TM DV Tiến Hưng, xã Tiến Hưng, TP.Đồng Xoài',
      Hinh_thuc_KM: 'Bốc thăm',
      So_Van_ban: '151/SCT-VP',
      Co_quan_ban_hanh: 'Sở Công Thương',
      Ngay_thang_nam: '20-05-2020',
      Id_quan_huyen: 2
    },
    {
      Ten_doanh_nghiep: 'Chi nhánh Công ty TNHH TM Dung Vượng',
      Dia_chi: 'QL14, Tổ 2, KP.Thanh Bình, P.Tân Bình, TP.Đồng Xoài',
      Ma_so_thue: '0500238762-004',
      Ten_chuong_trinh_KM: 'Qùa khủng bất ngờ - Hello Summer',
      Thoi_gian_KM: '15/6/2020 đến 31/12/2020',
      Hang_hoa_dung_de_KM: 'Xe gắn máy Honda Blade (phiên bản phanh cơ), tivi samsung 40 inch, tủ lạnh Panasonic 167 lít, nồi lẫu Sunhouse và mũ bảo hiểm thời trang Dung Vượng',
      Dia_diem_KM: '03 điểm: Số 85 QL14, Tổ 2, KP Thanh Bình, P.Tân Bình, TP.Đồng Xoài; số 15-16 KP.Tân An, TT.Tân Phú, huyện Đồng Phú; số 1109 Phú Riềng Đỏ, P.Tân Bình, TP.Đồng Xoài',
      Hinh_thuc_KM: 'Quay thưởng',
      So_Van_ban: '902/SCT-VP',
      Co_quan_ban_hanh: 'Sở Công Thương',
      Ngay_thang_nam: '06-11-2020',
      Id_quan_huyen: 2
    },
    {
      Ten_doanh_nghiep: 'Công ty CP Diana Unicharm',
      Dia_chi: 'KCN Vĩnh Tuy, đường Lĩnh Nam, P.Vĩnh Hưng, Q.Hoàng Mai, Hà Nội',
      Ma_so_thue: '100507058',
      Ten_chuong_trinh_KM: 'Chương trình hoạt động cho sản phẩm Diana siêu thấm viên êm chống tràn khu vực chợ',
      Thoi_gian_KM: '20/6/2020 đến 15/8/2020',
      Hang_hoa_dung_de_KM: 'Tivi màn hình Led 32 inch, tủ lạnh 92 lít, lò vi sóng, bộ nồi inox, bình đun siêu tốt, sản phẩm Diana siêu thấm cool fresh',
      Dia_diem_KM: 'Tại các chợ trên địa bàn tỉnh Bình Phước',
      Hinh_thuc_KM: 'Quay may mắn xác định trúng thưởng',
      So_Van_ban: '877/SCT-VP',
      Co_quan_ban_hanh: 'Sở Công Thương',
      Ngay_thang_nam: '06-08-2020',
      Id_quan_huyen: 99
    },
    {
      Ten_doanh_nghiep: 'Viettel Bình Phước - CN Tập đoàn công nghiệp viễn thông quân đội',
      Dia_chi: '818 Phú Riềng Đỏ, P.Tân Xuân, TP.Đồng Xoài',
      Ma_so_thue: '0100109106-064',
      Ten_chuong_trinh_KM: 'Kết nối tình thân, lộc xuân ngập tràn',
      Thoi_gian_KM: '15/01/2020 đến 31/3/2020',
      Hang_hoa_dung_de_KM: 'Voucher giảm, gói Lifebox (20GB), xem phim HD trên 5Dmax, truyền hình di động Viettel TV Basic, đồng hồ thông minh trẻ em MYKid, sổ tiết kiệm 5 triệu đồng',
      Dia_diem_KM: 'Tỉnh Bình Phước',
      Hinh_thuc_KM: 'Quay số trúng thưởng',
      So_Van_ban: '67/SCT-VP',
      Co_quan_ban_hanh: 'Sở Công Thương',
      Ngay_thang_nam: '13-01-2020',
      Id_quan_huyen: 99
    },
    {
      Ten_doanh_nghiep: 'Viettel Bình Phước - CN Tập đoàn công nghiệp viễn thông quân đội',
      Dia_chi: '818 Phú Riềng Đỏ, P.Tân Xuân, TP.Đồng Xoài',
      Ma_so_thue: '0100109106-064',
      Ten_chuong_trinh_KM: 'Vòng quay may mắn',
      Thoi_gian_KM: '13/10/2020 đến 15/10/2020',
      Hang_hoa_dung_de_KM: 'Thẻ cào Viettel các mệnh giá 20.000đ, 50.000đ, 100.000đ',
      Dia_diem_KM: 'Tỉnh Bình Phước',
      Hinh_thuc_KM: 'Quay số trúng thưởng',
      So_Van_ban: '1644/SCT-VP',
      Co_quan_ban_hanh: 'Sở Công Thương',
      Ngay_thang_nam: '01-12-2020',
      Id_quan_huyen: 99
    },
    {
      Ten_doanh_nghiep: 'Công ty TNHH SX - TM Tô Ba',
      Dia_chi: '63 Nguyễn Văn Lượng, P10, Quận Gò Gấp, TP.HCM',
      Ma_so_thue: '302124280',
      Ten_chuong_trinh_KM: 'Bio quét - TB Phon - cào ngay trúng liền tay',
      Thoi_gian_KM: '10/5/2020 đến 10/11/2020',
      Hang_hoa_dung_de_KM: 'Xe máy honda wave alpha, loa kéo, quạt máy, tiền mặt',
      Dia_diem_KM: 'các đại lý, cửa hang thuộc hệ thống phân phối của Công ty trên địa bàn tỉnh Bình Phước',
      Hinh_thuc_KM: 'Thẻ cào',
      So_Van_ban: '636/SCT-VP',
      Co_quan_ban_hanh: 'Sở Công Thương',
      Ngay_thang_nam: '29-04-2020',
      Id_quan_huyen: 99
    },
    {
      Ten_doanh_nghiep: 'Công ty TNHH TM và DV Linh',
      Dia_chi: '40-41 KP2, P.Phước Bình, Tx.Phước Long',
      Ma_so_thue: '3800388482',
      Ten_chuong_trinh_KM: 'Nhận quà hay trúng ngay quà đỉnh',
      Thoi_gian_KM: '08/8/2020 đến 03/10/2020',
      Hang_hoa_dung_de_KM: 'Tủ lạnh panasonic, máy giặt panasonic',
      Dia_diem_KM: '40-41 KP2, P.Phước Bình, Tx.Phước Long',
      Hinh_thuc_KM: 'Rút thăm',
      So_Van_ban: '1276/SCT-VP',
      Co_quan_ban_hanh: 'Sở Công Thương',
      Ngay_thang_nam: '08-06-2020',
      Id_quan_huyen: 1
    },
    {
      Ten_doanh_nghiep: 'Công ty TNHH TM và DV Linh',
      Dia_chi: '40-41 KP2, P.Phước Bình, Tx.Phước Long',
      Ma_so_thue: '3800388482',
      Ten_chuong_trinh_KM: 'Rút thăm trúng thưởng tri ân khách hàng',
      Thoi_gian_KM: '7/11/2020 đến 11/11/2020',
      Hang_hoa_dung_de_KM: 'Máy giặt, tivi, tủ lạnh, nồi cơm điện',
      Dia_diem_KM: '40-41 KP2, P.Phước Bình, Tx.Phước Long',
      Hinh_thuc_KM: 'Rút thăm',
      So_Van_ban: '1774/SCT-VP',
      Co_quan_ban_hanh: 'Sở Công Thương',
      Ngay_thang_nam: '11-03-2020',
      Id_quan_huyen: 1
    },
    {
      Ten_doanh_nghiep: 'Công ty TNHH TM và DV Linh',
      Dia_chi: '40-41 KP2, P.Phước Bình, Tx.Phước Long',
      Ma_so_thue: '3800388482',
      Ten_chuong_trinh_KM: 'Rút thăm trúng thưởng',
      Thoi_gian_KM: '5/11/2020 đến 30/11/2020',
      Hang_hoa_dung_de_KM: 'Máy giặt, ti vi, lò vi sóng',
      Dia_diem_KM: '40-41 KP2, P.Phước Bình, Tx.Phước Long',
      Hinh_thuc_KM: 'Rút thăm',
      So_Van_ban: '1775/SCT-VP',
      Co_quan_ban_hanh: 'Sở Công Thương',
      Ngay_thang_nam: '11-03-2020',
      Id_quan_huyen: 1
    },
    {
      Ten_doanh_nghiep: 'Công ty Bảo việt nhân thọ Bình Phước',
      Dia_chi: 'Đường Hùng Vương, P.Tân Bình, TP.Đồng Xoài',
      Ma_so_thue: '0102641429-009',
      Ten_chuong_trinh_KM: 'Quay số trúng thưởng',
      Thoi_gian_KM: '11/11/2020 đến 10/12/2020',
      Hang_hoa_dung_de_KM: 'Xe máy Honda Blade thắng đĩa màu xanh đen, Tivi Samsung 43T6500; Máy tính bảng Huawei Mediapad T5 10.1 inch; bộ vali du lịch; bàn ủi Philip HD 1172',
      Dia_diem_KM: 'Tỉnh Bình Phước',
      Hinh_thuc_KM: 'Quay số trúng thưởng',
      So_Van_ban: '1820/SCT-VP',
      Co_quan_ban_hanh: 'Sở Công Thương',
      Ngay_thang_nam: '11-11-2020',
      Id_quan_huyen: 2
    }
  ]

  displayedColumns: string[] = ['index', 'Ten_doanh_nghiep', 'Dia_chi', 'Ma_so_thue', 'Ten_chuong_trinh_KM', 'Thoi_gian_KM',
    'Hang_hoa_dung_de_KM', 'Dia_diem_KM', 'Hinh_thuc_KM', 'So_Van_ban', 'Co_quan_ban_hanh', 'Ngay_thang_nam',
  ];
  dataSource: MatTableDataSource<SD> = new MatTableDataSource<SD>();
  filteredDataSource: MatTableDataSource<SD> = new MatTableDataSource<SD>();
  filterModel: SDFilterModel = new SDFilterModel();
  sumvalues: number = 0;
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

  sdtypes: string[] = [];

  @ViewChild(MatAccordion, { static: false }) accordion: MatAccordion;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('TABLE', { static: false }) table: ElementRef;

  exportExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table.nativeElement);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Đăng ký khuyến mại');

    XLSX.writeFile(wb, 'Đăng ký khuyến mại.xlsx');

  }

  constructor(public sctService: SCTService) {
  }

  ngOnInit() {
    this.years = this.getYears();
    this.autoOpen();
    this.getSDList();
  }

  autoOpen() {
    setTimeout(() => this.accordion.openAll(), 1000);
  }

  applyFilter1(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
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

  filterArray(array, filters) {
    const filterKeys = Object.keys(filters);
    let temp = [...array];
    filterKeys.forEach(key => {
      let temp2 = [];
      switch (key) {
        case 'Id_quan_huyen':
          if (filters[key].length) {
            filters[key].forEach(criteria => {
              temp2 = temp2.concat(temp.filter(x => x[key] == criteria || x[key] == 99));
            });
            temp = [...temp2];
          }
          break;
          default: 
          if (filters[key].length) {
            filters[key].forEach(criteria => {
              temp2 = temp2.concat(temp.filter(x => x[key] == criteria));
              console.log(temp2);
            });
            temp = [...temp2];
          }
          break;
      }
    })
    return temp;
  }

  getSDList(): void {
    this.dataSource = new MatTableDataSource(this.DataSD);
    console.log(this.dataSource)
    this.filteredDataSource.data = [...this.dataSource.data];
    this.sdtypes = [...new Set(this.dataSource.data.map(x => x.Hinh_thuc_KM))];
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
    return [...new Set(this.dataSource.data.map(x => x.Ma_so_thue))].length;
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
