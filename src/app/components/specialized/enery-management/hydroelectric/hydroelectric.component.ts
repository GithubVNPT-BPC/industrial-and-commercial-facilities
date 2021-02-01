import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatAccordion, MatPaginator, MatTable, MatTableDataSource } from '@angular/material';
import { DistrictModel } from 'src/app/_models/APIModel/domestic-market.model';
import { HydroElectricManagementModel } from 'src/app/_models/APIModel/electric-management.module';
import { LinkModel } from 'src/app/_models/link.model';
import { BreadCrumService } from 'src/app/_services/injectable-service/breadcrums.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-hydroelectric',
  templateUrl: './hydroelectric.component.html',
  styleUrls: ['/../../special_layout.scss'],
})
export class HydroelectricComponent implements OnInit {
  //ViewChild 
  @ViewChild(MatAccordion, { static: true }) accordion: MatAccordion;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('TABLE', { static: false }) table: ElementRef;

  exportExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table.nativeElement);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Thủy điện');

    XLSX.writeFile(wb, 'Thủy điện.xlsx');

  }
  //Constant variable
  public readonly displayedColumns: string[] = ['index', 'Tdn', 'Dd', 'Cx', 'Lnxbq', 'Dthc', 'Sl6tck', 'Slnck', 'Dt',
    'Paupttcctvhd', 'Pdpauptt', 'Paupvthkcdhctd', 'Qtvhhctd', 'Qtdhctd', 'Kdd', 'Ldhtcbvhd', 'Btct', 'Lcsdlhctd', 'Pabvdhctd', 'Bcdgatdhctd', 'Bchtatdhctd', 'Tkdkatdhctd'
  ];
  //TS & HTML Variable
  public dataSource: MatTableDataSource<HydroElectricManagementModel> = new MatTableDataSource<HydroElectricManagementModel>();
  public filteredDataSource: MatTableDataSource<HydroElectricManagementModel> = new MatTableDataSource<HydroElectricManagementModel>();
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

  public data: Array<HydroElectricManagementModel> =
    [
      {
        Tdn: 'Thủy điện Thác Mơ',
        mst: null,
        Dd: 'Phường Thác Mơ, TX Phước Long',
        Cx: '150MW',
        Lnxbq: '65',
        Dthc: 1360.00,
        Sl6tck: 313.70,
        Slnck: 627.40,
        Dt: 442.68,
        trang_thai: null,
        Paupttcctvhd: null,
        Pdpauptt: 'QĐ: 462/QĐ-TMHPC-KTAT ngày 10/4/2020 của Công ty CP thủy điện Thác Mơ',
        Paupvthkcdhctd: 'QĐ: 907/QĐ-UBND ngày 29/4/2020 của UBND tỉnh BP',
        Qtvhhctd: 'QĐ: 1985/QĐ-TTg ngày 25/12/2019 của Thủ tướng Chính phủ về quy trình liên hồ chứa và QĐ: 4284/QĐ-BCT ngày 14/11/2018 của BCT về quy trình đơn hồ chứa',
        Qtdhctd: 'Quan trắc đập tháng 12/2019',
        Kdd: 'Lần kiểm định gần nhất (Tháng 12/2019)',
        Ldhtcbvhd: 'Có 01 trạm qđo mưa, 01 trạm đo mực nước và 05 camera giám sát hồ chứa thủy điện Thác Mơ',
        Btct: 'Hàng năm',
        Lcsdlhctd: 'Có tủ, lập sổ lưu trữ số liệu vận hành',
        Pabvdhctd: 'QĐ: 293/QĐ-UBND ngày 07/02/2020 của UBND tỉnh BP',
        Bcdgatdhctd: 'BC số 402/TMHPC-KTAT ngày 05/5/2020 của Công ty CP thủy điện Thác Mơ',
        Bchtatdhctd: 'BC số 336/TMHPC-KTAT ngày 15/4/2020 của Công ty CP thủy điện Thác Mơ',
        Tkdkatdhctd: 'Tờ khai Đăng ký an toàn đập, hồ chứa ngày 20/3/2019 của Công ty CP thủy điện Thác Mơ'
      },
      {
        Tdn: 'Thủy điện Cần Đơn',
        mst: null,
        Dd: 'TT Thanh Bình, Huyện Bù Đốp',
        Cx: '72MW',
        Lnxbq: '60',
        Dthc: 165.49,
        Sl6tck: 155094.00,
        Slnck: 310189.00,
        Dt: 348.00,
        trang_thai: null,
        Paupttcctvhd: null,
        Pdpauptt: 'QĐ: 12/QĐ-CT-KTCN ngày 20/4/2020 của Công ty CP thủy điện Cần Đơn',
        Paupvthkcdhctd: 'QĐ: 1503/QĐ-UBND ngày 06/7/2020 của UBND tỉnh BP',
        Qtvhhctd: 'QĐ: 1985/QĐ-TTg ngày 25/12/2019 của Thủ tướng Chính phủ về quy trình liên hồ chứa và QĐ: 2666/QĐ-BCT ngày 31/3/2014 của BCT về quy trình đơn hồ chứa',
        Qtdhctd: 'Quan trắc đập tháng 12/2019',
        Kdd: 'Lần kiểm định gần nhất (Tháng 12/2019)',
        Ldhtcbvhd: 'CP thủy điện Srok Phu Miêng IDICO',
        Btct: 'Hàng năm',
        Lcsdlhctd: 'Có tủ, lập sổ lưu trữ số liệu vận hành',
        Pabvdhctd: 'QĐ: 2369/QĐ-UBND ngày 24/9/2020 của UBND tỉnh BP',
        Bcdgatdhctd: 'BC số 21A/BC-CT-KTCN ngày 17/4/2020 của Công ty CP thủy điện Cần Đơn',
        Bchtatdhctd: 'BC số 19/BC-CT-KTCN ngày 07/4/2020 của Công ty CP thủy điện Cần Đơn',
        Tkdkatdhctd: null
      },
      {
        Tdn: 'Thủy điện Srok Phu Mieng',
        mst: null,
        Dd: 'Xã Long Bình, Huyện Phú riềng',
        Cx: '51MW',
        Lnxbq: '10%(65-60)',
        Dthc: 99.30,
        Sl6tck: 95.00,
        Slnck: 199.50,
        Dt: 229.68,
        trang_thai: null,
        Paupttcctvhd: null,
        Pdpauptt: 'QĐ:32/QĐ-CT ngày 09/4/2020 của Công ty CP thủy điện Srok Phu Miêng IDICO',
        Paupvthkcdhctd: 'QĐ: 1246/QĐ-UBND ngày12/6/2020 của UBND tỉnh BP',
        Qtvhhctd: 'QĐ: 1985/QĐ-TTg ngày 25/12/2019 của Thủ tướng Chính phủ về quy trình liên hồ chứa và QĐ: 4059/QĐ-BCT ngày 11/8/2011 cũa BCT về quy trình đơn hồ chứa',
        Qtdhctd: 'Quan trắc đập tháng 12/2019',
        Kdd: 'Lần kiểm định gần nhất (Tháng 12/2019)',
        Ldhtcbvhd: 'Có lắp hệ thống camera giám sát xả nước hồ chứa',
        Btct: 'Hàng năm',
        Lcsdlhctd: 'Có tủ, lập sổ lưu trữ số liệu vận hành',
        Pabvdhctd: 'Đang tổng hợp trình UBND tỉnh',
        Bcdgatdhctd: 'BC số 120/BC-CT ngày 04/5/2020 của Công ty CP thủy điện Srok Phu Miêng IDICO',
        Bchtatdhctd: 'BC số 99/BC-CT ngày 15/4/2020 của Công ty CP thủy điện Srok Phu Miêng IDICO',
        Tkdkatdhctd: null
      },
      {
        Tdn: 'Thủy điện Đak Glun',
        mst: null,
        Dd: 'Xã Bù Gia Mập, huyện Bù Gia Mập và xã Đak Nhau, huyện Bù Đăng',
        Cx: '18 MW',
        Lnxbq: 'Xả tràn tự do',
        Dthc: 2.00,
        Sl6tck: 30.00,
        Slnck: 60.30,
        Dt: 58.47,
        trang_thai: null,
        Paupttcctvhd: 'QĐ: 2293/QĐ-UBND ngày 31/12/2014 của UBND tỉnh BP',
        Pdpauptt: 'QĐ: 12/2020/QĐ-TBPTSG ngày 08/5/2020 của Công ty CP thiết bị phụ tùng Sài Gòn',
        Paupvthkcdhctd: null,
        Qtvhhctd: 'QĐ: 0717/QĐ-BCT ngày 09/02/2010 của Bộ Công Thương',
        Qtdhctd: 'Quan trắc đập tháng 12/2019',
        Kdd: 'Lần kiểm định gần nhất (Tháng 9/2014)',
        Ldhtcbvhd: 'Có 03 camera giám sát tại cửa nhận nước, hồ chứa và hạ lưu; 02 trạm đo mưa tại đập và thượng lưu',
        Btct: 'Hàng năm',
        Lcsdlhctd: 'Có tủ, lập sổ lưu trữ số liệu vận hành',
        Pabvdhctd: 'QĐ: 2367/QĐ-UBND ngày 04/11/2014 của UBND tỉnh BP',
        Bcdgatdhctd: null,
        Bchtatdhctd: null,
        Tkdkatdhctd: null
      },
      {
        Tdn: 'Thủy điện Bù Cà Mau',
        mst: null,
        Dd: 'Xã Phú Nghĩa, huyện Bù Gia Mập',
        Cx: '4 MW',
        Lnxbq: '7.8',
        Dthc: 0.08,
        Sl6tck: null,
        Slnck: null,
        Dt: null,
        trang_thai: null,
        Paupttcctvhd: null,
        Pdpauptt: 'QĐ: 16/2020/QĐ-CNC-KTTH ngày 17/3/2020 của Công ty TNHH TMDVSX Cát Nam',
        Paupvthkcdhctd: null,
        Qtvhhctd: 'QĐ: 2453/QĐ-UBND ngày 14/11/2013 của UBND tỉnh BP',
        Qtdhctd: 'Quan trắc hồ chứa (Quan trắc dịch vị, quan trắc ngầm) năm 2019',
        Kdd: 'Lần kiểm định gần nhất (Năm 2014)',
        Ldhtcbvhd: 'Có hệ thống giám sát tại cửa nhận nước, đập tràn và nhà máy',
        Btct: 'Hàng năm',
        Lcsdlhctd: 'Có tủ, lập sổ lưu trữ số liệu vận hành',
        Pabvdhctd: 'Phê duyệt năm 2014',
        Bcdgatdhctd: 'BC số 12/2020/BC-CNC-KT ngày 17/3/2020 của Công ty TNHH TMDVSX Cát Nam',
        Bchtatdhctd: 'BC số 13/2020/BC-CNC-KT ngày 17/3/2020 của Công ty TNHH TMDVSX Cát Nam',
        Tkdkatdhctd: 'Tờ khai ngày 17/02/2020 của Công ty TNHH TMDVSX Cát Nam'
      },
      {
        Tdn: 'Thủy điện Đak U',
        mst: null,
        Dd: 'Xã Đăk Ơ và xã Phú Nghĩa, huyện Bù Gia Mập',
        Cx: '2,4 MW',
        Lnxbq: 'Xả tràn tự do',
        Dthc: 0.25,
        Sl6tck: null,
        Slnck: null,
        Dt: null,
        trang_thai: null,
        Paupttcctvhd: null,
        Pdpauptt: null,
        Paupvthkcdhctd: 'QĐ: 1746/QĐ-UBND ngày 07/10/2019 của UBND huyện Bù Gia Mập',
        Qtvhhctd: 'QĐ: 2454/QĐ-UBND ngày 14/11/2014 của UBND tỉnh BP',
        Qtdhctd: null,
        Kdd: 'Lần kiểm định gần nhất (Năm 2014)',
        Ldhtcbvhd: 'Có hệ thống giám sát tại cửa nhận nước, đập tràn và nhà máy',
        Btct: 'Hàng năm',
        Lcsdlhctd: 'Có tủ, lập sổ lưu trữ số liệu vận hành',
        Pabvdhctd: null,
        Bcdgatdhctd: null,
        Bchtatdhctd: 'BC số 1504/2020/BC-DU ngày 15/4/2020 của Công ty CP ĐTPT năng lượng Phú Tân',
        Tkdkatdhctd: null
      },
      {
        Tdn: 'Thủy điện Thác Mơ mở rộng',
        mst: null,
        Dd: 'Xã Đức Hạnh, huyện Bù Gia Mập',
        Cx: '75 MW',
        Lnxbq: null,
        Dthc: 1360.00,
        Sl6tck: null,
        Slnck: null,
        Dt: null,
        trang_thai: null,
        Paupttcctvhd: null,
        Pdpauptt: null,
        Paupvthkcdhctd: null,
        Qtvhhctd: null,
        Qtdhctd: null,
        Kdd: null,
        Ldhtcbvhd: null,
        Btct: null,
        Lcsdlhctd: 'Có tủ lưu trữ hồ sơ',
        Pabvdhctd: null,
        Bcdgatdhctd: null,
        Bchtatdhctd: null,
        Tkdkatdhctd: null
      },
      {
        Tdn: 'Thủy điện Đak Glun 2',
        mst: null,
        Dd: 'Xã Đak Nhau, huyện Bù Đăng',
        Cx: '10 MW',
        Lnxbq: '(370-735)',
        Dthc: 3.08,
        Sl6tck: null,
        Slnck: null,
        Dt: null,
        trang_thai: null,
        Paupttcctvhd: null,
        Pdpauptt: null,
        Paupvthkcdhctd: null,
        Qtvhhctd: null,
        Qtdhctd: null,
        Kdd: null,
        Ldhtcbvhd: null,
        Btct: null,
        Lcsdlhctd: 'Có tủ lưu trữ hồ sơ',
        Pabvdhctd: null,
        Bcdgatdhctd: 'BC ngày 27/4/2020 của Công ty CP ĐTPT năng lượng Phú Tân',
        Bchtatdhctd: null,
        Tkdkatdhctd: 'Tờ khai ngày 15/4/2020 của Công ty CP ĐTPT năng lượng Phú Tân'
      },
      {
        Tdn: 'Thủy điện ĐaMlo',
        mst: null,
        Dd: 'Xã Đồng Nai, huyện Bù Đăng',
        Cx: '4 MW',
        Lnxbq: null,
        Dthc: null,
        Sl6tck: null,
        Slnck: null,
        Dt: null,
        trang_thai: null,
        Paupttcctvhd: null,
        Pdpauptt: null,
        Paupvthkcdhctd: null,
        Qtvhhctd: null,
        Qtdhctd: null,
        Kdd: null,
        Ldhtcbvhd: null,
        Btct: null,
        Lcsdlhctd: 'Có tủ lưu trữ hồ sơ',
        Pabvdhctd: null,
        Bcdgatdhctd: null,
        Bchtatdhctd: null,
        Tkdkatdhctd: null
      },
      {
        Tdn: 'Thủy điện Đak Kar',
        mst: null,
        Dd: 'Tỉnh Bình Phước và tỉnh Đắk Nông',
        Cx: '12 MW',
        Lnxbq: null,
        Dthc: 4.93,
        Sl6tck: null,
        Slnck: null,
        Dt: null,
        trang_thai: null,
        Paupttcctvhd: null,
        Pdpauptt: null,
        Paupvthkcdhctd: null,
        Qtvhhctd: 'QĐ: 2858/QĐ-BCT ngày 09/11/2020 của BCT về quy trìnhvận hành hồ chứa',
        Qtdhctd: null,
        Kdd: null,
        Ldhtcbvhd: null,
        Btct: null,
        Lcsdlhctd: 'Có tủ lưu trữ hồ sơ',
        Pabvdhctd: null,
        Bcdgatdhctd: null,
        Bchtatdhctd: null,
        Tkdkatdhctd: null
      },
      {
        Tdn: 'Thủy điện Thống Nhất',
        mst: null,
        Dd: 'Xã Thống Nhất, huyện Bù Đăng',
        Cx: '2,4 MW',
        Lnxbq: 'Xả tràn tự do',
        Dthc: 0.29,
        Sl6tck: null,
        Slnck: null,
        Dt: null,
        trang_thai: null,
        Paupttcctvhd: null,
        Pdpauptt: null,
        Paupvthkcdhctd: null,
        Qtvhhctd: 'QĐ: 2192/QĐ-UBND ngày 03/9/2020 của UBND tỉnh BP',
        Qtdhctd: null,
        Kdd: null,
        Ldhtcbvhd: null,
        Btct: null,
        Lcsdlhctd: 'Có tủ lưu trữ hồ sơ',
        Pabvdhctd: null,
        Bcdgatdhctd: null,
        Bchtatdhctd: null,
        Tkdkatdhctd: null
      },
      {
        Tdn: 'Thủy điện Đức Thành',
        mst: null,
        Dd: 'Tỉnh Bình Phước và tỉnh Lâm Đồng',
        Cx: '40 MW',
        Lnxbq: null,
        Dthc: null,
        Sl6tck: null,
        Slnck: null,
        Dt: null,
        trang_thai: null,
        Paupttcctvhd: null,
        Pdpauptt: null,
        Paupvthkcdhctd: null,
        Qtvhhctd: null,
        Qtdhctd: null,
        Kdd: null,
        Ldhtcbvhd: null,
        Btct: null,
        Lcsdlhctd: 'Có tủ lưu trữ hồ sơ',
        Pabvdhctd: null,
        Bcdgatdhctd: null,
        Bchtatdhctd: null,
        Tkdkatdhctd: null
      },
      {
        Tdn: 'Thủy điện Long Hà',
        mst: null,
        Dd: 'Xã Long Hà, huyện Phú Riềng',
        Cx: '20,1 MW',
        Lnxbq: null,
        Dthc: null,
        Sl6tck: null,
        Slnck: null,
        Dt: null,
        trang_thai: null,
        Paupttcctvhd: null,
        Pdpauptt: null,
        Paupvthkcdhctd: null,
        Qtvhhctd: null,
        Qtdhctd: null,
        Kdd: null,
        Ldhtcbvhd: null,
        Btct: null,
        Lcsdlhctd: null,
        Pabvdhctd: null,
        Bcdgatdhctd: null,
        Bchtatdhctd: null,
        Tkdkatdhctd: null
      },
      {
        Tdn: 'Thủy điện Đăk R_Lấp 3',
        mst: null,
        Dd: 'Tỉnh Bình Phước, Đăk Nông và tỉnh Lâm Đồng',
        Cx: '82 MW',
        Lnxbq: null,
        Dthc: 2.35,
        Sl6tck: null,
        Slnck: null,
        Dt: null,
        trang_thai: null,
        Paupttcctvhd: null,
        Pdpauptt: null,
        Paupvthkcdhctd: null,
        Qtvhhctd: null,
        Qtdhctd: null,
        Kdd: null,
        Ldhtcbvhd: null,
        Btct: null,
        Lcsdlhctd: null,
        Pabvdhctd: null,
        Bcdgatdhctd: null,
        Bchtatdhctd: null,
        Tkdkatdhctd: null
      },
      {
        Tdn: 'Thủy điện Phú Sơn',
        mst: null,
        Dd: 'Xã Phú Sơn, huyện Bù Đăng',
        Cx: '10 MW',
        Lnxbq: null,
        Dthc: 0.45,
        Sl6tck: null,
        Slnck: null,
        Dt: null,
        trang_thai: null,
        Paupttcctvhd: null,
        Pdpauptt: null,
        Paupvthkcdhctd: null,
        Qtvhhctd: null,
        Qtdhctd: null,
        Kdd: null,
        Ldhtcbvhd: null,
        Btct: null,
        Lcsdlhctd: null,
        Pabvdhctd: null,
        Bcdgatdhctd: null,
        Bchtatdhctd: null,
        Tkdkatdhctd: null
      },
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
    this.doanhThu = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => x.Dt).reduce((a, b) => a + b) : 0;
    this.soLuongDoanhNghiep = this.filteredDataSource.data.length;
    // this.congXuat = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => x.Cx).reduce((a, b) => a + b) : 0;
    this.sanluongnam = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => x.Slnck).reduce((a, b) => a + b) : 0;
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