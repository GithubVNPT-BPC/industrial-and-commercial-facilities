import { Component, ViewEncapsulation, ElementRef, Input, OnInit, OnDestroy, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource, MatTable, MatAccordion, MatPaginator } from '@angular/material';
import { ex_im_model } from 'src/app/_models/APIModel/export-import.model';
import { District } from 'src/app/_models/district.model';
import { CompanyDetailModel } from 'src/app/_models/APIModel/domestic-market.model';
import { log } from 'util';
import { Route } from '@angular/compiler/src/core';
import { Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';

import { ExcelService } from 'src/app/_services/excelUtil.service';

@Component({
    selector: 'jw-modal',
    templateUrl: 'modal.component.html',
    styleUrls: ['../../../special_layout.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ModalComponent implements OnInit {
    public displayedColumns_business: string[] = ['index', 'ten_doanh_nghiep', 'cong_suat', 'mst', 'dia_chi', 'dien_thoai', 'chi_tiet_doanh_nghiep'];
    ten_san_pham: string = '';
    so_doanh_nghiep: number = 0;
    displayedColumns: string[] = ['index', 'ten_san_pham', 'id_quoc_gia', 'luong_thang', 'gia_tri_thang', 'luong_cong_don', 'gia_tri_cong_don'];
    dataSource;
    dataDialog: any[] = [];
    filteredDataSource: MatTableDataSource<ex_im_model> = new MatTableDataSource<ex_im_model>();
    years: number[] = [];
    months: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    sanLuongBanRa: number = 0;
    soLuongdoanhNghiep: number;
    isChecked: boolean;
    curentmonth: number = new Date().getMonth();
    @ViewChild("table", { static: false }) table: ElementRef;
    @ViewChild("table", { static: false }) table1: ElementRef;
    @ViewChild(MatAccordion, { static: false }) accordion: MatAccordion;
    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: false }) sort: MatSort;
    TongLuongThangThucHien: number = 0;
    TongGiaTriThangThucHien: number = 0;
    TongLuongCongDon: number = 0;
    TongGiaTriCongDon: number = 0;
    id: number = 1;
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public router: Router,
        public excelService: ExcelService,
    ) {
    }

    ngOnInit(): void {
        console.log('xxx', this.data, this.table)
        this.handleData();
    }

    ngAfterViewInit(): void {
        //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
        //Add 'implements AfterViewInit' to the class.
        setTimeout(() => this.accordion.openAll(), 500)
        this.dataSource.paginator = this.paginator
        this.dataSource.sort = this.sort;
    }

    handleData() {
        this.id = this.data['id'];
        if (this.id === 1) {
            this.dataSource = new MatTableDataSource<ex_im_model>(this.data['data']);
            console.log('zxzxzxz', this.dataSource.data)
            for (let item of this.data['data']) {
                // console.log(item)
                this.TongLuongThangThucHien += item['luong_thang'];
                this.TongGiaTriThangThucHien += item['gia_tri_thang'];
                this.TongLuongCongDon += item['luong_cong_don'];
                this.TongGiaTriCongDon += item['gia_tri_cong_don'];
            }
        } else {
            this.ten_san_pham = this.data['ten_san_pham'];
            this.so_doanh_nghiep = this.data['data'].length;
            if (this.data['data'].length)
                this.dataSource = new MatTableDataSource<CompanyDetailModel>(this.data['data'])
            else
                this.dataSource = new MatTableDataSource<CompanyDetailModel>()

            console.log(this.dataSource)
        }
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
        // debugger
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    public OpenDetailCompany(mst: string) {
        let url = this.router.serializeUrl(
            this.router.createUrlTree([encodeURI('#') + '/public/partner/search/' + mst]));
        window.open(url.replace('%23', '#'), "_blank");
    }

    closeDialog() {

    }

    public ExportTOExcel(filename: string, sheetname: string) {
        this.excelService.exportDomTableAsExcelFile(filename, sheetname, this.table.nativeElement);
    }

    public ExportTOExcel1(filename: string, sheetname: string) {
        this.excelService.exportDomTableAsExcelFile(filename, sheetname, this.table.nativeElement);
    }
}