import { Component, ElementRef, OnInit, ViewChild, QueryList, ViewChildren, Inject } from '@angular/core';
import { MatOption, MatSelect, MatTable, MatTableDataSource } from '@angular/material';
import { formatDate } from '@angular/common';
import { NgForm, NumberValueAccessor } from '@angular/forms';
import { FormBuilder, FormGroup, FormArray, Validators } from "@angular/forms";
import { InformationService } from 'src/app/shared/information/information.service';
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from '@angular/common';

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
import { InfoUser, UserRole, UserOrg, ChangeInfoUser, ChangePassword, Status } from "src/app/_models/user.model";

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
      user_id: null,
      user_name: '',
      full_name: '',
      avatar_link: '',
      user_email: '',
      user_phone: '',
      user_position: '',
      role_id: null,
      org_id: null,
      status: true
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
    public _Service: LoginService,
    public location: Location,
  ) {
    this.show = true

    this.route.params.subscribe((params) => {
      this.id = params["id"];
    });
  }

  UserRole: Array<UserRole> = Array<UserRole>();
  UserOrg: Array<UserOrg> = Array<UserOrg>();
  Status: Array<Status> = [{ status: true, name: 'Hoạt động' }, { status: false, name: 'Ngừng hoạt động' }]

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

    if (this.id == 'undefined') {
      this.GetInfo(this._Service.userValue.user_id.toString());
    }
    else {
      this.GetInfo(this.id);
    }

    this.GetUserRole();
    this.GetUserOrg();

    this.userupdate = this.formbuilder.group({
      user_id: null,
      user_name: '',
      full_name: '',
      avatar_link: '',
      user_email: '',
      user_phone: '',
      user_position: '',
      role_id: null,
      org_id: null,
      status: true,
      password: '',
      nPassword: ''
    })
  }

  infouserarray: Array<InfoUser> = Array<InfoUser>();
  infouser: InfoUser

  GetInfo(user_id: string) {
    this._Service.GetUserInfoByID(user_id).subscribe(all => {

      this.infouserarray = all
      this.infouser = this.infouserarray[0]

      this._Service.userupdate = {
        user_id: this.infouser.user_id,
        user_name: this.infouser.user_name,
        full_name: this.infouser.full_name,
        avatar_link: '',
        user_email: this.infouser.user_email,
        user_phone: this.infouser.user_phone,
        user_position: this.infouser.user_position,
        role_id: this.infouser.role_id,
        org_id: this.infouser.org_id,
        status: this.infouser.status
      }
    })
  }

  SaveData(input, input1) {
    if (input1 != null) {
      this._Service.ChangePassword(input1).subscribe(
        res => {
          this._info.msgSuccess('Thay đổi thông tin thành công')
          if (this.id == 'undefined') {
            this._Service.LogoutUser();
            this.router.navigate(['login']);
          }
          else {
            this.ngOnInit
          }
        },
        err => {
          this._info.msgError('Thay đổi thông tin không thành công')
        }
      )
    }

    this._Service.PutUserInfo(input).subscribe(
      res => {
        this._info.msgSuccess('Thay đổi thông tin thành công')
        this.ngOnInit();
      },
      err => {
        this._info.msgError('Thay đổi thông tin không thành công')
      }
    )
  }

  changeinfoarray: Array<ChangeInfoUser> = new Array<ChangeInfoUser>();
  changepassword: Array<ChangePassword> = new Array<ChangePassword>();

  onSubmit() {
    this.changeinfoarray.push({
      user_id: null,
      user_name: '',
      full_name: '',
      user_email: '',
      user_phone: '',
      position: '',
      role_id: null,
      org_id: null,
      status: true,
      avatar_link: ''
    })

    if (this.id == 'undefined') {
      this.changeinfoarray[0].user_id = this._Service.userValue.user_id
      this.changeinfoarray[0].user_name = this._Service.userValue.username
      this.changeinfoarray[0].full_name = this.userupdate.value.full_name
      this.changeinfoarray[0].user_email = this.userupdate.value.user_email
      this.changeinfoarray[0].user_phone = this.userupdate.value.user_phone
      this.changeinfoarray[0].position = this.userupdate.value.user_position
      this.changeinfoarray[0].role_id = this.userupdate.value.role_id
      this.changeinfoarray[0].org_id = this.userupdate.value.org_id
      this.changeinfoarray[0].status = this.userupdate.value.status
    }
    else {
      this.changeinfoarray[0].user_id = parseInt(this.id)
      this.changeinfoarray[0].user_name = this.userupdate.value.user_name
      this.changeinfoarray[0].full_name = this.userupdate.value.full_name
      this.changeinfoarray[0].user_email = this.userupdate.value.user_email
      this.changeinfoarray[0].user_phone = this.userupdate.value.user_phone
      this.changeinfoarray[0].position = this.userupdate.value.user_position
      this.changeinfoarray[0].role_id = this.userupdate.value.role_id
      this.changeinfoarray[0].org_id = this.userupdate.value.org_id
      this.changeinfoarray[0].status = this.userupdate.value.status
    }

    this.changepassword.push({
      username: '',
      full_name: '',
      password: '',
      nPassword: ''
    })

    if (this.userupdate.value.password != '' && this.userupdate.value.nPassword != '') {
      if (this.id == 'undefined') {
        this.changepassword[0].username = this._Service.userValue.username
        this.changepassword[0].full_name = this.userupdate.value.full_name
        this.changepassword[0].password = this.userupdate.value.password
        this.changepassword[0].nPassword = this.userupdate.value.nPassword
      }
      else {
        this.changepassword[0].username = this.userupdate.value.user_name
        this.changepassword[0].full_name = this.userupdate.value.full_name
        this.changepassword[0].password = this.userupdate.value.password
        this.changepassword[0].nPassword = this.userupdate.value.nPassword
      }

      this.SaveData(this.changeinfoarray[0], this.changepassword[0])
    }

    this.SaveData(this.changeinfoarray[0], null);
  }

  Back() {
    this.location.back();
  }

}
