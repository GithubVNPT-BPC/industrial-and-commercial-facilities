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

export abstract class BaseComponent implements OnInit {

    @ViewChild(MatAccordion, { static: false }) accordion: MatAccordion;
    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
    @ViewChild('TABLE', { static: false }) table: ElementRef;

    protected _linkOutput: LinkModel = new LinkModel();
    //Constant
    protected LINK_DEFAULT: string = "";
    protected TITLE_DEFAULT: string = "";
    protected TEXT_DEFAULT: string = "";

    protected sctService: SCTService;
    protected excelService: ExcelService;
    protected logger: InformationService;
    protected formBuilder: FormBuilder;
    protected formBuilder1: FormBuilder;
    protected confirmationDialogService: ConfirmationDialogService;
    protected _breadCrumService: BreadCrumService;

    public formData: any;
    public formParams: any;
    public view = 'list';
    public mode = 'create';
    public errorMessage: any;
    public currentYear = new Date().getFullYear();
    public yearSelection = Array(10).fill(1).map((element, index) => new Date().getFullYear() + 5 - index);
    public terms = [
        {id: 6, value: '6 Tháng'}, 
        {id: 12, value: '1 Năm'}
    ];
    public dataSource = new MatTableDataSource();
    public filteredDataSource = new MatTableDataSource();
    public selection = new SelectionModel(true, []);

    public readonly dateFormat = 'YYYY/MM/DD';

    public displayedColumns = ['select', 'index'];
    public displayedFields = {};
    public filterModel = {}
    
    public districts: DistrictModel[] = [];
    public wards: SubDistrictModel[] = [];
    public districtWards: DistrictWardModel[] = [];
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
        this.initDistricts();
        this.getLinkDefault();
        this.sendLinkToNext(true);
    }

    protected initListView() {
        // In case we have already declared all field in displayed Columns
        if (this.displayedColumns.length == 2 && Object.keys(this.displayedFields).length > 0) {
            this.displayedColumns = this.displayedColumns.concat(Object.keys(this.displayedFields));
            // console.log(this.displayedColumns)
        }
    }

    protected initFormView() {
        let datas = this.getFormParams();
        this.formData = this.formBuilder.group(datas);
    }

    public getFormParams() {
        return {};
    }

    public autoOpen() {
        setTimeout(() => this.accordion.openAll(), 1000);
    }

    public switchView() {
        if (this.view == 'list') {
            this.view = 'form';
        } else {
            this.view = 'list';
            this.mode = 'create';
            this.formData.reset();
            this.selection.clear();
            this.autoOpen();
        }
    }

    public switchEditMode() {
        this.mode = 'edit';
        this.switchView();
        this.setFormParams();
    }

    public setFormParams() {}

    public prepareData(data) { return data }

    public callService(data) { }

    public callEditService(data) {}

    public onCreate() {
        // Must change to async function
        let data = this.formData.value;
        data = this.prepareData(data);
        if (this.mode == 'edit') this.callEditService(data);
        else this.callService(data);
    }

    prepareRemoveData(data) { return data }

    callRemoveService(data) {}

    public onRemove() {
        // Must change to async function
        let data = this.selection.selected;
        data = this.prepareRemoveData(data);
        this.callRemoveService(data);
        this.resetAll();
    }

    public clearTable(event) {
        event.preventDefault();
        this.formData.reset();
    }

    public resetAll(): void {
        this.formData.reset();
        if (this.view == 'form') this.switchView();
        this.selection.clear();
        this.ngOnInit();
    }

    public ExportTOExcel(filename: string, sheetname: string) {
        this.excelService.exportDomTableAsExcelFile(filename, sheetname, this.table.nativeElement);
    }

    public successNotify(response) {
        if (response.id == -1) {
            this.logger.msgError("Lưu lỗi! Lý do: " + response.message);
        }
        else {
            this.logger.msgSuccess("Dữ liệu được lưu thành công!");
            this.resetAll();
        }
    }

    public errorNotify(error) {
        this.logger.msgError("Không thể thực thi! Lý do: \n" + error);
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

    public openRemoveDialog() {
        let self = this;
        this.confirmationDialogService.confirm('Xác nhận', 'Bạn chắc chắn muốn xóa?', 'Đồng ý', 'Đóng')
            .then(confirm => {
                if (confirm) {
                    self.onRemove();
                    return;
                }
            })
            .catch((err) => console.log('Hủy không thao tác: \n' + err));
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

    paginatorAgain() {
        this.paginator._intl.itemsPerPageLabel = "Số hàng";
        this.paginator._intl.firstPageLabel = "Trang Đầu";
        this.paginator._intl.lastPageLabel = "Trang Cuối";
        this.paginator._intl.previousPageLabel = "Trang Trước";
        this.paginator._intl.nextPageLabel = "Trang Tiếp";
        this.filteredDataSource.paginator = this.paginator;
    }

    autopaging(){
        setTimeout(() => {
            this.paginatorAgain();
        }, 1000);
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
}