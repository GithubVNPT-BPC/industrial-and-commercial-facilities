import { Component, ElementRef, OnInit, ViewChild, QueryList, ViewChildren, Inject } from '@angular/core';
import { MatOption, MatSelect, MatTable, MatTableDataSource } from '@angular/material';
import { formatDate } from '@angular/common';
import { NgForm, NumberValueAccessor } from '@angular/forms';
import { FormBuilder, FormGroup, FormArray, Validators } from "@angular/forms";
import { InformationService } from 'src/app/shared/information/information.service';
import { ActivatedRoute, Router } from "@angular/router";

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { MatAccordion } from '@angular/material/expansion';
import { MatPaginator } from '@angular/material/paginator';

import { ExcelService } from 'src/app/_services/excelUtil.service';

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

import { LoginService } from "src/app/_services/APIService/login.service";
import { user_model, ChangePassword } from "src/app/_models/user.model";


@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['../manager_layout.scss'],
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
export class UpdateUserComponent implements OnInit {
  userupdate: FormGroup
  show: boolean

  resetForm(form?: NgForm) {
    if (form != null)
      form.form.reset();
    this._Service.userupdate = {
      username: '',
      password: '',
      nPassword: ''
    }
  }

  toggle() {
    this.show = !this.show
  }

  constructor(
    public excelService: ExcelService,
    public formbuilder: FormBuilder,
    public _info: InformationService,
    public router: Router,
    public route: ActivatedRoute,
    public datepipe: DatePipe,
    public _Service: LoginService
  ) {
    this.show = true
  }

  ngOnInit() {
    this.resetForm();

    this.userupdate = this.formbuilder.group({
      username: '',
      password: '',
      nPassword: ''
    })

    this._Service.userupdate = {
      username: this._Service.userValue.username,
      password: '',
      nPassword: ''
    }
  }

  SaveData(input) {
    this._Service.ChangePassword(input).subscribe(
      res => {
        this._info.msgSuccess('Thay đổi thông tin thành công')
        this._Service.LogoutUser();
        this.router.navigate(['login']);
      },
      err => {
      }
    )
  }

  onSubmit() {
    this.SaveData(this.userupdate.value);
  }

}
