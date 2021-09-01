import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatOption, MatSelect, MatTable, MatTableDataSource } from '@angular/material';
import { formatDate } from '@angular/common';
import { Router } from '@angular/router';
import { InformationService } from 'src/app/shared/information/information.service';

import { MatDialog } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';

import { LinkModel } from 'src/app/_models/link.model';
import { BreadCrumService } from 'src/app/_services/injectable-service/breadcrums.service';

import {
    DistrictModel,
    LiquorList,
    DeleteModel
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
import { LoginService } from 'src/app/_services/APIService/login.service';
import { CommonFuntions } from '../common-functions.service';
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
    selector: 'liquor-business',
    templateUrl: './liquor-business.component.html',
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

export class LiquorBusinessComponent implements OnInit {
    displayedColumns: string[] = [
        'select',
        'index',
        'mst',
        'ten_doanh_nghiep',
        'dia_chi_day_du',
        'nguoi_dai_dien',
        'so_dien_thoai',
        'so_giay_phep',
        'ngay_cap',
        'ngay_het_han',
        'ten_thuong_nhan',
        'so_luong',
        'tri_gia',
        'tinh_trang_hoat_dong',
        'ghi_chu',
        'thoi_gian_chinh_sua_cuoi',

        'ten_quan_huyen',
        'id_ruou',
        'time_id'
    ];

    @ViewChild('table', { static: false }) table: ElementRef;
    @ViewChild(MatAccordion, { static: false }) accordion: MatAccordion;
    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

    years: Array<{ value: number, des: string }>

    constructor(
        public excelService: ExcelService,
        public _Service: ConditionBusinessService,
        public router: Router,
        public _info: InformationService,
        public dialog: MatDialog,
        public _login: LoginService,
        private _breadCrumService: BreadCrumService,
        public _years: CommonFuntions
    ) {
        this.years = _years.getYears();
    }

    protected LINK_DEFAULT: string = "";
    protected TITLE_DEFAULT: string = "KINH DOANH RƯỢU";
    protected TEXT_DEFAULT: string = "KINH DOANH RƯỢU";
    private _linkOutput: LinkModel = new LinkModel();

    private sendLinkToNext(type: boolean): void {
        this._linkOutput.link = this.LINK_DEFAULT;
        this._linkOutput.title = this.TITLE_DEFAULT;
        this._linkOutput.text = this.TEXT_DEFAULT;
        this._linkOutput.type = type;
        this._breadCrumService.sendLink(this._linkOutput);
    }

    public district: Array<DistrictModel> = new Array<DistrictModel>();
    getQuan_Huyen() {
        this._Service.GetAllDistrict().subscribe((allDistrict) => {
            this.district = allDistrict["data"] as DistrictModel[];
        });
    }

    authorize: boolean = true

    ngOnInit() {
        this.autoOpen();
        this.getLiquorListbyYear();
        this.getQuan_Huyen();
        this.sendLinkToNext(true)

        if (this._login.userValue.user_role_id == 3 || this._login.userValue.user_role_id == 1) {
            this.authorize = false
        }
    }

    autoOpen() {
        setTimeout(() => this.accordion.openAll(), 1000);
    }

    selection = new SelectionModel<LiquorList>(true, []);

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

    checkboxLabel(row?: LiquorList): string {
        if (!row) {
            return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
        }
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id_ruou + 1}`;
    }

    deletemodel1: Array<DeleteModel> = new Array<DeleteModel>();
    selectionarray: string[];
    removeRows() {
        if (confirm('Bạn Có Chắc Muốn Xóa?')) {
            this.selection.selected.forEach(x => {
                this.selectionarray = this.selection.selected.map(item => item.id_ruou)
                this.deletemodel1.push({
                    id: ''
                })
            })
            for (let index = 0; index < this.selectionarray.length; index++) {
                const element = this.deletemodel1[index];
                element.id = this.selectionarray[index]
            }
            this._Service.DeleteLiquorValue(this.deletemodel1).subscribe(res => {
                this._info.msgSuccess('Xóa thành công')
                window.location.reload();
                this.deletemodel1 = []
                this.selection.clear();
                this.paginator.pageIndex = 0;
            })
        }
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

    dataSource: MatTableDataSource<LiquorList> = new MatTableDataSource<LiquorList>();
    filteredDataSource: MatTableDataSource<LiquorList> = new MatTableDataSource<LiquorList>();

    getLiquorListbyYear() {
        this._Service.GetAllLiquorValue().subscribe(all => {
            let LiquorList = all.data[0];
            let LiquorList1 = all.data[1];
            let LiquorList2 = LiquorList.map(x => {
                let temp = LiquorList1.filter(y => y.id_san_luong == x.id_ruou)

                let temp1 = temp.map(z => z.ten_thuong_nhan)
                if (temp1 == undefined || temp1 == null) {
                    x.ten_thuong_nhan = null
                }
                else {
                    x.ten_thuong_nhan = temp1.join('; ')
                }

                let temp2 = temp.map(z => z.dia_chi_tn)
                if (temp2 == undefined || temp2 == null) {
                    x.dia_chi_tn = null
                }
                else {
                    x.dia_chi_tn = temp2.join('; ')
                }

                let temp3 = temp.map(z => z.so_dien_thoai_tn)
                if (temp3 == undefined || temp3 == null) {
                    x.so_dien_thoai_tn = null
                }
                else {
                    x.so_dien_thoai_tn = temp3.join('; ')
                }

                return x
            })

            LiquorList2.forEach(element => {
                if (element.ngay_het_han) {
                    element.is_expired = element.ngay_het_han < this.getCurrentDate() ? "Doanh nghiệp hết hạn" : "Doanh nghiệp còn hạn"
                }
                else {
                    element.is_expired = "Doanh nghiệp còn hạn"
                }
                element.ngay_cap = element.ngay_cap ? this.Convertdate(element.ngay_cap) : null
                element.ngay_het_han = element.ngay_het_han ? this.Convertdate(element.ngay_het_han) : null
            });

            this.dataSource.data = LiquorList2
            this.filteredDataSource.data = [...this.dataSource.data]
            this.summary()

            this.filteredDataSource.paginator = this.paginator;
            this.paginator._intl.itemsPerPageLabel = 'Số hàng';
            this.paginator._intl.firstPageLabel = "Trang Đầu";
            this.paginator._intl.lastPageLabel = "Trang Cuối";
            this.paginator._intl.previousPageLabel = "Trang Trước";
            this.paginator._intl.nextPageLabel = "Trang Tiếp";
        })
    }

    type: string = 'Liquor'
    SanLuongBanRa: number = 0;
    TriGiaBanRa: number = 0;
    summary() {
        let data = this.filteredDataSource.data;
        this.SanLuongBanRa = data.length ? data.map(x => Number(x.so_luong) || 0).reduce((a, b) => a + b) : 0;
        this.TriGiaBanRa = data.length ? data.map(x => Number(x.tri_gia) || 0).reduce((a, b) => a + b) : 0;
    }

    public getCurrentDate() {
        let date = new Date;
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

    id_linh_vuc: number = 8;
    ManageBusiness(type: string, id_linh_vuc: number) {
        this.router.navigate(['specialized/commecial-management/domestic/managebusiness/' + type + '/' + id_linh_vuc]);
    }

    Addliquorbusiness(id: string, time: string) {
        if (this.authorize == false) {
            this.router.navigate(['specialized/commecial-management/domestic/add-liquor/' + id + '/' + time]);
        }
    }

    Addliquorsupply(id: string, time: string) {
        this.router.navigate(['specialized/commecial-management/domestic/add-liquor-supply/' + id + '/' + time]);
    }

    Back() {
        this.router.navigate(['specialized/commecial-management/domestic/cbl']);
    }

    status: any[] = ["Doanh nghiệp còn hạn", "Doanh nghiệp hết hạn"]

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
        this.summary()
    }

}