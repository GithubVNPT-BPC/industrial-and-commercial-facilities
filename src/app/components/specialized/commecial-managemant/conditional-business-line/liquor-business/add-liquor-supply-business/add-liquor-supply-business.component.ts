import { Component, ElementRef, OnInit, ViewChild, QueryList, ViewChildren } from '@angular/core';
import { MatOption, MatSelect, MatTable, MatTableDataSource } from '@angular/material';
import { formatDate } from '@angular/common';
import { NgForm, NumberValueAccessor } from '@angular/forms';
import { FormBuilder, FormGroup, FormArray, Validators } from "@angular/forms";
import { InformationService } from 'src/app/shared/information/information.service';
import { ActivatedRoute, Router } from "@angular/router";
import { SelectionModel } from '@angular/cdk/collections';
import { CommonFuntions } from 'src/app/components/specialized/commecial-managemant/conditional-business-line/common-functions.service';

import {
  DeleteModel,
  BusinessmanSelect,
  PostBusinessmanValue,
  LiquorList
} from 'src/app/_models/APIModel/conditional-business-line.model';
import { MatAccordion } from '@angular/material/expansion';
import { MatPaginator } from '@angular/material/paginator';

import { ExcelService } from 'src/app/_services/excelUtil.service';
import { ConditionBusinessService } from 'src/app/_services/APIService/Condition-Business.service';
import { SpecialDirective } from 'src/app/shared/special.directive';
import { KeyboardService } from 'src/app/shared/services/keyboard.service';

import { FormControl } from '@angular/forms';
import { MatDatepicker, MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import _moment from 'moment';
import { defaultFormat as _rollupMoment, Moment } from 'moment';
const moment = _rollupMoment || _moment;
export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-add-liquor-supply-business',
  templateUrl: './add-liquor-supply-business.component.html',
  styleUrls: ['../../../../special_layout.scss'],
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
export class AddLiquorSupplyBusinessComponent implements OnInit {
  displayedColumns: string[] = ['select', 'index', 'id', 'id_thuong_nhan', 'id_quan_ly', 'id_linh_vuc'];

  @ViewChild('table', { static: false }) table: ElementRef;
  @ViewChild(MatAccordion, { static: false }) accordion: MatAccordion;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChildren(SpecialDirective) inputs: QueryList<SpecialDirective>

  id: string;
  time: string;

  constructor(
    public excelService: ExcelService,
    public _Service: ConditionBusinessService,
    public formbuilder: FormBuilder,
    public _info: InformationService,
    public router: Router,
    public route: ActivatedRoute,
    public _keyboardservice: KeyboardService,
    public commonfunctions: CommonFuntions
  ) {
    this.route.params.subscribe((params) => {
      this.id = params["id"];
      this.time = params["time"];
    });
  }

  selection = new SelectionModel<PostBusinessmanValue>(true, []);

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

  checkboxLabel(row?: PostBusinessmanValue): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

  deletemodel1: Array<DeleteModel> = new Array<DeleteModel>();
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
      this._Service.DeleteBusinessmanValue(this.deletemodel1).subscribe(res => {
        this._info.msgSuccess('Xóa thành công')
        this.Back();
        this.selection.clear();
        this.paginator.pageIndex = 0;
      })
    }
  }

  Businessman: Array<BusinessmanSelect> = new Array<BusinessmanSelect>();

  GetBusinessman() {
    this._Service.GetBusinessman().subscribe((allrecords) => {
      this.Businessman = allrecords.data as BusinessmanSelect[];
    });
  }

  ngOnInit() {
    this._keyboardservice.keyBoard.subscribe(res => {
      this.move(res)
    })
    this.getBusinessmanvalue(this.time);
    this.GetBusinessman();
  }

  SaveData() {
    if (this.dataSource.data) {
      this._Service.PostBusinessmanValue(this.dataSource.data).subscribe(
        next => {
          if (next.id == -1) {
            this._info.msgError("Lưu lỗi! Lý do: " + next.message);
          }
          else {
            this._info.msgSuccess("Dữ liệu được lưu thành công!");
            this.Back();
          }
        },
        error => {
          this._info.msgError("Không thể thực thi! Lý do: " + error.message);
        }
      );
    }
  }

  dataSource: MatTableDataSource<PostBusinessmanValue> = new MatTableDataSource<PostBusinessmanValue>();
  businessmanvalue: Array<LiquorList> = new Array<LiquorList>();
  businessmanvalue1: Array<LiquorList> = new Array<LiquorList>();

  getBusinessmanvalue(time: string) {
    this._Service.GetTobaccoValue(time).subscribe(all => {

      this.businessmanvalue = all.data[1]
      this.businessmanvalue1 = this.businessmanvalue.filter(x => x.id_san_luong == this.id)

      this.businessmanvalue1.forEach(x => {
        this.dataSource.data.push({
          id_linh_vuc: 8,
          id: '',
          id_quan_ly: '',
          id_thuong_nhan: ''
        })
      })

      if (this.id == 'undefined') {
        this.id = null
      }

      for (let index = 0; index < this.businessmanvalue1.length; index++) {
        this.dataSource.data[index].id_thuong_nhan = this.businessmanvalue1[index].id_thuong_nhan ? this.businessmanvalue1[index].id_thuong_nhan : null
        this.dataSource.data[index].id_quan_ly = this.id
        this.dataSource.data[index].id = this.businessmanvalue1[index].id ? this.businessmanvalue1[index].id : null
      }

      this.dataSource.paginator = this.paginator;
      this.paginator._intl.itemsPerPageLabel = 'Số hàng';
      this.paginator._intl.firstPageLabel = "Trang Đầu";
      this.paginator._intl.lastPageLabel = "Trang Cuối";
      this.paginator._intl.previousPageLabel = "Trang Trước";
      this.paginator._intl.nextPageLabel = "Trang Tiếp";
    })
  }

  public _currentRow: number = 0;

  addRow(): void {
    let newRow: PostBusinessmanValue = new PostBusinessmanValue();
    newRow.id_quan_ly = this.id;
    newRow.id_linh_vuc = 8;
    this.dataSource.data.push(newRow);
    this.dataSource = new MatTableDataSource(this.dataSource.data);

    this._rows = this.dataSource.filteredData.length;
  }

  insertRow(): void {
    let data = this.dataSource.data.slice(this._currentRow);
    this.dataSource.data.splice(this._currentRow, this.dataSource.data.length - this._currentRow + 1);
    let newRow: PostBusinessmanValue = new PostBusinessmanValue();
    newRow.id_quan_ly = this.id;
    newRow.id_linh_vuc = 8;
    this.dataSource.data.push(newRow);
    data.forEach(element => {
      this.dataSource.data.push(element);
    });
    this.dataSource = new MatTableDataSource(this.dataSource.data);

    this._rows = this.dataSource.data.length
  }

  deleteRow(): void {
    this.dataSource.data.splice(this._currentRow, 1);
    this.dataSource = new MatTableDataSource(this.dataSource.data);

    this._rows = this.dataSource.data.length
  }

  getCurrentDate() {
    let date = new Date;
    return formatDate(date, 'yyyy-MM-dd', 'en-US');
  }

  getCurrentYear() {
    let date = new Date;
    return formatDate(date, 'yyyy', 'en-US');
  }

  public changeRow(index: number) {
    this._currentRow = index;
  }

  public _rows: number = 0;
  public columns: number = 1;

  public move(object) {
    const inputToArray = this.inputs.toArray()
    let index = inputToArray.findIndex(x => x.element == object.element);
    switch (object.action) {
      case "UP":
        index -= this.columns;
        break;
      case "DOWN":
        index += this.columns;
        break;
      case "LEFT":
        index -= this._rows;
        break;
      case "RIGHT":
        index += this._rows;
        break;
    }
    if (index >= 0 && index < this.inputs.length) {
      inputToArray[index].element.nativeElement.focus();
    }
  }

  Back() {
    this.router.navigate(['specialized/commecial-management/domestic/liquor']);
  }
}
