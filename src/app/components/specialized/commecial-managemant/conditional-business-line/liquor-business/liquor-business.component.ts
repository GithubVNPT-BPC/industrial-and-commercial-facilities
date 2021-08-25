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
        this.getLiquorListbyYear('', '');
        this.getQuan_Huyen();
        this.date = null
        this.UpdatedDate = null
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
        const numRows = this.dataSource1.connect().value.length;
        return numSelected === numRows;
    }

    masterToggle() {
        this.isAllSelected() ?
            this.selection.clear() :
            this.dataSource1.connect().value.forEach(row => this.selection.select(row));
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

    public newdate = new FormControl(_moment());

    // ngAfterViewInit(): void {
    //     //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //     //Add 'implements AfterViewInit' to the class.
    //     this.accordion.openAll();
    // }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource1.filter = filterValue.trim().toLowerCase();
    }

    SanLuongBanRa: number;
    TriGiaBanRa: number;

    dataSource1: MatTableDataSource<LiquorList> = new MatTableDataSource<LiquorList>();
    LiquorList: Array<LiquorList> = new Array<LiquorList>();
    LiquorList1: Array<LiquorList> = new Array<LiquorList>();
    LiquorList2: Array<LiquorList> = new Array<LiquorList>();
    LiquorList3: Array<LiquorList> = new Array<LiquorList>();

    getLiquorListbyYear(year: string, year1: string) {
        this._Service.GetAllLiquorValue().subscribe(all => {
            this.LiquorList = all.data[0];
            this.LiquorList1 = all.data[1];
            this.LiquorList2 = this.LiquorList.map(x => {
                let temp = this.LiquorList1.filter(y => y.id_san_luong == x.id_ruou)

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

            this.LiquorList3 = this.LiquorList2
            this.LiquorList3.forEach(element => {
                if (element.ngay_het_han) {
                    element.is_het_han = element.ngay_het_han < this.getCurrentDate()
                }
                else {
                    element.is_het_han = false
                }
                element.ngay_cap = element.ngay_cap ? this.Convertdate(element.ngay_cap) : null
                element.ngay_het_han = element.ngay_het_han ? this.Convertdate(element.ngay_het_han) : null
            });

            this.dataSource1.data = this.LiquorList3

            this.SanLuongBanRa = this.dataSource1.data.length ? this.dataSource1.data.map(x => Number(x.so_luong)).reduce((a, b) => a + b) : 0;
            this.TriGiaBanRa = this.dataSource1.data.length ? this.dataSource1.data.map(x => Number(x.tri_gia)).reduce((a, b) => a + b) : 0;

            this.dataSource1.paginator = this.paginator;
            this.paginator._intl.itemsPerPageLabel = 'Số hàng';
            this.paginator._intl.firstPageLabel = "Trang Đầu";
            this.paginator._intl.lastPageLabel = "Trang Cuối";
            this.paginator._intl.previousPageLabel = "Trang Trước";
            this.paginator._intl.nextPageLabel = "Trang Tiếp";
        })
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
    //         this.router.createUrlTree(['specialized/commecial-management/domestic/add-petrol/' + id + '/' + mst]));
    //     window.open(url, "_blank");
    // }

    disabled1: boolean = false
    disabled2: boolean = false
    disabled3: boolean = false
    disabled4: boolean = false

    applyDistrictFilter(event) {
        let filteredData = [];

        event.value.forEach(element => {
            this.LiquorList3.filter(x => x.ten_quan_huyen.toLowerCase().includes(element.toLowerCase())).forEach(x => filteredData.push(x));
        });

        if (!filteredData.length) {
            if (event.value.length) {
                this.dataSource1.data = [];
                this.disabled2 = true
                this.disabled3 = true
                this.disabled4 = true
            }
            else {
                this.dataSource1.data = this.LiquorList3
                this.disabled2 = false
                this.disabled3 = false
                this.disabled4 = false
            }
        }
        else {
            this.dataSource1.data = filteredData;
            this.disabled2 = true
            this.disabled3 = true
            this.disabled4 = true
        }

        this.SanLuongBanRa = this.dataSource1.data.length ? this.dataSource1.data.map(x => Number(x.so_luong)).reduce((a, b) => a + b) : 0;
        this.TriGiaBanRa = this.dataSource1.data.length ? this.dataSource1.data.map(x => Number(x.tri_gia)).reduce((a, b) => a + b) : 0;
    }

    applyExpireCheck(event) {
        if (event.checked == false) {
            this.dataSource1.data = this.LiquorList3.filter(x => x.is_het_han == event.checked)
            this.disabled1 = false
            this.disabled3 = false
            this.disabled4 = false
        }
        else {
            this.dataSource1.data = this.LiquorList3.filter(x => x.is_het_han == event.checked)
            this.disabled1 = true
            this.disabled3 = true
            this.disabled4 = true
        }

        // this.SumPetrolStore2 = this.SumPetrolStore1.filter(x => x.is_het_han == event.checked)

        this.SanLuongBanRa = this.dataSource1.data.length ? this.dataSource1.data.map(x => Number(x.so_luong)).reduce((a, b) => a + b) : 0;
        this.TriGiaBanRa = this.dataSource1.data.length ? this.dataSource1.data.map(x => Number(x.tri_gia)).reduce((a, b) => a + b) : 0;
    }

    applyCerYear(event) {
        let filteredData = [];

        event.value.forEach(element => {
            this.LiquorList3.filter(x => this.convertyear(x.ngay_cap).includes(element)).forEach(x => filteredData.push(x));
        });

        if (!filteredData.length) {
            if (event.value.length) {
                this.dataSource1.data = [];
                this.disabled1 = true
                this.disabled2 = true
                this.disabled4 = true
            }
            else {
                this.dataSource1.data = this.LiquorList3
                this.disabled1 = false
                this.disabled2 = false
                this.disabled4 = false
            }
        }
        else {
            this.dataSource1.data = filteredData;
            this.disabled1 = true
            this.disabled2 = true
            this.disabled4 = true
        }

        this.SanLuongBanRa = this.dataSource1.data.length ? this.dataSource1.data.map(x => Number(x.so_luong)).reduce((a, b) => a + b) : 0;
        this.TriGiaBanRa = this.dataSource1.data.length ? this.dataSource1.data.map(x => Number(x.tri_gia)).reduce((a, b) => a + b) : 0;
    }

    applyUpdatedDate(event) {
        let filteredData = [];

        event.value.forEach(element => {
            this.LiquorList3.filter(x => x.time_id.toString().includes(element) && x.is_het_han == false).forEach(x => filteredData.push(x));
        });

        if (!filteredData.length) {
            if (event.value.length) {
                this.dataSource1.data = [];
                this.disabled1 = true
                this.disabled2 = true
                this.disabled3 = true
            }
            else {
                this.dataSource1.data = this.LiquorList3
                this.disabled1 = false
                this.disabled2 = false
                this.disabled3 = false
            }
        }
        else {
            this.dataSource1.data = filteredData;
            this.disabled1 = true
            this.disabled2 = true
            this.disabled3 = true
        }

        this.SanLuongBanRa = this.dataSource1.data.length ? this.dataSource1.data.map(x => Number(x.so_luong)).reduce((a, b) => a + b) : 0;
        this.TriGiaBanRa = this.dataSource1.data.length ? this.dataSource1.data.map(x => Number(x.tri_gia)).reduce((a, b) => a + b) : 0;
    }

    public getCurrentDate() {
        let date = new Date;
        return formatDate(date, 'yyyyMMdd', 'en-US');
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

    convertyear(text: string): string {
        let date: string
        date = text.substring(6, 11)
        return date
    }

    public date = new FormControl(_moment());
    public date1 = new FormControl(_moment());
    public date2 = new FormControl(_moment());
    public UpdatedDate = new FormControl(_moment());
    public theYear: number;
    public theYear1: number;

    public chosenYearHandler(normalizedYear: Moment, datepicker: MatDatepicker<Moment>) {
        this.date = this.date1
        const ctrlValue = this.date.value;
        ctrlValue.year(normalizedYear.year());
        this.date.setValue(ctrlValue);
        this.theYear = normalizedYear.year();
        datepicker.close();
        this.selection.clear();
        this.getLiquorListbyYear(this.theYear.toString(), this.theYear1 ? this.theYear1.toString() : '')
    }

    public chosenYearHandler1(normalizedYear: Moment, datepicker: MatDatepicker<Moment>) {
        this.UpdatedDate = this.date2
        const ctrlValue = this.UpdatedDate.value;
        ctrlValue.year(normalizedYear.year());
        this.UpdatedDate.setValue(ctrlValue);
        this.theYear1 = normalizedYear.year();
        datepicker.close();
        this.selection.clear();
        this.getLiquorListbyYear(this.theYear ? this.theYear.toString() : '', this.theYear1.toString())
    }

    public ExportTOExcel(filename: string, sheetname: string) {
        this.excelService.exportDomTableAsExcelFile(filename, sheetname, this.table.nativeElement);
    }

    type: string = 'Liquor'
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

}