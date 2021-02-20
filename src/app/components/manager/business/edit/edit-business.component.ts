import { Component, OnInit, OnDestroy, Input, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from "@angular/forms";
import { InformationService } from '../../../../shared/information/information.service';
import { MarketService } from "../../../../_services/APIService/market.service";
import { NgForm } from '@angular/forms';
import {
  CompanyDetailModel1,
  CompanyPost,
  CareerModel,
  DistrictModel,
  SubDistrictModel,
  BusinessTypeModel,
  Career,
} from "../../../../_models/APIModel/domestic-market.model";
import { MatDialog } from "@angular/material/dialog";

import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from "@angular/material-moment-adapter";
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from "@angular/material/core";
import { MatTableDataSource, MatDatepicker, MatPaginator } from "@angular/material";
import { formatDate } from "@angular/common";
import moment from "moment";
import { CommentStmt } from "@angular/compiler";

export const MY_FORMATS = {
  parse: {
    dateInput: "DD/MM/YYYY",
  },
  display: {
    dateInput: "DD/MM/YYYY",
    monthYearLabel: "DD/MM/YYYY",
    dateA11yLabel: "LL",
    monthYearA11yLabel: "MMMM YYYY",
  },
};

@Component({
  selector: "app-edit-business",
  templateUrl: "./edit-business.component.html",
  styleUrls: ['../../manager_layout.scss'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: "vi-VI" },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class EditBusinessComponent implements OnInit {
  public career: Array<CareerModel> = new Array<CareerModel>();
  public subdistrict: Array<SubDistrictModel> = new Array<SubDistrictModel>();
  public district: Array<DistrictModel> = new Array<DistrictModel>();
  public Business: Array<BusinessTypeModel> = new Array<BusinessTypeModel>();
  errorMessage: string;

  @Input() company: CompanyDetailModel1;

  mst: string;
  doanh_nghiep: FormGroup;
  danh_sach_nganh_nghe: FormArray;

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public dialog: MatDialog,
    public _Service: MarketService,
    public info: InformationService,
    private formbuilder: FormBuilder
  ) {
    this.route.params.subscribe((params) => {
      this.mst = params["mst"];
    });
    this.company = new CompanyDetailModel1();
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
    // this.GetCompanyInfoById();
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
    this._Service.PostCompany().subscribe(
      res => {
        // debugger;
        // this.resetForm(form);
        this.info.msgSuccess('Thêm thành công')
        this.router.navigate(['manager/business/search/']);
      },
      err => {
        // debugger;
        console.log(err);
      }
    )
  }
  companyinput: CompanyPost
  onSubmit() {
    this.companyinput = this.doanh_nghiep.value
    this.SaveData(this.companyinput);
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

  companyList1: Array<CompanyDetailModel1> = new Array<CompanyDetailModel1>();
  companyList2: Array<CompanyDetailModel1> = new Array<CompanyDetailModel1>();
  companyList3: Array<CompanyDetailModel1> = new Array<CompanyDetailModel1>();
  companyList4: Array<CompanyDetailModel1> = new Array<CompanyDetailModel1>();
  companyList5: Array<CompanyDetailModel1> = new Array<CompanyDetailModel1>();

  public GetCompanyInfoById() {
    this._Service.GetCompanyInfoById(this.mst).subscribe(
      (allrecords) => {
        this.companyList1 = allrecords.data[0]
        this.companyList2 = allrecords.data[1]
        this.companyList3 = this.companyList1.map(x => {
          let temp = this.companyList2.find(y => y.mst === x.mst)
          if (temp) {
            x.ma_nganh_nghe = temp.ma_nganh_nghe
            x.ten_nganh_nghe = temp.ten_nganh_nghe
            x.nganh_nghe_kd_chinh = temp.nganh_nghe_kd_chinh
            x.id_nganh_nghe_kd = temp.id_nganh_nghe_kd
          }
          else {
            x.ma_nganh_nghe = null
            x.ten_nganh_nghe = null
            x.nganh_nghe_kd_chinh = null
            x.id_nganh_nghe_kd = null
          }
          return x
        })

        this.companyList4 = allrecords.data[2]

        this.companyList5 = this.companyList3.map(z => {
          let temp1 = this.companyList4.find(w => w.mst = z.mst)
          if (temp1) {
            z.so_giay_phep = temp1.so_giay_phep
            z.ngay_cap = temp1.ngay_cap
            z.ngay_het_han = temp1.ngay_het_han
          }
          return z
        })

        let temp2 = this.companyList5
        let temp3 = temp2.reduce(Object)
        this.company = temp3
      },
      (error) => (this.errorMessage = <any>error)
    );
  }

}
