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
import report_import from "../test/report_import.json";
import { ImportDataComponent } from '../import-data/import-data.component';

// Services
import { ExcelService } from 'src/app/_services/excelUtil.service';
import { LoginService } from 'src/app/_services/APIService/login.service';

@Component({
    selector: 'app-import-management',
    templateUrl: './import-management.component.html',
    styleUrls: ['../../../special_layout.scss'],
})

export class ImportManagementComponent implements OnInit, AfterViewInit {
    //Constant
    private readonly LINK_DEFAULT: string = "/specialized/commecial-management/export_import/imported_products";
    private readonly TITLE_DEFAULT: string = "Thông tin nhập khẩu";
    private readonly TEXT_DEFAULT: string = "Thông tin nhập khẩu";
    displayedColumns = [
        // 'delete_checkbox',
        'index', 'ten_san_pham',
        'thoi_gian_chinh_sua_cuoi',
        'luong_thang', 'gia_tri_thang',
        'uoc_th_so_cungky_tht',
        'uoc_th_so_thg_truoc_tht',

        'luong_cong_don', 'gia_tri_cong_don',
        'uoc_th_so_cungky_cong_don',
        'uoc_th_so_thg_truoc_cong_don',
        'danh_sach_doanh_nghiep',
        'chi_tiet_doanh_nghiep'];
    displayRow1Header = [
        // 'delete_checkbox',
        'index',
        'ten_san_pham',
        'thoi_gian_chinh_sua_cuoi',
        'thuc_hien_bao_cao_thang',
        'cong_don_den_ky_bao_cao',

        'danh_sach_doanh_nghiep',
        'chi_tiet_doanh_nghiep',
    ]
    displaRow2Header = [
        'luong_thang',
        'gia_tri_thang',
        'uoc_th_so_cungky_tht',
        'uoc_th_so_thg_truoc_tht',
        'luong_cong_don',
        'gia_tri_cong_don',
        'uoc_th_so_cungky_cong_don',
        'uoc_th_so_thg_truoc_cong_don',
    ]
    //Variable for only ts
    private _linkOutput: LinkModel = new LinkModel();
    dataSource: MatTableDataSource<new_import_export_model>;
    dataDialog: any[] = [];
    dataBusiness: any[] = [];
    filteredDataSource: MatTableDataSource<new_import_export_model> = new MatTableDataSource<new_import_export_model>();
    years: number[] = this.getYears();
    months: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

    TongGiaTriThangThucHien: number = 0;
    TongLuongCongDon: number = 0;
    TongLuongThangThucHien: number = 0;
    TongGiaTriCongDon: number = 0;
    uth_so_cungky: number = 0;
    uth_so_khn: number = 0;
    isChecked: boolean;
    pagesize: number = 0;
    curentmonth: number = new Date().getMonth() + 1;
    curentYear: number = new Date().getFullYear();
    @ViewChild("TABLE", { static: false }) table: ElementRef;
    @ViewChild(MatAccordion, { static: true }) accordion: MatAccordion;
    @ViewChild("paginator", { static: false }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: false }) sort: MatSort;
    nhap_khau_chu_yeu = [1, 6, 8, 4, 7, 21, 13, 27, 82, 51, 28, 20, 31, 19, 23]

    tongluong_tc: number = 0;
    tonggiatri_tc: number = 0;
    tongluongcongdon_tc: number = 0;
    tonggiatricongdon_tc: number = 0;

    dataTargets: any[] = [
        { id: 1, unit: 'Cục hải quan' },
        { id: 2, unit: 'Tổng cục hải quan' }
    ]
    dataTargetId = 2;
    isOnlyTongCucHQ: number = 2;
    dataDetail: any[] = [];
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

    kiem_tra(id_mat_hang) {
        if (this.nhap_khau_chu_yeu.includes(id_mat_hang))
            return true
        return false;
    }

    authorize: boolean = true;

    ngOnInit() {
        // this.curentmonth = 1;
        this.applyDataTarget();
        // this.getDanhSachNhapKhau();
        this.autoOpen();
        this.sendLinkToNext(true);
        // this.filteredDataSource.filterPredicate = function (data: ex_im_model, filter): boolean {
        //     return String(data.is_het_han).includes(filter);
        // };
        // this.handleGTXK();
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

    getDanhSachNhapKhau() {
        let time_id = this.curentYear * 100 + this.curentmonth;
        this.sctService.GetDanhSachNhapKhau(time_id).subscribe((result) => {
            this.setDataImport(result.data[0]);
            this.setDatabusiness(result.data[1]);
            this.setDataDetail(result.data[2]);
        });
    }

    getDanhSachNhapKhauTC() {
        let time_id = this.curentYear * 100 + this.curentmonth;
        this.sctService.GetDanhSachNhapKhauTC(time_id).subscribe((result) => {
            this.setDataImport(result.data[0]);
            this.setDatabusiness(result.data[1]);
            this.setDataDetail(result.data[2]);
        });
    }

    setDatabusiness(lsBusiness) {
        this.dataBusiness = lsBusiness;
    }


    setSumaryData(data: any[]) {
        this.TongGiaTriThangThucHien = data.length ? data.map(item => item.tri_gia_thang).reduce((a, b) => a + b) : 0
        this.uth_so_cungky = data.length ? data.map(item => item.uoc_thang_so_voi_ki_truoc).reduce((a, b) => a + b) / data.length : 0
        this.TongGiaTriCongDon = data.length ? data.map(item => item.tri_gia_cong_don).reduce((a, b) => a + b) : 0
        this.uth_so_khn = data.length ? data.map(item => item.uoc_cong_don_so_voi_cong_don_truoc).reduce((a, b) => a + b) / data.length : 0
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

    getYears() {
        return Array(5)
            .fill(1)
            .map((element, index) => new Date().getFullYear() - index);
    }

    applyExpireCheck(data) {
        let tem_data = [...data]
        this.dataSource = new MatTableDataSource<new_import_export_model>(tem_data.filter(item => this.nhap_khau_chu_yeu.includes(item.id_mat_hang)));
        this.tinh_tong(this.dataSource.data)
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    openDialog(id_mat_hang) {
        // if (this.kiem_tra(id_mat_hang)) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {
            data: this.handelDataDialog(id_mat_hang),
            id: 1,
        };
        dialogConfig.minWidth = window.innerWidth - 100;
        dialogConfig.minHeight = window.innerHeight - 100;
        // console.log(this.handelDataDialog(id_mat_hang));
        // dialogConfig.panelClass = ['overflow-y: scroll;']
        this.matDialog.open(ModalComponent, dialogConfig);
        // }
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

    applyDataTarget() {
        // this.dataTargetId[0] = 2
        // 1: cuc hai quan
        // 2: tong cuc hai quan
        this.dataDetail = [];
        switch (this.dataTargetId) {
            case 1:
                this.getDanhSachNhapKhau();
                break;
            case 2:
                this.getDanhSachNhapKhauTC();
                break;

            default:
                break;
        }
    }

    public ExportTOExcel(filename: string, sheetname: string) {
        this.excelService.exportDomTableAsExcelFile(filename, sheetname, this.table.nativeElement);
    }

    public DowloadFile(filename: string, sheetname: string) {
        let report: any = report_import;
        this.excelServices.exportAsExcelFile(report, "mau_bao_cao_nhap_khau");
    }

    // declare isImport
    public ImportTOExcel() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {
            data: {
                isImport: true
            },
        };
        dialogConfig.minWidth = window.innerWidth - 100;
        dialogConfig.minHeight = window.innerHeight - 100;
        this.matDialog.open(ImportDataComponent, dialogConfig);
    }

    // checkbox delete
    allComplete: boolean = false;
    task: Task[] = [];
    updateAllComplete() {
        let dataNo = this.dataSource.data['data'][0].length
        this.allComplete = this.task != null && this.task.length === dataNo;
    }

    // someComplete(): boolean {
    //     if (this.task.subtasks == null) {
    //         return false;
    //     }
    //     return this.task.subtasks.filter(t => t.completed).length > 0 && !this.allComplete;
    // }

    setAll() {
        this.dataSource.data.forEach(item => item.isChecked = !item.isChecked)
    }

    setSomeIten(element) {
        let temp_item: Task = Object.assign({}, element);
        this.task.push(temp_item);
        // element.isChecked = !element.isChecked;
    }

    Delete() {
        // waiting api
    }
}
