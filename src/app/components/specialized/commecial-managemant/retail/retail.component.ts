//Import library
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { MatAccordion } from '@angular/material/expansion';
import { MatPaginator } from '@angular/material/paginator';
//Import service
import { BreadCrumService } from 'src/app/_services/injectable-service/breadcrums.service';
import { ChartOptions, ChartDataSets, ChartType, Chart } from 'chart.js';
//Import Model
import { LinkModel } from 'src/app/_models/link.model';
import { Router } from '@angular/router';
import { RetailModel } from 'src/app/_models/commecial.model';
import { ExcelService } from 'src/app/_services/excelUtil.service';
import { ReportService } from 'src/app/_services/APIService/report.service';
import { formatDate } from '@angular/common';
import { SCTService } from 'src/app/_services/APIService/sct.service';

@Component({
    selector: 'retail',
    templateUrl: './retail.component.html',
    styleUrls: ['/../../special_layout.scss']
})

export class RetailComponent implements OnInit {
    //Constant variable -----------------------------------------------------------
    private readonly REDIRECT_PAGE: string = "/specialized/commecial-management/retail/retail-detail";
    private readonly LINK_DEFAULT: string = "/specialized/commecial-management/retail";
    private readonly TITLE_DEFAULT: string = "Tổng mức bán lẻ hàng hoá và dịch vụ";
    private readonly TEXT_DEFAULT: string = "Tổng mức bán lẻ hàng hoá và dịch vụ";
    public readonly DISPLAY_COLS: string[] = ['index', 'chi_tieu', 'don_vi', 'ke_hoach_nam', 'thang_01', 'thang_02', 'thang_03',
        'thang_04', 'thang_05', 'thang_06', 'thang_07', 'thang_08', 'thang_09', 'thang_10', 'thang_11', 'thang_12', 'thuc_hien_nam', 'so_sanh'];
    //TS & HTML variable -----------------------------------------------------------
    public dataSource: MatTableDataSource<RetailModel> = new MatTableDataSource<RetailModel>();
    public year: number = new Date().getFullYear();
    public years: number[];
    public obj_id: number = 1;
    //Only TS Variable ------------------------------------------------------------
    private _linkOutput: LinkModel = new LinkModel();
    //ViewChild & Input & Output -------------------------------------------------
    @ViewChild(MatAccordion, { static: false }) accordion: MatAccordion;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild('TABLE', { static: false }) table: ElementRef;

    ExportTOExcel(filename: string, sheetname: string) {
        this.excelService.exportDomTableAsExcelFile(filename, sheetname, this.table.nativeElement);
    }

    //Contructor + Init + Destroy
    constructor(
        public excelService: ExcelService,
        private _breadCrumService: BreadCrumService,
        private _router: Router,
        // private _reportService: ReportService,
        private _sctService: SCTService
    ) { }

    ngOnInit() {
        this.years = this.initYears();
        this.getData(this.year);
        this.sendLinkToNext(true);
    }

    @ViewChild('lineCanvas', { static: false }) lineCanvas: ElementRef;
    lineChart: any;

    timelist: string[] = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12']
    thuchienthang: any[]

    ngAfterViewInit(): void {
        this.lineChartMethod(parseInt(this.getCurrentYear()));
    }

    public getCurrentYear(): string {
        let date = new Date;
        return formatDate(date, 'yyyy', 'en-US');
    }

    retailCurrentYear: Array<RetailModel> = new Array<RetailModel>();
    retailPreviousYear: Array<RetailModel> = new Array<RetailModel>();
    retailOtherYear: Array<RetailModel> = new Array<RetailModel>();

    lineChartMethod(time_id: number) {
        //this._reportService.Get12MonthReports(this.obj_id, time_id, 'SCT_CUS_TMBLHHDV_ATTR_THT').subscribe(
        this._sctService.GetDanhSachBLHHTongHop(time_id).subscribe(
            res => {
                if (res){
                this.retailCurrentYear = res.data[0]
                this.retailPreviousYear = res.data[1]
                this.retailOtherYear = res.data[2]

                this.lineChart = new Chart(this.lineCanvas.nativeElement, {
                    type: 'line',
                    data: {
                        labels: this.timelist,
                        datasets: [
                            {
                                label: 'Năm ' + this.retailCurrentYear[0].time_id,
                                fill: false,
                                lineTension: 0.1,
                                backgroundColor: 'rgb(0, 0, 255)',
                                borderColor: 'rgb(0, 0, 255)',
                                borderCapStyle: 'butt',
                                borderDash: [],
                                borderDashOffset: 0.0,
                                borderJoinStyle: 'miter',
                                pointBorderColor: 'rgb(0, 0, 255)',
                                pointBackgroundColor: '#fff',
                                pointBorderWidth: 1,
                                pointHoverRadius: 5,
                                pointHoverBackgroundColor: 'rgb(0, 0, 255)',
                                pointHoverBorderColor: 'rgb(0, 0, 255)',
                                pointHoverBorderWidth: 2,
                                pointRadius: 1,
                                pointHitRadius: 10,
                                data: [this.retailCurrentYear[0].thang_01 ? this.retailCurrentYear[0].thang_01 : 0, this.retailCurrentYear[0].thang_02 ? this.retailCurrentYear[0].thang_02 : 0,
                                this.retailCurrentYear[0].thang_03 ? this.retailCurrentYear[0].thang_03 : 0, this.retailCurrentYear[0].thang_04 ? this.retailCurrentYear[0].thang_04 : 0,
                                this.retailCurrentYear[0].thang_05 ? this.retailCurrentYear[0].thang_05 : 0, this.retailCurrentYear[0].thang_06 ? this.retailCurrentYear[0].thang_06 : 0,
                                this.retailCurrentYear[0].thang_07 ? this.retailCurrentYear[0].thang_07 : 0, this.retailCurrentYear[0].thang_08 ? this.retailCurrentYear[0].thang_08 : 0,
                                this.retailCurrentYear[0].thang_09 ? this.retailCurrentYear[0].thang_09 : 0, this.retailCurrentYear[0].thang_10 ? this.retailCurrentYear[0].thang_10 : 0,
                                this.retailCurrentYear[0].thang_11 ? this.retailCurrentYear[0].thang_11 : 0, this.retailCurrentYear[0].thang_12 ? this.retailCurrentYear[0].thang_12 : 0],
                                spanGaps: false,
                            },
                            {
                                label: 'Năm ' + this.retailPreviousYear[0].time_id,
                                fill: false,
                                lineTension: 0.1,
                                backgroundColor: 'rgb(255, 255, 0)',
                                borderColor: 'rgb(255, 255, 0)',
                                borderCapStyle: 'butt',
                                borderDash: [],
                                borderDashOffset: 0.0,
                                borderJoinStyle: 'miter',
                                pointBorderColor: 'rgb(255, 255, 0)',
                                pointBackgroundColor: '#fff',
                                pointBorderWidth: 1,
                                pointHoverRadius: 5,
                                pointHoverBackgroundColor: 'rgb(255, 255, 0)',
                                pointHoverBorderColor: 'rgb(255, 255, 0)',
                                pointHoverBorderWidth: 2,
                                pointRadius: 1,
                                pointHitRadius: 10,
                                data: [this.retailPreviousYear[0].thang_01 ? this.retailPreviousYear[0].thang_01 : 0, this.retailPreviousYear[0].thang_02 ? this.retailPreviousYear[0].thang_02 : 0,
                                this.retailPreviousYear[0].thang_03 ? this.retailPreviousYear[0].thang_03 : 0, this.retailPreviousYear[0].thang_04 ? this.retailPreviousYear[0].thang_04 : 0,
                                this.retailPreviousYear[0].thang_05 ? this.retailPreviousYear[0].thang_05 : 0, this.retailPreviousYear[0].thang_06 ? this.retailPreviousYear[0].thang_06 : 0,
                                this.retailPreviousYear[0].thang_07 ? this.retailPreviousYear[0].thang_07 : 0, this.retailPreviousYear[0].thang_08 ? this.retailPreviousYear[0].thang_08 : 0,
                                this.retailPreviousYear[0].thang_09 ? this.retailPreviousYear[0].thang_09 : 0, this.retailPreviousYear[0].thang_10 ? this.retailPreviousYear[0].thang_10 : 0,
                                this.retailPreviousYear[0].thang_11 ? this.retailPreviousYear[0].thang_11 : 0, this.retailPreviousYear[0].thang_12 ? this.retailPreviousYear[0].thang_12 : 0],
                                spanGaps: false,
                            },
                            // {
                            //     label: 'Năm ' + this.retailOtherYear[0].time_id,
                            //     fill: false,
                            //     lineTension: 0.1,
                            //     backgroundColor: 'rgb(0, 0, 255)',
                            //     borderColor: 'rgb(0, 0, 255)',
                            //     borderCapStyle: 'butt',
                            //     borderDash: [],
                            //     borderDashOffset: 0.0,
                            //     borderJoinStyle: 'miter',
                            //     pointBorderColor: 'rgb(0, 0, 255)',
                            //     pointBackgroundColor: '#fff',
                            //     pointBorderWidth: 1,
                            //     pointHoverRadius: 5,
                            //     pointHoverBackgroundColor: 'rgb(0, 0, 255)',
                            //     pointHoverBorderColor: 'rgb(0, 0, 255)',
                            //     pointHoverBorderWidth: 2,
                            //     pointRadius: 1,
                            //     pointHitRadius: 10,
                            //     data: [this.retailOtherYear[0].thang_01 ? this.retailOtherYear[0].thang_01 : 0, this.retailOtherYear[0].thang_02 ? this.retailOtherYear[0].thang_02 : 0,
                            //     this.retailOtherYear[0].thang_03 ? this.retailOtherYear[0].thang_03 : 0, this.retailOtherYear[0].thang_04 ? this.retailOtherYear[0].thang_04 : 0,
                            //     this.retailOtherYear[0].thang_05 ? this.retailOtherYear[0].thang_05 : 0, this.retailOtherYear[0].thang_06 ? this.retailOtherYear[0].thang_06 : 0,
                            //     this.retailOtherYear[0].thang_07 ? this.retailOtherYear[0].thang_07 : 0, this.retailOtherYear[0].thang_08 ? this.retailOtherYear[0].thang_08 : 0,
                            //     this.retailOtherYear[0].thang_09 ? this.retailOtherYear[0].thang_09 : 0, this.retailOtherYear[0].thang_10 ? this.retailOtherYear[0].thang_10 : 0,
                            //     this.retailOtherYear[0].thang_11 ? this.retailOtherYear[0].thang_11 : 0, this.retailOtherYear[0].thang_12 ? this.retailOtherYear[0].thang_12 : 0],
                            //     spanGaps: false,
                            // }
                        ]
                    }
                });}
            })
    }

    private getData(time_id: number) {
        // this._reportService.Get12MonthReports(this.obj_id, time_id, 'SCT_CUS_TMBLHHDV_ATTR_THT').subscribe(res => {
        //     this.dataSource = new MatTableDataSource<RetailModel>(res.data);
        //     this.dataSource.paginator = this.paginator;
        //     this.paginator._intl.itemsPerPageLabel = 'Số hàng';
        //     this.paginator._intl.firstPageLabel = "Trang Đầu";
        //     this.paginator._intl.lastPageLabel = "Trang Cuối";
        //     this.paginator._intl.previousPageLabel = "Trang Trước";
        //     this.paginator._intl.nextPageLabel = "Trang Tiếp";
        // })
        this._sctService.GetDanhSachBLHHTongHop(time_id).subscribe(
            response => {
                this.dataSource = new MatTableDataSource<RetailModel>(response.data[0]);
                this.dataSource.paginator = this.paginator;
                this.paginator._intl.itemsPerPageLabel = 'Số hàng';
                this.paginator._intl.firstPageLabel = "Trang Đầu";
                this.paginator._intl.lastPageLabel = "Trang Cuối";
                this.paginator._intl.previousPageLabel = "Trang Trước";
                this.paginator._intl.nextPageLabel = "Trang Tiếp";
            }
        );
    }

    //HTML & TS Function ----------------------------------------------------------
    public ChangeYear(year: number): void {
        this.lineChart.config.data.datasets = []
        this.getData(this.year);
        this.lineChartMethod(this.year);
    }

    public OpenDetail(month: number, year: number) {
        this._router.navigate([this.REDIRECT_PAGE], { queryParams: { time_id: year * 100 + month } });
    }

    //TS Function -----------------------------------------------------------------

    private sendLinkToNext(type: boolean): void {
        this._linkOutput.link = this.LINK_DEFAULT;
        this._linkOutput.title = this.TITLE_DEFAULT;
        this._linkOutput.text = this.TEXT_DEFAULT;
        this._linkOutput.type = type;
        this._breadCrumService.sendLink(this._linkOutput);
    }

    private initYears(): any {
        let returnYear: Array<any> = [];
        let year = new Date().getFullYear();
        for (let index = 0; index < 5; index++) {
            returnYear.push(year - index);
        }
        return returnYear;
    }
}
