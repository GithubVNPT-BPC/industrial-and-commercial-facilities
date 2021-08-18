import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { MatTableDataSource, MatTable, MatAccordion, MatPaginator, MatSort } from '@angular/material';
import { new_import_export_model, Task } from 'src/app/_models/APIModel/export-import.model';
import { SCTService } from 'src/app/_services/APIService/sct.service';
import { ModalComponent } from '../dialog-import-export/modal.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MarketService } from '../../../../../_services/APIService/market.service';
import { BreadCrumService } from 'src/app/_services/injectable-service/breadcrums.service';
import { LinkModel } from 'src/app/_models/link.model';
import { ExcelServicesService } from 'src/app/shared/services/excel-services.service';
import { ImportDataComponent } from '../import-data/import-data.component';

// Services
import { ExcelService } from 'src/app/_services/excelUtil.service';
import { LoginService } from 'src/app/_services/APIService/login.service';

import { FormControl } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import _moment from 'moment';
import { defaultFormat as _rollupMoment, Moment } from 'moment';
import { MarketServicePublic } from 'src/app/_services/APIService/market.service public';
import { BaseComponent } from 'src/app/components/specialized/base.component';
import { formatDate } from '@angular/common';

const moment = _rollupMoment || _moment;
export const MY_FORMATS = {
    parse: {
        dateInput: 'MM/YYYY',
    },
    display: {
        dateInput: 'MM/YYYY',
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY',
    },
};

@Component({
    selector: 'app-import-management',
    templateUrl: './import-management.component.html',
    styleUrls: ['../../../special_layout.scss'],
    providers: [
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
        },

        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
        { provide: MAT_DATE_LOCALE, useValue: 'vi' },
    ],
})

export class ImportManagementComponent implements OnInit, AfterViewInit {
    private readonly LINK_DEFAULT: string = "/specialized/commecial-management/export_import/imported_products";
    private readonly TITLE_DEFAULT: string = "Thông tin nhập khẩu";
    private readonly TEXT_DEFAULT: string = "Thông tin nhập khẩu";

    public date = new FormControl(_moment());
    public newdate = new FormControl(_moment());
    public theYear: number;
    public theMonth: number;
    public stringmonth: string
    public time: string
    public timechange: number
    public month: string

    public chosenYearHandler(normalizedYear: Moment) {
        this.date = this.newdate
        const ctrlValue = this.date.value;
        ctrlValue.year(normalizedYear.year());
        this.date.setValue(ctrlValue);
        this.theYear = normalizedYear.year();
    }

    public chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
        const ctrlValue = this.date.value;
        ctrlValue.month(normalizedMonth.month());
        this.date.setValue(ctrlValue);
        this.theMonth = normalizedMonth.month() + 1;
        datepicker.close();

        if (this.theMonth >= 10) {
            this.stringmonth = this.theMonth.toString();
        }
        else {
            this.stringmonth = "0" + this.theMonth.toString()
        }
        this.time = this.theYear.toString() + this.stringmonth
        this.timechange = parseInt(this.time)

        if (this.dataTargetId == 1) {
            this.getDanhSachNhapKhau(this.timechange)
        }
        else {
            this.getDanhSachNhapKhauTC(this.timechange)
        }

        this.month = this.time.substring(5, 6)
    }

    // displayedColumns = [
    //     "index",
    //     "ten_san_pham",
    //     "thoi_gian_chinh_sua_cuoi",
    //     "luong_thang",
    //     "gia_tri_thang",
    //     "uoc_th_so_cungky_tht",
    //     "uoc_th_so_thg_truoc_tht",

    //     "luong_cong_don",
    //     "gia_tri_cong_don",
    //     "uoc_th_so_cungky_cong_don",
    //     "uoc_th_so_thg_truoc_cong_don",
    //     "danh_sach_doanh_nghiep",
    //     "chi_tiet_doanh_nghiep",
    // ];
    displayedColumns = [
        "index",
        "ten_san_pham",
        "don_vi_tinh",
        "gia_tri_thang",
        "uoc_th_so_cungky_tht",
        "uoc_th_so_thg_truoc_tht",

        "gia_tri_cong_don",
        "uoc_th_so_cungky_cong_don",
        "uoc_th_so_thg_truoc_cong_don",
        "danh_sach_doanh_nghiep",
        "chi_tiet_doanh_nghiep",
    ];
    displayRow1Header = [
        "index",
        "ten_san_pham",
        "don_vi_tinh",
        "thuc_hien_bao_cao_thang",
        "cong_don_den_ky_bao_cao",

        "danh_sach_doanh_nghiep",
        "chi_tiet_doanh_nghiep",
    ];
    // displaRow2Header = [
    //     "luong_thang",
    //     "gia_tri_thang",
    //     "uoc_th_so_cungky_tht",
    //     "uoc_th_so_thg_truoc_tht",
    //     "luong_cong_don",
    //     "gia_tri_cong_don",
    //     "uoc_th_so_cungky_cong_don",
    //     "uoc_th_so_thg_truoc_cong_don",
    // ];
    displaRow2Header = [
        "gia_tri_thang",
        "uoc_th_so_cungky_tht",
        "uoc_th_so_thg_truoc_tht",
        "gia_tri_cong_don",
        "uoc_th_so_cungky_cong_don",
        "uoc_th_so_thg_truoc_cong_don",
    ];

    private _linkOutput: LinkModel = new LinkModel();
    dataSource: MatTableDataSource<new_import_export_model>;
    dataDialog: any[] = [];
    dataBusiness: any[] = [];
    filteredDataSource: MatTableDataSource<new_import_export_model> = new MatTableDataSource<new_import_export_model>();

    TongGiaTriThangThucHien: number = 0;
    TongLuongCongDon: number = 0;
    TongLuongThangThucHien: number = 0;
    TongGiaTriCongDon: number = 0;
    uth_so_cungky: number = 0;
    uth_so_khn: number = 0;
    isChecked: boolean;
    pagesize: number = 0;
    @ViewChild("TABLE", { static: false }) table: ElementRef;
    @ViewChild(MatAccordion, { static: true }) accordion: MatAccordion;
    @ViewChild("paginator", { static: false }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: false }) sort: MatSort;

    dataTargets: any[] = [
        { id: 1, unit: 'Cục hải quan' },
        { id: 2, unit: 'Tổng cục hải quan' }
    ]
    dataTargetId = 1;

    constructor(
        public sctService: SCTService,
        public matDialog: MatDialog,
        public marketService: MarketService,
        private _breadCrumService: BreadCrumService,
        private excelServices: ExcelServicesService,
        public excelService: ExcelService,
        public _login: LoginService
    ) { }

    handleGTXK() {
        // this.dataSource.data.forEach(item => {
        //     this.TongGiaTriThangThucHien += item['gia_tri_thang'];
        //     this.uth_so_cungky = 
        // })
    }

    initVariable() {
        this.TongLuongThangThucHien = 0;
        this.TongGiaTriThangThucHien = 0;
        this.TongLuongCongDon = 0;
        this.TongGiaTriCongDon = 0;
        //toongr cuuc
        this.tongluong_tc = 0;
        this.tonggiatri_tc = 0;
        this.tongluongcongdon_tc = 0;
        this.tonggiatricongdon_tc = 0;

        //uth
        this.uth_so_cungky = 0;
        this.uth_so_khn = 0;
    }

    authorize: boolean = true;

    public getCurrentMonth(): string {
        let date = new Date;
        return formatDate(date, 'yyyyMM', 'en-US');
    }

    ngOnInit() {
        this.month = this.getCurrentMonth().substring(5, 6)
        this.timechange = parseInt(this.getCurrentMonth())
        this.getDanhSachNhapKhau(this.timechange);
        this.autoOpen();
        this.sendLinkToNext(true);
        if (this._login.userValue.user_role_id == 3 || this._login.userValue.user_role_id == 1) {
            this.authorize = false
        }
    }
    public sendLinkToNext(type: boolean) {
        this._linkOutput.link = this.LINK_DEFAULT;
        this._linkOutput.title = this.TITLE_DEFAULT;
        this._linkOutput.text = this.TEXT_DEFAULT;
        this._linkOutput.type = type;
        this._breadCrumService.sendLink(this._linkOutput);
    }

    autoOpen() {
        setTimeout(() => this.accordion.openAll(), 1000);
    }

    getDanhSachNhapKhau(time_id: number) {
        this.sctService.GetDanhSachNhapKhau(time_id).subscribe((result) => {
            this.setDataImport(result.data[0]);
            this.setDatabusiness(result.data[1]);
            this.setDataDetail(result.data[2]);
        });
    }

    getDanhSachNhapKhauTC(time_id: number) {
        this.sctService.GetDanhSachNhapKhauTC(time_id).subscribe((result) => {
            this.setDataImport(result.data[0]);
            this.setDatabusiness(result.data[1]);
            this.setDataDetail(result.data[2]);
        });
    }

    setDatabusiness(lsBusiness) {
        this.dataBusiness = lsBusiness;
    }

    tongluong_tc: number = 0;
    tonggiatri_tc: number = 0;
    tongluongcongdon_tc: number = 0;
    tonggiatricongdon_tc: number = 0;

    setSumaryData(data) {
        this.TongGiaTriThangThucHien = data[0].tri_gia_thang ? data[0].tri_gia_thang : 0;
        this.uth_so_cungky = data[0].uoc_thang_so_voi_ki_truoc ? data[0].uoc_thang_so_voi_ki_truoc : 0;
        this.TongGiaTriCongDon = data[0].tri_gia_cong_don ? data[0].tri_gia_cong_don : 0;
        this.uth_so_khn = data[0].uoc_cong_don_so_voi_cong_don_truoc ? data[0].uoc_cong_don_so_voi_cong_don_truoc : 0;
    }

    setDataImport(data) {
        this.dataSource = new MatTableDataSource<new_import_export_model>(data);
        if (data.length) {
            this.dataSource.paginator = this.paginator;
            this.setSumaryData(data);
        }
    }

    setDataDetail(data) {
        this.dataDialog = [...data];
    }

    tinh_tong(data) {
        this.initVariable();
        for (let item of data) {
            // console.log(item)
            this.TongLuongThangThucHien += item['luong_thang'];
            this.TongGiaTriThangThucHien += item['gia_tri_thang'] / 1000000;
            this.TongLuongCongDon += item['luong_cong_don'];
            this.TongGiaTriCongDon += item['gia_tri_cong_don'] / 1000000;
            // tổng cục hải quan
            this.tongluong_tc += item['luong_thang_tc'];
            this.tonggiatri_tc += item['gia_tri_thang_tc'];
            this.tongluongcongdon_tc += item['luong_cong_don_tc'];
            this.tonggiatricongdon_tc += item['gia_tri_cong_don_tc'];
        }
    }

    ngAfterViewInit(): void {
        //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
        //Add 'implements AfterViewInit' to the class.
        // this.dataSource.paginator = this.paginator;
        // this.dataSource.sort = this.sort;
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    openDialog(id_mat_hang) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {
            data: this.handelDataDialog(id_mat_hang),
            id: 1,
        };
        dialogConfig.minWidth = window.innerWidth - 100;
        dialogConfig.minHeight = window.innerHeight - 100;
        this.matDialog.open(ModalComponent, dialogConfig);
    }

    handelDataDialog(id_mat_hang) {
        let data = this.dataDialog.filter(
            (item) => item.id_san_pham === id_mat_hang
        );
        return data;
    }

    openDanh_sach_doanh_nghiep(id_san_pham) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {
            data: this.handleDataBusiness(id_san_pham),
            id: 2,
        };
        dialogConfig.minHeight = window.innerHeight - 100;
        dialogConfig.minWidth = "90%";
        this.matDialog.open(ModalComponent, dialogConfig);
    }

    handleDataBusiness(id_san_pham) {
        let data = this.dataBusiness.filter(
            (item) => item.id_san_pham === id_san_pham
        );
        return data;
    }

    applyDataTarget(event) {
        this.dataTargetId = event.value
        if (this.dataTargetId == 1) {
            this.getDanhSachNhapKhau(this.timechange)
        }
        else {
            this.getDanhSachNhapKhauTC(this.timechange)
        }
    }

    public ExportTOExcel(filename: string, sheetname: string) {
        this.excelService.exportDomTableAsExcelFile(filename, sheetname, this.table.nativeElement);
    }
}
