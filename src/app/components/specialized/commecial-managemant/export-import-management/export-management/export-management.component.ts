import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import {
    MatTableDataSource,
    MatAccordion,
    MatPaginator,
    MatDialog,
    MatDialogConfig,
} from "@angular/material";
import { SCTService } from "src/app/_services/APIService/sct.service";
import { new_import_export_model, Task, data_detail_model } from "src/app/_models/APIModel/export-import.model";
import { MarketService } from "src/app/_services/APIService/market.service";
import { ModalComponent } from "../dialog-import-export/modal.component";
import { MatSort } from "@angular/material/sort";
import { LinkModel } from "src/app/_models/link.model";
import { BreadCrumService } from "src/app/_services/injectable-service/breadcrums.service";
import { ExcelService } from 'src/app/_services/excelUtil.service';

import { ImportDataComponent } from "../import-data/import-data.component";
import { ExcelServicesService } from "src/app/shared/services/excel-services.service";
import { LoginService } from "src/app/_services/APIService/login.service";
import { ReplaySubject, Subject } from 'rxjs';
import * as XLSX from 'xlsx';
import { InformationService } from 'src/app/shared/information/information.service';

import { ChartOptions, ChartDataSets, ChartType, Chart } from 'chart.js';
import { exportimportchart, ProductModel } from 'src/app/_models/APIModel/domestic-market.model';
import { DashboardService } from 'src/app/_services/APIService/dashboard.service';

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
    selector: "app-export-management",
    templateUrl: "./export-management.component.html",
    styleUrls: ["../../../special_layout.scss"],
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

export class ExportManagementComponent implements OnInit {
    private readonly LINK_DEFAULT: string =
        "/specialized/commecial-management/export_import/exported_products";
    private readonly TITLE_DEFAULT: string = "Thông tin xuất khẩu";
    private readonly TEXT_DEFAULT: string = "Thông tin xuất khẩu";

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
            this.getDanhSachXuatKhau(this.timechange)
        }
        else {
            this.getDanhSachXuatKhauTC(this.timechange)
        }

        this.month = this.time.substring(4, 6)
    }

    displayedColumns = [
        // "index",
        "tt",
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
        // "index",
        "tt",
        "ten_san_pham",
        "don_vi_tinh",
        "thuc_hien_bao_cao_thang",
        "cong_don_den_ky_bao_cao",

        "danh_sach_doanh_nghiep",
        "chi_tiet_doanh_nghiep",
    ];
    displaRow2Header = [
        "gia_tri_thang",
        "uoc_th_so_cungky_tht",
        "uoc_th_so_thg_truoc_tht",
        "gia_tri_cong_don",
        "uoc_th_so_cungky_cong_don",
        "uoc_th_so_thg_truoc_cong_don",
    ];
    private _linkOutput: LinkModel = new LinkModel();

    dataBusiness: any[] = [];
    dataSource: MatTableDataSource<new_import_export_model> = new MatTableDataSource<new_import_export_model>();
    dataDialog: any[] = [];
    filteredDataSource: MatTableDataSource<new_import_export_model> = new MatTableDataSource<new_import_export_model>();

    @ViewChild("TABLE", { static: true }) table: ElementRef;
    @ViewChild(MatAccordion, { static: true }) accordion: MatAccordion;
    @ViewChild("paginator", { static: false }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: false }) sort: MatSort;

    dataTargets: any[] = [
        { id: 1, unit: "Cục hải quan" },
        { id: 2, unit: "Tổng cục hải quan" },
    ];
    dataTargetId = 1;
    dataTargetId1 = 1;

    constructor(
        public sctService: SCTService,
        public matDialog: MatDialog,
        public marketService: MarketService,
        public excelService: ExcelService,
        private _breadCrumService: BreadCrumService,
        private excelServices: ExcelServicesService,
        public _login: LoginService,
        public _infor: InformationService,
        public dashboardService: DashboardService
    ) { }

    public exportvalue: Array<new_import_export_model> = new Array<new_import_export_model>();

    spinnerEnabled = false;
    keys: string[];
    dataSheet = new Subject();
    @ViewChild('inputFile', { static: true }) inputFile: ElementRef;
    isExcelFile: boolean;
    uploadExcel(evt: any) {
        let isExcelFile: boolean;
        let spinnerEnabled = false;
        let dataSheet = new Subject();
        let keys: string[];
        let data, header;
        const target: DataTransfer = <DataTransfer>(evt.target);
        isExcelFile = !!target.files[0].name.match(/(.xls|.xlsx)/);
        if (isExcelFile) {
            let data, header;
            const target: DataTransfer = <DataTransfer>(evt.target);
            this.isExcelFile = !!target.files[0].name.match(/(.xls|.xlsx)/);
            if (target.files.length > 1) {
                this.inputFile.nativeElement.value = '';
            }
            if (this.isExcelFile) {
                this.spinnerEnabled = true;
                const reader: FileReader = new FileReader();
                reader.onload = (e: any) => {
                    const bstr: string = e.target.result;
                    const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

                    const wsname: string = wb.SheetNames[0];
                    const ws: XLSX.WorkSheet = wb.Sheets[wsname];

                    data = XLSX.utils.sheet_to_json(ws);
                    this.dataSource.data = [];
                    data.forEach(item => {
                        let datarow: new_import_export_model = new new_import_export_model();
                        datarow.id_san_pham = item['ID'];
                        datarow.san_luong_thang = 0;
                        datarow.tri_gia_thang = item['TH tháng'] ? item['TH tháng'] : 0;
                        datarow.uoc_thang_so_voi_ki_truoc = item['ƯTH so Tháng cùng kỳ'] ? item['ƯTH so Tháng cùng kỳ'] : 0;
                        datarow.uoc_thang_so_voi_thang_truoc = item['ƯTH so tháng trước'] ? item['ƯTH so tháng trước'] : 0;
                        datarow.san_luong_cong_don = 0;
                        datarow.tri_gia_cong_don = item['TH tháng (Cộng dồn)'] ? item['TH tháng (Cộng dồn)'] : 0;
                        datarow.uoc_cong_don_so_voi_ki_truoc = item['ƯTH so với cùng kỳ (Cộng dồn)'] ? item['ƯTH so với cùng kỳ (Cộng dồn)'] : 0;
                        datarow.uoc_cong_don_so_voi_cong_don_truoc = item['ƯTH so kế hoạch năm (Cộng dồn)'] ? item['ƯTH so kế hoạch năm (Cộng dồn)'] : 0;
                        this.exportvalue.push(datarow)
                    });
                    this.save(this.timechange, this.exportvalue)
                };

                reader.readAsBinaryString(target.files[0]);

                reader.onloadend = (e) => {
                    this.spinnerEnabled = false;
                    this.keys = Object.keys(data[0]);
                    this.dataSheet.next(data)
                    this.inputFile.nativeElement.value = '';
                    this.exportvalue = []
                }
            }
        }
    }

    public save(month: number, exportvalue: Array<new_import_export_model>) {
        if (this.dataTargetId == 1) {
            this.sctService.CapNhatDuLieuXKThang(month, exportvalue).subscribe(
                next => {
                    if (next.id == -1) {
                        this._infor.msgError("Lưu lỗi! Lý do: " + next.message);
                    }
                    else {
                        this._infor.msgSuccess("Dữ liệu được lưu thành công!");
                        this.getDanhSachXuatKhau(this.timechange)
                    }
                },
                error => {
                    this._infor.msgError("Không thể thực thi! Lý do: " + error.message);
                }
            );
        }
        else {
            this.sctService.CapNhatDuLieuXKThangTC(month, exportvalue).subscribe(
                next => {
                    if (next.id == -1) {
                        this._infor.msgError("Lưu lỗi! Lý do: " + next.message);
                    }
                    else {
                        this._infor.msgSuccess("Dữ liệu được lưu thành công!");
                        this.getDanhSachXuatKhauTC(this.timechange)
                    }
                },
                error => {
                    this._infor.msgError("Không thể thực thi! Lý do: " + error.message);
                }
            );
        }
    }

    public exportdetail: Array<data_detail_model> = new Array<data_detail_model>();

    uploadExcel1(evt: any) {
        let isExcelFile: boolean;
        let spinnerEnabled = false;
        let dataSheet = new Subject();
        let keys: string[];
        let data, header;
        const target: DataTransfer = <DataTransfer>(evt.target);
        isExcelFile = !!target.files[0].name.match(/(.xls|.xlsx)/);
        if (isExcelFile) {
            let data, header;
            const target: DataTransfer = <DataTransfer>(evt.target);
            this.isExcelFile = !!target.files[0].name.match(/(.xls|.xlsx)/);
            if (target.files.length > 1) {
                this.inputFile.nativeElement.value = '';
            }
            if (this.isExcelFile) {
                this.spinnerEnabled = true;
                const reader: FileReader = new FileReader();
                reader.onload = (e: any) => {
                    const bstr: string = e.target.result;
                    const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

                    const wsname: string = wb.SheetNames[0];
                    const ws: XLSX.WorkSheet = wb.Sheets[wsname];

                    data = XLSX.utils.sheet_to_json(ws);
                    this.dataSource.data = [];
                    data.forEach(item => {
                        let datarow: data_detail_model = new data_detail_model();
                        datarow.id_san_pham = item['ID'];
                        datarow.san_luong_thang = item['Lượng tháng thực hiện (Nghìn tấn)'] ? item['Lượng tháng thực hiện (Nghìn tấn)'] : 0;
                        datarow.tri_gia_thang = item['Giá trị tháng thực hiện (Triệu USD)'] ? item['Giá trị tháng thực hiện (Triệu USD)'] : 0;
                        datarow.san_luong_cong_don = item['Lượng cộng dồn (Nghìn tấn)'] ? item['Lượng cộng dồn (Nghìn tấn)'] : 0;
                        datarow.tri_gia_cong_don = item['Giá trị cộng dồn (Triệu USD)'] ? item['Giá trị cộng dồn (Triệu USD)'] : 0;
                        datarow.thi_truong = item['Thị trường chủ yếu'] ? item['Thị trường chủ yếu'] : 0;
                        this.exportdetail.push(datarow)
                    });
                    this.save1(this.timechange, this.exportdetail)
                };

                reader.readAsBinaryString(target.files[0]);

                reader.onloadend = (e) => {
                    this.spinnerEnabled = false;
                    this.keys = Object.keys(data[0]);
                    this.dataSheet.next(data)
                    this.inputFile.nativeElement.value = '';
                    this.exportdetail = []
                }
            }
        }
    }

    public save1(month: number, exportdetail: Array<data_detail_model>) {
        if (this.dataTargetId == 1) {
            this.sctService.CapNhatChiTietXKThang(month, exportdetail).subscribe(
                next => {
                    if (next.id == -1) {
                        this._infor.msgError("Lưu lỗi! Lý do: " + next.message);
                    }
                    else {
                        this._infor.msgSuccess("Dữ liệu được lưu thành công!");
                        this.getDanhSachXuatKhau(this.timechange)
                    }
                },
                error => {
                    this._infor.msgError("Không thể thực thi! Lý do: " + error.message);
                }
            );
        }
        else {
            this.sctService.CapNhatChiTietXKThangTC(month, exportdetail).subscribe(
                next => {
                    if (next.id == -1) {
                        this._infor.msgError("Lưu lỗi! Lý do: " + next.message);
                    }
                    else {
                        this._infor.msgSuccess("Dữ liệu được lưu thành công!");
                        this.getDanhSachXuatKhauTC(this.timechange)
                    }
                },
                error => {
                    this._infor.msgError("Không thể thực thi! Lý do: " + error.message);
                }
            );
        }
    }

    public exportcompany: Array<new_import_export_model> = new Array<new_import_export_model>();

    uploadExcel2(evt: any) {
        let isExcelFile: boolean;
        let spinnerEnabled = false;
        let dataSheet = new Subject();
        let keys: string[];
        let data, header;
        const target: DataTransfer = <DataTransfer>(evt.target);
        isExcelFile = !!target.files[0].name.match(/(.xls|.xlsx)/);
        if (isExcelFile) {
            let data, header;
            const target: DataTransfer = <DataTransfer>(evt.target);
            this.isExcelFile = !!target.files[0].name.match(/(.xls|.xlsx)/);
            if (target.files.length > 1) {
                this.inputFile.nativeElement.value = '';
            }
            if (this.isExcelFile) {
                this.spinnerEnabled = true;
                const reader: FileReader = new FileReader();
                reader.onload = (e: any) => {
                    const bstr: string = e.target.result;
                    const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

                    const wsname: string = wb.SheetNames[0];
                    const ws: XLSX.WorkSheet = wb.Sheets[wsname];

                    data = XLSX.utils.sheet_to_json(ws);
                    this.dataSource.data = [];
                    data.forEach(item => {
                        let datarow: new_import_export_model = new new_import_export_model();
                        datarow.id_san_pham = item['ID'];
                        datarow.mst = item['Mã số thuế']
                        datarow.cong_suat = item['Trị giá (Triệu USD)'];
                        datarow.time_id = this.timechange.toString()
                        this.exportcompany.push(datarow)
                    });
                    this.save2(this.exportcompany)
                };

                reader.readAsBinaryString(target.files[0]);

                reader.onloadend = (e) => {
                    this.spinnerEnabled = false;
                    this.keys = Object.keys(data[0]);
                    this.dataSheet.next(data)
                    this.inputFile.nativeElement.value = '';
                    this.exportcompany = []
                }
            }
        }
    }

    public save2(exportcompany: Array<new_import_export_model>) {
        if (this.dataTargetId == 1) {
            this.sctService.CapNhatDNXKThang(exportcompany).subscribe(
                next => {
                    if (next.id == -1) {
                        this._infor.msgError("Lưu lỗi! Lý do: " + next.message);
                    }
                    else {
                        this._infor.msgSuccess("Dữ liệu được lưu thành công!");
                        this.getDanhSachXuatKhau(this.timechange)
                    }
                },
                error => {
                    this._infor.msgError("Không thể thực thi! Lý do: " + error.message);
                }
            );
        }
        else {
            this.sctService.CapNhatDNXKThangTC(exportcompany).subscribe(
                next => {
                    if (next.id == -1) {
                        this._infor.msgError("Lưu lỗi! Lý do: " + next.message);
                    }
                    else {
                        this._infor.msgSuccess("Dữ liệu được lưu thành công!");
                        this.getDanhSachXuatKhauTC(this.timechange)
                    }
                },
                error => {
                    this._infor.msgError("Không thể thực thi! Lý do: " + error.message);
                }
            );
        }
    }

    authorize: boolean = true

    public getCurrentMonth(): string {
        let date = new Date;
        return formatDate(date, 'yyyyMM', 'en-US');
    }

    ngOnInit() {
        this.GetProduct();
        this.defaultcode = 42
        this.tuthang = this.firstmonth.value
        this.denthang = this.presentmonth.value
        this.productcode = 42

        this.month = this.getCurrentMonth().substring(4, 6)
        this.timechange = parseInt(this.getCurrentMonth())
        this.getDanhSachXuatKhau(this.timechange);
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
            height: '70%',
            width: '70%',
            data: this.handleDataDialog(id_mat_hang),
            id: 1,
        };
        this.matDialog.open(ModalComponent, dialogConfig);
    }

    handleDataDialog(id_mat_hang) {
        let data = this.dataDialog.filter(
            (item) => item.id_san_pham === id_mat_hang
        );
        return data;
    }

    openDanh_sach_doanh_nghiep(id_san_pham) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {
            height: '70%',
            width: '70%',
            data: this.handleDataBusiness(id_san_pham),
            id: 2,
        };
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
            this.getDanhSachXuatKhau(this.timechange)
        }
        else {
            this.getDanhSachXuatKhauTC(this.timechange)
        }
    }

    getDanhSachXuatKhau(time_id: number) {
        this.sctService.GetDanhSachXuatKhau(time_id).subscribe((result) => {
            result.data[0].forEach(x => {
                x.san_luong_thang = x.san_luong_thang == 0 ? null : x.san_luong_thang
                x.tri_gia_thang = x.tri_gia_thang == 0 ? null : x.tri_gia_thang
                x.uoc_thang_so_voi_ki_truoc = x.uoc_thang_so_voi_ki_truoc == 0 ? null : x.uoc_thang_so_voi_ki_truoc
                x.uoc_thang_so_voi_thang_truoc = x.uoc_thang_so_voi_thang_truoc == 0 ? null : x.uoc_thang_so_voi_thang_truoc
                x.san_luong_cong_don = x.san_luong_cong_don == 0 ? null : x.san_luong_cong_don
                x.tri_gia_cong_don = x.tri_gia_cong_don == 0 ? null : x.tri_gia_cong_don
                x.uoc_cong_don_so_voi_ki_truoc = x.uoc_cong_don_so_voi_ki_truoc == 0 ? null : x.uoc_cong_don_so_voi_ki_truoc
                x.uoc_cong_don_so_voi_cong_don_truoc = x.uoc_cong_don_so_voi_cong_don_truoc == 0 ? null : x.uoc_cong_don_so_voi_cong_don_truoc
            });

            this.setDataExport(result.data[0]);
            this.setDatabusiness(result.data[1]);
            this.setDataExportDetail(result.data[2]);
        });
    }

    getDanhSachXuatKhauTC(time_id: number) {
        this.sctService.GetDanhSachXuatKhauTC(time_id).subscribe((result) => {
            result.data[0].forEach(x => {
                x.san_luong_thang = x.san_luong_thang == 0 ? null : x.san_luong_thang
                x.tri_gia_thang = x.tri_gia_thang == 0 ? null : x.tri_gia_thang
                x.uoc_thang_so_voi_ki_truoc = x.uoc_thang_so_voi_ki_truoc == 0 ? null : x.uoc_thang_so_voi_ki_truoc
                x.uoc_thang_so_voi_thang_truoc = x.uoc_thang_so_voi_thang_truoc == 0 ? null : x.uoc_thang_so_voi_thang_truoc
                x.san_luong_cong_don = x.san_luong_cong_don == 0 ? null : x.san_luong_cong_don
                x.tri_gia_cong_don = x.tri_gia_cong_don == 0 ? null : x.tri_gia_cong_don
                x.uoc_cong_don_so_voi_ki_truoc = x.uoc_cong_don_so_voi_ki_truoc == 0 ? null : x.uoc_cong_don_so_voi_ki_truoc
                x.uoc_cong_don_so_voi_cong_don_truoc = x.uoc_cong_don_so_voi_cong_don_truoc == 0 ? null : x.uoc_cong_don_so_voi_cong_don_truoc
            });

            this.setDataExport(result.data[0]);
            this.setDatabusiness(result.data[1]);
            this.setDataExportDetail(result.data[2]);
        });
    }

    setDataExportDetail(detail_export: any) {
        this.dataDialog = [...detail_export];
    }

    setDatabusiness(lsBusiness) {
        this.dataBusiness = lsBusiness;
    }

    TongGiaTriThangThucHien: number = 0;
    uth_so_cungky: number = 0;
    TongGiaTriCongDon: number = 0;
    uth_so_khn: number = 0;

    setSumaryData(data) {
        this.TongGiaTriThangThucHien = data[0].tri_gia_thang ? data[0].tri_gia_thang : 0;
        this.uth_so_cungky = data[0].uoc_thang_so_voi_ki_truoc ? data[0].uoc_thang_so_voi_ki_truoc : 0;
        this.TongGiaTriCongDon = data[0].tri_gia_cong_don ? data[0].tri_gia_cong_don : 0;
        this.uth_so_khn = data[0].uoc_cong_don_so_voi_cong_don_truoc ? data[0].uoc_cong_don_so_voi_cong_don_truoc : 0;
    }

    setDataExport(data) {
        this.dataSource = new MatTableDataSource<new_import_export_model>(data);
        if (data.length) {
            this.setSumaryData(data);
            this.dataSource.paginator = this.paginator;
            this.paginator._intl.itemsPerPageLabel = "Số hàng";
            this.paginator._intl.firstPageLabel = "Trang Đầu";
            this.paginator._intl.lastPageLabel = "Trang Cuối";
            this.paginator._intl.previousPageLabel = "Trang Trước";
            this.paginator._intl.nextPageLabel = "Trang Tiếp";
        }
    }

    public ExportTOExcel(filename: string, sheetname: string) {
        this.excelService.exportDomTableAsExcelFile(filename, sheetname, this.table.nativeElement);
    }

    public ImportTOExcel() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {
            data: {
                isExport: true,
            },
        };
        dialogConfig.minWidth = window.innerWidth - 100;
        dialogConfig.minHeight = window.innerHeight - 300;
        this.matDialog.open(ImportDataComponent, dialogConfig);
    }

    addexport: boolean

    AddExport(event) {
        this.addexport = event.checked
    }

    applyDataTarget1(event) {
        this.dataTargetId1 = event.value
    
        this.lineChart.config.data.datasets = []
        this.lineChartMethod(this.tuthang, this.denthang, this.productcode, this.dataTargetId1);
      }

    public firstmonth = new FormControl(_moment().startOf('year').format('yyyyMM'));
    public presentmonth = new FormControl(_moment().format('yyyyMM'));
  
    @ViewChild('lineCanvas', { static: false }) lineCanvas: ElementRef;
    lineChart: any;
  
    defaultcode: number
    tuthang: string
    denthang: string
    productcode: number
  
    timelist: string[]
    trigiathang: number[]
    trigiacongdon: number[]
  
    ngAfterViewInit(): void {
      this.lineChartMethod(this.tuthang, this.denthang, this.productcode, this.dataTargetId1);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }

    exportchart: Array<exportimportchart> = new Array<exportimportchart>();
  
    lineChartMethod(tuthang: string, denthang: string, productcode: number, istongcuc: number) {
      this.dashboardService.GetExportChart(tuthang, denthang, productcode, istongcuc).subscribe(
        all => {
          this.exportchart = all.data
          this.timelist = this.exportchart.map(x => this.Convertdate(x.time_id.toString()))
          this.trigiathang = this.exportchart.map(x => x.tri_gia_thang)
          this.trigiacongdon = this.exportchart.map(x => x.tri_gia_cong_don)
  
          this.lineChart = new Chart(this.lineCanvas.nativeElement, {
            type: 'line',
            data: {
              labels: this.timelist,
              datasets: [
                {
                  label: 'Thực hiện tháng ' + this.month,
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
                  data: this.trigiathang,
                  spanGaps: false,
                },
                {
                  label: 'Thực hiện ' + this.month + ' tháng',
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
                  data: this.trigiacongdon,
                  spanGaps: false,
                }
              ]
            }
          });
        },
      );
    }
  
    products: Array<ProductModel> = new Array<ProductModel>();
    filterproducts: ReplaySubject<ProductModel[]> = new ReplaySubject<ProductModel[]>(1);
    GetProduct() {
      this.dashboardService.GetProductListAll().subscribe((allrecords) => {
        this.products = allrecords.data.filter(x => x.xnk == 1) as ProductModel[];
        this.filterproducts.next(this.products.slice());
      });
    }
    public profilter: FormControl = new FormControl();
    public filterThuongnhan() {
      if (!this.products) {
        return;
      }
      let search = this.profilter.value;
      if (!search) {
        this.filterproducts.next(this.products.slice());
        return;
      } else {
        search = search.toLowerCase();
      }
      this.filterproducts.next(
        this.products.filter(x => x.ten_san_pham.toLowerCase().indexOf(search) > -1)
      );
    }
  
    applyfilter(event) {
      this.productcode = event.value
      this.lineChart.config.data.datasets = []
      this.lineChartMethod(this.tuthang, this.denthang, this.productcode, this.dataTargetId1);
    }
  
    Convertdate(text: string): string {
      let date: string
      date = text.substr(4, 2) + "-" + text.substring(0, 4)
      return date
    }
  
    public date1 = new FormControl(_moment().startOf('year').format('yyyyMM'));
    public newdate1 = new FormControl(_moment());
  
    public chosenYearHandler1(normalizedYear: Moment) {
      this.date1 = this.newdate1
      const ctrlValue = this.date1.value;
      ctrlValue.year(normalizedYear.year());
      this.date1.setValue(ctrlValue);
      this.theYear = normalizedYear.year();
    }
  
    public chosenMonthHandler1(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
      const ctrlValue = this.date1.value;
      ctrlValue.month(normalizedMonth.month());
      this.date1.setValue(ctrlValue);
      this.theMonth = normalizedMonth.month() + 1;
      datepicker.close();
  
      if (this.theMonth >= 10) {
        this.stringmonth = this.theMonth.toString();
      }
      else {
        this.stringmonth = "0" + this.theMonth.toString()
      }
      this.time = this.theYear.toString() + this.stringmonth
  
      this.tuthang = this.time
      this.lineChart.config.data.datasets = []
      this.lineChartMethod(this.tuthang, this.denthang, this.productcode, this.dataTargetId1);
    }
  
    public date2 = new FormControl(_moment());
    public newdate2 = new FormControl(_moment());
  
    public chosenYearHandler2(normalizedYear: Moment) {
      this.date2 = this.newdate2
      const ctrlValue = this.date2.value;
      ctrlValue.year(normalizedYear.year());
      this.date1.setValue(ctrlValue);
      this.theYear = normalizedYear.year();
    }
  
    public chosenMonthHandler2(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
      const ctrlValue = this.date2.value;
      ctrlValue.month(normalizedMonth.month());
      this.date2.setValue(ctrlValue);
      this.theMonth = normalizedMonth.month() + 1;
      datepicker.close();
  
      if (this.theMonth >= 10) {
        this.stringmonth = this.theMonth.toString();
      }
      else {
        this.stringmonth = "0" + this.theMonth.toString()
      }
      this.time = this.theYear.toString() + this.stringmonth
  
      this.denthang = this.time
      this.lineChart.config.data.datasets = []
      this.lineChartMethod(this.tuthang, this.denthang, this.productcode, this.dataTargetId1);
    }
}
