import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatAccordion, MatPaginator, MatSort, MatDialog, MatDialogConfig } from '@angular/material';
import { ex_im_model } from 'src/app/_models/APIModel/export-import.model';
import { LinkModel } from 'src/app/_models/link.model';
import { MarketService } from 'src/app/_services/APIService/market.service';
import { SCTService } from 'src/app/_services/APIService/sct.service';
import { BreadCrumService } from 'src/app/_services/injectable-service/breadcrums.service';
import { ModalComponent } from '../../export-import-management/dialog-import-export/modal.component';
import { dataExport, dataExport2, dataExport3, dataExport4, dataExport5, dataExport6, dataExport7, dataExport8, dataExport9, dataExport10, dataExport11, dataExport12 } from '../../export-import-management/export-management/data';
import { dataDialogM1, dataDialogM2, dataDialogM3, dataDialogM4, dataDialogM5, dataDialogM6, dataDialogM7, dataDialogM8, dataDialogM9, dataDialogM10, dataDialogM11, dataDialogM12 } from '../../export-import-management/export-management/dataDialog';
import * as XLSX from "xlsx";
import { data_xk_t11 } from '../border-trade-export/data';
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
    displayedColumns = [
        'index', 'ten_san_pham',
        'luong_thang', 'gia_tri_thang',
        'uoc_th_so_cungky_tht',
        'uoc_th_so_thg_truoc_tht',

        'luong_cong_don', 'gia_tri_cong_don',
        'uoc_th_so_cungky_cong_don',
        'uoc_th_so_thg_truoc_cong_don',
        'danh_sach_doanh_nghiep',
        'chi_tiet_doanh_nghiep'];
    displayRow1Header = [
        'index',
        'ten_san_pham',
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
    dataSource: MatTableDataSource<ex_im_model> = new MatTableDataSource<ex_im_model>();
    dataDialog: any[] = [];
    filteredDataSource: MatTableDataSource<ex_im_model> = new MatTableDataSource<ex_im_model>();
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
        public matDialog: MatDialog,
        public marketService: MarketService,
        private _breadCrumService: BreadCrumService
    ) { }

    handleGTXK() {
        this.TongGiaTriThangThucHien = this.dataSource.data[15].gia_tri_thang;
        this.uth_so_cungky = this.dataSource.data[15].uoc_th_so_cungky_tht;
        this.TongGiaTriCongDon = this.dataSource.data[15].gia_tri_cong_don;
        this.uth_so_khn = this.dataSource.data[15].uoc_th_so_thg_truoc_cong_don;
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
        this.getDanhSachXuatKhau(this.curentmonth);
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

    getDanhSachXuatKhau(value) {
        let time_id = this.curentYear * 100 + this.curentmonth;
        if (time_id == 202001) {
            this.dataSource.data = [];
            // this.dataDialog = dataDialogM1;
        }
        if (time_id == 202002) {
            this.dataSource.data = [];
            // this.dataDialog = dataDialogM2;
        }
        if (time_id == 202003) {
            this.dataSource.data = [];
            // this.dataDialog = dataDialogM3;
        }
        if (time_id == 202004) {
            this.dataSource.data = [];
            // this.dataDialog = dataDialogM4;
        }
        if (time_id == 202005) {
            this.dataSource.data = [];
            // this.dataDialog = dataDialogM5;
        }
        if (time_id == 202006) {
            this.dataSource.data = [];
            // this.dataDialog = dataDialogM6;
        }
        if (time_id == 202007) {
            this.dataSource.data = [];
            // this.dataDialog = dataDialogM7
        }
        if (time_id == 202008) {
            this.dataSource.data = [];
            // this.dataDialog = dataDialogM8
        }
        if (time_id == 202009) {
            this.dataSource.data = [];
            // this.dataDialog = dataDialogM9;
        }
        if (time_id == 202010) {
            this.dataSource.data = [];
            // this.dataDialog = dataDialogM10
        }
        if (time_id == 202011) {
            this.dataSource.data = data_xk_t11;
            // this.dataDialog = dataDialogM11;
        }
        if (time_id == 202012) {
            this.dataSource.data = [];
            // this.dataDialog = dataDialogM12;
        }
    }

    tinh_tong(data) {
        this.initVariable();
        for (let item of data) {
            // console.log(item)
            this.TongLuongThangThucHien += item['luong_thang'];
            this.TongGiaTriThangThucHien += item['gia_tri_thang'];
            this.TongLuongCongDon += item['luong_cong_don'];
            this.TongGiaTriCongDon += item['gia_tri_cong_don'];
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
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    log(any) {
        console.log(any);
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

    applyDistrictFilter(event) { }

    // isHidden(row : any){
    //     return (this.isChecked)? (row.is_het_han) : false;
    // }

    applyExpireCheck(data) {
        // console.log(data);
        let tem_data = [...data]
        this.dataSource = new MatTableDataSource<ex_im_model>(tem_data.filter(item => this.xuat_khau_chu_yeu.includes(item.id_mat_hang)));
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

    openDanh_sach_doanh_nghiep(id_mat_hang, ten_san_pham) {
        this.marketService
            .GetTopExport(this.curentmonth, new Date().getFullYear(), id_mat_hang)
            .subscribe((data) => {
                const dialogConfig = new MatDialogConfig();
                dialogConfig.data = {
                    data: data["data"],
                    id: 2,
                    ten_san_pham: ten_san_pham,
                    thang: this.curentmonth,
                };
                dialogConfig.minWidth = '80%';
                this.matDialog.open(ModalComponent, dialogConfig);
            });
    }

    applyDataTarget(value: number[]) {
    }

    public ExportTOExcel(filename: string, sheetname: string) {
        const excelExtention: string = ".xlsx";
        let excelFileName: string = filename + excelExtention;
        const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table.nativeElement);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, sheetname);
        /* save to file */
        XLSX.writeFile(wb, excelFileName);
    }

}
