import { Component, OnInit, OnDestroy, Input, ViewChild } from "@angular/core";
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from "@angular/router";
import { FormBuilder, FormGroup, FormArray, Validators } from "@angular/forms";
import { InformationService } from '../../../../shared/information/information.service';
import { MarketService } from "../../../../_services/APIService/market.service";
import { MatDialog } from "@angular/material/dialog";
import { NgForm } from '@angular/forms';
import {
  CompanyDetailModel,
  CompanyPost,
  CareerModel,
  DistrictModel,
  SubDistrictModel,
  BusinessTypeModel,
} from "../../../../_models/APIModel/domestic-market.model";

import { FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material';
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
  styleUrls: ['../../manager_layout.scss'],
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
  public career: Array<CareerModel> = new Array<CareerModel>();
  public subdistrict: Array<SubDistrictModel> = new Array<SubDistrictModel>();
  public district: Array<DistrictModel> = new Array<DistrictModel>();
  public Business: Array<BusinessTypeModel> = new Array<BusinessTypeModel>();
  errorMessage: string;

  mst: string;
  doanh_nghiep: FormGroup;
  danh_sach_nganh_nghe: FormArray;

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public datepipe: DatePipe,
    public dialog: MatDialog,
    public _Service: MarketService,
    public info: InformationService,
    private formbuilder: FormBuilder
  ) {
    this.route.params.subscribe((params) => {
      this.mst = params["mst"];
    });
  }

  date = new FormControl(moment);
  pickedDate = {
    date: new Date()
  }

  GetAllNganhNghe() {
    this._Service.GetAllCareer().subscribe((allrecords) => {
      this.career = allrecords.data as CareerModel[];
    });
  }

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

  GetAllLoaiHinh() {
    this._Service.GetAllBusinessType().subscribe((allrecords) => {
      this.Business = allrecords.data as BusinessTypeModel[];
    });
  }

  ngOnInit() {
    console.log(this.mst)
    if (this.mst != undefined) {
      this.GetCompanyInfoById();
    }
    this.GetAllNganhNghe();
    this.GetAllPhuongXa();
    this.getQuan_Huyen();
    this.GetAllLoaiHinh();
    this.resetForm();

    this.doanh_nghiep = this.formbuilder.group({
      mst: '',
      id_loai_hinh_hoat_dong: 0,
      mst_parent: '',
      sct: true,
      hoat_dong: false,
      dia_chi: '',
      id_phuong_xa: 0,
      nguoi_dai_dien: '',
      so_dien_thoai: '',
      ten_doanh_nghiep: '',
      von_dieu_le: 0,
      ngay_bd_kd: '',
      so_lao_dong: 0,
      cong_suat_thiet_ke: 0,
      san_luong: 0,
      email: '',
      so_lao_dong_sct: 0,
      cong_suat_thiet_ke_sct: 0,
      san_luong_sct: 0,
      email_sct: '',
      tieu_chuan_san_pham: '',
      doanh_thu: '',
      quy_mo_tai_san: '',
      loi_nhuan: '',
      nhu_cau_ban: '',
      nhu_cau_mua: '',
      nhu_cau_hop_tac: '',
      danh_sach_nganh_nghe: this.formbuilder.array([this.newCareer()])
    })
  }

  newCareer(): FormGroup {
    return this.formbuilder.group({
      id_nganh_nghe_kinh_doanh: 0,
      nganh_nghe_kd_chinh: '',
      id_linh_vuc: 0
    })
  }

  addCareer(): void {
    this.danh_sach_nganh_nghe = this.doanh_nghiep.get('danh_sach_nganh_nghe') as FormArray;
    this.danh_sach_nganh_nghe.push(this.newCareer());
  }

  removeCareer(i: number) {
    this.danh_sach_nganh_nghe.removeAt(i);
  }

  public SaveData(companyinput) {
    console.log(companyinput)
    this._Service.PostCompany(companyinput).subscribe(
      res => {
        // debugger;
        // this.resetForm(companyinput);
        this.info.msgSuccess('Thêm thành công')
        this.router.navigate(['manager/business/search/']);
      },
      err => {
        // debugger;
      }
    )
  }

  public UpdateData(companyinput) {
    console.log(companyinput)
    this._Service.UpdateCompany(companyinput, this.mst).subscribe(
      res => {
        // debugger;
        this.resetForm(companyinput);
        this.info.msgSuccess('Cập nhật thành công')
        this.router.navigate(['manager/business/search/']);
      },
      err => {
        // debugger;
      }
    )
  }

  companyinput: CompanyPost
  onSubmit() {
    this.companyinput = this.doanh_nghiep.value
    this.SaveData(this.companyinput);
    // if (this.mst == undefined) {
    //   this.SaveData(this.companyinput);
    // }
    // else {
    //   this.UpdateData(this.companyinput);
    // }
  }

  resetForm(form?: NgForm) {
    if (form != null)
      form.form.reset();
    this._Service.companyinfo = {
      mst: '',
      id_loai_hinh_hoat_dong: 0,
      mst_parent: '',
      sct: true,
      hoat_dong: false,
      dia_chi: '',
      id_phuong_xa: 0,
      nguoi_dai_dien: '',
      so_dien_thoai: '',
      ten_doanh_nghiep: '',
      von_dieu_le: 0,
      ngay_bd_kd: '',
      so_lao_dong: 0,
      cong_suat_thiet_ke: 0,
      san_luong: 0,
      email: '',
      so_lao_dong_sct: 0,
      cong_suat_thiet_ke_sct: 0,
      san_luong_sct: 0,
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

  Convertdate(text: string): string {
    let date: string
    date = text.substring(6, 8) + "-" + text.substring(4, 6) + "-" + text.substring(0, 4)
    return date
  }

  dataSource: MatTableDataSource<CompanyDetailModel> = new MatTableDataSource();
  companyList1: Array<CompanyDetailModel> = new Array<CompanyDetailModel>();
  companyList2: Array<CompanyDetailModel> = new Array<CompanyDetailModel>();
  companyList3: Array<CompanyDetailModel> = new Array<CompanyDetailModel>();
  companyList4: Array<CompanyDetailModel> = new Array<CompanyDetailModel>();
  companyList5: Array<CompanyDetailModel> = new Array<CompanyDetailModel>();
  company: CompanyDetailModel;

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

          let temp2 = temp.map(f => this.Convertdate(f.ngay_cap))
          if (temp2[0] == undefined || temp2[0] == null) {
            d.ngay_cap = null
          }
          else {
            d.ngay_cap = temp2.join('; ')
          }

          let temp3 = temp.map(f => this.Convertdate(f.ngay_het_han))
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
        console.log(this.company)

        this._Service.companyinfo = {
          mst: this.company.mst,
          id_loai_hinh_hoat_dong: this.company.id_loai_hinh_hoat_dong,
          mst_parent: this.company.mst_cha,
          sct: true,
          hoat_dong: this.company.hoat_dong,
          dia_chi: this.company.dia_chi,
          id_phuong_xa: this.company.id_phuong_xa,
          nguoi_dai_dien: this.company.nguoi_dai_dien,
          so_dien_thoai: this.company.so_dien_thoai,
          ten_doanh_nghiep: '',
          von_dieu_le: this.company.von_dieu_le,
          ngay_bd_kd: this.company.ngay_bd_kd,
          so_lao_dong: this.company.so_lao_dong,
          cong_suat_thiet_ke: this.company.cong_suat_thiet_ke,
          san_luong: this.company.san_luong,
          email: this.company.email,
          so_lao_dong_sct: this.company.so_lao_dong_sct,
          cong_suat_thiet_ke_sct: 0,
          san_luong_sct: 0,
          email_sct: '',
          tieu_chuan_san_pham: '',
          doanh_thu: '',
          quy_mo_tai_san: '',
          loi_nhuan: '',
          nhu_cau_ban: '',
          nhu_cau_mua: '',
          nhu_cau_hop_tac: '',
          danh_sach_nganh_nghe: [{
            id_nganh_nghe_kinh_doanh: 1,
            nganh_nghe_kd_chinh: 'Test',
            id_linh_vuc: 1
          }],
        }

      });
  }

}
