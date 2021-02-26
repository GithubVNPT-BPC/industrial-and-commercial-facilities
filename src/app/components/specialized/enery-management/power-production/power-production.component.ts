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

@Component({
    selector: 'app-power-production',
    templateUrl: './power-production.component.html',
    styleUrls: ['/../../special_layout.scss']
})

export class PowerProductionManagementComponent implements OnInit {

    displayedColumns: string[] = ['index', "obj_name", "time_id", "edit"];
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
        public confirmationDialogService: ConfirmationDialogService
    ) { }

    ngOnInit() {
        this.filterObject = new ReportOject();
        this.tempObject = new ReportOject();
        this.filterType = MatTableFilter.ANYWHERE;
        this.years = this.InitialYears();
        this.selectedYear = this.GetCurrentYear();

        let data: any = JSON.parse(localStorage.getItem('currentUser'));
        this.org_id = parseInt(data.org_id);
        this.GetList_ReportPowerProduction(this.selectedYear);
        this.periods = this.months;
        this.tempObject.submit_type_name = 'Báo cáo tháng';
    }

    GetList_ReportPowerProduction(year : number) {
        this.reportSevice.GetList_ReportPowerProduction(year).subscribe(response => {
            console.log(response)
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

    OpenDetailObject(obj: ReportOject) {
        const url = this.router.serializeUrl(
            this.router.createUrlTree([encodeURI('#') + '/report/view'], { queryParams: { obj_id: obj.obj_id, org_id: this.org_id, time_id: obj.time_id } })
        );
        window.open(url.replace('%23', '#'), "_blank");
    }
}
