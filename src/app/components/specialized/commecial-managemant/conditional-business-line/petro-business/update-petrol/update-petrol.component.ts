import { Component, ElementRef, OnInit, ViewChild, QueryList, ViewChildren } from '@angular/core';
import { MatOption, MatSelect, MatTable, MatTableDataSource } from '@angular/material';
import { NgForm, NumberValueAccessor } from '@angular/forms';
import { FormBuilder, FormGroup, FormArray, Validators } from "@angular/forms";
import { InformationService } from 'src/app/shared/information/information.service';
import { ActivatedRoute, Router } from "@angular/router";
import { SelectionModel } from '@angular/cdk/collections';
import { CommonFuntions } from 'src/app/components/specialized/commecial-managemant/conditional-business-line/common-functions.service';

import {
  PetrolList,
  PetrolPost,
  PetrolValuePost,
  DeleteModel,
  Status,
  PostBusinessmanValue,
  BusinessmanSelect,
  StoreSelect,
  PetrolValuePostNEW
} from 'src/app/_models/APIModel/conditional-business-line.model';
import { MatAccordion } from '@angular/material/expansion';
import { MatPaginator } from '@angular/material/paginator';

import { ExcelService } from 'src/app/_services/excelUtil.service';
import { ConditionBusinessService } from 'src/app/_services/APIService/Condition-Business.service';
import { SpecialDirective } from 'src/app/shared/special.directive';
import { KeyboardService } from 'src/app/shared/services/keyboard.service';

import { FormControl } from '@angular/forms';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

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
  selector: 'app-update-petrol',
  templateUrl: './update-petrol.component.html',
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
export class UpdatePetrolComponent implements OnInit {
  displayedColumns: string[] = ['select', 'index', 'id', 'id_thuong_nhan', 'id_quan_ly', 'id_linh_vuc'];

  @ViewChild('table', { static: false }) table: ElementRef;
  @ViewChild(MatAccordion, { static: false }) accordion: MatAccordion;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChildren(SpecialDirective) inputs: QueryList<SpecialDirective>

  id: number;
  mst: string;
  years: any[] = [];
  time: string;
  id_san_luong: string;

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
      this.mst = params["mst"];
      this.time = params["time"]
      this.id_san_luong = params["id_san_luong"]
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
      this.businessman = allrecords.data.filter(x => x.id_linh_vuc == 6) as BusinessmanSelect[];
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

  petrolstore: Array<StoreSelect> = new Array<StoreSelect>();
  public filterpetrolstore: ReplaySubject<StoreSelect[]> = new ReplaySubject<StoreSelect[]>(1);
  GetStore() {
    this._Service.GetAllPetrolStore().subscribe((all) => {
      this.petrolstore = all.data as StoreSelect[];
      this.filterpetrolstore.next(this.petrolstore.slice());
    })
  }
  public cuahangfilter: FormControl = new FormControl();
  public filterCuahang() {
    if (!this.petrolstore) {
      return;
    }
    let search = this.cuahangfilter.value;
    if (!search) {
      this.filterpetrolstore.next(this.petrolstore.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filterpetrolstore.next(
      this.petrolstore.filter(x => x.storeselect.toLowerCase().indexOf(search) > -1)
    );
  }

  dataSource: MatTableDataSource<PostBusinessmanValue> = new MatTableDataSource<PostBusinessmanValue>();
  businessmanvalue: Array<PetrolList> = new Array<PetrolList>();

  getBusinessmanvalue() {
    this._Service.GetAllPetrolValue().subscribe(all => {
      this.businessmanvalue = all.data[1].filter(x => x.id_san_luong == this.id_san_luong)

      this.businessmanvalue.forEach(x => {
        this.dataSource.data.push({
          id_linh_vuc: 6,
          id: '',
          id_quan_ly: 0,
          id_thuong_nhan: ''
        })
      })

      for (let index = 0; index < this.businessmanvalue.length; index++) {
        this.dataSource.data[index].id_thuong_nhan = this.businessmanvalue[index].id_thuong_nhan ? this.businessmanvalue[index].id_thuong_nhan : null
        this.dataSource.data[index].id_quan_ly = parseInt(this.businessmanvalue[index].id_san_luong) ? parseInt(this.businessmanvalue[index].id_san_luong) : null
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

  resetForm(form?: NgForm) {
    if (form != null)
      form.form.reset();
    this._Service.petrol = {
      id_cua_hang_xang_dau: null,
      ten_cua_hang: '',
      mst: '',
      dia_chi: '',
      id_phuong_xa: 25195,
      so_dien_thoai: '',
      id_tinh_trang_hoat_dong: 1,
      ten_quan_ly: '',
      ten_nhan_vien: '',
      id_giay_phep: 0,
      san_luong: null,
      ghi_chu: '',
      time_id: ''
    }
  }

  petrol_data: FormGroup;

  ngOnInit() {
    this._keyboardservice.keyBoard.subscribe(res => {
      this.move(res)
    })
    this.resetForm();
    this.getPetrolInfo();
    this.getBusinessmanvalue();
    this.GetBusinessman();
    this.GetStore();

    this.petrol_data = this.formbuilder.group({
      id_cua_hang_xang_dau: null,
      ten_cua_hang: '',
      mst: '',
      dia_chi: '',
      id_phuong_xa: 25195,
      so_dien_thoai: '',
      id_tinh_trang_hoat_dong: 1,
      ten_quan_ly: '',
      ten_nhan_vien: '',
      id_giay_phep: 0,
      ghi_chu: '',
      san_luong: null,
      time_id: ''
    })

    this.years = this.commonfunctions.getYears()

    this.thuongnhanfilter.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterThuongnhan();
      });

    this.cuahangfilter.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterCuahang();
      });
  }

  public _onDestroy = new Subject<void>();

  SaveData(input1, input2) {
    if (this.id.toString() != 'undefined') {
      this._Service.PostPetrolValue(input1).subscribe(
        next => {
          this._info.msgSuccess("Lưu thông tin thành công");
        },
        error => {
          this._info.msgError("Lưu thông tin không thành công");
        }
      );

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
      this._Service.PostPetrolValueNEW(input2).subscribe(
        next => {
          this._info.msgSuccess("Lưu thông tin thành công");
          this.Back();
        },
        error => {
          this._info.msgError("Lưu thông tin không thành công");
        }
      );
    }
  }

  petrolvaluepost: Array<PetrolValuePost> = new Array<PetrolValuePost>();
  petrolvaluepost1: Array<PetrolValuePostNEW> = new Array<PetrolValuePostNEW>();

  input: PetrolPost
  onSubmit() {

    this.input = this.petrol_data.value

    this.petrolvaluepost.push({
      ghi_chu: '',
      san_luong: null,
      time_id: '',
      id: null,
      id_cua_hang_xang_dau: null,
    })

    this.petrolvaluepost[0].time_id = this.input.time_id
    this.petrolvaluepost[0].ghi_chu = this.input.ghi_chu
    this.petrolvaluepost[0].san_luong = this.input.san_luong
    this.petrolvaluepost[0].id_cua_hang_xang_dau = this.input.id_cua_hang_xang_dau
    if (this.id_san_luong != 'undefined') {
      this.petrolvaluepost[0].id = this.id_san_luong
    }

    this.petrolvaluepost1.push({
      ghi_chu: '',
      san_luong: null,
      time_id: '',
      id: null,
      id_cua_hang_xang_dau: null,
      danh_sach_thuong_nhan: []
    })

    this.petrolvaluepost1[0].time_id = this.input.time_id
    this.petrolvaluepost1[0].ghi_chu = this.input.ghi_chu
    this.petrolvaluepost1[0].san_luong = this.input.san_luong
    this.petrolvaluepost1[0].id_cua_hang_xang_dau = this.input.id_cua_hang_xang_dau
    if (this.id_san_luong != 'undefined') {
      this.petrolvaluepost1[0].id = this.id_san_luong
    }
    this.petrolvaluepost1[0].danh_sach_thuong_nhan = this.dataSource.data

    this.SaveData(this.petrolvaluepost, this.petrolvaluepost1[0]);
  }

  petrolobject = new PetrolList();
  getPetrolInfo() {
    this._Service.GetAllPetrolValue().subscribe(all => {
      let temp = all.data[0].filter(x => x.id_san_luong == this.id_san_luong)
      this.petrolobject = temp[0]

      this._Service.petrol = {
        id_cua_hang_xang_dau: this.petrolobject.id_cua_hang_xang_dau,
        ten_cua_hang: this.petrolobject.ten_cua_hang,
        mst: this.petrolobject.mst,
        dia_chi: this.petrolobject.dia_chi,
        id_phuong_xa: this.petrolobject.id_phuong_xa,
        so_dien_thoai: this.petrolobject.so_dien_thoai,
        id_tinh_trang_hoat_dong: this.petrolobject.id_tinh_trang_hoat_dong,
        ten_quan_ly: this.petrolobject.ten_quan_ly,
        ten_nhan_vien: this.petrolobject.ten_nhan_vien,
        id_giay_phep: this.petrolobject.id_giay_phep,
        time_id: this.petrolobject.time_id,
        ghi_chu: this.petrolobject.ghi_chu,
        san_luong: this.petrolobject.san_luong
      }
    })
  }

  public _currentRow: number = 0;

  // addRow(): void {
  //   let newRow: PostBusinessmanValue = new PostBusinessmanValue();
  //   if (this.id_san_luong != 'undefined') {
  //     newRow.id_quan_ly = parseInt(this.id_san_luong)
  //   }
  //   else {
  //     newRow.id_quan_ly = 0;
  //   }
  //   newRow.id_linh_vuc = 6;
  //   this.dataSource.data.push(newRow);
  //   this.dataSource = new MatTableDataSource(this.dataSource.data);

  //   this._rows = this.dataSource.filteredData.length;
  // }

  insertRow(): void {
    let data = this.dataSource.data.slice(this._currentRow);
    this.dataSource.data.splice(this._currentRow, this.dataSource.data.length - this._currentRow + 1);
    let newRow: PostBusinessmanValue = new PostBusinessmanValue();
    if (this.id_san_luong != 'undefined') {
      newRow.id_quan_ly = parseInt(this.id_san_luong)
    }
    else {
      newRow.id_quan_ly = 0;
    }
    newRow.id_linh_vuc = 6;
    this.dataSource.data.push(newRow);
    data.forEach(element => {
      this.dataSource.data.push(element);
    });
    this.dataSource = new MatTableDataSource(this.dataSource.data);

    this._rows = this.dataSource.filteredData.length;
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

  Back() {
    this.router.navigate(['specialized/commecial-management/domestic/petrol']);
  }

}
