import { Component, Injector } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { BaseComponent } from '../../base.component';
import { FormControl, FormGroup } from '@angular/forms';
import { IndustryManagementService } from 'src/app/_services/APIService/industry-management.service';
import { LoginService } from 'src/app/_services/APIService/login.service';
import {
  CertificateViewModel
} from 'src/app/_models/APIModel/conditional-business-line.model';

import { ConditionBusinessService } from 'src/app/_services/APIService/Condition-Business.service';

import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import {
  SubDistrictModel,
} from "src/app/_models/APIModel/domestic-market.model";
import { CommerceManagementService } from 'src/app/_services/APIService/commerce-management.service';

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

export class supportbusiness {
  id: number;
  ten_dn: string;
  mst: string;
  id_phuong_xa: number;
  dien_thoai: string;
  nganh_nghe: string;
  giay_cn: string;
  ngay_cap: Date;
  ngay_het_han: Date;
  dia_chi_day_du: string;
  ten_quan_huyen: string;
}

export class SPBusinessFilterModel {
  id_quan_huyen: number[];
}

@Component({
  selector: 'app-support-business',
  templateUrl: './support-business.component.html',
  styleUrls: ['/../../special_layout.scss'],
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
export class SupportBusinessComponent extends BaseComponent {

  totalColumns: string[] = ['select', 'index', 'ten_dn', 'mst', 'dia_chi_day_du', 'dien_thoai', 'nganh_nghe',
    'giay_cn', 'ngay_cap', 'ngay_het_han', 'thoi_gian_chinh_sua_cuoi'];

  dataSource: MatTableDataSource<supportbusiness> = new MatTableDataSource<supportbusiness>();
  filteredDataSource: MatTableDataSource<supportbusiness> = new MatTableDataSource<supportbusiness>();
  filterModel: SPBusinessFilterModel = { id_quan_huyen: [] };
  DB_TABLE = 'QLCN_DOANH_NGHIEP_HO_TRO'

  constructor(
    public indService: IndustryManagementService,
    public router: Router,
    private injector: Injector,
    public _login: LoginService,
    public commerceManagementService: CommerceManagementService,
    public _Service: ConditionBusinessService,
    // public _Service1: MarketService,
  ) {
    super(injector)
  }

  authorize: boolean = true

  ngOnInit() {
    super.ngOnInit();
    this.getSPBusiness();
    this.GetAllPhuongXa();
    if (this._login.userValue.user_role_id == 5 || this._login.userValue.user_role_id == 1) {
      this.authorize = false
    }

    this.phuongxafilter.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterPhuongxa();
      });

    this.GetAllGiayPhep();

    this.mstfilter.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterMST();
      });

    this.GetAllGiayPhep1();

    this.mstfilter1.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterMST1();
      });
  }

  allcertificate: Array<CertificateViewModel> = new Array<CertificateViewModel>();
  public filterallcertificate: ReplaySubject<CertificateViewModel[]> = new ReplaySubject<CertificateViewModel[]>(1);
  GetAllGiayPhep() {
    this._Service.GetALLCompany('ALL').subscribe((allrecords) => {
      this.allcertificate = allrecords.data as CertificateViewModel[];
      this.filterallcertificate.next(this.allcertificate.slice());
    });
  }
  public mstfilter: FormControl = new FormControl();
  public filterMST() {
    if (!this.allcertificate) {
      return;
    }
    let search = this.mstfilter.value;
    if (!search) {
      this.filterallcertificate.next(this.allcertificate.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filterallcertificate.next(
      this.allcertificate.filter(x => x.combine.toLowerCase().indexOf(search) > -1)
    );
  }

  allcertificate1: Array<CertificateViewModel> = new Array<CertificateViewModel>();
  public filterallcertificate1: ReplaySubject<CertificateViewModel[]> = new ReplaySubject<CertificateViewModel[]>(1);
  GetAllGiayPhep1() {
    this._Service.GetALLCompany('FILTER').subscribe((allrecords) => {
      this.allcertificate1 = allrecords.data as CertificateViewModel[];
      this.filterallcertificate1.next(this.allcertificate1.slice());
    });
  }
  public mstfilter1: FormControl = new FormControl();
  public filterMST1() {
    if (!this.allcertificate1) {
      return;
    }
    let search = this.mstfilter1.value;
    if (!search) {
      this.filterallcertificate1.next(this.allcertificate1.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filterallcertificate1.next(
      this.allcertificate1.filter(x => x.combine1.toLowerCase().indexOf(search) > -1)
    );
  }

  public _onDestroy = new Subject<void>();

  getLinkDefault() {
    this.LINK_DEFAULT = "/specialized/industry-management/supportbusiness";
    this.TITLE_DEFAULT = "Doanh nghiệp công nghiệp hỗ trợ";
    this.TEXT_DEFAULT = "Doanh nghiệp công nghiệp hỗ trợ";
  }

  getSPBusiness() {
    this.indService.GetSupportBusiness().subscribe(result => {
      this.filteredDataSource.data = [];
      let companytemp = result.data[0].map(a => {
        let temp = result.data[1].filter(b => b.mst === a.mst)

        let temp3 = temp.map(c => c.nganh_nghe_kd_chinh)
        if (temp3 == undefined || temp3 == null) {
          a.nganh_nghe = null
        }
        else {
          a.nganh_nghe = temp3.join('; ')
        }

        return a
      })

      companytemp.forEach(element => {
        element.ngay_cap = this.formatDate(element.ngay_cap)
        element.ngay_het_han = this.formatDate(element.ngay_het_han)
      });
      this.dataSource = new MatTableDataSource<supportbusiness>(companytemp);
      this.filteredDataSource.data = [...this.dataSource.data];
      this.paginatorAgain();
    })
  }

  GetCompanyInfoById() {
    // this._Service1.GetCompanyInfoById(this.mst).subscribe(
    //   allrecords => {
    //   });
  }

  setFormParams() {
    if (this.selection.selected.length) {
      let selectedRecord = this.selection.selected[0];
      this.formData.controls['id'].setValue(selectedRecord.id);
      this.formData.controls['ten_dn'].setValue(selectedRecord.ten_dn);
      this.formData.controls['mst'].setValue(selectedRecord.mst);
      this.formData.controls['id_phuong_xa'].setValue(selectedRecord.id_phuong_xa);
      this.formData.controls['dien_thoai'].setValue(selectedRecord.dien_thoai);
      this.formData.controls['nganh_nghe'].setValue(selectedRecord.nganh_nghe);
      this.formData.controls['giay_cn'].setValue(selectedRecord.giay_cn);
      this.formData.controls['ngay_cap'].setValue(selectedRecord.ngay_cap._d);
      this.formData.controls['ngay_het_han'].setValue(selectedRecord.ngay_het_han._d);
      this.formData.controls['dia_chi'].setValue(selectedRecord.dia_chi);
    }
  }

  getFormParams() {
    return {
      id: new FormControl(),
      ten_dn: new FormControl(''),
      mst: new FormControl(''),
      id_phuong_xa: new FormControl(25195),
      dien_thoai: new FormControl(''),
      nganh_nghe: new FormControl(''),
      giay_cn: new FormControl(),
      ngay_cap: new FormControl(''),
      ngay_het_han: new FormControl(''),
      dia_chi: new FormControl(''),
    }
  }

  public subdistrict: Array<SubDistrictModel> = new Array<SubDistrictModel>();
  public filtersubdistrict: ReplaySubject<SubDistrictModel[]> = new ReplaySubject<SubDistrictModel[]>(1);
  GetAllPhuongXa() {
    this.commerceManagementService.GetAllSubDistrict().subscribe((allrecords) => {
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

  prepareData(data) {
    data['ngay_cap'] = data['ngay_cap'] ? _moment(data['ngay_cap']).format('yyyyMMDD') : ''
    data['ngay_het_han'] = data['ngay_het_han'] ? _moment(data['ngay_het_han']).format('yyyyMMDD') : ''

    return data;
  }

  public callService(data) {
    this.indService.PostSupportBusiness([data]).subscribe(response => {
      this.successNotify(response)
    }, error => this.errorNotify(error));
  }

  prepareRemoveData(data) {
    let datas = data.map(element => new Object({ id: element.id }));
    return datas;
  }

  callRemoveService(data) {
    this.indService.DeleteSupportBusiness(data).subscribe(response => this.successNotify(response), error => this.errorNotify(error));
  }

}
