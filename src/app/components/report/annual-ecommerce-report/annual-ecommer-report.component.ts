import { Component, Injector } from '@angular/core';
import { MatDialog, MatDialogConfig, MatTableDataSource } from '@angular/material';
import { BaseComponent } from 'src/app/components/specialized/base.component';
import { LoginService } from 'src/app/_services/APIService/login.service';
import { DialogService } from 'src/app/_services/injectable-service/dialog.service';
import { DialogContainerComponent } from 'src/app/shared/dialog/dialog-container/dialog-container.component';
import { DialogContainerYearComponent } from 'src/app/shared/dialog/dialog-container/dialog-container-year.component';
import { ReportService } from 'src/app/_services/APIService/report.service';
import { AnnualEcommerceReportModel } from 'src/app/_models/APIModel/report.model';

@Component({
  selector: 'annual-ecommerce-report',
  templateUrl: './annual-ecommer-report.component.html',
  styleUrls: ['../report_layout.scss'],
  // styleUrls: ['../../specialized/special_layout.scss']
})
export class AnnualEcommerceReportComponent extends BaseComponent {
  //Constant variable
  public readonly displayedColumns: string[] = ['stt', 'ten_chi_tieu','ma_so', 'tong_so', 'nha_nuoc', 'ngoai_nha_nuoc', 'von_dau_tu_nuoc_ngoai', 'khu_vuc_khac'];
  //TS & HTML Variable
  public dataSource: MatTableDataSource<AnnualEcommerceReportModel> = new MatTableDataSource<AnnualEcommerceReportModel>();
  public filteredDataSource: MatTableDataSource<AnnualEcommerceReportModel> = new MatTableDataSource<AnnualEcommerceReportModel>();


  constructor(
    private injector: Injector,
    private reportService: ReportService,
    public _login: LoginService,
    public matDialog: MatDialog,
    private dialogService: DialogService 
  ) {
    super(injector);
  }

  authorize: boolean = true

  ngOnInit() {
    super.ngOnInit();
    this.getData(this.currentYear);

    if (this._login.userValue.user_role_id == 4  || this._login.userValue.user_role_id == 1) {
      this.authorize = false
    }
  }

  getLinkDefault() {
    this.LINK_DEFAULT = "/report/annual-ecommerce-report";
    this.TITLE_DEFAULT = "Báo cáo năm số đơn vị có giao dịch TMĐT";
    this.TEXT_DEFAULT = "Báo cáo năm số đơn vị có giao dịch TMĐT";
  }

  prepareData(data) {
    return data;
  }

  getData(time_id: any) {
    this.reportService.GetAnnualEcommerceReport(time_id).subscribe(res => {
      this.filteredDataSource.data = [];
      if (res.data && res.data.length > 0) {
        this.filteredDataSource = new MatTableDataSource<AnnualEcommerceReportModel>(res['data']);
        this.dataSource = new MatTableDataSource<AnnualEcommerceReportModel>(res['data']);
      }
      this.paginatorAgain();
    })
  }

  uploadExcel(e) {
    // open dialog upload excel file 
    this.openDialog("BCN TMĐT");
  }

  openDialog(nameSheet) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = window.innerWidth * 0.5 + 'px';
    dialogConfig.data = {
      nameSheet: nameSheet,
    };
    let dialogRef = this.matDialog.open(DialogContainerYearComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        const body = this.handleData(res);
        
        this.reportService.PostAnnualEcommerceReport(this.currentYear, body).subscribe(res => this.successNotify(res), err => this.errorNotify(err));
      }

    })
  }

  handleData(time_id) {
    let ls: any[] = [];
    let dataExcel = this.dialogService.getDataTransform();

    console.log(dataExcel)
    for (let i = 2; i < dataExcel.length; i++) {
      let body: any = {};
      body['stt'] = dataExcel[i]['BÁO CÁO NĂM - SỐ ĐƠN VỊ CÓ GIAO DỊCH TMĐT '];
      body['ten_chi_tieu'] = dataExcel[i]['__EMPTY'];
      body['ma_so'] = dataExcel[i]['__EMPTY_1'];
      body['tong_so'] = dataExcel[i]['__EMPTY_2'];
      body['nha_nuoc'] = dataExcel[i]['__EMPTY_3'];
      body['ngoai_nha_nuoc'] = dataExcel[i]['__EMPTY_4'];
      body['von_dau_tu_nuoc_ngoai'] = dataExcel[i]['__EMPTY_5'];
      body['khu_vuc_khac'] = dataExcel[i]['__EMPTY_6'];
      body['time_id'] = time_id;
      ls.push(body)
      console.log(body);
    }
    return ls;
  }

}
