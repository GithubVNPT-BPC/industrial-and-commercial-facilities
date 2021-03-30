import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';

import { ReportService } from '../../../../_services/APIService/report.service';

import { ReportAttribute, ReportDatarow, ReportIndicator, ReportOject } from '../../../../_models/APIModel/report.model';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { formatDate } from '@angular/common';
import { MatTableFilter } from 'mat-table-filter';
import { element } from 'protractor';
import { ConfirmationDialogService } from 'src/app/shared/confirmation-dialog/confirmation-dialog.service';
import { LinkModel } from 'src/app/_models/link.model';
import { BreadCrumService } from 'src/app/_services/injectable-service/breadcrums.service';

@Component({
    selector: 'app-power-production',
    templateUrl: './power-production.component.html',
    styleUrls: ['/../../special_layout.scss']
})

export class PowerProductionManagementComponent implements OnInit {

    protected _linkOutput: LinkModel = new LinkModel();
    //Constant
    protected REDIRECT_PAGE: string = "/specialized/enery-management/power-production-month-detail";
    protected LINK_DEFAULT: string = "/specialized/enery-management/power_production";
    protected TITLE_DEFAULT: string = "Quy hoạch phát triển lưới điện - Điện sản xuất và thương phẩm";
    protected TEXT_DEFAULT: string = "Quy hoạch phát triển lưới điện - Điện sản xuất và thương phẩm";
    displayedColumns: string[] = ['index', /**"obj_name",**/ "time_id", "edit"];
    dataSource: MatTableDataSource<any>;
    tempObject: ReportOject;
    filterObject: ReportOject;
    filterType: MatTableFilter;

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    @ViewChild('reportPaginators', { static: true }) paginator: MatPaginator;
    public readonly DEFAULT_PERIOD = "Tháng";
    public readonly format = 'dd/MM/yyyy';
    public readonly locale = 'en-US';
    reportTypes = [{ ma_so: null, noi_dung: '' }, { ma_so: 1, noi_dung: 'Tháng' }, { ma_so: 2, noi_dung: 'Quý' }, { ma_so: 3, noi_dung: '6 Tháng' }, { ma_so: 4, noi_dung: 'Năm' }];
    months: number[] = [null, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    selectedYear: number;
    years: number[] = [];
    halfs: number[] = [1];
    org_id: number = 0;
    periods: Object[];

    constructor(
        public reportSevice: ReportService,
        public router: Router,
        public confirmationDialogService: ConfirmationDialogService,
        private breadCrumService: BreadCrumService
    ) { }

    ngOnInit() {
        this.filterObject = new ReportOject();
        this.tempObject = new ReportOject();
        this.filterType = MatTableFilter.ANYWHERE;
        this.years = this.InitialYears();
        this.selectedYear = this.GetCurrentYear();
        this.sendLinkToNext(true);

        let data: any = JSON.parse(localStorage.getItem('currentUser'));
        // this.org_id = parseInt(data.org_id);
        this.org_id = 5;
        this.GetList_ReportPowerProduction(this.selectedYear);
        this.periods = this.months;
        this.tempObject.submit_type_name = 'Báo cáo tháng';
    }

    GetList_ReportPowerProduction(year: number) {
        this.reportSevice.GetList_ReportPowerProduction(year).subscribe(response => {
            response.data.forEach(element => {
                element.time_id_text = this.TimeIDToText(element.time_id.toString());
            })
            this.dataSource = null;
            this.dataSource = new MatTableDataSource<ReportOject>(response.data);
            this.dataSource.paginator = this.paginator;
            if (this.paginator) {
                this.paginator._intl.itemsPerPageLabel = 'Số hàng';
                this.paginator._intl.firstPageLabel = "Trang Đầu";
                this.paginator._intl.lastPageLabel = "Trang Cuối";
                this.paginator._intl.previousPageLabel = "Trang Trước";
                this.paginator._intl.nextPageLabel = "Trang Tiếp";
            }
        })
    }

    TimeIDToText(time_id: string) {
        let result: string;
        switch (time_id.length) {
            case 4: result = 'Năm ' + time_id;
                break;
            case 5: result = 'Quý ' + time_id.substr(4) + '/' + time_id.substr(0, 4);
                break;
            case 6: result = 'Tháng ' + time_id.substr(4) + '/' + time_id.substr(0, 4);
                break;
            default:
        }
        return result;
    }

    GetCurrentYear() {
        var currentDate = new Date();
        return currentDate.getFullYear();
    }
    InitialYears() {
        let returnYear: Array<any> = [];
        let currentDate = new Date();
        let nextYear = currentDate.getFullYear();
        for (let index = 0; index < 5; index++) {
            returnYear.push(nextYear - index);
        }
        return returnYear;
    }

    click() {
        this.GetList_ReportPowerProduction(this.selectedYear);
    }

    OpenDetailObject(time_id: number) {
        this.router.navigate([this.REDIRECT_PAGE], { queryParams: { time_id : time_id} });

    public sendLinkToNext(type: boolean) {
        this._linkOutput.link = this.LINK_DEFAULT;
        this._linkOutput.title = this.TITLE_DEFAULT;
        this._linkOutput.text = this.TEXT_DEFAULT;
        this._linkOutput.type = type;
        this.breadCrumService.sendLink(this._linkOutput);
    }
}
