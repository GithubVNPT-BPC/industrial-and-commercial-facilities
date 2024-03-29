import { Component, Injector } from '@angular/core';
import { BaseComponent } from 'src/app/components/specialized/base.component';
import { MatTableDataSource } from '@angular/material';

import { LoggerModel } from 'src/app/_models/APIModel/logger.model';
import { LoggerService } from 'src/app/_services/APIService/logger.service';

import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: 'app-system-log',
  templateUrl: './system-log.component.html',
  styleUrls: ['../manager_layout.scss'],
})
export class SystemLogComponent extends BaseComponent {

  dataSource: MatTableDataSource<LoggerModel> = new MatTableDataSource<LoggerModel>();
  filteredDataSource: MatTableDataSource<LoggerModel> = new MatTableDataSource<LoggerModel>();

  public displayedColumns = ['index', 'time', 'full_name', 'ten_bang',  'log_type', 'noi_dung_doi'];

  displayedFields = {
    ten_bang: "Bảng thay đổi",
    full_name: "Người thay đổi",
    time: "Thời gian",
    log_type: "Loại thay đổi",
    noi_dung_doi: "Nội dung",
  }

  logTypes = {
    1: "Tạo mới",
    2: "Chỉnh sửa",
    3: "Xóa",
  }

  constructor(
    private injector: Injector,
    public loggerService: LoggerService,
    public router: Router,
  ) {
    super(injector);
  }
  ngOnInit() {
    super.ngOnInit();
    this.getLog();
  }

  getLog() {
    this.loggerService.GetLogger().subscribe(result => {
      this.filteredDataSource.data = [];
      if (result.data && result.data.length) {
        result.data.map(x => {
          // FIX: hard-code ten_bang;
          x.ten_bang = 'Doanh nghiệp';
          x.log_type = this.logTypes[x.loai_thay_doi];
        });

        this.dataSource = new MatTableDataSource<LoggerModel>(result.data);
        this._prepareData();
        this.filteredDataSource.data = [...this.dataSource.data];
      }
      this.paginatorAgain();
    }),
      error => this.errorMessage = <any>error;
  }

  _prepareData() {
    this.dataSource.data.map(x => {
      x.noi_dung_doi = JSON.parse(x.noi_dung_doi);
      x.time = new Date(x.time + "+00:00");
    });

  }
 
  private Back() {
    this.router.navigate(['/']);
  }

}
