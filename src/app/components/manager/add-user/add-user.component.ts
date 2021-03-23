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
import { InfoUser, UserRole, UserOrg, ChangeInfoUser, ChangePassword, PostInfoUser } from "src/app/_models/user.model";

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
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
export class AddUserComponent implements OnInit {
  postuser: FormGroup
  show: boolean

  resetForm(form?: NgForm) {
    if (form != null)
      form.form.reset();
    this._Service.postuser = {
      user_name: '',
      full_name: '',
      avatar_link: '',
      user_email: '',
      user_phone: '',
      position: '',
      user_role_id: null,
      org_id: null,
      status: true,
      password: ''
    }
  }

  toggle() {
    this.show = !this.show
  }

  id: string;

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
    this.route.params.subscribe((params) => {
      this.id = params["id"];
    });
  }

  UserRole: Array<UserRole> = Array<UserRole>();
  UserOrg: Array<UserOrg> = Array<UserOrg>();

  GetUserRole() {
    this._Service.GetUserRole().subscribe((all) => {
      this.UserRole = all as UserRole[];
    });
  }

  GetUserOrg() {
    this._Service.GetUserOrg().subscribe((all) => {
      this.UserOrg = all as UserOrg[];
    });
  }

  ngOnInit() {
    this.resetForm();
    this.GetInfo();
    this.GetUserRole();
    this.GetUserOrg();

    this.postuser = this.formbuilder.group({
      user_id: null,
      user_name: '',
      full_name: '',
      avatar_link: '',
      user_email: '',
      user_phone: '',
      user_position: '',
      role_id: null,
      org_id: null,
      password: '',
      nPassword: ''
    })
  }

  infouserarray: Array<InfoUser> = Array<InfoUser>();
  infouser: InfoUser

  GetInfo() {
    this._Service.GetUserInfoByID(this.id).subscribe(all => {

      this.infouserarray = all
      this.infouser = this.infouserarray[0]

      this._Service.postuser = {
        user_name: this.infouser.user_name,
        full_name: this.infouser.full_name,
        avatar_link: '',
        user_email: this.infouser.user_email,
        user_phone: this.infouser.user_phone,
        position: this.infouser.user_position,
        user_role_id: this.infouser.role_id,
        org_id: this.infouser.org_id,
        status: true,
        password: ''
      }
    })
  }

  SaveData(input) {
    this._Service.PostUserInfo(input).subscribe(
      res => {
        this._info.msgSuccess('Thay đổi thông tin thành công')
        this.ngOnInit();
      },
      err => {
        this._info.msgError('Thay đổi thông tin không thành công')
      }
    )
  }

  changeinfoarray: Array<PostInfoUser> = new Array<PostInfoUser>();

  onSubmit() {
    this.changeinfoarray.push({
      user_name: '',
      full_name: '',
      user_email: '',
      user_phone: '',
      position: '',
      user_role_id: null,
      org_id: null,
      status: true,
      avatar_link: '',
      password: ''
    })

    this.changeinfoarray[0].user_name = this.postuser.value.user_name
    this.changeinfoarray[0].full_name = this.postuser.value.full_name
    this.changeinfoarray[0].user_email = this.postuser.value.user_email
    this.changeinfoarray[0].user_phone = this.postuser.value.user_phone
    this.changeinfoarray[0].position = this.postuser.value.user_position
    this.changeinfoarray[0].user_role_id = this.postuser.value.role_id
    this.changeinfoarray[0].org_id = this.postuser.value.org_id
    this.changeinfoarray[0].status = true
    this.changeinfoarray[0].password = this.postuser.value.password

    this.SaveData(this.changeinfoarray[0]);
  }
}
