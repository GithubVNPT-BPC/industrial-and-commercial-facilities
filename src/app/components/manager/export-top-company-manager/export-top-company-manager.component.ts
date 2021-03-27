import { Component, ViewChild, ElementRef, OnInit, AfterViewInit, Inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';

import { MarketService } from 'src/app/_services/APIService/market.service';
import { TopCompanyModel, ProductValueModel, ExportMarketModel, ImportMarketModel, DeleteModel1, PostTopProduct } from 'src/app/_models/APIModel/domestic-market.model';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SAVE } from 'src/app/_enums/save.enum';
import { InformationService } from 'src/app/shared/information/information.service';
import { ExcelService } from 'src/app/_services/excelUtil.service';

@Component({
    selector: 'export-top-company-manager',
    templateUrl: './export-top-company-manager.component.html',
    styleUrls: ['../manager_layout.scss'],
})

export class ExportTopCompanyManager implements OnInit {
    @ViewChild('TABLE', { static: false }) table: ElementRef;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

    dataSource: MatTableDataSource<TopCompanyModel> = new MatTableDataSource();
    public displayedColumns: string[] = ['select', 'index', 'ten_doanh_nghiep', 'cong_suat', 'mst', 'dia_chi', 'dien_thoai', 'chi_tiet_doanh_nghiep', 'id_san_pham', 'time_id'];

    field: string;
    public product_data: ProductValueModel;
    public import_data: ImportMarketModel;
    public export_data: ExportMarketModel;
    typeOfSave: SAVE;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<ExportTopCompanyManager>,
        public marketService: MarketService,
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
                break;
            case SAVE.IMPORT:
                break;
            case SAVE.PRODUCT:
                this.GetTopProduct();
                break;
            case SAVE.ADD:
                this.GetAllCompany();
                this.GetTopProductFilter();
                break;
            default:
                break;
        }
    }

    OpenDetailCompany(mst: string) {
        let url = this.router.serializeUrl(
            this.router.createUrlTree(['public/partner/search/' + mst]));
        window.open(url, "_blank");
    }

    public exportTOExcel(filename: string, sheetname: string) {
        this.excelService.exportDomTableAsExcelFile(filename, sheetname, this.table.nativeElement);
    }

    Convertdatetostring(text: string): string {
        let date: string
        date = text.replace('/', '')
        let date1: string
        date1 = date.substring(2, 7) + date.substring(0, 2)
        return date1
    }

    filtercompany: Array<TopCompanyModel> = new Array<TopCompanyModel>();
    filtercompany1: Array<TopCompanyModel> = new Array<TopCompanyModel>();

    public GetTopProduct() {
        this.marketService.GetProductValue(this.Convertdatetostring(this.product_data.time_id.toString())).subscribe(
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

    public GetTopProductFilter() {
        this.marketService.GetProductValue(this.Convertdatetostring(this.product_data.time_id.toString())).subscribe(
            allrecords => {
                this.filtercompany = allrecords.data[1]
                this.filtercompany1 = this.filtercompany.filter(x => x.id_san_pham == this.product_data.id_san_pham)
            });
    }

    filtercompany2: Array<TopCompanyModel> = new Array<TopCompanyModel>();

    GetAllCompany() {
        this.marketService.GetAllCompany().subscribe(
            allrecords => {
                console.log(this.filtercompany1)

                this.dataSource = new MatTableDataSource<TopCompanyModel>(allrecords.data[0]);

                for (let index = 0; index < this.filtercompany1.length; index++) {
                    this.filtercompany2 = this.dataSource.data.filter(x => x.mst != this.filtercompany1[index].mst)
                }

                console.log(this.filtercompany2)

                this.dataSource.data.forEach(x => {
                    x.time_id = this.product_data.time_id
                    x.id_san_pham = this.product_data.id_san_pham
                    x.time_id = x.time_id ? this.Convertdatetostring(x.time_id) : null
                })

                this.dataSource.paginator = this.paginator;
                this.paginator._intl.itemsPerPageLabel = 'Số hàng';
                this.paginator._intl.firstPageLabel = "Trang Đầu";
                this.paginator._intl.lastPageLabel = "Trang Cuối";
                this.paginator._intl.previousPageLabel = "Trang Trước";
                this.paginator._intl.nextPageLabel = "Trang Tiếp";

                // // Overrride default filter behaviour of Material Datatable
                // this.dataSource.filterPredicate = this.filterService.createFilter();
            });
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    selection = new SelectionModel<TopCompanyModel>(true, []);

    isAllSelected() {
        const numSelected = this.selection.selected.length;
        // const numRows = this.dataSource.data.length;
        const numRows = this.dataSource.connect().value.length;
        return numSelected === numRows;
    }

    masterToggle() {
        this.isAllSelected() ?
            this.selection.clear() :
            this.dataSource.connect().value.forEach(row => this.selection.select(row));
    }

    checkboxLabel(row?: TopCompanyModel): string {
        if (!row) {
            return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
        }
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
    }

    deletemodel1: Array<DeleteModel1> = new Array<DeleteModel1>();
    selectionarray: string[];
    removeRows() {
        if (confirm('Bạn Có Chắc Muốn Xóa?')) {
            this.selection.selected.forEach(x => {
                this.selectionarray = this.selection.selected.map(item => item.id)
                this.deletemodel1.push({
                    id: ''
                })
            })
            for (let index = 0; index < this.selectionarray.length; index++) {
                const element = this.deletemodel1[index];
                element.id = this.selectionarray[index]
            }
            console.log(this.deletemodel1)
            this.marketService.DeleteProductValueTop(this.deletemodel1).subscribe(res => {
                this.info.msgSuccess('Xóa thành công')
                this.dialogRef.close()
                this.selection.clear();
                this.paginator.pageIndex = 0;
            })
        }
    }

    posttopcompany: Array<PostTopProduct> = new Array<PostTopProduct>();

    public save() {
        switch (this.typeOfSave) {
            case SAVE.NONE:
                break;
            case SAVE.EXPORT:
                break;
            case SAVE.IMPORT:
                break;
            case SAVE.ADD:
                this.selection.selected.forEach(x => {
                    this.posttopcompany.push({
                        id: null,
                        id_san_pham: this.product_data.id_san_pham,
                        mst: '',
                        cong_suat: 0,
                        time_id: this.Convertdatetostring(this.product_data.time_id)
                    })
                })

                for (let index = 0; index < this.posttopcompany.length; index++) {
                    this.posttopcompany[index].cong_suat = this.dataSource.data[index].cong_suat
                    this.posttopcompany[index].mst = this.dataSource.data[index].mst
                }

                this.marketService.PostProductValueTop(this.posttopcompany).subscribe(
                    next => {
                        if (next.id == -1) {
                            this.info.msgError("Lưu lỗi! Lý do: " + next.message);
                        }
                        else {
                            this.info.msgSuccess("Dữ liệu được lưu thành công!");
                            this.dialogRef.close();
                        }
                    },
                    error => {
                        this.info.msgError(error.message);
                    }
                )
                break;
            case SAVE.PRODUCT:
                this.dataSource.data.forEach(x => {
                    this.posttopcompany.push({
                        id: null,
                        id_san_pham: this.product_data.id_san_pham,
                        mst: '',
                        cong_suat: 0,
                        time_id: this.Convertdatetostring(this.product_data.time_id)
                    })
                })

                for (let index = 0; index < this.posttopcompany.length; index++) {
                    this.posttopcompany[index].cong_suat = this.dataSource.data[index].cong_suat
                    this.posttopcompany[index].mst = this.dataSource.data[index].mst
                    this.posttopcompany[index].id = this.dataSource.data[index].id
                }

                this.marketService.PostProductValueTop(this.posttopcompany).subscribe(
                    next => {
                        if (next.id == -1) {
                            this.info.msgError("Lưu lỗi! Lý do: " + next.message);
                        }
                        else {
                            this.info.msgSuccess("Dữ liệu được lưu thành công!");
                            this.dialogRef.close();
                        }
                    },
                    error => {
                        this.info.msgError(error.message);
                    }
                )
                break;
            default:
                break;
        }
    }

}