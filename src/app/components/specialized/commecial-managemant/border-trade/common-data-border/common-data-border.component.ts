import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatAccordion, MatDialog, MAT_DIALOG_DATA, MatTableDataSource } from '@angular/material';
import { ExcelServicesService } from 'src/app/shared/services/excel-services.service';
import { new_import_export_model, tong_quan_bg_model } from 'src/app/_models/APIModel/export-import.model';
import { SCTService } from 'src/app/_services/APIService/sct.service';
import * as XLSX from "xlsx";
import json_report_01 from "../../export-import-management/test/report_export_01.json";
import report_import from "../../export-import-management/test/report_export_01.json";
@Component({
  selector: 'app-common-data-border',
  templateUrl: './common-data-border.component.html',
  styleUrls: ["../../../special_layout.scss"],
})
export class CommonDataBorderComponent implements OnInit {

  displayedColumns = [
    "index",
    "ten_san_pham",
    "luong_thang",
    "gia_tri_thang",
    "uoc_th_so_cungky_tht",
    "uoc_th_so_thg_truoc_tht",

    "luong_cong_don",
    "gia_tri_cong_don",
    "uoc_th_so_cungky_cong_don",
    "uoc_th_so_thg_truoc_cong_don",
    // "danh_sach_doanh_nghiep",
    // "chi_tiet_doanh_nghiep",
  ];
  displayRow1Header = [
    "index",
    "ten_san_pham",
    "thuc_hien_bao_cao_thang",
    "cong_don_den_ky_bao_cao",

    // "danh_sach_doanh_nghiep",
    // "chi_tiet_doanh_nghiep",
  ];
  displaRow2Header = [
    "luong_thang",
    "gia_tri_thang",
    "uoc_th_so_cungky_tht",
    "uoc_th_so_thg_truoc_tht",
    "luong_cong_don",
    "gia_tri_cong_don",
    "uoc_th_so_cungky_cong_don",
    "uoc_th_so_thg_truoc_cong_don",
  ];
  years: number[] = this.getYears();
  months: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  dataTargets: any[] = [
    { id: 1, unit: "Cục hải quan" },
    { id: 2, unit: "Tổng cục hải quan" },
  ];
  dataTargetId = 2;
  currentmonth: number = new Date().getMonth() + 1;
  currentYear: number = new Date().getFullYear();
  @ViewChild(MatAccordion, { static: true }) accordion: MatAccordion;
  hrefReport: string;
  constructor(
    private excelService: ExcelServicesService,
    private sctService: SCTService,
    public matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public dataDialog,
    private excelServices: ExcelServicesService
  ) { }
  dataSource: MatTableDataSource<tong_quan_bg_model>;
  ngOnInit() {
    this.autoOpen();
    this.initReport();
  }

  getYears() {
    return Array(5)
      .fill(1)
      .map((element, index) => new Date().getFullYear() - index);
  }

  autoOpen() {
    setTimeout(() => this.accordion.openAll(), 1000);
  }

  onFileChange(e: any) {

  }

  arrayBuffer: any;
  file: File;
  incomingfile(event) {
    this.file = event.target.files[0];
  }

  handleFile(e) {

    /* wire up file reader */
    const target: any = <any>(e.target);
    if (target.files.length !== 1) {
      throw new Error('Cannot use multiple files');
    }
    let reader: FileReader = new FileReader();
    reader.readAsBinaryString(target.files[0]);
    reader.onload = (e: any) => {
      /* create workbook */
      const binarystr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(binarystr, { type: 'binary' });

      /* selected the first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      const data = XLSX.utils.sheet_to_json(ws); // to get 2d array pass 2nd parameter as object {header: 1}
      this.mapDataToObject(data);
      // this.mapDataToObject(data);
    };
  }

  mapData(data) {
    console.log(data)
    // this.dataSource = new MatTableDataSource<new_import_export_model>(data.map(item => {
    //   let tem = new new_import_export_model();
    //   // tem.ten_san_pham = item['Sản phẩm'];
    //   tem.id_san_pham = item['ID'].toString() ? item['ID'].toString() : 0;
    //   tem.san_luong_thang = item['Sản lượng (Nghìn tấn)'];
    //   tem.tri_gia_thang = item['Trị giá (Triệu USD)'] ? item['Trị giá (Triệu USD)'] : 0;
    //   tem.uoc_thang_so_voi_ki_truoc = item['ƯTH so với 1 tháng cùng kỳ'] ? item['ƯTH so với 1 tháng cùng kỳ'] : 0;
    //   tem.uoc_thang_so_voi_thang_truoc = item['ƯTH so với tháng trước'] ? item['ƯTH so với tháng trước'] : 0;
    //   tem.san_luong_cong_don= item['Sản lượng (Nghìn tấn)_1'] ? item['Sản lượng (Nghìn tấn)_1'] : 0;
    //   tem.tri_gia_cong_don = item['Trị giá (Triệu USD)_1'] ? item['Trị giá (Triệu USD)_1'] : 0;
    //   tem.uoc_cong_don_so_voi_ki_truoc = item['ƯTH so với 1 tháng cùng kỳ'] ? item['ƯTH so với 1 tháng cùng kỳ'] : 0;
    //   tem.uoc_cong_don_so_voi_cong_don_truoc = item['ƯTH so với kế hoạch năm'] ? item['ƯTH so với kế hoạch năm'] : 0;
    //   return tem;
    // }));
  }

  // Nhap khau
  mapDataToObject(data) {
    console.log(data)
    this.dataSource = new MatTableDataSource<tong_quan_bg_model>(data.map(item => {
      let tem = new tong_quan_bg_model();
      tem.id_cua_khau = item['id_cua_khau'];
      tem.id_loai_hang_hoa = item['id_loai_hang_hoa'];
      tem.ten_cua_khau = item['Tên cửa khẩu']
      tem.san_luong_thang = item['Sản lượng(Nghìn tấn)'] ? item['Sản lượng(Nghìn tấn)'] : 0;
      tem.tri_gia_thang = item['Trị giá(Triệu USD)'] ? item['Trị giá(Triệu USD)'] : 0;
      tem.uoc_thang_so_voi_ki_truoc = item['ƯTH so cùng kỳ'] ? item['ƯTH so cùng kỳ'] : 0;
      tem.uoc_thang_so_voi_thang_truoc = item['ƯTH so tháng trước'] ? item['ƯTH so tháng trước'] : 0;
      tem.san_luong_cong_don = item['Sản lượng(Nghìn tấn)_1'] ? item['Sản lượng(Nghìn tấn)_1'] : 0;
      tem.tri_gia_cong_don = item['Trị giá(Triệu USD)_1'] ? item['Trị giá(Triệu USD)_1'] : 0;
      tem.uoc_cong_don_so_voi_cung_ki = item['ƯTH so cùng kỳ_1'] ? item['ƯTH so cùng kỳ_1'] : 0;
      tem.uoc_cong_don_so_voi_ke_hoach_nam = item['ƯTH so KH năm'] ? item['ƯTH so KH năm'] : 0;
      // tem.time_id = this.currentYear * 100 + this.currentmonth;
      return tem;
    }));
    console.log(data)
  }

  Save() {
    let date_time = this.currentYear * 100 + this.currentmonth;
    if (this.dataDialog.data['isImport']) {

      if (this.getConfirm()) {
        this.sctService.CapNhatDuLieuNKBG(date_time, this.dataSource.data).subscribe(res => {
          alert(res['message']);
          console.log(this.dataSource.data)
        });
      }
    }
    if (this.dataDialog.data['isExport']) {

      if (this.getConfirm()) {
        this.sctService.CapNhatDuLieuXKBG(date_time, this.dataSource.data).subscribe(res => {
          alert(res['message']);
        });
      }
    }
  }
// this.matDialog.closeAll();


getConfirm() {
  return window.confirm('Bạn có muốn lưu dữ liệu !!');
}

  public DowloadFile(filename: string, sheetname: string) {
  let report: any = this.checkType() ? report_import : json_report_01;
  this.excelServices.exportAsExcelFile(report, "mau_bao_cao_xuat_khau");
}

checkType() {
  return this.dataDialog.data['isImport'] ? true : false;
}

initReport(): void {
  // this.downloads
  //   .download('/Book1.xlsx')
  //   .subscribe(blob => saveAs(blob, 'Book1.xlsx'))
  // if(this.dataDialog.data['isImport']) this.hrefReport = "assets\\Báo cáo xuất nhập khẩu\\Chi tiết nhập khẩu\\Chi tiết nhập khẩu.xlsx";
  // if(this.dataDialog.data['isExport'])
  this.hrefReport = "assets\\Báo cáo BG\\mau_bao_cao_bg_nk.xlsx";
  console.log(this.hrefReport)
}

}
