import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatAccordion, MatDialog, MAT_DIALOG_DATA, MatTableDataSource } from '@angular/material';
import { ExcelServicesService } from 'src/app/shared/services/excel-services.service';
import { data_detail_model } from 'src/app/_models/APIModel/export-import.model';
import { SCTService } from 'src/app/_services/APIService/sct.service';
import { DownloadService } from 'src/app/_services/injectable-service/dowloadFile.service';
import * as XLSX from "xlsx";
import json_report_01 from "../test/report_export_01.json";

@Component({
  selector: 'app-detail-data',
  templateUrl: './detail-data.component.html',
  styleUrls: ["../../../special_layout.scss"],
})
export class DetailDataComponent implements OnInit {

  displayedColumns = [
    "index",
    "ten_san_pham",
    "thi_truong",
    "luong_thang",
    "gia_tri_thang",

    "luong_cong_don",
    "gia_tri_cong_don",
  ];
  displayRow1Header = [
    "index",
    "ten_san_pham",
    "thi_truong",
    "thuc_hien_bao_cao_thang",
    "cong_don_den_ky_bao_cao",

  ];
  displaRow2Header = [
    "luong_thang",
    "gia_tri_thang",

    "luong_cong_don",
    "gia_tri_cong_don",
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
  constructor(
    private excelService: ExcelServicesService,
    private sctService: SCTService,
    public matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public dataDialog,
    private downloads: DownloadService
  ) { }
  dataSource: MatTableDataSource<data_detail_model>;
  hrefReport: string;
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

      if (this.dataDialog.data['isExport']) this.mapData(data);
      if (this.dataDialog.data['isImport']) this.mapData(data);
    };
  }

  // Xuat khau
  mapData(data) {
    console.log(data)
    this.dataSource = new MatTableDataSource<data_detail_model>(data.map(item => {
      let tem = new data_detail_model();
      // tem.ten_san_pham = item['Sản phẩm'];
      tem.id_san_pham = item['id'] ? item['id'] : 1
      tem.thi_truong = item['Thị trường chủ yếu'] ? item['Thị trường chủ yếu'] : ""
      tem.san_luong_thang = item['Lượng tháng thực hiện (Tấn)'] ? item['Lượng tháng thực hiện (Tấn)'] : 0
      tem.tri_gia_thang = item['Giá trị tháng thực hiện (1,000 USD)'] ? item['Giá trị tháng thực hiện (1,000 USD)'] : 0
      tem.san_luong_cong_don = item['Lượng cộng dồn (Tấn)'] ? item['Lượng cộng dồn (Tấn)'] : 0
      tem.tri_gia_cong_don = item['Giá trị cộng dồn (1,000 USD)'] ? item['Giá trị cộng dồn (1,000 USD)'] : 0
      return tem;
    }));
  }

  Save() {
    console.log(this.dataSource.data)
    let date_time = this.currentYear * 100 + this.currentmonth;
    if (this.dataDialog.data['isImport']) {
      if (this.dataSource.data.length) {
        switch (this.dataTargetId) {
          case 1:
            if (this.getConfirm()) {
              this.sctService.CapNhatChiTietNKThang(date_time, this.dataSource.data).subscribe(res => {
                alert(res['message']);
              });
            }
            break;
          case 2:
            if (this.getConfirm()) {
              this.sctService.CapNhatChiTietNKThangTC(date_time, this.dataSource.data).subscribe(res => {
                alert(res['message']);
              });
            }
            break;

          default:
            break;
        }
      } else {
        alert('Chưa có dữ liệu !!');
      }
    }

    if (this.dataDialog.data['isExport']) {
      if (this.dataSource.data.length) {
        switch (this.dataTargetId) {
          case 1:
            if (this.getConfirm()) {
              this.sctService.CapNhatChiTietXKThang(date_time, this.dataSource.data).subscribe(res => {
                alert(res['message']);
              });
            }
            break;
          case 2:
            if (this.getConfirm()) {
              this.sctService.CapNhatChiTietXKThangTC(date_time, this.dataSource.data).subscribe(res => {
                alert(res['message']);
              });
            }
            break;

          default:
            break;
        }
      } else {
        alert('Chưa có dữ liệu !!');
      }
    }
    // this.matDialog.closeAll();
  }

  getConfirm() {
    return window.confirm('Bạn có muốn lưu dữ liệu !!');
  }

  public DowloadFile(filename: string, sheetname: string) {
    let report: any = json_report_01;
    this.excelService.exportAsExcelFile(report, "mau_bao_cao");
  }

  initReport(): void {
    this.hrefReport = "assets\\Báo cáo xuất nhập khẩu\\Chi tiết xuất khẩu\\Chi tiết xuất khẩu.xlsx";
  }

  checkIsImportOrExport(){
    if(this.dataDialog.data['isImport'])
      return true;
    return false;
  }
}
