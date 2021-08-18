import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { MatTableDataSource, MatTable, MatAccordion, MatPaginator, MatSort } from '@angular/material';
import { SCTService } from 'src/app/_services/APIService/sct.service';
import { ModalComponent } from '../dialog-import-export/modal.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MarketService } from '../../../../../_services/APIService/market.service';
import { BreadCrumService } from 'src/app/_services/injectable-service/breadcrums.service';
import { LinkModel } from 'src/app/_models/link.model';
import { ExcelServicesService } from 'src/app/shared/services/excel-services.service';
import { ImportDataComponent } from '../import-data/import-data.component';
import { new_import_export_model, Task, data_detail_model } from "src/app/_models/APIModel/export-import.model";
import { ReplaySubject, Subject } from 'rxjs';
import * as XLSX from 'xlsx';
import { InformationService } from 'src/app/shared/information/information.service';

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

    displayedColumns = [
        // "index",
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

    constructor(
        public sctService: SCTService,
        public matDialog: MatDialog,
        public marketService: MarketService,
        public excelService: ExcelService,
        private _breadCrumService: BreadCrumService,
        private excelServices: ExcelServicesService,
        public _login: LoginService,
        public _infor: InformationService,
    ) { }

    public importvalue: Array<new_import_export_model> = new Array<new_import_export_model>();

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
                        this.importvalue.push(datarow)
                    });
                    this.save(this.timechange, this.importvalue)
                };

                reader.readAsBinaryString(target.files[0]);

                reader.onloadend = (e) => {
                    this.spinnerEnabled = false;
                    this.keys = Object.keys(data[0]);
                    this.dataSheet.next(data)
                    this.inputFile.nativeElement.value = '';
                    this.importvalue = []
                }
            }
        }
    }

    public save(month: number, importvalue: Array<new_import_export_model>) {
        if (this.dataTargetId == 1) {
            this.sctService.CapNhatDuLieuNKThang(month, importvalue).subscribe(
                next => {
                    if (next.id == -1) {
                        this._infor.msgError("Lưu lỗi! Lý do: " + next.message);
                    }
                    else {
                        this._infor.msgSuccess("Dữ liệu được lưu thành công!");
                        this.getDanhSachNhapKhau(this.timechange)
                    }
                },
                error => {
                    this._infor.msgError("Không thể thực thi! Lý do: " + error.message);
                }
            );
        }
        else {
            this.sctService.CapNhatDuLieuNKThangTC(month, importvalue).subscribe(
                next => {
                    if (next.id == -1) {
                        this._infor.msgError("Lưu lỗi! Lý do: " + next.message);
                    }
                    else {
                        this._infor.msgSuccess("Dữ liệu được lưu thành công!");
                        this.getDanhSachNhapKhauTC(this.timechange)
                    }
                },
                error => {
                    this._infor.msgError("Không thể thực thi! Lý do: " + error.message);
                }
            );
        }
    }

    public importdetail: Array<data_detail_model> = new Array<data_detail_model>();

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
                        this.importdetail.push(datarow)
                    });
                    this.save1(this.timechange, this.importdetail)
                };

                reader.readAsBinaryString(target.files[0]);

                reader.onloadend = (e) => {
                    this.spinnerEnabled = false;
                    this.keys = Object.keys(data[0]);
                    this.dataSheet.next(data)
                    this.inputFile.nativeElement.value = '';
                    this.importdetail = []
                }
            }
        }
    }

    public save1(month: number, importdetail: Array<data_detail_model>) {
        if (this.dataTargetId == 1) {
            this.sctService.CapNhatChiTietNKThang(month, importdetail).subscribe(
                next => {
                    if (next.id == -1) {
                        this._infor.msgError("Lưu lỗi! Lý do: " + next.message);
                    }
                    else {
                        this._infor.msgSuccess("Dữ liệu được lưu thành công!");
                        this.getDanhSachNhapKhau(this.timechange)
                    }
                },
                error => {
                    this._infor.msgError("Không thể thực thi! Lý do: " + error.message);
                }
            );
        }
        else {
            this.sctService.CapNhatChiTietNKThangTC(month, importdetail).subscribe(
                next => {
                    if (next.id == -1) {
                        this._infor.msgError("Lưu lỗi! Lý do: " + next.message);
                    }
                    else {
                        this._infor.msgSuccess("Dữ liệu được lưu thành công!");
                        this.getDanhSachNhapKhauTC(this.timechange)
                    }
                },
                error => {
                    this._infor.msgError("Không thể thực thi! Lý do: " + error.message);
                }
            );
        }
    }

    public importcompany: Array<new_import_export_model> = new Array<new_import_export_model>();

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
                        this.importcompany.push(datarow)
                    });
                    console.log(this.importcompany)
                    this.save2(this.importcompany)
                };

                reader.readAsBinaryString(target.files[0]);

                reader.onloadend = (e) => {
                    this.spinnerEnabled = false;
                    this.keys = Object.keys(data[0]);
                    this.dataSheet.next(data)
                    this.inputFile.nativeElement.value = '';
                    this.importcompany = []
                }
            }
        }
    }

    public save2(importcompany: Array<new_import_export_model>) {
        if (this.dataTargetId == 1) {
            this.sctService.CapNhatDNNKThang(importcompany).subscribe(
                next => {
                    if (next.id == -1) {
                        this._infor.msgError("Lưu lỗi! Lý do: " + next.message);
                    }
                    else {
                        this._infor.msgSuccess("Dữ liệu được lưu thành công!");
                        this.getDanhSachNhapKhau(this.timechange)
                    }
                },
                error => {
                    this._infor.msgError("Không thể thực thi! Lý do: " + error.message);
                }
            );
        }
        else {
            this.sctService.CapNhatDNNKThangTC(importcompany).subscribe(
                next => {
                    if (next.id == -1) {
                        this._infor.msgError("Lưu lỗi! Lý do: " + next.message);
                    }
                    else {
                        this._infor.msgSuccess("Dữ liệu được lưu thành công!");
                        this.getDanhSachNhapKhauTC(this.timechange)
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

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
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
            this.getDanhSachNhapKhau(this.timechange)
        }
        else {
            this.getDanhSachNhapKhauTC(this.timechange)
        }
    }

    getDanhSachNhapKhau(time_id: number) {
        this.sctService.GetDanhSachNhapKhau(time_id).subscribe((result) => {
            this.setDataImport(result.data[0]);
            this.setDatabusiness(result.data[1]);
            this.setDataImportDetail(result.data[2]);
        });
    }

    getDanhSachNhapKhauTC(time_id: number) {
        this.sctService.GetDanhSachNhapKhauTC(time_id).subscribe((result) => {
            this.setDataImport(result.data[0]);
            this.setDatabusiness(result.data[1]);
            this.setDataImportDetail(result.data[2]);
        });
    }

    setDataImportDetail(detail_export: any) {
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

    setDataImport(data) {
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

    addimport: boolean

    AddImport(event) {
        this.addimport = event.checked
    }
}
