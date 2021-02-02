//Import library
import { Component, ViewChild, ElementRef, OnInit, AfterViewInit, Inject } from '@angular/core';
import * as XLSX from 'xlsx';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
//Import Service
import { MarketService } from './../../../_services/APIService/market.service';
import { InformationService } from 'src/app/shared/information/information.service';
import { ManagerService } from 'src/app/_services/APIService/manager.service';
//Import Model
import { ExportManagerModel } from 'src/app/_models/APIModel/manager.model';
import { CompanyDetailModel } from './../../../_models/APIModel/domestic-market.model';
import { SAVE } from 'src/app/_enums/save.enum';
//Import Component

@Component({
    selector: 'export-top-company-manager',
    templateUrl: './export-top-company-manager.component.html',
    styleUrls: ['../manager_layout.scss'],
})

export class ExportTopCompanyManager implements OnInit {

    //Declare variable for HTML & TS
    public dataSource: MatTableDataSource<CompanyDetailModel> = new MatTableDataSource();
    public selection = new SelectionModel<CompanyDetailModel>(true, []);
    public field: string = "";
    public product: ExportManagerModel;
    public textSaveButton: string = "Lưu";
    public textCancelButton: string = "Hủy bỏ";
    public typeOfSave: SAVE = SAVE.NONE;
    public displayedColumns: string[] = ['select', 'index', 'ten_doanh_nghiep', 'cong_suat', 'mst', 'dia_chi', 'dien_thoai', 'nganh_nghe_kd'];
    //Declare variable for ONLY TS


    //Viewchild
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild('TABLE', { static: false }) table: ElementRef;
    @ViewChild(MatSort, { static: true }) sort: MatSort;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<ExportTopCompanyManager>,
        public marketService: MarketService,
        public managerService: ManagerService,
        public router: Router,
        public _infor: InformationService
    ) { }

    async ngOnInit(): Promise<void> {
        this.field = this.data.message + " cho sản phẩm: " + this.data.product.ten_san_pham;
        this.product = this.data.product;
        this.typeOfSave = this.data.typeOfSave;
        if (this.data.buttonText) {
            this.textCancelButton = this.data.buttonText.cancel;
            this.textSaveButton = this.data.buttonText.ok;
        }
        await this.getAllCompany();
        if (this.dataSource.data.length > 0) {
            this.dataSource.sortingDataAccessor = (item, property) => {
                switch (property) {
                    case 'select': return this.selection.selected.includes(item);
                    default: return item[property];
                }
            };
        }
    }

    //Function for PROCESS-FLOW----------------------------------------------------------------------------------
    //Get all Company
    public async getAllCompany() {
        let allCompany = await this.marketService.GetAllCompany().toPromise();
        let checkedCompay = await this.getAllCheckedCompany();
        if (allCompany) {
            this.dataSource = new MatTableDataSource<CompanyDetailModel>(allCompany.data);
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
            this.paginator._intl.itemsPerPageLabel = 'Số hàng';
            this.paginator._intl.firstPageLabel = "Trang Đầu";
            this.paginator._intl.lastPageLabel = "Trang Cuối";
            this.paginator._intl.previousPageLabel = "Trang Trước";
            this.paginator._intl.nextPageLabel = "Trang Tiếp";
            if (checkedCompay && checkedCompay.data.length > 0) {
                checkedCompay.data.forEach(element => {
                    let tempElement = this.dataSource.data.find(con => con.mst == element.mst);
                    if (tempElement) {
                        this.selection.select(tempElement);
                    }
                });
            }
        }
    }
    public async getAllCheckedCompany(): Promise<any> {
        switch (this.typeOfSave) {
            case SAVE.NONE:
                return null;
            case SAVE.EXPORT:
                return await this.marketService.GetTopExport(this.data.product.thang, this.data.product.nam, this.data.product.id_san_pham).toPromise();
            case SAVE.IMPORT:
                return await this.marketService.GetTopImport(this.data.product.thang, this.data.product.nam, this.data.product.id_san_pham).toPromise();
            case SAVE.PRODUCT:
                return await this.marketService.GetTopProduct(this.data.product.thang, this.data.product.nam, this.data.product.id_san_pham).toPromise();
            default:
                return null;
        }
    }
    //Function for EVENT HTML----------------------------------------------------------------------------------
    //Event for "Lọc dữ liệu"
    public applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }
    //Event selected all
    public isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.length;
        return numSelected === numRows;
    }
    //Event check
    public masterToggle() {
        this.isAllSelected() ?
            this.selection.clear() :
            this.dataSource.data.forEach(row => this.selection.select(row));
    }
    //Event check item
    public checkboxLabel(row?: CompanyDetailModel): string {
        if (!row) {
            return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
        }
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
    }
    //Event "Xuất Excel"
    public exportTOExcel(filename: string, sheetname: string) {
        sheetname = sheetname.replace('/', '_');
        let excelFileName: string = filename + '.xlsx';
        const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table.nativeElement);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, sheetname);
        XLSX.writeFile(wb, excelFileName);
    }
    //Event "Lưu"
    public save() {
        switch (this.typeOfSave) {
            case SAVE.NONE:
                break;
            case SAVE.EXPORT:
                this.managerService.PostTopExportManager(this.product.id, this.selection.selected).subscribe(
                    next => {
                        if (next.id == -1) {
                            this._infor.msgError("Lưu lỗi! Lý do: " + next.message);
                        }
                        else {
                            this._infor.msgSuccess("Dữ liệu được lưu thành công!");
                        }
                        this.dialogRef.close(true);
                    },
                    error => {
                        this._infor.msgError(error.message);
                    }
                )
                break;
            case SAVE.IMPORT:
                this.managerService.PostTopImportManager(this.product.id, this.selection.selected).subscribe(
                    next => {
                        if (next.id == -1) {
                            this._infor.msgError("Lưu lỗi! Lý do: " + next.message);
                        }
                        else {
                            this._infor.msgSuccess("Dữ liệu được lưu thành công!");
                        }
                        this.dialogRef.close(true);
                    },
                    error => {
                        this._infor.msgError(error.message);
                    }
                )
                break;
            case SAVE.PRODUCT:
                this.managerService.PostTopProductManager(this.product.id, this.selection.selected).subscribe(
                    next => {
                        if (next.id == -1) {
                            this._infor.msgError("Lưu lỗi! Lý do: " + next.message);
                        }
                        else {
                            this._infor.msgSuccess("Dữ liệu được lưu thành công!");
                        }
                        this.dialogRef.close(true);
                    },
                    error => {
                        this._infor.msgError(error.message);
                    }
                )
                break;
            default:
                break;
        }

    }
    //Function for EXTENTION-------------------------------------------------------------------------












}