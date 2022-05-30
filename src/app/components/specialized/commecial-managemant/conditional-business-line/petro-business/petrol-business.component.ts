import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatOption, MatSelect, MatTable, MatTableDataSource } from '@angular/material';
import { formatDate } from '@angular/common';
import { Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { InformationService } from 'src/app/shared/information/information.service';

import {
    DistrictModel,
    SubDistrictModel,
    DeleteModel,
    PetrolList,
    CertificateModel,
    Statusfilter
} from 'src/app/_models/APIModel/conditional-business-line.model';
import { MatAccordion } from '@angular/material/expansion';
import { MatPaginator } from '@angular/material/paginator';

import { ExcelService } from 'src/app/_services/excelUtil.service';
import { ConditionBusinessService } from 'src/app/_services/APIService/Condition-Business.service';

import { FormControl } from '@angular/forms';
import { MatDatepicker, MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import _moment from 'moment';
import { defaultFormat as _rollupMoment, Moment } from 'moment';
const moment = _rollupMoment || _moment;
export const MY_FORMATS = {
    parse: {
        dateInput: 'YYYY',
    },
    display: {
        dateInput: 'YYYY',
        monthYearLabel: 'YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY',
    },
};

@Component({
    selector: 'petrol-business',
    templateUrl: './petrol-business.component.html',
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

export class PetrolBusinessComponent implements OnInit {
    displayedColumns: string[] = ['select',
        'index',
        'ten_cua_hang',
        'mst',
        'so_giay_phep',
        'ngay_cap',
        'ngay_het_han',
        'dia_chi_day_du',
        'ten_quan_huyen',
        'so_dien_thoai',
        'ten_quan_ly',
        'ten_nhan_vien',
        'nguoi_dai_dien',
        'tinh_trang_hoat_dong',
        'san_luong',
        'id_cua_hang_xang_dau',
        'thoi_gian_chinh_sua_cuoi'
    ];

    @ViewChild('table', { static: false }) table: ElementRef;
    @ViewChild(MatAccordion, { static: false }) accordion: MatAccordion;
    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

    constructor(
        public excelService: ExcelService,
        public _Service: ConditionBusinessService,
        public router: Router,
        public _info: InformationService,
    ) {
    }

    selection = new SelectionModel<PetrolList>(true, []);

    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.filteredDataSource.connect().value.length;
        return numSelected === numRows;
    }

    masterToggle() {
        this.isAllSelected() ?
            this.selection.clear() :
            this.filteredDataSource.connect().value.forEach(row => this.selection.select(row));
    }

    checkboxLabel(row?: PetrolList): string {
        if (!row) {
            return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
        }
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id_cua_hang_xang_dau + 1}`;
    }

    deletemodel1: Array<DeleteModel> = new Array<DeleteModel>();
    selectionarray: string[];
    removeRows() {
        if (confirm('Bạn Có Chắc Muốn Xóa?')) {
            this.selection.selected.forEach(x => {
                this.selectionarray = this.selection.selected.map(item => item.id_cua_hang_xang_dau.toString())
                this.deletemodel1.push({
                    id: ''
                })
            })
            for (let index = 0; index < this.selectionarray.length; index++) {
                const element = this.deletemodel1[index];
                element.id = this.selectionarray[index]
            }
            this._Service.DeletePetrol(this.deletemodel1).subscribe(res => {
                this._info.msgSuccess('Xóa thành công')
                this.ngOnInit();
                this.deletemodel1 = []
                this.selection.clear();
                this.paginator.pageIndex = 0;
            })
        }
    }

    public subdistrict: Array<SubDistrictModel> = new Array<SubDistrictModel>();
    public district: Array<DistrictModel> = new Array<DistrictModel>();
    public Certificate: Array<CertificateModel> = new Array<CertificateModel>();

    GetAllPhuongXa() {
        this._Service.GetAllSubDistrict().subscribe((allrecords) => {
            this.subdistrict = allrecords.data as SubDistrictModel[];
        });
    }

    getQuan_Huyen() {
        this._Service.GetAllDistrict().subscribe((allDistrict) => {
            this.district = allDistrict["data"] as DistrictModel[];
        });
    }

    GetAllGiayPhep(mst: string) {
        this._Service.GetCertificate(mst).subscribe((allrecords) => {
            this.Certificate = allrecords.data as CertificateModel[];
        });
    }

    ngOnInit() {
        this.getQuan_Huyen();
        this.getPetrolList();
        this.autoOpen();
    }

    autoOpen() {
        setTimeout(() => this.accordion.openAll(), 1000);
    }

    // ngAfterViewInit(): void {
    //     //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //     //Add 'implements AfterViewInit' to the class.
    //     this.accordion.openAll();
    // }

    // applyFilter(event: Event) {
    //     const filterValue = (event.target as HTMLInputElement).value;
    //     this.filteredDataSource.filter = filterValue.trim().toLowerCase();
    // }

    dataSource: MatTableDataSource<PetrolList> = new MatTableDataSource<PetrolList>();
    filteredDataSource: MatTableDataSource<PetrolList> = new MatTableDataSource<PetrolList>();

    getPetrolList() {
        this._Service.GetAllPetrolStore().subscribe(all => {
            this.dataSource.data = all.data
            this.dataSource.data.forEach(element => {
                if (element.ngay_het_han) {
                    element.is_expired = element.ngay_het_han < this.getCurrentDate() ? "Doanh nghiệp hết hạn" : 
                    (element.ngay_het_han < this.getDate2Months()? "Doanh nghiệp sắp hết hạn" : "Doanh nghiệp còn hạn")
                }
                else {
                    element.is_expired = "Doanh nghiệp còn hạn"
                }
                element.ngay_cap = element.ngay_cap ? this.Convertdate(element.ngay_cap) : null
                element.ngay_het_han = element.ngay_het_han ? this.Convertdate(element.ngay_het_han) : null
            });

            this.filteredDataSource.data = [...this.dataSource.data];
            this.filteredDataSource.paginator = this.paginator;
            this.paginator._intl.itemsPerPageLabel = 'Số hàng';
            this.paginator._intl.firstPageLabel = "Trang Đầu";
            this.paginator._intl.lastPageLabel = "Trang Cuối";
            this.paginator._intl.previousPageLabel = "Trang Trước";
            this.paginator._intl.nextPageLabel = "Trang Tiếp";
        })
    }

    public getCurrentDate() {
        let date = new Date;
        return formatDate(date, 'yyyyMMdd', 'en-US');
    }

    public getDate2Months(){
        let date = new Date;
        date.setMonth(date.getMonth() + 2)
        return formatDate(date, 'yyyyMMdd', 'en-US');
    }

    Convertdate(text: string): string {
        let date: string
        date = text.substring(6, 8) + "-" + text.substring(4, 6) + "-" + text.substring(0, 4)
        return date
    }

    public ExportTOExcel(filename: string, sheetname: string) {
        this.excelService.exportDomTableAsExcelFile(filename, sheetname, this.table.nativeElement);
    }

    AddStore(id: number, mst: string) {
        this.router.navigate(['specialized/commecial-management/domestic/addstore/' + id + '/' + mst]);
    }

    OpenDetailPetrol(id: number, mst: string) {
        this.router.navigate(['specialized/commecial-management/domestic/update-petrol/' + id + '/' + mst])
    }

    Back() {
        this.router.navigate(['specialized/commecial-management/domestic/petrol']);
    }

    status: any[] = ["Doanh nghiệp còn hạn", "Doanh nghiệp hết hạn", "Doanh nghiệp sắp hết hạn"]

    filterModel = {
        ten_quan_huyen: [],
        is_expired: []
    }

    filterArray(dataSource, filters) {
        const filterKeys = Object.keys(filters);
        let filteredData = [...dataSource];
        filterKeys.forEach(key => {
            let filterCrits = [];
            if (filters[key].length) {
                filters[key].forEach(criteria => {
                    filterCrits = filterCrits.concat(filteredData.filter(x => x[key] == criteria));
                });
                filteredData = [...filterCrits];
            }
        })
        return filteredData;
    }

    applyFilter(event) {
        if (event.target) {
            const filterValue = (event.target as HTMLInputElement).value;
            this.filteredDataSource.filter = filterValue.trim().toLowerCase();
        } else {
            let filteredData = this.filterArray(this.dataSource.data, this.filterModel);

            if (!filteredData.length) {
                if (this.filterModel)
                    this.filteredDataSource.data = [];
                else
                    this.filteredDataSource.data = this.dataSource.data;
            }
            else {
                this.filteredDataSource.data = filteredData;
            }
        }
    }
}
