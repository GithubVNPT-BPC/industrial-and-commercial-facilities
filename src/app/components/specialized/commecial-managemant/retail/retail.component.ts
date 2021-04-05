//Import library
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { MatAccordion } from '@angular/material/expansion';
import { MatPaginator } from '@angular/material/paginator';
//Import service
import { BreadCrumService } from 'src/app/_services/injectable-service/breadcrums.service';
//Import Model
import { LinkModel } from 'src/app/_models/link.model';
import { Router } from '@angular/router';
import { RetailModel } from 'src/app/_models/commecial.model';
import { ExcelService } from 'src/app/_services/excelUtil.service';
import { ReportService } from 'src/app/_services/APIService/report.service';

@Component({
    selector: 'retail',
    templateUrl: './retail.component.html',
    styleUrls: ['/../../special_layout.scss'],
})

export class RetailComponent implements OnInit {
    //Constant variable -----------------------------------------------------------
    private readonly REDIRECT_PAGE: string = "/specialized/commecial-management/retail/retail-detail";
    private readonly LINK_DEFAULT: string = "/specialized/commecial-management/retail";
    private readonly TITLE_DEFAULT: string = "Tổng mức bán lẻ hàng hoá và dịch vụ";
    private readonly TEXT_DEFAULT: string = "Tổng mức bán lẻ hàng hoá và dịch vụ";
    public readonly DISPLAY_COLS: string[] = ['index', 'chi_tieu', 'don_vi', 'thang_01', 'thang_02', 'thang_03',
        'thang_04', 'thang_05', 'thang_06', 'thang_07', 'thang_08', 'thang_09', 'thang_10', 'thang_11', 'thang_12'];
    //TS & HTML variable -----------------------------------------------------------
    public dataSource: MatTableDataSource<RetailModel> = new MatTableDataSource<RetailModel>();
    public year: number = new Date().getFullYear() - 1;
    public years: number[];
    public obj_id : number = 1;
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
        this.getData(this.year);
        this.sendLinkToNext(true);
    }

    //HTML & TS Function ----------------------------------------------------------
    public ChangeYear(year: number): void {
        this.getData(this.year);
    }

    public OpenDetail(month: number, year: number) {
        this._router.navigate([this.REDIRECT_PAGE], { queryParams: { time_id : year * 100 + month } });
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

    private getData(time_id: number) {
        this._reportService.Get12MonthReports(this.obj_id, time_id, 'SCT_CUS_ATTR_THT').subscribe(res => {
            this.dataSource = new MatTableDataSource<RetailModel>(res.data);
            this.dataSource.paginator = this.paginator;
            this.paginator._intl.itemsPerPageLabel = 'Số hàng';
            this.paginator._intl.firstPageLabel = "Trang Đầu";
            this.paginator._intl.lastPageLabel = "Trang Cuối";
            this.paginator._intl.previousPageLabel = "Trang Trước";
            this.paginator._intl.nextPageLabel = "Trang Tiếp";
        })
    }
}