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
//Import Services
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
import { MarketCommonModel, StoreCommonModel, StoreFilterModel, SuperMarketCommonModel } from 'src/app/_models/APIModel/commecial-management.model';
import { Data } from 'src/app/components/data-sct/data-sct-type';
import { Time } from 'highcharts';
import { MatAccordion } from '@angular/material/expansion';
import { MatPaginator } from '@angular/material/paginator';
import { District } from 'src/app/_models/district.model';

interface HashTableNumber<T> {
  [key: string]: T;
}

@Component({
  selector: 'app-stores-commecial',
  templateUrl: './stores-commecial.component.html',
  styleUrls: ['../../../special_layout.scss'],
})

export class StoreManagementComponent implements OnInit {
  //Constant-------------------------------------------------------------------------

  //Viewchild & Input-----------------------------------------------------------------------
  @ViewChildren(ReportDirective) inputs: QueryList<ReportDirective>
  @ViewChild(MatAccordion, { static: false }) accordion: MatAccordion;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild('TABLE', { static: false }) table: ElementRef;

  exportExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table.nativeElement);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'HTTM - Cửa hàng');

    XLSX.writeFile(wb, 'HTTM - Cửa hàng.xlsx');

  }
  //Variable for HTML&TS-------------------------------------------------------------------------
  displayedColumns = ['index', 'tencuahang', 'sanphamkinhdoanh', 'scndkkd', 'ngaycap', 'noicap', 'diachi', 'sogcn', 'ngaycapgcn', 'ngayhethangcn', 'sdtlienhe'];
  dataHuyenThi: Array<StoreCommonModel> = [{ tencuahang: ' CH BHX Bình Phước số 3', sanphamkinhdoanh: 'Thực phẩm tiêu dùng', scndkkd: '00003', ngaycap: new Date('2018-12-12'), noicap: 'Bình Phước', diachi: 'Đường ĐT741, ấp chợ, Xã Tân Tiến, Huyện Đồng Phú', id_quan_huyen: 8, sogcn: '03.2019KD/GCNATTP-SCT', ngaycapgcn: new Date('2019-02-13'), ngayhethangcn: new Date('2022-02-12'), sdtlienhe: '0902789078', is_het_han: false },
  { tencuahang: ' CH BHX Bình Phước số 04', sanphamkinhdoanh: 'Thực phẩm tiêu dùng', scndkkd: '00004', ngaycap: new Date('2018-12-21'), noicap: 'Bình Phước', diachi: 'Thôn Phú Hưng, Xã Phú Riềng, Huyện Phú Riềng', id_quan_huyen: 11, sogcn: '04.2019KD/GCNATTP-SCT', ngaycapgcn: new Date('2019-05-04'), ngayhethangcn: new Date('2022-05-03'), sdtlienhe: '0902789079', is_het_han: false },
  { tencuahang: ' CH BHX Bình Phước số 5', sanphamkinhdoanh: 'Thực phẩm tiêu dùng', scndkkd: '00005', ngaycap: new Date('2019-01-21'), noicap: 'Bình Phước', diachi: 'Đường Võ Văn Tần, Khu phố Tân Bình, Phường Tân Bình, TP Đồng Xoài', id_quan_huyen: 2, sogcn: '05.2019KD/GCNATTP-SCT', ngaycapgcn: new Date('2019-05-04'), ngayhethangcn: new Date('2022-05-03'), sdtlienhe: '0902789080', is_het_han: false },
  { tencuahang: ' CH BHX Bình Phước số 01', sanphamkinhdoanh: 'Thực phẩm tiêu dùng', scndkkd: '00001', ngaycap: new Date('2018-12-06'), noicap: 'Bình Phước', diachi: 'đường 7/4, khu phố Ninh Phú, Thị Trấn Lộc Ninh, Huyện Lộc Ninh', id_quan_huyen: 5, sogcn: '07/2019KD/GCNATTP-SCT', ngaycapgcn: new Date('2019-05-22'), ngayhethangcn: new Date('2022-05-21'), sdtlienhe: '0902789081', is_het_han: false },
  { tencuahang: 'Chi nhánh Công ty CP TM Bách Hóa Xanh - CH BHX Bình Phước', sanphamkinhdoanh: 'Thực phẩm tiêu dùng', scndkkd: '0310471746 - 356', ngaycap: new Date('2018-11-27'), noicap: 'Bình Phước', diachi: 'Ấp 3A, Xã Minh Hưng, Huyện Chơn Thành', id_quan_huyen: 10, sogcn: '06/2019KD/GCNATTP-SCT', ngaycapgcn: new Date('2019-05-22'), ngayhethangcn: new Date('2022-05-21'), sdtlienhe: '0902789082', is_het_han: false },
  { tencuahang: ' CH BHX Bình Phước số 06', sanphamkinhdoanh: 'Thực phẩm tiêu dùng', scndkkd: '00006', ngaycap: new Date('2019-01-21'), noicap: 'Bình Phước', diachi: 'đường Hùng Vương, Khu Phố Phú Bình, Phường An Lộc, Thị xã Bình Long', id_quan_huyen: 3, sogcn: '06.2019KD/GCNATTP-SCT', ngaycapgcn: new Date('2019-06-14'), ngayhethangcn: new Date('2022-06-13'), sdtlienhe: '0902789083', is_het_han: false },
  { tencuahang: ' CH BHX Bình Phước số 8', sanphamkinhdoanh: 'Thực phẩm tiêu dùng', scndkkd: '00008', ngaycap: new Date('2019-04-03'), noicap: 'Bình Phước', diachi: 'Đường ĐT741, Khu phố 3, Phường Thác Mơ, Thị xã Phước Long', id_quan_huyen: 1, sogcn: '08.2019KD/GCNATTP-SCT', ngaycapgcn: new Date('2019-06-14'), ngayhethangcn: new Date('2022-06-13'), sdtlienhe: '0902789084', is_het_han: false },
  { tencuahang: ' CH BHX Bình Phước số 7', sanphamkinhdoanh: 'Thực phẩm tiêu dùng', scndkkd: '00007', ngaycap: new Date('2019-02-19'), noicap: 'Bình Phước', diachi: 'đường Lê Quý Đôn, Phường Tân Xuân, Phường Tân Xuân, TP Đồng Xoài', id_quan_huyen: 2, sogcn: '07.2019KD/GCNATTP-SCT', ngaycapgcn: new Date('2019-07-10'), ngayhethangcn: new Date('2022-07-09'), sdtlienhe: '0902789085', is_het_han: false },
  { tencuahang: ' CH BHX Bình Phước số 10', sanphamkinhdoanh: 'Thực phẩm tiêu dùng', scndkkd: '00010', ngaycap: new Date('2019-04-22'), noicap: 'Bình Phước', diachi: 'Đường Lê Lợi, Khu Tân Hưng, Thị Trấn Đức Phong, Huyện Bù Đăng', id_quan_huyen: 9, sogcn: '10.2019KD/GCNATTP-SCT', ngaycapgcn: new Date('2019-07-10'), ngayhethangcn: new Date('2022-07-09'), sdtlienhe: '0902789086', is_het_han: false },
  { tencuahang: ' CH BHX Bình Phước số 11', sanphamkinhdoanh: 'Thực phẩm tiêu dùng', scndkkd: '00011', ngaycap: new Date('2019-05-07'), noicap: 'Bình Phước', diachi: 'Đường ĐT 741, Ấp 1, Xã Tiến Hưng, TP Đồng Xoài', id_quan_huyen: 2, sogcn: '11.2019KD/GCNATTP-SCT', ngaycapgcn: new Date('2019-07-26'), ngayhethangcn: new Date('2022-07-25'), sdtlienhe: '0902789087', is_het_han: false },
  { tencuahang: ' CH BHX Bình Phước số 13', sanphamkinhdoanh: 'Thực phẩm tiêu dùng', scndkkd: '00014', ngaycap: new Date('2019-05-20'), noicap: 'Bình Phước', diachi: 'Đường ĐT741, Ấp 3, Xã Tân Lập, Huyện Đồng Phú', id_quan_huyen: 8, sogcn: '13.2019KD/GCNATTP-SCT', ngaycapgcn: new Date('2019-07-26'), ngayhethangcn: new Date('2022-07-25'), sdtlienhe: '0902789088', is_het_han: false },
  { tencuahang: ' CH BHX Bình Phước số 14', sanphamkinhdoanh: 'Thực phẩm tiêu dùng', scndkkd: '00012', ngaycap: new Date('2019-05-13'), noicap: 'Bình Phước', diachi: 'Đường QL14, Thôn 1, Xã Nghĩa Trung, Huyện Bù Đăng', id_quan_huyen: 9, sogcn: '14.2019KD/GCNATTP-SCT', ngaycapgcn: new Date('2019-08-19'), ngayhethangcn: new Date('2022-08-18'), sdtlienhe: '0902789089', is_het_han: false },
  { tencuahang: ' CH BHX Bình Phước số 15', sanphamkinhdoanh: 'Thực phẩm tiêu dùng', scndkkd: '00015', ngaycap: new Date('2019-05-15'), noicap: 'Bình Phước', diachi: 'Đường Nguyễn Huệ, Huyện Chơn Thành', id_quan_huyen: 10, sogcn: '14.2019KD/GCNATTP-SCT', ngaycapgcn: new Date('2019-08-19'), ngayhethangcn: new Date('2022-08-18'), sdtlienhe: '0902789090', is_het_han: false },
  { tencuahang: ' CH BHX Bình Phước số 16', sanphamkinhdoanh: 'Thực phẩm tiêu dùng', scndkkd: '00016', ngaycap: new Date('2019-05-15'), noicap: 'Bình Phước', diachi: 'Đường QL13, Ấp 3B, Xã Minh Hưng, Huyện Chơn Thành', id_quan_huyen: 10, sogcn: '14.2019KD/GCNATTP-SCT', ngaycapgcn: new Date('2019-08-19'), ngayhethangcn: new Date('2022-08-18'), sdtlienhe: '0902789091', is_het_han: false },
  { tencuahang: ' CH BHX Bình Phước số 17', sanphamkinhdoanh: 'Thực phẩm tiêu dùng', scndkkd: '00017', ngaycap: new Date('2019-06-10'), noicap: 'Bình Phước', diachi: 'Đường ĐT741, Khu phố Tân An, Thị Trấn An Phú, Huyện Đồng Phú', id_quan_huyen: 8, sogcn: '17.2019KD/GCNATTP-SCT', ngaycapgcn: new Date('2019-08-26'), ngayhethangcn: new Date('2022-08-25'), sdtlienhe: '0902789092', is_het_han: false },
  { tencuahang: ' CH BHX Bình Phước số 19', sanphamkinhdoanh: 'Thực phẩm tiêu dùng', scndkkd: '00019', ngaycap: new Date('2019-07-04'), noicap: 'Bình Phước', diachi: 'đường QL14, Ấp 4, Xã Minh Lập, Huyện Chơn Thành', id_quan_huyen: 10, sogcn: '19.2019KD/GCNATTP-SCT', ngaycapgcn: new Date('2019-08-26'), ngayhethangcn: new Date('2022-08-25'), sdtlienhe: '0902789093', is_het_han: false },
  { tencuahang: ' CH BHX Bình Phước số 22', sanphamkinhdoanh: 'Thực phẩm tiêu dùng', scndkkd: '00023', ngaycap: new Date('2019-07-10'), noicap: 'Bình Phước', diachi: 'Đường ĐT741, Khu phố 3, Phường Phước Bình, Thị xã Phước Long', id_quan_huyen: 1, sogcn: '22.2019KD/GCNATTP-SCT', ngaycapgcn: new Date('2019-10-11'), ngayhethangcn: new Date('2022-10-10'), sdtlienhe: '0902789094', is_het_han: false },
  { tencuahang: ' CH BHX Bình Phước số 23', sanphamkinhdoanh: 'Thực phẩm tiêu dùng', scndkkd: '00022', ngaycap: new Date('2019-07-10'), noicap: 'Bình Phước', diachi: 'Đường Phú Riềng Đỏ, Khu phố Tân Đồng 3, Phường Tân Đồng, TP Đồng Xoài', id_quan_huyen: 2, sogcn: '23.2019KD/GCNATTP-SCT', ngaycapgcn: new Date('2019-10-11'), ngayhethangcn: new Date('2022-10-10'), sdtlienhe: '0902789095', is_het_han: false },
  { tencuahang: ' CH BHX Bình Phước số 24', sanphamkinhdoanh: 'Thực phẩm tiêu dùng', scndkkd: '00025', ngaycap: new Date('2019-08-05'), noicap: 'Bình Phước', diachi: 'đường Trường Chinh, Phường Tân Phú, TP Đồng Xoài', id_quan_huyen: 2, sogcn: '24.2019KD/GCNATTP-SCT', ngaycapgcn: new Date('2019-10-11'), ngayhethangcn: new Date('2022-10-10'), sdtlienhe: '0902789096', is_het_han: false },
  { tencuahang: ' CH BHX Bình Phước số 18', sanphamkinhdoanh: 'Thực phẩm tiêu dùng', scndkkd: '00018', ngaycap: new Date('2019-07-04'), noicap: 'Bình Phước', diachi: 'Đường QL14, Ấp 2, Xã Tân Thành,TP Đồng Xoài', id_quan_huyen: 2, sogcn: '18.2019KD/GCNATTP-SCT', ngaycapgcn: new Date('2019-10-11'), ngayhethangcn: new Date('2022-10-10'), sdtlienhe: '0902789097', is_het_han: false },
  { tencuahang: ' CH BHX Bình Phước số 26', sanphamkinhdoanh: 'Thực phẩm tiêu dùng', scndkkd: '00027', ngaycap: new Date('2019-08-29'), noicap: 'Bình Phước', diachi: 'Đường ĐT-741, Ấp Thuận Phú 1, Xã Thuận Phú, Huyện Đồng Phú', id_quan_huyen: 8, sogcn: '26.2019KD/GCNATTP-SCT', ngaycapgcn: new Date('2019-11-13'), ngayhethangcn: new Date('2022-11-12'), sdtlienhe: '0902789098', is_het_han: false },
  { tencuahang: ' CH BHX Bình Phước số 12', sanphamkinhdoanh: 'Thực phẩm tiêu dùng', scndkkd: '00013', ngaycap: new Date('2019-05-03'), noicap: 'Bình Phước', diachi: 'Đường ĐT741, Thôn Tân Lực, Xã Bù Nho, Huyện Phú Riềng', id_quan_huyen: 11, sogcn: '12.2019KD/GCNATTP-SCT', ngaycapgcn: new Date('2019-10-28'), ngayhethangcn: new Date('2022-10-27'), sdtlienhe: '0902789099', is_het_han: false },
  { tencuahang: ' CH BHX Bình Phước số 30', sanphamkinhdoanh: 'Thực phẩm tiêu dùng', scndkkd: '00032', ngaycap: new Date('2019-09-13'), noicap: 'Bình Phước', diachi: 'Khu phố Ninh Phú, Thị trấn Lộc Ninh, Huyện Lộc Ninh', id_quan_huyen: 5, sogcn: '30.2019KD/GCNATTP-SCT', ngaycapgcn: new Date('2019-10-28'), ngayhethangcn: new Date('2022-10-27'), sdtlienhe: '0902789100', is_het_han: false },
  { tencuahang: ' CH BHX Bình Phước số 29', sanphamkinhdoanh: 'Thực phẩm tiêu dùng', scndkkd: '00030', ngaycap: new Date('2019-09-06'), noicap: 'Bình Phước', diachi: 'đường ĐT759, Khu phố 6, Phường Long Phước, Thị xã Phước Long', id_quan_huyen: 1, sogcn: '29.2019KD/GCNATTP-SCT', ngaycapgcn: new Date('2019-11-13'), ngayhethangcn: new Date('2022-11-12'), sdtlienhe: '0902789101', is_het_han: false },
  { tencuahang: ' CH BHX Bình Phước số 28', sanphamkinhdoanh: 'Thực phẩm tiêu dùng', scndkkd: '00029', ngaycap: new Date('2019-08-30'), noicap: 'Bình Phước', diachi: 'Đường Phạm Ngọc Thạch, Khu TĐC, Phường Tiến Thành, TP Đồng Xoài', id_quan_huyen: 2, sogcn: '28.2019KD/GCNATTP-SCT', ngaycapgcn: new Date('2019-11-13'), ngayhethangcn: new Date('2022-11-12'), sdtlienhe: '0902789102', is_het_han: false },
  { tencuahang: ' CH BHX Bình Phước số 27', sanphamkinhdoanh: 'Thực phẩm tiêu dùng', scndkkd: '00028', ngaycap: new Date('2019-08-30'), noicap: 'Bình Phước', diachi: 'Đường ĐT759, Ấp Hiệp Tâm A, Xã Lộc Hiệp, Huyện Lộc Ninh', id_quan_huyen: 5, sogcn: '27.2019KD/GCNATTP-SCT', ngaycapgcn: new Date('2019-11-13'), ngayhethangcn: new Date('2022-11-12'), sdtlienhe: '0902789103', is_het_han: false },
  { tencuahang: ' CH BHX Bình Phước số 25', sanphamkinhdoanh: 'Thực phẩm tiêu dùng', scndkkd: '00026', ngaycap: new Date('2019-08-06'), noicap: 'Bình Phước', diachi: 'Đường ĐT757, Thôn 8, Xã Long Hà, Huyện Phú Riềng', id_quan_huyen: 11, sogcn: '25.2019KD/GCNATTP-SCT', ngaycapgcn: new Date('2019-11-13'), ngayhethangcn: new Date('2022-11-12'), sdtlienhe: '0902789104', is_het_han: false },
  { tencuahang: ' CH BHX Bình Phước số 21', sanphamkinhdoanh: 'Thực phẩm tiêu dùng', scndkkd: '00020', ngaycap: new Date('2019-07-09'), noicap: 'Bình Phước', diachi: 'Xã Bom Bo, Huyện Bù Đăng', id_quan_huyen: 9, sogcn: '21.2019KD/GCNATTP-SCT', ngaycapgcn: new Date('2019-12-08'), ngayhethangcn: new Date('2022-12-07'), sdtlienhe: '0902789105', is_het_han: false },
  { tencuahang: ' CH BHX Bình Phước số 9', sanphamkinhdoanh: 'Thực phẩm tiêu dùng', scndkkd: '00009', ngaycap: new Date('2019-04-18'), noicap: 'Bình Phước', diachi: 'Đường ĐT759, Khu Phố Thanh Xuân, Tt Thanh Bình, Huyện Bù Đốp', id_quan_huyen: 6, sogcn: '9.2019KD/GCNATTP-SCT', ngaycapgcn: new Date('2019-12-08'), ngayhethangcn: new Date('2022-12-07'), sdtlienhe: '0902789106', is_het_han: false },
  { tencuahang: ' CH BHX Bình Phước số 31', sanphamkinhdoanh: 'Thực phẩm tiêu dùng', scndkkd: '00033', ngaycap: new Date('2019-10-14'), noicap: 'Bình Phước', diachi: 'Ấp Tân Lợi, Xã Tân Thành, Huyện Bù Đốp, Tỉnh Bình Phước,', id_quan_huyen: 6, sogcn: '31.2019KD/GCNATTP-SCT', ngaycapgcn: new Date('2019-12-08'), ngayhethangcn: new Date('2022-12-07'), sdtlienhe: '0902789107', is_het_han: false },
  { tencuahang: ' CH BHX Bình Phước số 32', sanphamkinhdoanh: 'Thực phẩm tiêu dùng', scndkkd: '00034', ngaycap: new Date('2019-10-28'), noicap: 'Bình Phước', diachi: 'Khu Phố 2, Thị trấn Tân Khai, Huyện Hớn Quản, Tỉnh Bình Phước', id_quan_huyen: 7, sogcn: '32.2019KD/GCNATTP-SCT', ngaycapgcn: new Date('2019-12-30'), ngayhethangcn: new Date('2022-12-29'), sdtlienhe: '0902789108', is_het_han: false },
  { tencuahang: ' CH BHX Bình Phước số 20', sanphamkinhdoanh: 'Thực phẩm tiêu dùng', scndkkd: '00021', ngaycap: new Date('2019-07-08'), noicap: 'Bình Phước', diachi: 'Ấp Thanh Trung, Xã Thanh Lương, Thị xã Bình Long', id_quan_huyen: 3, sogcn: '39.2019KD/GCNATTP-SCT', ngaycapgcn: new Date('2020-01-16'), ngayhethangcn: new Date('2023-01-15'), sdtlienhe: '0902789109', is_het_han: false },
  { tencuahang: ' CH BHX Bình Phước số 34', sanphamkinhdoanh: 'Thực phẩm tiêu dùng', scndkkd: '00036', ngaycap: new Date('2019-12-13'), noicap: 'Bình Phước', diachi: 'Đường ĐT753, Khu phố Phước Tân, Phường Tân Thiện, TP Đồng Xoài', id_quan_huyen: 2, sogcn: '34.2020KD/GCNATTP-SCT', ngaycapgcn: new Date('2020-03-04'), ngayhethangcn: new Date('2023-03-03'), sdtlienhe: '0902789110', is_het_han: false },
  { tencuahang: ' CH BHX Bình Phước số 33', sanphamkinhdoanh: 'Thực phẩm tiêu dùng', scndkkd: '00035', ngaycap: new Date('2019-12-04'), noicap: 'Bình Phước', diachi: 'Thôn 2B, Xã Bình Thắng, Huyện Bù Gia Mập', id_quan_huyen: 4, sogcn: '33.2020KD/GCNATTP-SCT', ngaycapgcn: new Date('2020-03-04'), ngayhethangcn: new Date('2023-03-03'), sdtlienhe: '0902789111', is_het_han: false },
  { tencuahang: ' CH BHX Bình Phước số 35', sanphamkinhdoanh: 'Thực phẩm tiêu dùng', scndkkd: '00037', ngaycap: new Date('2019-12-25'), noicap: 'Bình Phước', diachi: 'Đường ĐT759-B, Ấp 2, Xã Thiện Hưng, Huyện Bù Đốp', id_quan_huyen: 6, sogcn: '35.2020KD/GCNATTP-SCT', ngaycapgcn: new Date('2020-03-16'), ngayhethangcn: new Date('2023-03-15'), sdtlienhe: '0902789112', is_het_han: false },
  { tencuahang: ' CH BHX Bình Phước số 36', sanphamkinhdoanh: 'Thực phẩm tiêu dùng', scndkkd: '00038', ngaycap: new Date('2020-01-31'), noicap: 'Bình Phước', diachi: 'Khu Tân Hưng, Thị Trấn Đức Phong, Huyện Bù Đăng', id_quan_huyen: 9, sogcn: '36.2020KD/GCNATTP-SCT', ngaycapgcn: new Date('2020-03-16'), ngayhethangcn: new Date('2023-03-15'), sdtlienhe: '0902789113', is_het_han: false },
  { tencuahang: ' CH BHX Bình Phước số 39', sanphamkinhdoanh: 'Thực phẩm tiêu dùng', scndkkd: '00041', ngaycap: new Date('2020-03-03'), noicap: 'Bình Phước', diachi: 'Đường ĐT741, thôn Đăk Lim, xã Đăk Ơ, huyện Bù Gia Mập', id_quan_huyen: 4, sogcn: '39.2020KD/GCNATTP-SCT', ngaycapgcn: new Date('2020-04-23'), ngayhethangcn: new Date('2023-04-22'), sdtlienhe: '0902789114', is_het_han: false },
  { tencuahang: ' CH BHX Bình Phước số 38', sanphamkinhdoanh: 'Thực phẩm tiêu dùng', scndkkd: '00040', ngaycap: new Date('2020-03-03'), noicap: 'Bình Phước', diachi: 'Đường ĐT 760, thôn 3, xã Phú Văn, huyện Bù Gia Mập', id_quan_huyen: 4, sogcn: '38.2020KD/GCNATTP-SCT', ngaycapgcn: new Date('2020-05-20'), ngayhethangcn: new Date('2023-05-19'), sdtlienhe: '0902789115', is_het_han: false },
  { tencuahang: ' CH BHX Bình Phước số 41', sanphamkinhdoanh: 'Thực phẩm tiêu dùng', scndkkd: '00042', ngaycap: new Date('2020-03-11'), noicap: 'Bình Phước', diachi: 'Ấp An Quý, xã Thanh An, huyện Hớn Quản', id_quan_huyen: 7, sogcn: '41.2020KD/GCNATTP-SCT', ngaycapgcn: new Date('2020-05-20'), ngayhethangcn: new Date('2023-05-19'), sdtlienhe: '0902789116', is_het_han: false },
  { tencuahang: ' CH BHX Bình Phước số 43', sanphamkinhdoanh: 'Thực phẩm tiêu dùng', scndkkd: '00044', ngaycap: new Date('2020-03-31'), noicap: 'Bình Phước', diachi: 'Đường ĐT 760, Thôn 2, Xã Bình Minh, Huyện Bù Đăng', id_quan_huyen: 9, sogcn: '43.2020KD/GCNATTP-SCT', ngaycapgcn: new Date('2020-05-29'), ngayhethangcn: new Date('2023-05-28'), sdtlienhe: '0902789117', is_het_han: false },
  { tencuahang: ' CH BHX Bình Phước số 44', sanphamkinhdoanh: 'Thực phẩm tiêu dùng', scndkkd: '00046', ngaycap: new Date('2020-03-31'), noicap: 'Bình Phước', diachi: 'Đường ĐT 741, Khu phố 3, Phường Thác Mơ, Thị xã Phước Long', id_quan_huyen: 1, sogcn: '44.2020KD/GCNATTP-SCT', ngaycapgcn: new Date('2020-05-29'), ngayhethangcn: new Date('2023-05-28'), sdtlienhe: '0902789118', is_het_han: false },
  { tencuahang: ' CH BHX Bình Phước số 40', sanphamkinhdoanh: 'Thực phẩm tiêu dùng', scndkkd: '00043', ngaycap: new Date('2020-03-11'), noicap: 'Bình Phước', diachi: 'Thôn 4, Xã Đa Kia, Huyện Bù Gia Mập', id_quan_huyen: 4, sogcn: '40.2020KD/GCNATTP-SCT', ngaycapgcn: new Date('2020-06-03'), ngayhethangcn: new Date('2023-06-02'), sdtlienhe: '0902789119', is_het_han: false },
  { tencuahang: ' CH BHX Bình Phước số 45', sanphamkinhdoanh: 'Thực phẩm tiêu dùng', scndkkd: '00047', ngaycap: new Date('2020-04-22'), noicap: 'Bình Phước', diachi: 'Đường ĐT741, Khu phố 6, Phường Long Phước, Thị xã Phước Long', id_quan_huyen: 1, sogcn: '45.2020KD/GCNATTP-SCT', ngaycapgcn: new Date('2020-06-18'), ngayhethangcn: new Date('2023-06-17'), sdtlienhe: '0902789120', is_het_han: false },
  { tencuahang: ' CH BHX Bình Phước số 49', sanphamkinhdoanh: 'Thực phẩm tiêu dùng', scndkkd: '00051', ngaycap: new Date('2020-05-20'), noicap: 'Bình Phước', diachi: 'Đường Trần Phú, Phường Tân Phú, TP Đồng Xoài', id_quan_huyen: 2, sogcn: '49.2020KD/GCNATTP-SCT', ngaycapgcn: new Date('2020-06-18'), ngayhethangcn: new Date('2023-06-17'), sdtlienhe: '0902789121', is_het_han: false },
  { tencuahang: ' CH BHX Bình Phước số 46', sanphamkinhdoanh: 'Thực phẩm tiêu dùng', scndkkd: '00048', ngaycap: new Date('2020-05-11'), noicap: 'Bình Phước', diachi: 'Đường QL 14, Xã Đồng Tiến, Huyện Đồng Phú', id_quan_huyen: 8, sogcn: '46.2020KD/GCNATTP-SCT', ngaycapgcn: new Date('2020-07-01'), ngayhethangcn: new Date('2023-06-30'), sdtlienhe: '0902789122', is_het_han: false },
  { tencuahang: ' CH BHX Bình Phước số 47', sanphamkinhdoanh: 'Thực phẩm tiêu dùng', scndkkd: '00049', ngaycap: new Date('2020-05-12'), noicap: 'Bình Phước', diachi: 'Khu phố 3, Phường Long Thủy, Thị xã Phước Long', id_quan_huyen: 1, sogcn: '47.2020KD/GCNATTP-SCT', ngaycapgcn: new Date('2020-07-16'), ngayhethangcn: new Date('2023-07-15'), sdtlienhe: '0902789123', is_het_han: false },
  { tencuahang: ' CH BHX Bình Phước số 37', sanphamkinhdoanh: 'Thực phẩm tiêu dùng', scndkkd: '00039', ngaycap: new Date('2020-01-31'), noicap: 'Bình Phước', diachi: 'Thôn 6, Xã Minh Hưng, Huyện Bù Đăng', id_quan_huyen: 9, sogcn: '49.2020KD/GCNATTP-SCT', ngaycapgcn: new Date('2020-07-16'), ngayhethangcn: new Date('2023-07-15'), sdtlienhe: '0902789124', is_het_han: false },
  { tencuahang: ' CH BHX Bình Phước số 42', sanphamkinhdoanh: 'Thực phẩm tiêu dùng', scndkkd: '00045', ngaycap: new Date('2020-03-31'), noicap: 'Bình Phước', diachi: 'Đường Bom Bo - Đắk Nhau, Thôn Thống Nhất, Xã Đắk Nhau, Huyện Bù Đăng', id_quan_huyen: 9, sogcn: '50.2020KD/GCNATTP-SCT', ngaycapgcn: new Date('2020-07-16'), ngayhethangcn: new Date('2023-07-15'), sdtlienhe: '0902789125', is_het_han: false },
  { tencuahang: ' CH BHX Bình Phước số 48', sanphamkinhdoanh: 'Thực phẩm tiêu dùng', scndkkd: '00050', ngaycap: new Date('2020-05-14'), noicap: 'Bình Phước', diachi: 'Đường Trần Hưng Đạo, Khu phố Phú Bình, Phường An Lộc, Thị xã Bình Long', id_quan_huyen: 3, sogcn: '48.2020KD/GCNATTP-SCT', ngaycapgcn: new Date('2020-07-16'), ngayhethangcn: new Date('2023-07-15'), sdtlienhe: '0902789126', is_het_han: false },
  { tencuahang: ' CH BHX Bình Phước số 51', sanphamkinhdoanh: 'Thực phẩm tiêu dùng', scndkkd: '00053', ngaycap: new Date('2020-06-08'), noicap: 'Bình Phước', diachi: 'Ấp 2A, Xã Lộc Điền, Huyện Lộc Ninh', id_quan_huyen: 4, sogcn: '52.2020KD/GCNATTP-SCT', ngaycapgcn: new Date('2020-07-31'), ngayhethangcn: new Date('2023-07-30'), sdtlienhe: '0902789127', is_het_han: false },
  { tencuahang: 'CH BHX Bình Phước số 52', sanphamkinhdoanh: 'Thực phẩm tiêu dùng', scndkkd: '00052', ngaycap: new Date('2020-05-18'), noicap: 'Bình Phước', diachi: 'Đường Quốc lộ 20C, Ấp 3, Xã Thống Nhất, Huyện Bù Đăng', id_quan_huyen: 9, sogcn: '53.2020KD/GCNATTP-SCT', ngaycapgcn: new Date('2020-07-31'), ngayhethangcn: new Date('2023-07-30'), sdtlienhe: '0902789128', is_het_han: false },
  { tencuahang: 'CH BHX Bình Phước số 50', sanphamkinhdoanh: 'Thực phẩm tiêu dùng', scndkkd: '00054', ngaycap: new Date('2020-06-08'), noicap: 'Bình Phước', diachi: 'Đường ĐT 759, Khu phố 2, Phường Phước Bình, Thị xã Phước Long', id_quan_huyen: 1, sogcn: '51.2020KD/GCNATTP-SCT', ngaycapgcn: new Date('2020-07-31'), ngayhethangcn: new Date('2023-07-30'), sdtlienhe: '0902789129', is_het_han: false },
  { tencuahang: 'CH BHX Bình Phước số 53', sanphamkinhdoanh: 'Thực phẩm tiêu dùng', scndkkd: '00055', ngaycap: new Date('2020-07-03'), noicap: 'Bình Phước', diachi: 'Đường Quốc lộ 13, Khu phố Ninh Thịnh, Thị trấn Lộc Ninh, Huyện Lộc Ninh', id_quan_huyen: 5, sogcn: '54.2020KD/GCNATTP-SCT', ngaycapgcn: new Date('2020-08-19'), ngayhethangcn: new Date('2023-08-18'), sdtlienhe: '0902789130', is_het_han: false },
  { tencuahang: 'CH BHX Bình Phước số 54', sanphamkinhdoanh: 'Thực phẩm tiêu dùng', scndkkd: '00056', ngaycap: new Date('2020-07-15'), noicap: 'Bình Phước', diachi: 'Đường 3 tháng 2, Khu phố Long Điền 1, Phường Phước Long, Thị xã Phước Long', id_quan_huyen: 1, sogcn: '55.2020KD/GCNATTP-SCT', ngaycapgcn: new Date('2020-10-20'), ngayhethangcn: new Date('2023-10-19'), sdtlienhe: '0902789131', is_het_han: false }]
  years: any[] = [];
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

  applyFilter1(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceHuyenThi.filter = filterValue.trim().toLowerCase();
  }

  public tableMergeHader: Array<ToltalHeaderMerge> = [];
  public mergeHeadersColumn: Array<string> = [];
  public indexOftableMergeHader: number = 0;

  columns: number = 1;
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
  { id: 11, ten_quan_huyen: 'Huyện Phú Riềng' }];
  headerArray: string[] = ['index', 'tenhuyenthi', 'ten_tttm', 'dientich', 'vondautu', 'namdautuxaydung', 'phanloai'];
  isChecked: boolean = false;

  filterModel: StoreFilterModel = new StoreFilterModel();
  filteredDataSource: MatTableDataSource<StoreCommonModel> = new MatTableDataSource<StoreCommonModel>();

  //
  public tongCuaHang: number;
  public soCuaHangTL: number;
  public soCuaHangKhac: number;
  public soCuaHangDauTuTrongNam: number = 0;
  public soCuaHangDauTuNamTruoc: number = 0;
  year: number;


  //Angular FUnction --------------------------------------------------------------------
  constructor(
    public excelService: ExcelService,
    public reportSevice: ReportService,
    public route: ActivatedRoute,
    public keyboardservice: KeyboardService,
    public info: InformationService
  ) { }

  ngOnInit(): void {
    let data: any = JSON.parse(localStorage.getItem('currentUser'));
    this.dataSourceHuyenThi.data = this.dataHuyenThi;
    this.filteredDataSource.data = [...this.dataSourceHuyenThi.data];

    this._caculator(this.dataSourceHuyenThi.data);
    this.year = new Date().getFullYear();
    this.years = this.getYears();
    this.autoOpen();
    // this._paginator();
  }

  autoOpen() {
    setTimeout(() => this.accordion.openAll(), 1000);
  }

  ngAfterViewInit(): void {
    this._paginator();
  }
  dataSourceHuyenThi: MatTableDataSource<StoreCommonModel> = new MatTableDataSource<StoreCommonModel>();

  //Xuất excel
  ExportTOExcel(filename: string, sheetname: string) {
    this.excelService.exportDomTableAsExcelFile(filename, sheetname, this.table.nativeElement);
  }

  sortHeaderCondition(event) {

  }

  getYears() {
    return [{text:'Tất cả',value:0}, {text:'2020',value:2020},{text:'2019',value:2019},{text:'2018',value:2018},];
  }

  private _paginator(): void {
    this.filteredDataSource.paginator = this.paginator;
    this.paginator._intl.itemsPerPageLabel = 'Số hàng';
    this.paginator._intl.firstPageLabel = "Trang Đầu";
    this.paginator._intl.lastPageLabel = "Trang Cuối";
    this.paginator._intl.previousPageLabel = "Trang Trước";
    this.paginator._intl.nextPageLabel = "Trang Tiếp";
  }

  private _caculator(data: StoreCommonModel[]): void {
    this.soCuaHangTL = data.length;
    this.soCuaHangKhac = data.length - this.soCuaHangTL;
    this.tongCuaHang = this.dataHuyenThi.length;
  }

  applyFilter() {
    if (this.isChecked)
      this.filterModel.is_het_han = true;
    else
      this.filterModel.is_het_han = null;
    let filteredData = this.filterArray(this.dataSourceHuyenThi.data, this.filterModel);
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
    this._caculator(filteredData);
  }

  filterArray(array, filters) {
    const filterKeys = Object.keys(filters);
    let temp = [...array];
    filterKeys.forEach(key => {
      let temp2 = [];
      if (key == 'is_het_han') {
        if (filters[key]) {
          temp2 = temp2.concat(temp.filter(x => x[key] == filters[key]));
          temp = [...temp2];
        }
      }
      if (key == 'ngaycapgcn') {
        if (filters[key] != 0) {
          temp2 = temp2.concat(temp.filter(x => x[key].getFullYear() == filters[key]));
          temp = [...temp2];
        }
      }
      else {
        if (filters[key])
          if (filters[key].length) {
            filters[key].forEach(criteria => {
              temp2 = temp2.concat(temp.filter(x => x[key] == criteria));
            });
            temp = [...temp2];
          }
      }
    })
    return temp;
  }
}
