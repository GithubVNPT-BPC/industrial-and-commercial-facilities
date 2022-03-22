import { OnInit, ElementRef, ViewChild, Injector } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { MatPaginator } from '@angular/material/paginator';
import { MatOption, MatSelect, MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { FormBuilder } from '@angular/forms';

// Services
import { ExcelService } from 'src/app/_services/excelUtil.service';
import { InformationService } from 'src/app/shared/information/information.service';
import { ConfirmationDialogService } from 'src/app/shared/confirmation-dialog/confirmation-dialog.service';
import { DistrictModel, SubDistrictModel, DistrictWardModel } from 'src/app/_models/APIModel/domestic-market.model';
import { SCTService } from 'src/app/_services/APIService/sct.service';

import { LinkModel } from 'src/app/_models/link.model';
import { BreadCrumService } from 'src/app/_services/injectable-service/breadcrums.service';

import moment from 'moment';

export abstract class AbstractBaseComponent implements OnInit {

    @ViewChild(MatAccordion, { static: false }) accordion: MatAccordion;
    @ViewChild(MatPaginator, undefined) paginator: MatPaginator;
    @ViewChild('TABLE', { static: false }) table: ElementRef;

    protected _linkOutput: LinkModel = new LinkModel();
    //Constant
    LINK_DEFAULT: string = "";
    TITLE_DEFAULT: string = "";
    TEXT_DEFAULT: string = "";
    EXCEL_NAME: string = "Sở công thương";

    protected sctService: SCTService;
    protected excelService: ExcelService;
    protected logger: InformationService;
    protected formBuilder: FormBuilder;
    protected confirmationDialogService: ConfirmationDialogService;
    protected _breadCrumService: BreadCrumService;

    public dataSource = new MatTableDataSource();
    public filteredDataSource = new MatTableDataSource();
    public selection = new SelectionModel(true, []);

    public formData: any;
    public formParams: any;
    public view = 'list';
    public mode = 'create';
    
    public readonly dateFormat = 'YYYY/MM/DD';
    public currentTime = moment();
    public currentYear = new Date().getFullYear();
    public currentMonth = parseInt(moment().format('MM'));
    // public currentYearAndMonth = this.currentYear.toString() + (this.currentMonth >= 10 ? this.currentMonth.toString() : '0' + this.currentMonth.toString());
    public monthSelection: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    public yearSelection = Array(10).fill(1).map((element, index) => new Date().getFullYear() - index);
    public terms = [{id: 6, value: '6 Tháng'}, {id: 12, value: '1 Năm'}];

    public displayedColumns = ['select', 'index'];
    public displayedFields = {};
    public filterModel = {};
    public formPrevData = {};
    
    public districts: DistrictModel[] = [];
    public wards: SubDistrictModel[] = [];
    public districtWards: DistrictWardModel[] = [];
    public filteredDistrictWards = [];
    public districtWardSorted = {};

    constructor(injector: Injector) {
        this.excelService = injector.get(ExcelService);
        this.logger = injector.get(InformationService);
        this.formBuilder = injector.get(FormBuilder);
        this.confirmationDialogService = injector.get(ConfirmationDialogService);
        this.sctService = injector.get(SCTService);
        this._breadCrumService = injector.get(BreadCrumService);
    }

    ngOnInit() {
        this.autoOpen();
        this.initListView();
        this.initFormView();
        this.initFilters();
        this.initDistricts();
        this.getLinkDefault();
        this.sendLinkToNext(true);
    }

    protected initListView() {
        // In case we have already declared all field in displayed Columns
        if (this.displayedColumns.length == 2 && Object.keys(this.displayedFields).length > 0) {
            this.displayedColumns = this.displayedColumns.concat(Object.keys(this.displayedFields));
        }
    }

    protected initFormView() {
        let datas = this.getFormParams();
        this.formData = this.formBuilder.group(datas);
    }

    public initFilters() {
        for (var key of Object.keys(this.filterModel)) {
            this.filterModel[key] = [];
        }
    }

    public setFormParams() {}


    public getFormParams() {
        return {};
    }

    public autoOpen() {
        setTimeout(() => {
            if (this.accordion) this.accordion.openAll()}
        , 1000);
    }
    public ExportTOExcel(filename, sheetname) {
        this.excelService.exportDomTableAsExcelFile(filename, sheetname, this.table.nativeElement);
    }

    public ExportToExcel(all=false) {
        if (all) {
            let self = this;
            let dataSource = this.dataSource.data;
            let datas = [];
            dataSource.forEach(function (record: Object) {
                let data = {};
                for (let k in record) {
                    if (self.displayedFields[k]) data[self.displayedFields[k]] = record[k];
                }
                datas.push(data);
            });
            this.excelService.exportJsonAsExcelFile(this.EXCEL_NAME, this.EXCEL_NAME, datas);
        } else {
            this.excelService.exportDomTableAsExcelFile(this.EXCEL_NAME, this.EXCEL_NAME, this.table.nativeElement);
        }
    }

    @ViewChild('dSelect', { static: false }) dSelect: MatSelect;
    allSelected = false;
    toggleAllSelection() {
        this.allSelected = !this.allSelected;  // to control select-unselect

        if (this.allSelected) {
            this.dSelect.options.forEach((item: MatOption) => item.select());
        } else {
            this.dSelect.options.forEach((item: MatOption) => item.deselect());
        }
        this.dSelect.close();
    }

    public isAllSelected() {
        let numSelected = this.selection.selected.length;
        let numRows = this.dataSource.data.length;
        return numSelected === numRows;
    }

    //Event check
    public masterToggle() {
        this.isAllSelected() ?
            this.selection.clear() :
            this.dataSource.data.forEach(row => this.selection.select(row));
    }
    //Event check item
    public checkboxLabel(row): string {

        if (!row) {
            return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
        }
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
    }

    public initDistricts() {
        this.sctService.LayDanhSachQuanHuyen().subscribe(res => {
            if (res['success'])
                this.districts = res['data'];
        })
    }

    public initWards(){
        this.sctService.LayDanhSachPhuongXa().subscribe(res => {
            if(res['success'])
                this.wards = res['data'];
        })
    }

    public initDistrictWard(sorted=true) {
        this.sctService.LayDanhSachPhuongXaQuanHuyen().subscribe(res => {
            if(res['success']) {
                let districtWardData = res['data'];
                this.districtWards = districtWardData;
                this.filteredDistrictWards = districtWardData.slice()
                if (sorted) {
                    districtWardData.forEach(x => {
                        if (!this.districtWardSorted[x.ten_quan_huyen]) {
                            this.districtWardSorted[x.ten_quan_huyen] = [{
                                id_phuong_xa: x.id_phuong_xa,
                                ten_phuong_xa: x.ten_phuong_xa,
                            }];
                        } else {
                            this.districtWardSorted[x.ten_quan_huyen].push({
                                id_phuong_xa: x.id_phuong_xa,
                                ten_phuong_xa: x.ten_phuong_xa,
                            })
                        }
                    });
                }
            }   
        })
    }

    getLinkDefault(){}

    public sendLinkToNext(type: boolean) {
        this._linkOutput.link = this.LINK_DEFAULT;
        this._linkOutput.title = this.TITLE_DEFAULT;
        this._linkOutput.text = this.TEXT_DEFAULT;
        this._linkOutput.type = type;
        this._breadCrumService.sendLink(this._linkOutput);
    }

    remove(){}

    protected formatDate(date) {
        let formattedDate = moment(date, this.dateFormat);
        return formattedDate.isValid() ? formattedDate : "";
    }
   
}