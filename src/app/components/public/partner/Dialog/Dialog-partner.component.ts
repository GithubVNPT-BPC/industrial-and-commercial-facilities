import { Component, ViewChild, ElementRef, OnInit, AfterViewInit, Inject } from '@angular/core';
import * as XLSX from 'xlsx';
import { MatPaginator } from '@angular/material/paginator';
import { Router, ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';

import { CompanyDetailModel } from '../../../../_models/APIModel/domestic-market.model';
import { CSTTModel } from 'src/app/_models/APIModel/domestic-market.model';
import { MarketService } from '../../../../_services/APIService/market.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'dialog-partner-component',
    templateUrl: './dialog-partner.component.html',
    styleUrls: ['../../public_layout.scss'],
})

export class DialogPartnerComponent implements OnInit {

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

    dataSource: MatTableDataSource<CSTTModel> = new MatTableDataSource();
    selection = new SelectionModel<CSTTModel>(true, []);

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

    checkboxLabel(row?: CSTTModel): string {
        if (!row) {
            return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
        }
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
    }

    public displayedColumns: string[] = ['select', 'index', 'so_gpgcn', 'ngay_cap', 'ngay_het_han'];

    @ViewChild('TABLE', { static: false }) table: ElementRef;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public marketService: MarketService,
        public route: ActivatedRoute
    ) {
    }

    ngOnInit(): void {
        this.GetAllCSTT();
        console.log(this.data);
    }

    ExportTOExcel(filename: string, sheetname: string) {
        sheetname = sheetname.replace('/', '_');
        let excelFileName: string = filename + '.xlsx';
        const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table.nativeElement);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, sheetname);
        XLSX.writeFile(wb, excelFileName);
    }

    GetAllCSTT() {
        this.marketService.GetAllBasebyid(this.data).subscribe(
            allrecords => {
                this.dataSource = new MatTableDataSource<CSTTModel>(allrecords.data);
                console.log(this.dataSource)
                this.dataSource.paginator = this.paginator;
                this.paginator._intl.itemsPerPageLabel = 'Số hàng';
                this.paginator._intl.firstPageLabel = "Trang Đầu";
                this.paginator._intl.lastPageLabel = "Trang Cuối";
                this.paginator._intl.previousPageLabel = "Trang Trước";
                this.paginator._intl.nextPageLabel = "Trang Tiếp";
            });
    }
}