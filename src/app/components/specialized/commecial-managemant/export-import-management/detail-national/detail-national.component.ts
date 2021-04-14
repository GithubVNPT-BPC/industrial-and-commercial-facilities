import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatAccordion, MatDialog, MAT_DIALOG_DATA, MatTableDataSource } from '@angular/material';
import { ExcelServicesService } from 'src/app/shared/services/excel-services.service';
import { new_import_export_model } from 'src/app/_models/APIModel/export-import.model';
import { SCTService } from 'src/app/_services/APIService/sct.service';
import * as XLSX from "xlsx";
import json_report_01 from "../test/report_export_01.json";

@Component({
  selector: 'app-detail-national',
  templateUrl: './detail-national.component.html',
  styleUrls: ["../../../special_layout.scss"],
})
export class DetailNationalComponent implements OnInit {

  hrefReport = "assets\\Báo cáo xuất nhập khẩu\\File_mau_top_doanh_nghiep.xlsx";
  displayedColumns = [
    "index",
    "ma_so_thue",
    "ten_san_pham",
    "tri_gia"
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
    @Inject(MAT_DIALOG_DATA) public dataDialog
  ) {}
  dataSource: MatTableDataSource<new_import_export_model>;
  body: any[]=[];
  ngOnInit() {
    this.autoOpen();
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

    arrayBuffer:any;
    file:File;
    incomingfile(event){
        this.file= event.target.files[0]; 
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
      };
    }

    mapDataToObject(data){
      // console.log(data);
      this.dataSource = new MatTableDataSource<new_import_export_model>(data.map(item => {
        let tem = new new_import_export_model();
        // tem.ten_san_pham = item['Sản phẩm'];
        tem.id_san_pham = item['ID'] ? item['ID'] : 0;
        tem.mst = item['Mã số thuế'] ? item['Mã số thuế'] : 0;
        tem.ten_san_pham = item['Sản phẩm'] ? item['Sản phẩm'] : 0;
        tem.tri_gia_thang = item['Trị giá'] ? item['Trị giá'] : 0;
        return tem;
      }));
      this.mapDataTobody();
    }

    mapDataTobody(){
      let date_time = this.currentYear*100 + this.currentmonth;
      this.body = this.dataSource.data.map(e =>{
        let ob = {};
        ob['id_san_pham'] = e.id_san_pham;
        ob['mst'] = e.mst;
        ob['cong_suat'] = e.tri_gia_thang;
        ob['time_id'] = date_time
        return ob;
      })
    }

    Save(){
      console.log(this.body);
      if(this.dataDialog.data['isImport']){
        if(this.body.length){
          switch (this.dataTargetId) {
            case 1:
              if(this.getConfirm()){
                this.sctService.CapNhatDNNKThang(this.body).subscribe(res => {
                  alert(res['message']);
                });
              }
              break;
            case 2:
              if(this.getConfirm()){
                this.sctService.CapNhatDNNKThangTC(this.dataSource.data).subscribe(res => {
                  alert(res['message']);
                });
              }
              break;
          
            default:
              break;
          }
        }else{
          alert('Chưa có dữ liệu !!');
        }
      }

      if(this.dataDialog.data['isExport']){
        if(this.body.length){
          switch (this.dataTargetId) {
            case 1:
              if(this.getConfirm()){
                this.sctService.CapNhatDNXKThang(this.body).subscribe(res => {
                  alert(res['message']);
                });
              }
              break;
            case 2:
              if(this.getConfirm()){
                this.sctService.CapNhatDNXKThangTC(this.body).subscribe(res => {
                  alert(res['message']);
                });
              }
              break;
          
            default:
              break;
          }
        }else{
          alert('Chưa có dữ liệu !!');
        }
      }
      // this.matDialog.closeAll();
    }

    getConfirm(){
      return window.confirm('Bạn có muốn lưu dữ liệu !!');
    }

    public DowloadFile(filename: string, sheetname: string) {
      let report: any = json_report_01;
      this.excelService.exportAsExcelFile(report, "mau_bao_cao_xuat_khau");
    }

}
