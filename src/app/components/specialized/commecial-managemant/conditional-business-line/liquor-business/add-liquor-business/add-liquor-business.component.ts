import { Component, ElementRef, OnInit, ViewChild, QueryList, ViewChildren } from '@angular/core';
import { NgForm, NumberValueAccessor } from '@angular/forms';
import { FormBuilder, FormGroup, FormArray, Validators } from "@angular/forms";
import { InformationService } from 'src/app/shared/information/information.service';
import { ActivatedRoute, Router } from "@angular/router";
import { CommonFuntions } from 'src/app/components/specialized/commecial-managemant/conditional-business-line/common-functions.service';
import { formatDate } from '@angular/common';

import {
  DistrictModel,
  SubDistrictModel,
  CertificateModel,
  LiquorPost,
  LiquorList
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
import { PostTopProduct } from 'src/app/_models/APIModel/domestic-market.model';
const moment = _rollupMoment || _moment;
export const MY_FORMATS = {
  parse: {
    dateInput: 'YYYY',
  },
  display: {
    dateInput: 'YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
@Component({
  selector: 'app-add-liquor-business',
  templateUrl: './add-liquor-business.component.html',
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
export class AddLiquorBusinessComponent implements OnInit {

  @ViewChild('table', { static: false }) table: ElementRef;
  @ViewChild(MatAccordion, { static: false }) accordion: MatAccordion;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChildren(SpecialDirective) inputs: QueryList<SpecialDirective>

  id: string;

  constructor(
    public excelService: ExcelService,
    public _Service: ConditionBusinessService,
    public formbuilder: FormBuilder,
    public _info: InformationService,
    public router: Router,
    public route: ActivatedRoute
  ) {
    this.route.params.subscribe((params) => {
      this.id = params["id"];
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

  resetForm(form?: NgForm) {
    if (form != null)
      form.form.reset();
    this._Service.liquor = {
      id: null,
      mst: '',
      so_luong: null,
      tri_gia: null,
      time_id: ''
    }
  }

  liquor_data: FormGroup;
  LiquorList: Array<LiquorList> = new Array<LiquorList>();
  LiquorList1: Array<LiquorList> = new Array<LiquorList>();
  liquorobject = new LiquorList();

  getLiquorList() {
    this._Service.GetAllLiquorValue().subscribe(all => {
      this.LiquorList = all.data[0];
      this.LiquorList1 = this.LiquorList.filter(x => x.id_ruou == this.id)
      this.liquorobject = this.LiquorList1[0]

      if (this.id != 'undefined') {
        this._Service.liquor = {
          id: this.id,
          mst: this.liquorobject.mst,
          so_luong: this.liquorobject.so_luong,
          tri_gia: this.liquorobject.tri_gia,
          time_id: this.liquorobject.time_id,
        }
      }
    })
  }

  ngOnInit() {
    this.resetForm();
    this.getQuan_Huyen();
    this.GetAllPhuongXa();
    this.theYear = parseInt(this.getCurrentYear());
    this.getLiquorList()

    this.liquor_data = this.formbuilder.group({
      id: null,
      mst: '',
      so_luong: null,
      tri_gia: null,
      time_id: ''
    })
  }

  SaveData(input) {
    this._Service.PostLiquor(input).subscribe(
      res => {
        // debugger;
        this._info.msgSuccess('Thêm thành công')
        this.router.navigate(['specialized/commecial-management/domestic/tobacco']);
      },
      err => {
        // debugger;
      }
    )
  }

  input: Array<LiquorPost> = new Array<LiquorPost>();
  onSubmit() {
    this.input.push({
      id: null,
      mst: '',
      so_luong: null,
      tri_gia: null,
      time_id: '',
    })

    if (this.id != 'undefined') {
      this.input[0].id = this.id
    }

    this.input[0].mst = this.liquor_data.value.mst
    this.input[0].so_luong = this.liquor_data.value.so_luong
    this.input[0].tri_gia = this.liquor_data.value.tri_gia
    this.input[0].time_id = this.liquor_data.value.time_id

    this.SaveData(this.input);
  }

  public exportTOExcel(filename: string, sheetname: string) {
    this.excelService.exportDomTableAsExcelFile(filename, sheetname, this.table.nativeElement);
  }

  public getCurrentDate() {
    let date = new Date;
    return formatDate(date, 'yyyy-MM-dd', 'en-US');
  }

  public getCurrentYear() {
    let date = new Date;
    return formatDate(date, 'yyyy', 'en-US');
  }

  Convertdate(text: string): string {
    let date: string
    date = text.substring(6, 8) + "-" + text.substring(4, 6) + "-" + text.substring(0, 4)
    return date
  }

  public date = new FormControl(_moment());
  public theYear: number;

  public chosenYearHandler(normalizedYear: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.date.value;
    ctrlValue.year(normalizedYear.year());
    this.date.setValue(ctrlValue);
    this.theYear = normalizedYear.year();
    datepicker.close();
  }

  Back() {
    this.router.navigate(['specialized/commecial-management/domestic/liquor']);
  }
}
