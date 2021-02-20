import { Component, OnInit, Injectable, ElementRef, ViewChild, Injector } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { MatPaginator } from '@angular/material/paginator';
import { MatOption, MatSelect, MatTable, MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';

import { FormBuilder, FormControl, Validators } from '@angular/forms';

// Services
import { ExcelService } from 'src/app/_services/excelUtil.service';
import { InformationService } from 'src/app/shared/information/information.service';
import { ConfirmationDialogService } from 'src/app/shared/confirmation-dialog/confirmation-dialog.service';

export abstract class BaseComponent implements OnInit {

    @ViewChild(MatAccordion, { static: false }) accordion: MatAccordion;
    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
    @ViewChild('TABLE', { static: false }) table: ElementRef;

    protected excelService: ExcelService;
    protected _infor: InformationService;
    protected formBuilder: FormBuilder;
    protected confirmationDialogService: ConfirmationDialogService;

    public formData: any;
    public formParams: any;
    public view = 'list';
    public errorMessage: any;
    public dataSource = new MatTableDataSource();
    public filteredDataSource = new MatTableDataSource();
    public selection = new SelectionModel(true, []);
    
    constructor(injector: Injector) {
        this.excelService = injector.get(ExcelService);
        this._infor = injector.get(InformationService);
        this.formBuilder = injector.get(FormBuilder);
        this.confirmationDialogService = injector.get(ConfirmationDialogService);
    }

    ngOnInit() {
        this.autoOpen();
        this.initFormDatas();
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
        this.confirmationDialogService.confirm('Xác nhận', 'Bạn chắc chắn muốn xóa?', 'Đồng ý','Đóng')
        .then(confirm => {
          if (confirm) {
            // this.remove();
            return;
          }
        })
        .catch((err) => console.log('Hủy không thao tác: \n' + err));
    }

    public initFormDatas() {
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
        this.view = this.view == 'list' ? 'form': 'list';
    }

    // Currently cannot find this._infor
    public successNotify(response) {
        if (response.id == -1) {
          this._infor.msgError("Lưu lỗi! Lý do: " + response.message);
        }
        else {
          this._infor.msgSuccess("Dữ liệu được lưu thành công!");
          this.resetAll();
        }
    }

    public errorNotify(error) {
        this._infor.msgError("Không thể thực thi! Lý do: " + error.message);
    }

    public prepareData(data) {}

    public callService(data) {}

    public onCreate() {
        let data = this.formData.value;
        this.prepareData(data);    
        this.callService(data);
    }

    public clearTable(event) {
        event.preventDefault();
        this.formData.reset();
    }

    public switch2ListView(): void {
        this.formData.reset();
        this.switchView();
        this.autoOpen();
    }

    public resetAll(): void {
        this.formData.reset();
        this.switchView();
        this.ngOnInit();
    }

    public ExportTOExcel(filename: string, sheetname: string) {
        this.excelService.exportDomTableAsExcelFile(filename, sheetname, this.table.nativeElement);
    }
}