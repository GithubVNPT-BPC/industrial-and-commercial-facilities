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
    CertificateModel
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
    displayedColumns: string[] = ['select', 'cap_nhat',
        'index',
        'ten_cua_hang',
        'mst',
        'so_giay_phep',
        'ngay_cap',
        'ngay_het_han',
        'dia_chi',
        'ten_quan_huyen',
        'so_dien_thoai',
        'ten_quan_ly',
        'ten_nhan_vien',
        'nguoi_dai_dien',
        'tinh_trang_hoat_dong',
        'san_luong',
        'id_cua_hang_xang_dau',
    ];
    dataSource: MatTableDataSource<PetrolList> = new MatTableDataSource<PetrolList>();
    dataSource1: MatTableDataSource<PetrolList> = new MatTableDataSource<PetrolList>();

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
        // const numRows = this.dataSource.data.length;
        const numRows = this.dataSource1.connect().value.length;
        return numSelected === numRows;
    }

    masterToggle() {
        this.isAllSelected() ?
            this.selection.clear() :
            this.dataSource1.connect().value.forEach(row => this.selection.select(row));
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
                this.selectionarray = this.selection.selected.map(item => item.id_cua_hang_xang_dau)
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
                this.getPetrolList();
                this.date = null
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

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource1.filter = filterValue.trim().toLowerCase();
    }

    getPetrolList() {
        this._Service.GetAllPetrolStore().subscribe(all => {
            this.dataSource = new MatTableDataSource<PetrolList>(all.data);
            this.dataSource.data.forEach(element => {
                if (element.ngay_het_han) {
                    let temp = this.Convertdate(element.ngay_het_han)
                    element.is_het_han = Date.parse(temp) < Date.parse(this.getCurrentDate())
                }
                else {
                    element.is_het_han = false
                }
                element.ngay_cap = element.ngay_cap ? this.Convertdate(element.ngay_cap) : null
                element.ngay_het_han = element.ngay_het_han ? this.Convertdate(element.ngay_het_han) : null
            });
            this.dataSource1.data = this.dataSource.data.filter(x => x.is_het_han == false)
            this.dataSource1.paginator = this.paginator;
            this.paginator._intl.itemsPerPageLabel = 'Số hàng';
            this.paginator._intl.firstPageLabel = "Trang Đầu";
            this.paginator._intl.lastPageLabel = "Trang Cuối";
            this.paginator._intl.previousPageLabel = "Trang Trước";
            this.paginator._intl.nextPageLabel = "Trang Tiếp";
        })
    }

    // getPetrolListbyYear(year: string) {
    //     this._Service.GetPetrolValue(year).subscribe(all => {
    //         this.dataSource = new MatTableDataSource<PetrolList>(all.data[0]);
    //         this.dataSource.data.forEach(element => {
    //             if (element.ngay_het_han) {
    //                 let temp = this.Convertdate(element.ngay_het_han)
    //                 element.is_het_han = Date.parse(temp) < Date.parse(this.getCurrentDate())
    //             }
    //             else {
    //                 element.is_het_han = false
    //             }
    //         });
    //         this.dataSource1.data = this.dataSource.data.filter(x => x.is_het_han == false)
    //         this.dataSource1.paginator = this.paginator;
    //         this.paginator._intl.itemsPerPageLabel = 'Số hàng';
    //         this.paginator._intl.firstPageLabel = "Trang Đầu";
    //         this.paginator._intl.lastPageLabel = "Trang Cuối";
    //         this.paginator._intl.previousPageLabel = "Trang Trước";
    //         this.paginator._intl.nextPageLabel = "Trang Tiếp";
    //     })
    // }

    AddStore() {
        this.router.navigate(['specialized/commecial-management/domestic/addstore']);
    }

    ManageValue() {
        this.router.navigate(['specialized/commecial-management/domestic/managevalue']);
    }

    ManageBusiness() {
        this.router.navigate(['specialized/commecial-management/domestic/managebusiness']);
    }

    OpenDetailPetrol(id: number, mst: string) {
        this.router.navigate(['specialized/commecial-management/domestic/update-petrol/' + id + '/' + mst])
    }

    // @ViewChild('dSelect', { static: false }) dSelect: MatSelect;
    // allSelected = false;
    // toggleAllSelection() {
    //     this.allSelected = !this.allSelected;

    //     if (this.allSelected) {
    //         this.dSelect.options.forEach((item: MatOption) => item.select());
    //     } else {
    //         this.dSelect.options.forEach((item: MatOption) => item.deselect());
    //     }
    //     this.dSelect.close();
    // }

    // OpenDetailPetrol(id: number, mst: string) {
    //     let url = this.router.serializeUrl(
    //         this.router.createUrlTree([encodeURI('#') + 'specialized/commecial-management/domestic/add-petrol/' + id + '/' + mst]));
    //     window.open(url.replace('%23', '#'), "_blank");
    // }

    applyDistrictFilter(event) {
        let filteredData = [];

        event.value.forEach(element => {
            this.dataSource.data.filter(x => x.ten_quan_huyen.toLowerCase().includes(element.toLowerCase())).forEach(x => filteredData.push(x));
        });

        if (!filteredData.length) {
            if (event.value.length)
                this.dataSource1.data = [];
            else
                this.dataSource1.data = this.dataSource.data;
        }
        else {
            this.dataSource1.data = filteredData;
        }
    }

    applyExpireCheck(event) {
        this.dataSource1.data = this.dataSource.data.filter(x => x.is_het_han == event.checked)
    }

    public getCurrentDate() {
        let date = new Date;
        return formatDate(date, 'yyyy-MM-dd', 'en-US');
    }

    public getCurrentYear() {
        let date = new Date;
        return formatDate(date, 'yyyy', 'en-US');
    }

    Convertdate(text: string): string {
        let date: string
        date = text.substring(6, 8) + "-" + text.substring(4, 6) + "-" + text.substring(0, 4)
        return date
    }

    public date = new FormControl(_moment());
    public theYear: number;

    public chosenYearHandler(normalizedYear: Moment, datepicker: MatDatepicker<Moment>) {
        const ctrlValue = this.date.value;
        ctrlValue.year(normalizedYear.year());
        this.date.setValue(ctrlValue);
        this.theYear = normalizedYear.year();
        datepicker.close();
        // this.getPetrolListbyYear(this.theYear.toString())
    }

    public ExportTOExcel(filename: string, sheetname: string) {
        this.excelService.exportDomTableAsExcelFile(filename, sheetname, this.table.nativeElement);
    }
}
