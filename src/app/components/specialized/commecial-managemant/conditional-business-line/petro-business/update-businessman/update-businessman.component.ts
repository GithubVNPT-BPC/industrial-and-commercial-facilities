import { Component, ElementRef, OnInit, ViewChild, QueryList, ViewChildren, Inject } from '@angular/core';
import { MatOption, MatSelect, MatTable, MatTableDataSource } from '@angular/material';
import { formatDate } from '@angular/common';
import { NgForm, NumberValueAccessor } from '@angular/forms';
import { FormBuilder, FormGroup, FormArray, Validators } from "@angular/forms";
import { InformationService } from 'src/app/shared/information/information.service';
import { ActivatedRoute, Router } from "@angular/router";

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import {
  Businessman
} from 'src/app/_models/APIModel/conditional-business-line.model';
import { MatAccordion } from '@angular/material/expansion';
import { MatPaginator } from '@angular/material/paginator';

import { ExcelService } from 'src/app/_services/excelUtil.service';
import { ConditionBusinessService } from 'src/app/_services/APIService/Condition-Business.service';
import { SpecialDirective } from 'src/app/shared/special.directive';

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
  selector: 'app-update-businessman',
  templateUrl: './update-businessman.component.html',
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
export class UpdateBusinessmanComponent implements OnInit {
  @ViewChild('table', { static: false }) table: ElementRef;
  @ViewChild(MatAccordion, { static: false }) accordion: MatAccordion;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  businessman: FormGroup

  resetForm(form?: NgForm) {
    if (form != null)
      form.form.reset();
    this._Service.businessman = {
      id_thuong_nhan: null,
      ten_thuong_nhan: '',
      dia_chi: '',
      so_dien_thoai: '',
    }
  }

  id: string;

  constructor(
    // @Inject(MAT_DIALOG_DATA) public data: any,
    // public dialogRef: MatDialogRef<UpdateBusinessmanComponent>,
    public excelService: ExcelService,
    public _Service: ConditionBusinessService,
    public formbuilder: FormBuilder,
    public _info: InformationService,
    public router: Router,
    public route: ActivatedRoute,
  ) {
    this.route.params.subscribe((params) => {
      this.id = params["id"];
    });
  }

  ngOnInit() {
    this.resetForm();
    this.getBusinessmanList();

    this.businessman = this.formbuilder.group({
      id_thuong_nhan: null,
      ten_thuong_nhan: '',
      dia_chi: '',
      so_dien_thoai: '',
    })
  }

  SaveData(input) {
    this._Service.PostBusinessman(input).subscribe(
      res => {
        // debugger;
        this._info.msgSuccess('Thêm thành công')
        // this.dialogRef.close()
        this.router.navigate(['specialized/commecial-management/domestic/managebusiness']);
      },
      err => {
        // debugger;
      }
    )
  }

  input: Array<Businessman> = new Array<Businessman>();

  onSubmit() {
    this.input.push({
      id_thuong_nhan: null,
      ten_thuong_nhan: '',
      dia_chi: '',
      so_dien_thoai: '',
    })
    this.input[0].ten_thuong_nhan = this.businessman.value.ten_thuong_nhan
    this.input[0].dia_chi = this.businessman.value.dia_chi
    this.input[0].so_dien_thoai = this.businessman.value.so_dien_thoai
    console.log(this.input)
    this.SaveData(this.input);
  }

  businessmanobject = new Businessman();
  dataSource: MatTableDataSource<Businessman> = new MatTableDataSource<Businessman>();
  dataSource1: MatTableDataSource<Businessman> = new MatTableDataSource<Businessman>();

  getBusinessmanList() {
    this._Service.GetBusinessman().subscribe(all => {
      this.dataSource = new MatTableDataSource<Businessman>(all.data);
      this.dataSource1.data = this.dataSource.data.filter(x => x.id_thuong_nhan == this.id)
      this.businessmanobject = this.dataSource1.data[0]

      this._Service.businessman = {
        id_thuong_nhan: this.businessmanobject.id_thuong_nhan,
        ten_thuong_nhan: this.businessmanobject.ten_thuong_nhan,
        dia_chi: this.businessmanobject.dia_chi,
        so_dien_thoai: this.businessmanobject.so_dien_thoai,
      }
    })
  }

  getCurrentDate() {
    let date = new Date;
    return formatDate(date, 'yyyy-MM-dd', 'en-US');
  }

  getCurrentYear() {
    let date = new Date;
    return formatDate(date, 'yyyy', 'en-US');
  }

}
