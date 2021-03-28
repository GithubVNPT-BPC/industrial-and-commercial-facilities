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
  DistrictModel,
  SubDistrictModel,
  PetrolList,
  CertificateModel,
  PetrolPost,
  PetrolValuePost,
  DeleteModel,
  Status,
  PetrolStore,
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

  Businessman: Array<BusinessmanSelect> = new Array<BusinessmanSelect>();
  filterbusinessman: Array<BusinessmanSelect> = new Array<BusinessmanSelect>();

  GetBusinessman() {
    this._Service.GetBusinessman().subscribe((allrecords) => {
      this.Businessman = allrecords.data as BusinessmanSelect[];
      this.filterbusinessman = this.Businessman.slice();
    });
  }

  PetrolStore: Array<StoreSelect> = new Array<StoreSelect>();
  filterpetrolstore: Array<StoreSelect> = new Array<StoreSelect>();

  GetStore() {
    this._Service.GetAllPetrolStore().subscribe((all) => {
      this.PetrolStore = all.data as StoreSelect[];
      this.filterpetrolstore = this.PetrolStore.slice();
    })
  }

  dataSource: MatTableDataSource<PostBusinessmanValue> = new MatTableDataSource<PostBusinessmanValue>();
  businessmanvalue: Array<PetrolList> = new Array<PetrolList>();
  businessmanvalue1: Array<PetrolList> = new Array<PetrolList>();

  getBusinessmanvalue() {
    this._Service.GetAllPetrolValue().subscribe(all => {

      this.businessmanvalue = all.data[1]
      this.businessmanvalue1 = this.businessmanvalue.filter(x => x.id_san_luong == this.id_san_luong)

      this.businessmanvalue1.forEach(x => {
        this.dataSource.data.push({
          id_linh_vuc: 6,
          id: '',
          id_quan_ly: 0,
          id_thuong_nhan: ''
        })
      })

      for (let index = 0; index < this.businessmanvalue1.length; index++) {
        this.dataSource.data[index].id_thuong_nhan = this.businessmanvalue1[index].id_thuong_nhan ? this.businessmanvalue1[index].id_thuong_nhan : null
        this.dataSource.data[index].id_quan_ly = parseInt(this.businessmanvalue1[index].id_san_luong) ? parseInt(this.businessmanvalue1[index].id_san_luong) : null
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


  subdistrict: Array<SubDistrictModel> = new Array<SubDistrictModel>();
  filtersubdistrict: Array<SubDistrictModel> = new Array<SubDistrictModel>();
  district: Array<DistrictModel> = new Array<DistrictModel>();
  Certificate: Array<CertificateModel> = new Array<CertificateModel>();

  GetAllPhuongXa() {
    this._Service.GetAllSubDistrict().subscribe((allrecords) => {
      this.subdistrict = allrecords.data as SubDistrictModel[];
      this.filtersubdistrict = this.subdistrict.slice();
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
    this.getQuan_Huyen();
    this.GetAllPhuongXa();
    this.getPetrolValue();
    this.GetAllGiayPhep(this.mst);
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
  }

  SaveData(input1, input2, input3) {
    if (this.id.toString() != 'undefined') {
      this._Service.PostPetrolValue(input1).subscribe(
        next => {
          this._info.msgSuccess("Lưu thông tin thành công");
        },
        error => {
          this._info.msgError("Lưu thông tin không thành công");
        }
      );

      // this._Service.PostPetrol(input2).subscribe(
      //   res => {
      //     // debugger;
      //     this._info.msgSuccess('Thêm thành công')
      //   },
      //   err => {
      //     // debugger;
      //   }
      // )

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
      this._Service.PostPetrolValueNEW(input3).subscribe(
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
  petrolstorepost: Array<PetrolStore> = new Array<PetrolStore>();

  input: PetrolPost
  onSubmit() {

    this.input = this.petrol_data.value

    this.petrolvaluepost.push({
      ghi_chu: '',
      san_luong: null,
      time_id: this.getCurrentYear(),
      id: null,
      id_cua_hang_xang_dau: null,
    })

    this.petrolvaluepost[0].ghi_chu = this.input.ghi_chu
    this.petrolvaluepost[0].san_luong = this.input.san_luong
    this.petrolvaluepost[0].id_cua_hang_xang_dau = this.input.id_cua_hang_xang_dau
    if (this.id_san_luong != 'undefined') {
      this.petrolvaluepost[0].id = this.id_san_luong
    }

    this.petrolvaluepost1.push({
      ghi_chu: '',
      san_luong: null,
      time_id: this.getCurrentYear(),
      id: null,
      id_cua_hang_xang_dau: null,
      danh_sach_thuong_nhan: []
    })

    this.petrolvaluepost1[0].ghi_chu = this.input.ghi_chu
    this.petrolvaluepost1[0].san_luong = this.input.san_luong
    this.petrolvaluepost1[0].id_cua_hang_xang_dau = this.input.id_cua_hang_xang_dau
    if (this.id_san_luong != 'undefined') {
      this.petrolvaluepost1[0].id = this.id_san_luong
    }
    this.petrolvaluepost1[0].danh_sach_thuong_nhan = this.dataSource.data

    this.petrolstorepost.push({
      id_cua_hang_xang_dau: null,
      ten_cua_hang: '',
      mst: '',
      dia_chi: '',
      id_phuong_xa: 25195,
      so_dien_thoai: '',
      id_tinh_trang_hoat_dong: 1,
      ten_quan_ly: '',
      ten_nhan_vien: '',
      id_giay_phep: 0
    })

    this.petrolstorepost[0].ten_cua_hang = this.input.ten_cua_hang
    this.petrolstorepost[0].mst = this.input.mst
    this.petrolstorepost[0].dia_chi = this.input.dia_chi
    this.petrolstorepost[0].id_phuong_xa = this.input.id_phuong_xa
    this.petrolstorepost[0].so_dien_thoai = this.input.so_dien_thoai
    this.petrolstorepost[0].id_tinh_trang_hoat_dong = this.input.id_tinh_trang_hoat_dong
    this.petrolstorepost[0].ten_quan_ly = this.input.ten_quan_ly
    this.petrolstorepost[0].ten_nhan_vien = this.input.ten_nhan_vien
    this.petrolstorepost[0].id_giay_phep = this.input.id_giay_phep

    this.SaveData(this.petrolvaluepost, this.petrolstorepost[0], this.petrolvaluepost1[0]);
  }

  petrolobject = new PetrolList();
  petrolValue = new PetrolValuePost();

  dataSource1: MatTableDataSource<PetrolList> = new MatTableDataSource<PetrolList>();
  dataSource2: MatTableDataSource<PetrolList> = new MatTableDataSource<PetrolList>();
  dataSource3: MatTableDataSource<PetrolValuePost> = new MatTableDataSource<PetrolValuePost>();
  dataSource4: MatTableDataSource<PetrolValuePost> = new MatTableDataSource<PetrolValuePost>();

  getPetrolValue() {
    this._Service.GetAllPetrolValue().subscribe(all => {
      this.dataSource3 = new MatTableDataSource<PetrolValuePost>(all.data[0]);
      this.dataSource4.data = this.dataSource3.data.filter(x => x.id_cua_hang_xang_dau == this.id)

      this.dataSource4.paginator = this.paginator;
      this.paginator._intl.itemsPerPageLabel = 'Số hàng';
      this.paginator._intl.firstPageLabel = "Trang Đầu";
      this.paginator._intl.lastPageLabel = "Trang Cuối";
      this.paginator._intl.previousPageLabel = "Trang Trước";
      this.paginator._intl.nextPageLabel = "Trang Tiếp";

      this._rows = this.dataSource4.filteredData.length;
    })
  }

  getPetrolInfo() {
    this._Service.GetAllPetrolValue().subscribe(all => {
      this.dataSource1 = new MatTableDataSource<PetrolList>(all.data[0]);
      this.dataSource2.data = this.dataSource1.data.filter(x => x.id_san_luong == this.id_san_luong)
      this.petrolobject = this.dataSource2.data[0]

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
        time_id: this.getCurrentYear(),
        ghi_chu: this.petrolobject.ghi_chu,
        san_luong: this.petrolobject.san_luong
      }
    })
  }

  public _currentRow: number = 0;

  addRow(): void {
    let newRow: PostBusinessmanValue = new PostBusinessmanValue();
    if (this.id_san_luong != 'undefined') {
      newRow.id_quan_ly = parseInt(this.id_san_luong)
    }
    else {
      newRow.id_quan_ly = 0;
    }
    newRow.id_linh_vuc = 6;
    this.dataSource.data.push(newRow);
    this.dataSource = new MatTableDataSource(this.dataSource.data);
    this.filterbusinessman = this.Businessman.slice();

    this._rows = this.dataSource.filteredData.length;
  }

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
    this.filterbusinessman = this.Businessman.slice();

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
    this.router.navigate(['specialized/commecial-management/domestic/petrol']);
  }

}
