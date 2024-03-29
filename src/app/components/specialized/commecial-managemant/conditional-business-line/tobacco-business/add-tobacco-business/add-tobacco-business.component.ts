import { Component, ElementRef, OnInit, ViewChild, QueryList, ViewChildren } from '@angular/core';
import { MatOption, MatSelect, MatTable, MatTableDataSource } from '@angular/material';
import { NgForm, NumberValueAccessor } from '@angular/forms';
import { FormBuilder, FormGroup, FormArray, Validators } from "@angular/forms";
import { InformationService } from 'src/app/shared/information/information.service';
import { ActivatedRoute, Router } from "@angular/router";
import { CommonFuntions } from 'src/app/components/specialized/commecial-managemant/conditional-business-line/common-functions.service';
import { formatDate } from '@angular/common';
import { SelectionModel } from '@angular/cdk/collections';

import {
  DistrictModel,
  SubDistrictModel,
  CertificateModel,
  TobaccoPost,
  TobaccoList,
  Status,
  PostBusinessmanValue,
  BusinessmanSelect,
  DeleteModel,
  TobaccoPostNEW
} from 'src/app/_models/APIModel/conditional-business-line.model';
import { MatAccordion } from '@angular/material/expansion';
import { MatPaginator } from '@angular/material/paginator';

import { FormControl } from '@angular/forms';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { ExcelService } from 'src/app/_services/excelUtil.service';
import { ConditionBusinessService } from 'src/app/_services/APIService/Condition-Business.service';
import { SpecialDirective } from 'src/app/shared/special.directive';
import { KeyboardService } from 'src/app/shared/services/keyboard.service';

import { MatDatepicker, MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import _moment from 'moment';
import { defaultFormat as _rollupMoment, Moment } from 'moment';
import { PostTopProduct } from 'src/app/_models/APIModel/domestic-market.model';
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
  selector: 'app-add-tobacco-business',
  templateUrl: './add-tobacco-business.component.html',
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
export class AddTobaccoBusinessComponent implements OnInit {
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
    public route: ActivatedRoute
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

  businessman: Array<BusinessmanSelect> = new Array<BusinessmanSelect>();
  public filterbusinessman: ReplaySubject<BusinessmanSelect[]> = new ReplaySubject<BusinessmanSelect[]>(1);
  GetBusinessman() {
    this._Service.GetBusinessman().subscribe((allrecords) => {
      this.businessman = allrecords.data.filter(x => x.id_linh_vuc == 7) as BusinessmanSelect[];
      this.filterbusinessman.next(this.businessman.slice());
    });
  }
  public thuongnhanfilter: FormControl = new FormControl();
  public filterThuongnhan() {
    if (!this.businessman) {
      return;
    }
    let search = this.thuongnhanfilter.value;
    if (!search) {
      this.filterbusinessman.next(this.businessman.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filterbusinessman.next(
      this.businessman.filter(x => x.ten_thuong_nhan.toLowerCase().indexOf(search) > -1)
    );
  }

  dataSource: MatTableDataSource<PostBusinessmanValue> = new MatTableDataSource<PostBusinessmanValue>();
  businessmanvalue: Array<TobaccoList> = new Array<TobaccoList>();
  getBusinessmanvalue(time: string) {
    this._Service.GetTobaccoValue(time).subscribe(all => {

      this.businessmanvalue = all.data[1].filter(x => x.id_san_luong == this.id)

      this.businessmanvalue.forEach(x => {
        this.dataSource.data.push({
          id_linh_vuc: 7,
          id: '',
          id_quan_ly: null,
          id_thuong_nhan: ''
        })
      })

      for (let index = 0; index < this.businessmanvalue.length; index++) {
        this.dataSource.data[index].id_thuong_nhan = this.businessmanvalue[index].id_thuong_nhan ? this.businessmanvalue[index].id_thuong_nhan : null
        this.dataSource.data[index].id_quan_ly = parseInt(this.id)
        this.dataSource.data[index].id = this.businessmanvalue[index].id ? this.businessmanvalue[index].id : null
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

  // addRow(): void {
  //   let newRow: PostBusinessmanValue = new PostBusinessmanValue();
  //   if (this.id != 'undefined') {
  //     newRow.id_quan_ly = parseInt(this.id)
  //   }
  //   else {
  //     newRow.id_quan_ly = 0;
  //   }
  //   newRow.id_linh_vuc = 7;
  //   this.dataSource.data.push(newRow);
  //   this.dataSource = new MatTableDataSource(this.dataSource.data);

  //   this._rows = this.dataSource.filteredData.length;
  // }

  insertRow(): void {
    let data = this.dataSource.data.slice(this._currentRow);
    this.dataSource.data.splice(this._currentRow, this.dataSource.data.length - this._currentRow + 1);
    let newRow: PostBusinessmanValue = new PostBusinessmanValue();
    if (this.id != 'undefined') {
      newRow.id_quan_ly = parseInt(this.id)
    }
    else {
      newRow.id_quan_ly = 0;
    }
    newRow.id_linh_vuc = 7;
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

  subdistrict: Array<SubDistrictModel> = new Array<SubDistrictModel>();
  district: Array<DistrictModel> = new Array<DistrictModel>();
  Certificate: Array<CertificateModel> = new Array<CertificateModel>();

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

  resetForm(form?: NgForm) {
    if (form != null)
      form.form.reset();
    this._Service.tobacco = {
      id: null,
      mst: '',
      so_luong: null,
      tri_gia: null,
      time_id: '',
      ghi_chu: '',
      id_tinh_trang_hoat_dong: 1
    }
  }

  tobacco_data: FormGroup;
  TobaccoList: Array<TobaccoList> = new Array<TobaccoList>();
  TobaccoList1: Array<TobaccoList> = new Array<TobaccoList>();
  tobaccoobject = new TobaccoList();

  getTobaccoList() {
    this._Service.GetAllTobaccoValue().subscribe(all => {
      this.TobaccoList = all.data[0];
      this.TobaccoList1 = this.TobaccoList.filter(x => x.id_thuoc_la == this.id)
      this.tobaccoobject = this.TobaccoList1[0]

      this._Service.tobacco = {
        id: this.id,
        mst: this.tobaccoobject.mst,
        so_luong: this.tobaccoobject.so_luong,
        tri_gia: this.tobaccoobject.tri_gia,
        time_id: this.tobaccoobject.time_id,
        ghi_chu: this.tobaccoobject.ghi_chu,
        id_tinh_trang_hoat_dong: this.tobaccoobject.id_tinh_trang_hoat_dong
      }
    })
  }

  @ViewChild('selectpicker', { static: false }) selectPicker: ElementRef;

  ngOnInit() {
    this.resetForm();
    this.getQuan_Huyen();
    this.GetAllPhuongXa();
    this.getTobaccoList()
    this.getBusinessmanvalue(this.time)
    this.GetBusinessman()

    this.tobacco_data = this.formbuilder.group({
      id: null,
      mst: '',
      so_luong: null,
      tri_gia: null,
      time_id: '',
      ghi_chu: '',
      id_tinh_trang_hoat_dong: 1
    })

    this.thuongnhanfilter.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterThuongnhan();
      });
  }

  public _onDestroy = new Subject<void>();

  SaveData(input, input1) {
    if (this.id != 'undefined') {
      this._Service.PostTobacco(input).subscribe(
        res => {
          this._info.msgSuccess("Lưu thông tin thành công")
        },
        err => {
          this._info.msgError("Lưu thông tin không thành công")
        }
      )

      if (this.dataSource.data) {
        this._Service.PostBusinessmanValue(this.dataSource.data).subscribe(
          next => {
            this._info.msgSuccess("Lưu thông tin thành công");
            this.Back()
          },
          error => {
            this._info.msgError("Lưu thông tin không thành công");
          }
        );
      }
    }
    else {
      this._Service.PostTobaccoValueNEW(input1).subscribe(
        next => {
          this._info.msgSuccess("Lưu thông tin thành công");
          this.Back()
        },
        error => {
          this._info.msgError("Lưu thông tin không thành công");
        }
      );
    }
  }

  trangthai: Array<Status> = [
    {
      id_tinh_trang_hoat_dong: 1,
      tinh_trang_hoat_dong: 'Hoạt động'
    },
    {
      id_tinh_trang_hoat_dong: 2,
      tinh_trang_hoat_dong: 'Ngừng hoạt động'
    },
    {
      id_tinh_trang_hoat_dong: 3,
      tinh_trang_hoat_dong: 'Cho thuê lại'
    }
  ]

  input: Array<TobaccoPost> = new Array<TobaccoPost>();
  input1: Array<TobaccoPostNEW> = new Array<TobaccoPostNEW>();
  onSubmit() {
    this.input.push({
      id: this.id,
      mst: '',
      so_luong: null,
      tri_gia: null,
      time_id: '',
      ghi_chu: '',
      id_tinh_trang_hoat_dong: null
    })

    this.input[0].mst = this.tobacco_data.value.mst
    this.input[0].so_luong = this.tobacco_data.value.so_luong
    this.input[0].tri_gia = this.tobacco_data.value.tri_gia
    this.input[0].time_id = this.tobacco_data.value.time_id
    this.input[0].ghi_chu = this.tobacco_data.value.ghi_chu
    this.input[0].id_tinh_trang_hoat_dong = this.tobacco_data.value.id_tinh_trang_hoat_dong

    this.input1.push({
      id: null,
      mst: '',
      so_luong: null,
      tri_gia: null,
      time_id: '',
      ghi_chu: '',
      id_tinh_trang_hoat_dong: null,
      danh_sach_thuong_nhan: []
    })

    this.input1[0].mst = this.tobacco_data.value.mst
    this.input1[0].so_luong = this.tobacco_data.value.so_luong
    this.input1[0].tri_gia = this.tobacco_data.value.tri_gia
    this.input1[0].time_id = this.tobacco_data.value.time_id
    this.input1[0].ghi_chu = this.tobacco_data.value.ghi_chu
    this.input1[0].id_tinh_trang_hoat_dong = this.tobacco_data.value.id_tinh_trang_hoat_dong
    this.input1[0].danh_sach_thuong_nhan = this.dataSource.data

    this.SaveData(this.input, this.input1[0]);
  }

  public exportTOExcel(filename: string, sheetname: string) {
    this.excelService.exportDomTableAsExcelFile(filename, sheetname, this.table.nativeElement);
  }

  Back() {
    this.router.navigate(['specialized/commecial-management/domestic/tobacco']);
  }

}
