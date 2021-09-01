import { Component, OnInit, OnDestroy, Input, ViewChild, QueryList, ViewChildren } from "@angular/core";
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from "@angular/router";
import { FormBuilder, FormGroup, FormArray, Validators } from "@angular/forms";
import { InformationService } from 'src/app/shared/information/information.service';
import { MarketService } from "src/app/_services/APIService/market.service";
import { MatDialog } from "@angular/material/dialog";
import { NgForm } from '@angular/forms';
import { KeyboardService } from 'src/app/shared/services/keyboard.service';
import { formatDate } from '@angular/common';
import { ManagerDirective } from 'src/app/shared/manager.directive';
import { MatPaginator } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import {
  CompanyDetailModel,
  CompanyPost,
  CareerModel,
  DistrictModel,
  SubDistrictModel,
  BusinessTypeModel,
  Career,
  DeleteModel1,
  FieldModel
} from "src/app/_models/APIModel/domestic-market.model";
import { LoginService } from "src/app/_services/APIService/login.service";

import { FormControl } from '@angular/forms';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { DatePipe } from '@angular/common';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS, MatDatepicker } from '@angular/material';
import { defaultFormat as _rollupMoment } from 'moment';
import _moment from 'moment';
const moment = _rollupMoment || _moment;
export const DDMMYY_FORMAT = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD-MM-YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};

@Component({
  selector: "app-edit-business",
  templateUrl: "./edit-business.component.html",
  styleUrls: ['../../../special_layout.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: DDMMYY_FORMAT },
    { provide: MAT_DATE_LOCALE, useValue: 'vi-VN' },
    DatePipe
  ],
})
export class EditBusinessComponent implements OnInit {
  @ViewChildren(ManagerDirective) inputs: QueryList<ManagerDirective>
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  selection = new SelectionModel<Career>(true, []);

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

  checkboxLabel(row?: Career): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

  deletemodel1: Array<DeleteModel1> = new Array<DeleteModel1>();
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

      this._Service.DeleteCareer(this.deletemodel1).subscribe(res => {
        this.info.msgSuccess('Xóa thành công')
        window.location.reload();
        this.deletemodel1 = []
        this.selection.clear();
        this.paginator.pageIndex = 0;
      })
    }
  }

  mst: string;
  doanh_nghiep: FormGroup;
  submitted = false;

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public datepipe: DatePipe,
    public dialog: MatDialog,
    public _Service: MarketService,
    public info: InformationService,
    private formbuilder: FormBuilder,
    public _keyboardservice: KeyboardService,
    public _login: LoginService
  ) {
    this.route.params.subscribe((params) => {
      this.mst = params["mst"];
    });
  }

  public district: Array<DistrictModel> = new Array<DistrictModel>();
  getQuan_Huyen() {
    this._Service.GetAllDistrict().subscribe((allDistrict) => {
      this.district = allDistrict["data"] as DistrictModel[];

    });
  }

  public Business: Array<BusinessTypeModel> = new Array<BusinessTypeModel>();
  GetAllLoaiHinh() {
    this._Service.GetAllBusinessType().subscribe((allrecords) => {
      this.Business = allrecords.data as BusinessTypeModel[];
    });
  }

  public career: Array<CareerModel> = new Array<CareerModel>();
  public filtercareer: ReplaySubject<CareerModel[]> = new ReplaySubject<CareerModel[]>(1);
  GetAllNganhNghe() {
    this._Service.GetAllCareer().subscribe((allrecords) => {
      this.career = allrecords.data as CareerModel[];
      this.filtercareer.next(this.career.slice());
    });
  }
  public nganhnghefilter: FormControl = new FormControl();
  public filterNganhnghe() {
    if (!this.career) {
      return;
    }
    let search = this.nganhnghefilter.value;
    if (!search) {
      this.filtercareer.next(this.career.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filtercareer.next(
      this.career.filter(x => x.ten_nganh_nghe.toLowerCase().indexOf(search) > -1)
    );
  }

  public subdistrict: Array<SubDistrictModel> = new Array<SubDistrictModel>();
  public filtersubdistrict: ReplaySubject<SubDistrictModel[]> = new ReplaySubject<SubDistrictModel[]>(1);
  GetAllPhuongXa() {
    this._Service.GetAllSubDistrict().subscribe((allrecords) => {
      this.subdistrict = allrecords.data as SubDistrictModel[];
      this.filtersubdistrict.next(this.subdistrict.slice());
    });
  }
  public phuongxafilter: FormControl = new FormControl();
  public filterPhuongxa() {
    if (!this.subdistrict) {
      return;
    }
    let search = this.phuongxafilter.value;
    if (!search) {
      this.filtersubdistrict.next(this.subdistrict.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filtersubdistrict.next(
      this.subdistrict.filter(x => x.ten_phuong_xa.toLowerCase().indexOf(search) > -1)
    );
  }

  public Field: Array<FieldModel> = new Array<FieldModel>();
  public FilterField: ReplaySubject<FieldModel[]> = new ReplaySubject<FieldModel[]>(1);
  GetLinhVuc() {
    this._Service.GetAllField().subscribe((allrecords) => {
      this.Field = allrecords.data as FieldModel[];
      this.FilterField.next(this.Field.slice());
    });
  }
  public linhvucfilter: FormControl = new FormControl();
  public filterLinhvuc() {
    if (!this.Field) {
      return;
    }
    let search = this.linhvucfilter.value;
    if (!search) {
      this.FilterField.next(this.Field.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.FilterField.next(
      this.Field.filter(x => x.ten_linh_vuc.toLowerCase().indexOf(search) > -1)
    );
  }

  authorize: boolean = true;
  SCT: boolean = true
  DN: boolean = false

  ngOnInit() {
    if (this._login.userValue.user_role_id == 1 || this._login.userValue.user_role_id == 3 || this._login.userValue.user_role_id == 4
      || this._login.userValue.user_role_id == 5 || this._login.userValue.user_role_id == 7) {
      this.authorize = false
    }

    if (this._login.userValue.user_role_id != 2) {
      this.SCT = false
      this.DN = true
    }

    if (this.mst != undefined) {
      this.GetCompanyInfoById();
    }

    this.GetAllNganhNghe();
    this.GetAllPhuongXa();
    this.getQuan_Huyen();
    this.GetAllLoaiHinh();
    this.GetLinhVuc();
    this.resetForm();

    this.doanh_nghiep = this.formbuilder.group({
      mst: ['', Validators.required],
      id_loai_hinh_hoat_dong: [null, Validators.required],
      mst_parent: '',
      sct: false,
      hoat_dong: true,
      dia_chi: ['', Validators.required],
      id_phuong_xa: [null, Validators.required],
      nguoi_dai_dien: ['', Validators.required],
      so_dien_thoai: '',
      ten_doanh_nghiep: [null, Validators.required],
      von_dieu_le: null,
      ngay_bd_kd: '',
      so_lao_dong: null,
      cong_suat_thiet_ke: null,
      san_luong: null,
      email: '',
      so_lao_dong_sct: null,
      cong_suat_thiet_ke_sct: null,
      san_luong_sct: null,
      email_sct: '',
      tieu_chuan_san_pham: '',
      doanh_thu: '',
      quy_mo_tai_san: '',
      loi_nhuan: '',
      nhu_cau_ban: '',
      nhu_cau_mua: '',
      nhu_cau_hop_tac: '',
      danh_sach_nganh_nghe: []
    })

    this.linhvucfilter.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterLinhvuc();
      });

    this.nganhnghefilter.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterNganhnghe();
      });

    this.phuongxafilter.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterPhuongxa();
      });
  }

  public _onDestroy = new Subject<void>();

  public SaveData(companyinput) {
    if (this.mst == undefined) {
      this._Service.PostCompany(companyinput).subscribe(
        res => {
          this.info.msgSuccess('Thêm doanh nghiệp thành công')
          this.Back();
        },
        err => {
          this.info.msgError('Mã số thuế đã tồn tại')
        }
      )
    }
    else {
      this._Service.UpdateCompany(companyinput).subscribe(
        res => {
          this.info.msgSuccess('Cập nhật doanh nghiệp thành công')
          this.GetCompanyInfoById();
        },
        err => {
          this.info.msgError('Cập nhật doanh nghiệp không thành công')
        }
      )
    }
  }

  date = new FormControl(moment);
  pickedDate = {
    date: new Date()
  }

  public getChange(param: any): string {
    let datepipe = this.datepipe.transform(param._d, 'yyyyMMdd')
    return datepipe
  }

  get f() { return this.doanh_nghiep.controls; }

  companyinput: CompanyPost
  onSubmit() {
    this.submitted = true;

    if (this.doanh_nghiep.invalid) {
      return;
    }

    this.companyinput = this.doanh_nghiep.value
    this.companyinput.danh_sach_nganh_nghe = this.dataSource.data.filter(x => x.id_nganh_nghe_kinh_doanh != null)
    this.companyinput.ngay_bd_kd = this.doanh_nghiep.value.ngay_bd_kd ? this.getChange(this.companyinput.ngay_bd_kd) : null

    this.SaveData(this.companyinput);
  }

  onReset() {
    if (this.mst != 'undefined') {
      this.submitted = false;
      this.ngOnInit();
    }
    else {
      this.submitted = false;
      this.doanh_nghiep.reset();
    }
  }

  resetForm(form?: NgForm) {
    if (form != null)
      form.form.reset();
    this._Service.companyinfo = {
      mst: '',
      id_loai_hinh_hoat_dong: null,
      mst_parent: '',
      sct: false,
      hoat_dong: true,
      dia_chi: '',
      id_phuong_xa: null,
      nguoi_dai_dien: '',
      so_dien_thoai: '',
      ten_doanh_nghiep: '',
      von_dieu_le: null,
      ngay_bd_kd: '',
      so_lao_dong: null,
      cong_suat_thiet_ke: null,
      san_luong: null,
      email: '',
      so_lao_dong_sct: null,
      cong_suat_thiet_ke_sct: null,
      san_luong_sct: null,
      email_sct: '',
      tieu_chuan_san_pham: '',
      doanh_thu: '',
      quy_mo_tai_san: '',
      loi_nhuan: '',
      nhu_cau_ban: '',
      nhu_cau_mua: '',
      nhu_cau_hop_tac: '',
      danh_sach_nganh_nghe: [],
    }
  }
  dataSource: MatTableDataSource<Career> = new MatTableDataSource<Career>();
  public displayedColumns: string[] = ['select', 'index', 'id', 'id_nganh_nghe_kinh_doanh', 'id_linh_vuc', 'nganh_nghe_kd_chinh', 'ma_nganh_nghe'];

  public _currentRow: number = 0;

  // addRow(): void {
  //   let newRow: Career = new Career();
  //   newRow.id = null;
  //   newRow.id_nganh_nghe_kinh_doanh;
  //   newRow.nganh_nghe_kd_chinh = "";
  //   newRow.id_linh_vuc;
  //   newRow.ma_nganh_nghe = '';

  //   this.dataSource.data.push(newRow);
  //   this.dataSource = new MatTableDataSource(this.dataSource.data);

  //   this.dataSource.paginator = this.paginator;
  //   this.paginator._intl.itemsPerPageLabel = 'Số hàng';
  //   this.paginator._intl.firstPageLabel = "Trang Đầu";
  //   this.paginator._intl.lastPageLabel = "Trang Cuối";
  //   this.paginator._intl.previousPageLabel = "Trang Trước";
  //   this.paginator._intl.nextPageLabel = "Trang Tiếp";

  //   this._rows = this.dataSource.filteredData.length;
  // }

  insertRow(): void {
    let data = this.dataSource.data.slice(this._currentRow);
    this.dataSource.data.splice(this._currentRow, this.dataSource.data.length - this._currentRow + 1);
    let newRow: Career = new Career();
    newRow.id = null;
    newRow.id_nganh_nghe_kinh_doanh;
    newRow.nganh_nghe_kd_chinh = "";
    newRow.id_linh_vuc;
    newRow.ma_nganh_nghe = '';

    this.dataSource.data.push(newRow);
    data.forEach(element => {
      this.dataSource.data.push(element);
    });
    this.dataSource = new MatTableDataSource(this.dataSource.data);

    this.dataSource.paginator = this.paginator;
    this.paginator._intl.itemsPerPageLabel = 'Số hàng';
    this.paginator._intl.firstPageLabel = "Trang Đầu";
    this.paginator._intl.lastPageLabel = "Trang Cuối";
    this.paginator._intl.previousPageLabel = "Trang Trước";
    this.paginator._intl.nextPageLabel = "Trang Tiếp";

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

  Convertdate(text: string): string {
    let date: string
    date = text.substring(6, 8) + "-" + text.substring(4, 6) + "-" + text.substring(0, 4)
    return date
  }

  companyList1: Array<CompanyDetailModel> = new Array<CompanyDetailModel>();
  companyList2: Array<CompanyDetailModel> = new Array<CompanyDetailModel>();
  companyList3: Array<CompanyDetailModel> = new Array<CompanyDetailModel>();
  companyList4: Array<CompanyDetailModel> = new Array<CompanyDetailModel>();
  companyList5: Array<CompanyDetailModel> = new Array<CompanyDetailModel>();
  company: CompanyDetailModel;
  careerarray: Array<Career> = new Array<Career>();

  bdkddate: Date;

  GetCompanyInfoById() {
    this._Service.GetCompanyInfoById(this.mst).subscribe(
      allrecords => {
        this.companyList1 = allrecords.data[0]
        this.companyList2 = allrecords.data[1]
        this.companyList3 = allrecords.data[2]

        this.companyList4 = this.companyList1.map(a => {
          let temp = this.companyList2.filter(b => b.mst === a.mst)
          let temp1 = temp.map(c => c.ma_nganh_nghe)
          if (temp1 == undefined || temp1 == null) {
            a.ma_nganh_nghe = null
          }
          else {
            a.ma_nganh_nghe = temp1.join('; ')
          }

          let temp2 = temp.map(c => c.ten_nganh_nghe)
          if (temp2 == undefined || temp2 == null) {
            a.ten_nganh_nghe = null
          }
          else {
            a.ten_nganh_nghe = temp2.join('; ')
          }

          let temp3 = temp.map(c => c.nganh_nghe_kd_chinh)
          if (temp3 == undefined || temp3 == null) {
            a.nganh_nghe_kd_chinh = null
          }
          else {
            a.nganh_nghe_kd_chinh = temp3.join('; ')
          }

          return a
        })

        this.companyList5 = this.companyList4.map(d => {
          let temp = this.companyList3.filter(e => e.mst === d.mst)
          let temp1 = temp.map(f => f.so_giay_phep)
          if (temp1[0] == undefined || temp1[0] == null) {
            d.so_giay_phep = null
          }
          else {
            d.so_giay_phep = temp1.join('; ')
          }

          let temp2 = temp.map(f => f.ngay_cap ? this.Convertdate(f.ngay_cap) : null)
          if (temp2[0] == undefined || temp2[0] == null) {
            d.ngay_cap = null
          }
          else {
            d.ngay_cap = temp2.join('; ')
          }

          let temp3 = temp.map(f => f.ngay_het_han ? this.Convertdate(f.ngay_het_han) : null)
          if (temp3[0] == undefined || temp3[0] == null) {
            d.ngay_het_han = null
          }
          else {
            d.ngay_het_han = temp3.join('; ')
          }

          let temp4 = temp.map(f => f.noi_cap)
          if (temp4[0] == undefined || temp4[0] == null) {
            d.noi_cap = null
          }
          else {
            d.noi_cap = temp4.join('; ')
          }

          let temp5 = temp.map(f => f.co_quan_cap)
          if (temp5[0] == undefined || temp5[0] == null) {
            d.co_quan_cap = null
          }
          else {
            d.co_quan_cap = temp5.join('; ')
          }

          let temp6 = temp.map(f => f.ghi_chu)
          if (temp6[0] == undefined || temp6[0] == null) {
            d.ghi_chu == null
          }
          else {
            d.ghi_chu = temp6.join('; ')
          }

          return d
        })

        this.company = this.companyList5[0]

        if (this.companyList2) {
          this.careerarray = []

          this.companyList2.forEach(x => {
            this.careerarray.push({
              id: null,
              ma_nganh_nghe: null,
              id_nganh_nghe_kinh_doanh: null,
              nganh_nghe_kd_chinh: '',
              id_linh_vuc: null
            })
          })

          for (let index = 0; index < this.companyList2.length; index++) {
            this.careerarray[index].id = this.companyList2[index].id.toString()
            this.careerarray[index].id_nganh_nghe_kinh_doanh = this.companyList2[index].id_nganh_nghe_kd
            this.careerarray[index].nganh_nghe_kd_chinh = this.companyList2[index].nganh_nghe_kd_chinh
            this.careerarray[index].ma_nganh_nghe = this.companyList2[index].id_nganh_nghe
            this.careerarray[index].id_linh_vuc = this.companyList2[index].id_linh_vuc
          }
          this.dataSource.data = this.careerarray

          this.dataSource.paginator = this.paginator;
          this.paginator._intl.itemsPerPageLabel = 'Số hàng';
          this.paginator._intl.firstPageLabel = "Trang Đầu";
          this.paginator._intl.lastPageLabel = "Trang Cuối";
          this.paginator._intl.previousPageLabel = "Trang Trước";
          this.paginator._intl.nextPageLabel = "Trang Tiếp";
        }

        this.bdkddate = this.company.ngay_bd_kd ? this.convertstringtodate(this.company.ngay_bd_kd) : null,

          this._Service.companyinfo = {
            mst: this.company.mst,
            id_loai_hinh_hoat_dong: this.company.id_loai_hinh_hoat_dong,
            mst_parent: this.company.mst_cha,
            sct: this.company.sct,
            hoat_dong: this.company.hoat_dong,
            dia_chi: this.company.dia_chi,
            id_phuong_xa: this.company.id_phuong_xa,
            nguoi_dai_dien: this.company.nguoi_dai_dien,
            so_dien_thoai: this.company.so_dien_thoai,
            ten_doanh_nghiep: String(this.company.ten_doanh_nghiep),
            von_dieu_le: this.company.von_dieu_le,
            ngay_bd_kd: '',
            so_lao_dong: this.company.so_lao_dong,
            cong_suat_thiet_ke: this.company.cong_suat_thiet_ke,
            san_luong: this.company.san_luong,
            email: this.company.email,
            so_lao_dong_sct: this.company.so_lao_dong_sct,
            cong_suat_thiet_ke_sct: this.company.cong_suat_thiet_ke_sct,
            san_luong_sct: this.company.san_luong_sct,
            email_sct: this.company.email_sct,
            tieu_chuan_san_pham: this.company.tieu_chuan_san_pham,
            doanh_thu: this.company.doanh_thu,
            quy_mo_tai_san: this.company.quy_mo_tai_san,
            loi_nhuan: this.company.loi_nhuan,
            nhu_cau_ban: this.company.nhu_cau_ban,
            nhu_cau_mua: this.company.nhu_cau_mua,
            nhu_cau_hop_tac: this.company.nhu_cau_hop_tac,
            danh_sach_nganh_nghe: [],
          }
      });
  }

  convertstringtodate(time: string): Date {
    let year = parseInt(time.substring(0, 4));
    let month = parseInt(time.substring(4, 6));
    let day = parseInt(time.substring(6, 8));

    let date = new Date(year, month - 1, day);
    return date
  }

  Back() {
    this.router.navigate(['manager/business/search/']);
  }

  detail: boolean

  Detail(event) {
    this.detail = event.checked
  }
}
