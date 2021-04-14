//Import Library
import { Component, Injector } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

import { SummaryReportModel } from 'src/app/_models/APIModel/report.model';
import { BaseComponent } from 'src/app/components/specialized/base.component';
import { ReportService } from 'src/app/_services/APIService/report.service';

import { EnterpriseService } from 'src/app/_services/APIService/enterprise.service';
import { FilterService } from 'src/app/_services/filter.service';
import { LoginService } from 'src/app/_services/APIService/login.service';

@Component({
  selector: 'app-summary-report',
  templateUrl: './summary-report.component.html',
  styleUrls: ['../report_layout.scss'],
})
export class SummaryReportComponent extends BaseComponent {
  public dataSource: MatTableDataSource<SummaryReportModel> = new MatTableDataSource<SummaryReportModel>();
  public filteredDataSource: MatTableDataSource<SummaryReportModel> = new MatTableDataSource<SummaryReportModel>();

  displayedColumns = ['index', 'ma_chi_tieu', 'ten_chi_tieu', 'don_vi_tinh', 'thuc_hien_cung_ki_nam_truoc', 'thuc_hien_ki_truoc', 'thuc_hien_thang', 'so_sanh_thuc_hien_voi_ki_truoc', 'thuc_hien_thang_12_nam_truoc'];

  displayedFields = {
    ma_chi_tieu: "MÃ CHỈ TIÊU",
    ten_chi_tieu: "TÊN CHỈ TIÊU",
    don_vi_tinh: "ĐƠN VỊ TÍNH",
    thuc_hien_cung_ki_nam_truoc: "Thực hiện cùng kỳ",
    thuc_hien_ki_truoc: "Thực hiện tháng trước",
    thuc_hien_thang: "Thực hiện tháng",
    so_sanh_thuc_hien_voi_ki_truoc: "Thực hiện so với tháng trước",
    thuc_hien_thang_12_nam_truoc: "Thực hiện so cùng kỳ",
  }

  constructor(
    private injector: Injector,
    public reportSevice: ReportService,    
    public filterService: FilterService,
    public enterpriseService: EnterpriseService,
    public _login: LoginService
  ) {
    super(injector);
  }

  authorize: boolean = true;

  ngOnInit(): void {
    super.ngOnInit();
    this.initDistrictWard();
    this.getSummaryReportData(this.currentYear, this.currentMonth);

    if (this._login.userValue.user_role_id == 3  || this._login.userValue.user_role_id == 1) {
      this.authorize = false
    }
  }

  getLinkDefault() {
    this.LINK_DEFAULT = "/report/summary";
    this.TITLE_DEFAULT = "Tổng hợp số liệu báo cáo";
    this.TEXT_DEFAULT = "Tổng hợp số liệu báo cáo";
  }

  getSummaryReportData(year, month) {
    this.reportSevice.GetSummaryReport(year, month).subscribe(
      allrecords => {
        this.filteredDataSource.data = [];
        if (allrecords.data && allrecords.data.length > 0) {
          let data = allrecords.data;
          this.dataSource = new MatTableDataSource<SummaryReportModel>(data);

          // this.dataSource.data.map(x => {
          //   x.
          // });
          this.filteredDataSource.data = [...this.dataSource.data];
        }
        this._prepareData();
        this.paginatorAgain();
      },
      error => this.errorMessage = <any>error
    );
  }

  applyFilter(event) {
    if (event.target) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.filteredDataSource.filter = filterValue.trim().toLowerCase();
    } else {
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
    this._prepareData();
    this.paginatorAgain();
  }

  public _prepareData() {};

}
