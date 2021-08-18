//Import library
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material';
import { MatAccordion } from '@angular/material/expansion';
import { MatPaginator } from '@angular/material/paginator';
//Import service
import { BreadCrumService } from 'src/app/_services/injectable-service/breadcrums.service';
import { ChartOptions, ChartDataSets, ChartType, Chart } from 'chart.js';
//Import Model
import { IIPIndustrialModel } from 'src/app/_models/industry.model';
import { LinkModel } from 'src/app/_models/link.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ExcelService } from 'src/app/_services/excelUtil.service';
import { ReportService } from 'src/app/_services/APIService/report.service';
import { formatDate } from '@angular/common';

@Component({
    selector: 'iip-industrial',
    templateUrl: './iip-industrial.component.html',
    styleUrls: ['/../../special_layout.scss'],
})

export class IIPIndustrialComponent implements OnInit {
    //Constant variable -----------------------------------------------------------
    private readonly REDIRECT_PAGE: string = "/specialized/industry-management/iip/iip-detail";
    private readonly LINK_DEFAULT: string = "/specialized/industry-management/iip";
    private readonly TITLE_DEFAULT: string = "Công nghiệp - Chỉ số sản xuất công nghiệp";
    private readonly TEXT_DEFAULT: string = "Công nghiệp - Chỉ số sản xuất công nghiệp";
    public readonly DISPLAY_COLS: string[] = ['index', 'chi_tieu', 'don_vi', 'thang_01', 'thang_02', 'thang_03',
        'thang_04', 'thang_05', 'thang_06', 'thang_07', 'thang_08', 'thang_09', 'thang_10', 'thang_11', 'thang_12', 'thuc_hien_nam'];
    //TS & HTML variable -----------------------------------------------------------
    private readonly DATA_DEFAULT: IIPIndustrialModel[] = [];
    public dataSource: MatTableDataSource<IIPIndustrialModel> = new MatTableDataSource<IIPIndustrialModel>();
    public year: number;
    public years: number[] = [];
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
        private _reportService: ReportService
    ) { }

    ngOnInit() {
        this.years = this.initYears();
        this.year = new Date().getFullYear();
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

    iip: Array<IIPIndustrialModel> = new Array<IIPIndustrialModel>();

    lineChartMethod(time_id: number) {
        this._reportService.Get12MonthReports(2, time_id, 'SCT_CUS_CSSXCNT_ATTR_THT').subscribe(
            res => {
                this.iip = res.data

                this.lineChart = new Chart(this.lineCanvas.nativeElement, {
                    type: 'line',
                    data: {
                        labels: this.timelist,
                        datasets: [
                            {
                                label: 'Chỉ số sản xuất công nghiệp (IIP) so với cùng kỳ theo giá so sánh năm 2010',
                                fill: false,
                                lineTension: 0.1,
                                backgroundColor: 'rgb(255, 0, 0)',
                                borderColor: 'rgb(255, 0, 0)',
                                borderCapStyle: 'butt',
                                borderDash: [],
                                borderDashOffset: 0.0,
                                borderJoinStyle: 'miter',
                                pointBorderColor: 'rgb(255, 0, 0)',
                                pointBackgroundColor: '#fff',
                                pointBorderWidth: 1,
                                pointHoverRadius: 5,
                                pointHoverBackgroundColor: 'rgb(255, 0, 0)',
                                pointHoverBorderColor: 'rgb(255, 0, 0)',
                                pointHoverBorderWidth: 2,
                                pointRadius: 1,
                                pointHitRadius: 10,
                                data: [this.iip[0].thang_01 ? this.iip[0].thang_01 : 0, this.iip[0].thang_02 ? this.iip[0].thang_02 : 0,
                                this.iip[0].thang_03 ? this.iip[0].thang_03 : 0, this.iip[0].thang_04 ? this.iip[0].thang_04 : 0,
                                this.iip[0].thang_05 ? this.iip[0].thang_05 : 0, this.iip[0].thang_06 ? this.iip[0].thang_06 : 0,
                                this.iip[0].thang_07 ? this.iip[0].thang_07 : 0, this.iip[0].thang_08 ? this.iip[0].thang_08 : 0,
                                this.iip[0].thang_09 ? this.iip[0].thang_09 : 0, this.iip[0].thang_10 ? this.iip[0].thang_10 : 0,
                                this.iip[0].thang_11 ? this.iip[0].thang_11 : 0, this.iip[0].thang_12 ? this.iip[0].thang_12 : 0],
                                spanGaps: false,
                            }
                        ]
                    }
                });
            })
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
    // //TS Function -----------------------------------------------------------------

    private initYears(): any {
        let returnYear: Array<any> = [];
        let year = new Date().getFullYear();
        for (let index = 0; index < 5; index++) {
            returnYear.push(year - index);
        }
        return returnYear;
    }

    private sendLinkToNext(type: boolean): void {
        this._linkOutput.link = this.LINK_DEFAULT;
        this._linkOutput.title = this.TITLE_DEFAULT;
        this._linkOutput.text = this.TEXT_DEFAULT;
        this._linkOutput.type = type;
        this._breadCrumService.sendLink(this._linkOutput);
    }

    private getData(time_id: number) {
        this._reportService.Get12MonthReports(2, time_id, 'SCT_CUS_CSSXCNT_ATTR_THT').subscribe(res => {
            this.dataSource = new MatTableDataSource<IIPIndustrialModel>(res.data);
            this.dataSource.paginator = this.paginator;
            this.paginator._intl.itemsPerPageLabel = 'Số hàng';
            this.paginator._intl.firstPageLabel = "Trang Đầu";
            this.paginator._intl.lastPageLabel = "Trang Cuối";
            this.paginator._intl.previousPageLabel = "Trang Trước";
            this.paginator._intl.nextPageLabel = "Trang Tiếp";
        })
    }
}