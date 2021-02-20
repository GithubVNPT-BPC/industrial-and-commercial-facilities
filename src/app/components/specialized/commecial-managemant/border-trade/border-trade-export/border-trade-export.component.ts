import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatAccordion, MatPaginator, MatSort, MatDialog, MatDialogConfig } from '@angular/material';
import { BorderTrade } from 'src/app/_models/APIModel/border-trade.model';
import { Task } from 'src/app/_models/APIModel/export-import.model';
import { LinkModel } from 'src/app/_models/link.model';
// Services
import { MarketService } from 'src/app/_services/APIService/market.service';
import { SCTService } from 'src/app/_services/APIService/sct.service';
import { ExcelService } from 'src/app/_services/excelUtil.service';
import { BreadCrumService } from 'src/app/_services/injectable-service/breadcrums.service';

import { ModalComponent } from '../../export-import-management/dialog-import-export/modal.component';
import { data_xk_t11 } from '../border-trade-export/data';
import { DialogImportDataComponent } from '../dialog-import-data/dialog-import-data.component';
@Component({
    selector: 'app-border-trade-export',
    templateUrl: './border-trade-export.component.html',
    styleUrls: ['../../../special_layout.scss'],
})
export class BorderTradeExportComponent implements OnInit {

    //Constant
    private readonly LINK_DEFAULT: string = "/specialized/commecial-management/export_import/exported_products";
    private readonly TITLE_DEFAULT: string = "Thông tin xuất khẩu";
    private readonly TEXT_DEFAULT: string = "Thông tin xuất khẩu";
    displayedColumns = ['delete_checkbox',
        'index', 'ten_cua_khau',
        'luong_thang', 'gia_tri_thang',
        'uoc_th_so_cungky_tht',
        'uoc_th_so_thg_truoc_tht',

        'luong_cong_don', 'gia_tri_cong_don',
        'uoc_th_so_cungky_cong_don',
        'uoc_th_so_thg_truoc_cong_don',
        'danh_sach_doanh_nghiep',
        'chi_tiet_doanh_nghiep'];
    displayRow1Header = [
        'delete_checkbox',
        'index',
        'ten_cua_khau',
        'thuc_hien_bao_cao_thang',
        'cong_don_den_ky_bao_cao',

        'danh_sach_doanh_nghiep',
        'chi_tiet_doanh_nghiep'
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
    // displayedColumns: string[] = [];
    // displayRow1Header: string[] = []
    // displaRow2Header: string[] = []
    // displayRow3Header: string[] = [];
    // dataSource: MatTableDataSource<ex_im_model> = new MatTableDataSource<ex_im_model>();
    dataSource: MatTableDataSource<BorderTrade>;
    dataDialog: any[] = [];
    filteredDataSource: MatTableDataSource<BorderTrade> = new MatTableDataSource<BorderTrade>();
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
    @ViewChild("table", { static: false }) table: ElementRef;
    @ViewChild(MatAccordion, { static: true }) accordion: MatAccordion;
    @ViewChild("paginator", { static: false }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: false }) sort: MatSort;
    xuat_khau_chu_yeu = [1, 6, 8, 4, 7, 21, 13, 27, 82, 51, 28, 20, 31, 19, 23]

    tongluong_tc: number = 0;
    tonggiatri_tc: number = 0;
    tongluongcongdon_tc: number = 0;
    tonggiatricongdon_tc: number = 0;

    dataTargets: any[] = [
        { id: 1, unit: 'Cục hải quan' },
        { id: 2, unit: 'Tổng cục hải quan' }
    ]
    dataTargetId = [2];
    isOnlyTongCucHQ: number = 2;
    constructor(
        public sctService: SCTService,
        public excelService: ExcelService,
        public matDialog: MatDialog,
        public marketService: MarketService,
        private _breadCrumService: BreadCrumService
    ) { }

    handleGTXK() {
        // this.TongGiaTriThangThucHien = this.dataSource.data[15].gia_tri_thang;
        // this.uth_so_cungky = this.dataSource.data[15].uoc_th_so_cungky_tht;
        // this.TongGiaTriCongDon = this.dataSource.data[15].gia_tri_cong_don;
        // this.uth_so_khn = this.dataSource.data[15].uoc_th_so_thg_truoc_cong_don;
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
    }

    kiem_tra(id_mat_hang) {
        if (this.xuat_khau_chu_yeu.includes(id_mat_hang))
            return true
        return false;
    }

    ngOnInit() {
        this.getDanhSachXuatKhau();
        this.autoOpen();
        this.sendLinkToNext(true);
        this.handleGTXK();
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

    // getTotalCost() {
    //   return this.dataSource.data.map(t => t.cost).reduce((acc, value) => acc + value, 0);
    // }

    getDanhSachXuatKhau() {
        let time_id = this.curentYear * 100 + this.curentmonth;
        this.sctService.GetDanhSachXuatNhapKhauBG(time_id).subscribe(data => {
            this.dataSource = new MatTableDataSource<BorderTrade>(data['data']);
        })
    }

    tinh_tong(data) {
        this.initVariable();
        for (let item of data) {
            this.TongLuongThangThucHien += item['luong_thang'];
            this.TongGiaTriThangThucHien += item['gia_tri_thang'];
            this.TongLuongCongDon += item['luong_cong_don'];
            this.TongGiaTriCongDon += item['gia_tri_cong_don'];
            this.tongluong_tc += item['luong_thang_tc'];
            this.tonggiatri_tc += item['gia_tri_thang_tc'];
            this.tongluongcongdon_tc += item['luong_cong_don_tc'];
            this.tonggiatricongdon_tc += item['gia_tri_cong_don_tc'];
        }
    }

    ngAfterViewInit(): void {
        //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
        //Add 'implements AfterViewInit' to the class.
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    log() {
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

    applyDistrictFilter() { }

    // isHidden(row : any){
    //     return (this.isChecked)? (row.is_het_han) : false;
    // }

    applyExpireCheck(data) {
        let tem_data = [...data]
        this.dataSource = new MatTableDataSource<BorderTrade>(tem_data.filter(item => this.xuat_khau_chu_yeu.includes(item.id_mat_hang)));
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
        dialogConfig.minHeight = '100%';
        dialogConfig.minWidth = '90%';
        this.matDialog.open(ModalComponent, dialogConfig);
        // }
    }

    handelDataDialog(id_mat_hang) {
        let data = this.dataDialog.filter(
            (item) => item.id_mat_hang === id_mat_hang
        );
        return data;
    }

    // openDanh_sach_doanh_nghiep(id_mat_hang, ten_san_pham) {
    //     this.marketService
    //         .GetTopExport(this.curentmonth, new Date().getFullYear(), id_mat_hang)
    //         .subscribe((data) => {
    //             const dialogConfig = new MatDialogConfig();
    //             dialogConfig.data = {
    //                 data: data["data"],
    //                 id: 2,
    //                 ten_san_pham: ten_san_pham,
    //                 thang: this.curentmonth,
    //             };
    //             dialogConfig.minWidth = '80%';
    //             this.matDialog.open(ModalComponent, dialogConfig);
    //         });
    // }

    applyDataTarget() {
    }

    public ExportTOExcel(filename: string, sheetname: string) {
        this.excelService.exportDomTableAsExcelFile(filename, sheetname, this.table.nativeElement);
    }

    // declare variable isExport

    public ImportTOExcel() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {
            data: {
                isExport: true,
            },
        };
        dialogConfig.minWidth = window.innerWidth - 100;
        dialogConfig.minHeight = window.innerHeight - 300;
        this.matDialog.open(DialogImportDataComponent, dialogConfig);
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
        console.log(this.dataSource.data)
    }

    setSomeIten(element) {
        let temp_item: Task = Object.assign({}, element);
        this.task.push(temp_item);
        console.log(this.task);
        // element.isChecked = !element.isChecked;
    }

    Delete() {
        // waiting api
    }

}
