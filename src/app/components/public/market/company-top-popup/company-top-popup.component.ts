import { Component, ViewChild, ElementRef, OnInit, AfterViewInit, Inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';

import { TopCompanyModel, ProductValueModel, ExportMarketModel, ImportMarketModel } from 'src/app/_models/APIModel/domestic-market.model';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SAVE } from 'src/app/_enums/save.enum';
import { InformationService } from 'src/app/shared/information/information.service';
import { ExcelService } from 'src/app/_services/excelUtil.service';
import { MarketServicePublic } from 'src/app/_services/APIService/market.service public';

@Component({
    selector: 'company-top-popup',

    templateUrl: 'company-top-popup.component.html',
    styleUrls: ['../../public_layout.scss'],
})

export class CompanyTopPopup implements OnInit {
    @ViewChild('TABLE', { static: false }) table: ElementRef;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

    dataSource: MatTableDataSource<TopCompanyModel> = new MatTableDataSource();
    public displayedColumns: string[] = ['index', 'ten_doanh_nghiep', 'cong_suat', 'mst', 'dia_chi', 'dien_thoai', 'chi_tiet_doanh_nghiep'];

    field: string;
    public product_data: ProductValueModel;
    public import_data: ImportMarketModel;
    public export_data: ExportMarketModel;
    typeOfSave: SAVE;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<CompanyTopPopup>,
        public marketService: MarketServicePublic,
        public router: Router,
        public info: InformationService,
        public excelService: ExcelService,
    ) {
    }

    ngOnInit(): void {
        this.field = this.data.message;
        this.product_data = this.data.product_data;
        this.import_data = this.data.import_data;
        this.export_data = this.data.export_data;

        this.typeOfSave = this.data.typeOfSave;
        switch (this.typeOfSave) {
            case SAVE.EXPORT:
                this.GetTopExport();
                break;
            case SAVE.IMPORT:
                this.GetTopImport();
                break;
            case SAVE.PRODUCT:
                this.GetTopProduct();
                break;
            default:
                break;
        }
    }

    OpenDetailCompany(mst: string) {
        window.open('/#/public/partner/search/' + mst, "_blank");
    }

    public exportTOExcel(filename: string, sheetname: string) {
        this.excelService.exportDomTableAsExcelFile(filename, sheetname, this.table.nativeElement);
    }

    filtercompany: Array<TopCompanyModel> = new Array<TopCompanyModel>();
    filtercompany1: Array<TopCompanyModel> = new Array<TopCompanyModel>();

    public GetTopProduct() {
        this.marketService.GetProductValue(this.product_data.time_id).subscribe(
            allrecords => {
                this.filtercompany = allrecords.data[1]
                this.filtercompany1 = this.filtercompany.filter(x => x.id_san_pham == this.product_data.id_san_pham)

                this.dataSource = new MatTableDataSource<TopCompanyModel>(this.filtercompany1);
                this.dataSource.paginator = this.paginator;
                this.paginator._intl.itemsPerPageLabel = 'Số hàng';
                this.paginator._intl.firstPageLabel = "Trang Đầu";
                this.paginator._intl.lastPageLabel = "Trang Cuối";
                this.paginator._intl.previousPageLabel = "Trang Trước";
                this.paginator._intl.nextPageLabel = "Trang Tiếp";
            });
    }

    public GetTopExport() {
        this.marketService.GetExportValue(this.export_data.time_id).subscribe(
            allrecords => {
                this.filtercompany = allrecords.data[1]
                this.filtercompany1 = this.filtercompany.filter(x => x.id_san_pham == this.export_data.id_san_pham)

                this.dataSource = new MatTableDataSource<TopCompanyModel>(this.filtercompany1);
                this.dataSource.paginator = this.paginator;
                this.paginator._intl.itemsPerPageLabel = 'Số hàng';
                this.paginator._intl.firstPageLabel = "Trang Đầu";
                this.paginator._intl.lastPageLabel = "Trang Cuối";
                this.paginator._intl.previousPageLabel = "Trang Trước";
                this.paginator._intl.nextPageLabel = "Trang Tiếp";
            });
    }

    public GetTopImport() {
        this.marketService.GetImportValue(this.import_data.time_id).subscribe(
            allrecords => {
                this.filtercompany = allrecords.data[1]
                this.filtercompany1 = this.filtercompany.filter(x => x.id_san_pham == this.import_data.id_san_pham)

                this.dataSource = new MatTableDataSource<TopCompanyModel>(this.filtercompany1);
                this.dataSource.paginator = this.paginator;
                this.paginator._intl.itemsPerPageLabel = 'Số hàng';
                this.paginator._intl.firstPageLabel = "Trang Đầu";
                this.paginator._intl.lastPageLabel = "Trang Cuối";
                this.paginator._intl.previousPageLabel = "Trang Trước";
                this.paginator._intl.nextPageLabel = "Trang Tiếp";
            });
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

}