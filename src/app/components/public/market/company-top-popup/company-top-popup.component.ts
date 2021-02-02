import { Component, ViewChild, ElementRef, OnInit, AfterViewInit, Inject } from '@angular/core';
import * as XLSX from 'xlsx';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';

import { MarketService } from './../../../../_services/APIService/market.service';
import { CompanyDetailModel } from './../../../../_models/APIModel/domestic-market.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ExportManagerModel } from 'src/app/_models/APIModel/manager.model';
import { ManagerService } from 'src/app/_services/APIService/manager.service';
import { SAVE } from 'src/app/_enums/save.enum';
import { InformationService } from 'src/app/shared/information/information.service';

@Component({
    selector: 'company-top-popup',
    templateUrl: 'company-top-popup.component.html',
    styleUrls: ['../../public_layout.scss'],
})

export class CompanyTopPopup implements OnInit {

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

    dataSource: MatTableDataSource<CompanyDetailModel> = new MatTableDataSource();
    selection = new SelectionModel<CompanyDetailModel>(true, []);
    field: string = "";
    toptop: ExportManagerModel;
    textSaveButton: string = "Lưu";
    textCancelButton: string = "Hủy bỏ";
    typeOfSave: SAVE = SAVE.NONE;

    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.length;
        return numSelected === numRows;
    }

    masterToggle() {
        this.isAllSelected() ?
            this.selection.clear() :
            this.dataSource.data.forEach(row => this.selection.select(row));
    }

    checkboxLabel(row?: CompanyDetailModel): string {
        if (!row) {
            return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
        }
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
    }

    // public displayedColumns: string[] = ['select', 'index', 'ten_doanh_nghiep', 'cong_suat', 'mst', 'dia_chi', 'dien_thoai', 'nganh_nghe_kd'];
    public displayedColumns: string[] = ['index', 'ten_doanh_nghiep', 'cong_suat', 'mst', 'dia_chi', 'dien_thoai', 'nganh_nghe_kd', 'chi_tiet_doanh_nghiep'];

    @ViewChild('TABLE', { static: false }) table: ElementRef;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<CompanyTopPopup>,
        public marketService: MarketService,
        public managerService: ManagerService,
        public router: Router,
        public info: InformationService,
    ) {
    }

    ngOnInit(): void {
        console.log(this.data);
        this.field = this.data.message;
        this.toptop = this.data.toptop;
        this.typeOfSave = this.data.typeOfSave;
        if (this.data.buttonText) {
            this.textCancelButton = this.data.buttonText.cancel;
            this.textSaveButton = this.data.buttonText.ok;
        }
        // this.GetAllCompany();
        switch (this.typeOfSave) {
            case SAVE.NONE:
                break;
            case SAVE.EXPORT:
                this.GetTopCompanyExport();
                break;
            case SAVE.IMPORT:
                this.GetTopCompanyImport();
                break;
            case SAVE.PRODUCT:
                this.GetTopCompanyProduct();
                break;
            default:
                break;
        }
    }

    OpenDetailCompany(mst: string) {
        this.router.navigate(['/public/partner/search/' + mst]);
        this.dialogRef.close();
    }

    ExportTOExcel(filename: string, sheetname: string) {
        sheetname = sheetname.replace('/', '_');
        let excelFileName: string = filename + '.xlsx';
        const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table.nativeElement);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, sheetname);
        XLSX.writeFile(wb, excelFileName);
    }

    // GetAllCompany() {
    //     this.marketService.GetAllCompany().subscribe(
    //         allrecords => {
    //             this.dataSource = new MatTableDataSource<CompanyDetailModel>(allrecords.data);
    //             this.dataSource.paginator = this.paginator;
    //             this.paginator._intl.itemsPerPageLabel = 'Số hàng';
    //             this.paginator._intl.firstPageLabel = "Trang Đầu";
    //             this.paginator._intl.lastPageLabel = "Trang Cuối";
    //             this.paginator._intl.previousPageLabel = "Trang Trước";
    //             this.paginator._intl.nextPageLabel = "Trang Tiếp";
    //         });
    // }

    GetTopCompanyExport() {
        this.marketService.GetTopExport(this.toptop.thang, this.toptop.nam, this.toptop.id_san_pham).subscribe(
            allrecords => {
                console.log(allrecords)
                this.dataSource = new MatTableDataSource<CompanyDetailModel>(allrecords.data);
                this.dataSource.paginator = this.paginator;
                this.paginator._intl.itemsPerPageLabel = 'Số hàng';
                this.paginator._intl.firstPageLabel = "Trang Đầu";
                this.paginator._intl.lastPageLabel = "Trang Cuối";
                this.paginator._intl.previousPageLabel = "Trang Trước";
                this.paginator._intl.nextPageLabel = "Trang Tiếp";
            });
    }

    GetTopCompanyImport() {
        this.marketService.GetTopImport(this.toptop.thang, this.toptop.nam, this.toptop.id_san_pham).subscribe(
            allrecords => {
                console.log(allrecords)
                this.dataSource = new MatTableDataSource<CompanyDetailModel>(allrecords.data);
                this.dataSource.paginator = this.paginator;
                this.paginator._intl.itemsPerPageLabel = 'Số hàng';
                this.paginator._intl.firstPageLabel = "Trang Đầu";
                this.paginator._intl.lastPageLabel = "Trang Cuối";
                this.paginator._intl.previousPageLabel = "Trang Trước";
                this.paginator._intl.nextPageLabel = "Trang Tiếp";
            });
    }

    GetTopCompanyProduct() {
        this.marketService.GetTopProduct(this.toptop.thang, this.toptop.nam, this.toptop.id_san_pham).subscribe(
            allrecords => {
                console.log(allrecords)
                this.dataSource = new MatTableDataSource<CompanyDetailModel>(allrecords.data);
                this.dataSource.paginator = this.paginator;
                this.paginator._intl.itemsPerPageLabel = 'Số hàng';
                this.paginator._intl.firstPageLabel = "Trang Đầu";
                this.paginator._intl.lastPageLabel = "Trang Cuối";
                this.paginator._intl.previousPageLabel = "Trang Trước";
                this.paginator._intl.nextPageLabel = "Trang Tiếp";
            });
    }

    // Save() {
    //     switch (this.typeOfSave) {
    //         case SAVE.NONE:
    //             break;
    //         case SAVE.EXPORT:
    //             break;
    //         case SAVE.IMPORT:
    //             break;
    //         case SAVE.PRODUCT:
    //             break;
    //         default:
    //             break;
    //     }

    // }
}