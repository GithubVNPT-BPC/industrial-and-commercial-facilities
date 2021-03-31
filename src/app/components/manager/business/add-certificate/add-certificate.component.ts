import { Component, ElementRef, OnInit, ViewChild, QueryList, ViewChildren, Inject } from '@angular/core';
import { MatOption, MatSelect, MatTable, MatTableDataSource } from '@angular/material';
import { formatDate } from '@angular/common';
import { NgForm, NumberValueAccessor } from '@angular/forms';
import { FormBuilder, FormGroup, FormArray, Validators } from "@angular/forms";
import { InformationService } from 'src/app/shared/information/information.service';
import { ActivatedRoute, Router } from "@angular/router";

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import {
  CertificateModel,
  CertificateType,
  FieldList
} from 'src/app/_models/APIModel/conditional-business-line.model';
import { MatAccordion } from '@angular/material/expansion';
import { MatPaginator } from '@angular/material/paginator';

import { ExcelService } from 'src/app/_services/excelUtil.service';
import { ConditionBusinessService } from 'src/app/_services/APIService/Condition-Business.service';
import { SpecialDirective } from 'src/app/shared/special.directive';

import { FormControl } from '@angular/forms';
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
  selector: 'app-add-certificate',
  templateUrl: './add-certificate.component.html',
  styleUrls: ['/../../manager_layout.scss'],
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
export class AddCertificateComponent implements OnInit {
  @ViewChild('table', { static: false }) table: ElementRef;
  @ViewChild(MatAccordion, { static: false }) accordion: MatAccordion;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  certificate: FormGroup

  resetForm(form?: NgForm) {
    if (form != null)
      form.form.reset();
    this._Service.certificate = {
      id_giay_phep: null,
      mst: '',
      so_giay_phep: '',
      ngay_cap: '',
      ngay_het_han: '',
      id_loai_giay_phep: 1,
      noi_cap: '',
      co_quan_cap: '',
      ghi_chu: '',
      id_linh_vuc: 1,
    }
  }

  id: number;

  constructor(
    // @Inject(MAT_DIALOG_DATA) public data: any,
    // public dialogRef: MatDialogRef<UpdateCertificateModelComponent>,
    public excelService: ExcelService,
    public _Service: ConditionBusinessService,
    public formbuilder: FormBuilder,
    public _info: InformationService,
    public router: Router,
    public route: ActivatedRoute,
    public datepipe: DatePipe,
  ) {
    this.route.params.subscribe((params) => {
      this.id = params["id"];
    });
  }

  ngOnInit() {
    this.resetForm();
    this.getCertificateList();
    this.getLoaiGiayPhep();
    this.getLinhVuc();

    this.certificate = this.formbuilder.group({
      id_giay_phep: null,
      mst: '',
      so_giay_phep: '',
      ngay_cap: '',
      ngay_het_han: '',
      id_loai_giay_phep: 1,
      noi_cap: '',
      co_quan_cap: '',
      ghi_chu: '',
      id_linh_vuc: 1,
    })
  }

  LoaiGiayPhep: Array<CertificateType> = new Array<CertificateType>();
  LoaiLinhVuc: Array<FieldList> = new Array<FieldList>();
  filterloailinhvuc: Array<FieldList> = new Array<FieldList>();

  getLoaiGiayPhep() {
    this._Service.GetCertificateType().subscribe((all) => {
      this.LoaiGiayPhep = all.data as CertificateType[];
    });
  }

  getLinhVuc() {
    this._Service.GetField().subscribe((all) => {
      this.LoaiLinhVuc = all.data as FieldList[];
      this.filterloailinhvuc = this.LoaiLinhVuc.slice();
    });
  }

  SaveData(input) {
    this._Service.PostCertificate(input).subscribe(
      res => {
        this._info.msgSuccess('Cập nhật thông tin thành công')
        // this.dialogRef.close()
        this.Back()
      },
      err => {
        this._info.msgError('Cập nhật thông tin Không thành công')
      }
    )
  }

  public getChange(param: any): string {
    let datepipe = this.datepipe.transform(param._d, 'yyyyMMdd')
    return datepipe
  }

  input: Array<CertificateModel> = new Array<CertificateModel>();

  onSubmit() {
    this.input.push({
      id_giay_phep: null,
      mst: '',
      so_giay_phep: '',
      ngay_cap: '',
      ngay_het_han: '',
      id_loai_giay_phep: 1,
      noi_cap: '',
      co_quan_cap: '',
      ghi_chu: '',
      id_linh_vuc: 1,
    })

    if (this.id.toString() != 'undefined') {
      this.input[0].id_giay_phep = this.id
    }

    this.input[0].mst = this.certificate.value.mst
    this.input[0].so_giay_phep = this.certificate.value.so_giay_phep
    this.input[0].ngay_cap = this.certificate.value.ngay_cap ? this.getChange(this.certificate.value.ngay_cap) : null
    this.input[0].ngay_het_han = this.certificate.value.ngay_het_han ? this.getChange(this.certificate.value.ngay_het_han) : null
    this.input[0].id_loai_giay_phep = this.certificate.value.id_loai_giay_phep
    this.input[0].noi_cap = this.certificate.value.noi_cap
    this.input[0].co_quan_cap = this.certificate.value.co_quan_cap
    this.input[0].ghi_chu = this.certificate.value.ghi_chu
    this.input[0].id_linh_vuc = this.certificate.value.id_linh_vuc

    this.SaveData(this.input);
  }

  CertificateModelobject = new CertificateModel();
  dataSource: MatTableDataSource<CertificateModel> = new MatTableDataSource<CertificateModel>();
  dataSource1: MatTableDataSource<CertificateModel> = new MatTableDataSource<CertificateModel>();

  ngaycap: Date;
  ngayhethan: Date;

  getCertificateList() {
    this._Service.GetCertificate('').subscribe(all => {
      this.dataSource = new MatTableDataSource<CertificateModel>(all.data);
      this.dataSource1.data = this.dataSource.data.filter(x => x.id_giay_phep == this.id)
      this.CertificateModelobject = this.dataSource1.data[0]

      this.ngaycap = this.CertificateModelobject.ngay_cap ? this.convertstringtodate(this.CertificateModelobject.ngay_cap) : null
      this.ngayhethan = this.CertificateModelobject.ngay_het_han ? this.convertstringtodate(this.CertificateModelobject.ngay_het_han) : null

      this._Service.certificate = {
        id_giay_phep: this.CertificateModelobject.id_giay_phep,
        mst: this.CertificateModelobject.mst,
        so_giay_phep: this.CertificateModelobject.so_giay_phep,
        ngay_cap: this.CertificateModelobject.ngay_cap,
        ngay_het_han: this.CertificateModelobject.ngay_het_han,
        id_loai_giay_phep: this.CertificateModelobject.id_loai_giay_phep,
        noi_cap: this.CertificateModelobject.noi_cap,
        co_quan_cap: this.CertificateModelobject.co_quan_cap,
        ghi_chu: this.CertificateModelobject.ghi_chu,
        id_linh_vuc: this.CertificateModelobject.id_linh_vuc
      }
    })
  }

  convertstringtodate(time: string): Date {
    let year = parseInt(time.substring(0, 4));
    let month = parseInt(time.substring(4, 6));
    let day = parseInt(time.substring(6, 8));

    let date = new Date(year, month - 1, day);
    return date
  }

  date = new FormControl(moment);
  pickedDate = {
    date: new Date()
  }

  getCurrentDate() {
    let date = new Date;
    return formatDate(date, 'yyyy-MM-dd', 'en-US');
  }

  getCurrentYear() {
    let date = new Date;
    return formatDate(date, 'yyyy', 'en-US');
  }

  Back() {
    this.router.navigate(['manager/business/certificate']);
  }
}
