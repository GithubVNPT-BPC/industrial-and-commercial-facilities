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
  DeleteModel
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
  displayedColumns: string[] = ['select', 'index', 'id', 'id_cua_hang_xang_dau', 'san_luong', 'ghi_chu', 'time_id'];

  @ViewChild('table', { static: false }) table: ElementRef;
  @ViewChild(MatAccordion, { static: false }) accordion: MatAccordion;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChildren(SpecialDirective) inputs: QueryList<SpecialDirective>

  id: string;
  mst: string;
  years: any[] = [];

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
    });
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

  GetAllGiayPhep(mst: string) {
    this._Service.GetCertificate(mst).subscribe((allrecords) => {
      this.Certificate = allrecords.data as CertificateModel[];
    });
  }

  resetForm(form?: NgForm) {
    if (form != null)
      form.form.reset();
    this._Service.petrol = {
      id_cua_hang_xang_dau: null,
      ten_cua_hang: '',
      mst: '',
      dia_chi: '',
      id_phuong_xa: null,
      so_dien_thoai: '',
      id_tinh_trang_hoat_dong: 1,
      ten_quan_ly: '',
      ten_nhan_vien: '',
      id_giay_phep: 0
    }
  }

  selection = new SelectionModel<PetrolValuePost>(true, []);

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    // const numRows = this.dataSource.data.length;
    const numRows = this.dataSource4.connect().value.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource4.connect().value.forEach(row => this.selection.select(row));
  }

  checkboxLabel(row?: PetrolValuePost): string {
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
      this._Service.DeletePetrolValue(this.deletemodel1).subscribe(res => {
        this._info.msgSuccess('Xóa thành công')
        this.getPetrolValue();
        this.selection.clear();
        this.paginator.pageIndex = 0;
      })
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

    this.petrol_data = this.formbuilder.group({
      id_cua_hang_xang_dau: null,
      ten_cua_hang: '',
      mst: '',
      dia_chi: '',
      id_phuong_xa: null,
      so_dien_thoai: '',
      id_tinh_trang_hoat_dong: 1,
      ten_quan_ly: '',
      ten_nhan_vien: '',
      id_giay_phep: 0
    })

    this.years = this.commonfunctions.getYears()
  }

  SaveData(input) {
    if (this.dataSource4.data) {
      this._Service.PostPetrolValue(this.dataSource4.data).subscribe(
        next => {
          if (next.id == -1) {
            this._info.msgError("Lưu lỗi! Lý do: " + next.message);
          }
          else {
            this._info.msgSuccess("Dữ liệu được lưu thành công!");
          }
        },
        error => {
          this._info.msgError("Không thể thực thi! Lý do: " + error.message);
        }
      );
    }

    this._Service.PostPetrol(input).subscribe(
      res => {
        // debugger;
        this._info.msgSuccess('Thêm thành công')
        this.getPetrolValue()
        // this.router.navigate(['specialized/commecial-management/domestic/cbl']);
      },
      err => {
        // debugger;
      }
    )
  }

  input: PetrolPost
  onSubmit() {
    this.input = this.petrol_data.value
    this.SaveData(this.input);
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
    this._Service.GetAllPetrolStore().subscribe(all => {
      this.dataSource1 = new MatTableDataSource<PetrolList>(all.data);
      this.dataSource2.data = this.dataSource1.data.filter(x => x.id_cua_hang_xang_dau == this.id)
      this.petrolobject = this.dataSource2.data[0]

      this._Service.petrol = {
        id_cua_hang_xang_dau: this.id,
        ten_cua_hang: this.petrolobject.ten_cua_hang,
        mst: this.petrolobject.mst,
        dia_chi: this.petrolobject.dia_chi,
        id_phuong_xa: this.petrolobject.id_phuong_xa,
        so_dien_thoai: this.petrolobject.so_dien_thoai,
        id_tinh_trang_hoat_dong: this.petrolobject.id_tinh_trang_hoat_dong,
        ten_quan_ly: this.petrolobject.ten_quan_ly,
        ten_nhan_vien: this.petrolobject.ten_nhan_vien,
        id_giay_phep: this.petrolobject.id_giay_phep
      }
    })
  }

  public _currentRow: number = 0;

  addRow(): void {
    let newRow: PetrolValuePost = new PetrolValuePost();
    newRow.san_luong;
    newRow.ghi_chu = "";
    newRow.time_id = ""
    newRow.id_cua_hang_xang_dau = this.id;
    this.dataSource4.data.push(newRow);
    this.dataSource4 = new MatTableDataSource(this.dataSource4.data);

    this._rows = this.dataSource4.filteredData.length;
  }

  insertRow(): void {
    let data = this.dataSource4.data.slice(this._currentRow);
    this.dataSource4.data.splice(this._currentRow, this.dataSource4.data.length - this._currentRow + 1);
    let newRow: PetrolValuePost = new PetrolValuePost();
    newRow.san_luong;
    newRow.ghi_chu = "";
    newRow.time_id = "";
    newRow.id_cua_hang_xang_dau = this.id;
    this.dataSource4.data.push(newRow);
    data.forEach(element => {
      this.dataSource4.data.push(element);
    });
    this.dataSource4 = new MatTableDataSource(this.dataSource4.data);

    this._rows = this.dataSource4.data.length
  }

  deleteRow(): void {
    this.dataSource4.data.splice(this._currentRow, 1);
    this.dataSource4 = new MatTableDataSource(this.dataSource4.data);

    this._rows = this.dataSource4.data.length
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
