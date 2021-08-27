import { Component, ElementRef, OnInit, ViewChild, QueryList, ViewChildren } from '@angular/core';
import { NgForm, NumberValueAccessor } from '@angular/forms';
import { FormBuilder, FormGroup, FormArray, Validators } from "@angular/forms";
import { InformationService } from 'src/app/shared/information/information.service';
import { ActivatedRoute, Router } from "@angular/router";
import { CommonFuntions } from 'src/app/components/specialized/commecial-managemant/conditional-business-line/common-functions.service';
import { MatOption, MatSelect, MatTable, MatTableDataSource } from '@angular/material';

import {
  DistrictModel,
  SubDistrictModel,
  CertificateModel,
  PetrolPost,
  Status,
  PetrolList,
} from 'src/app/_models/APIModel/conditional-business-line.model';
import { MatAccordion } from '@angular/material/expansion';
import { MatPaginator } from '@angular/material/paginator';

import { ExcelService } from 'src/app/_services/excelUtil.service';
import { ConditionBusinessService } from 'src/app/_services/APIService/Condition-Business.service';
import { SpecialDirective } from 'src/app/shared/special.directive';
import { KeyboardService } from 'src/app/shared/services/keyboard.service';

import { FormControl } from '@angular/forms';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-add-store',
  templateUrl: './add-store.component.html',
  styleUrls: ['../../../../special_layout.scss'],
  providers: [
  ],
})
export class AddStoreComponent implements OnInit {
  @ViewChild('table', { static: false }) table: ElementRef;
  @ViewChild(MatAccordion, { static: false }) accordion: MatAccordion;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChildren(SpecialDirective) inputs: QueryList<SpecialDirective>

  id: number
  mst: string

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
      this.mst = params["mst"];
    });
  }

  subdistrict: Array<SubDistrictModel> = new Array<SubDistrictModel>();
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

  district: Array<DistrictModel> = new Array<DistrictModel>();
  getQuan_Huyen() {
    this._Service.GetAllDistrict().subscribe((allDistrict) => {
      this.district = allDistrict["data"] as DistrictModel[];
    });
  }

  Certificate: Array<CertificateModel> = new Array<CertificateModel>();
  GetGiayPhep(mst: string) {
    this._Service.GetCertificate(mst).subscribe((allrecords) => {
      this.Certificate = allrecords.data as CertificateModel[];
    });
  }

  allcertificate: Array<CertificateModel> = new Array<CertificateModel>();
  public filterallcertificate: ReplaySubject<CertificateModel[]> = new ReplaySubject<CertificateModel[]>(1);
  GetAllGiayPhep() {
    this._Service.GetCertificate('').subscribe((allrecords) => {
      this.allcertificate = allrecords.data as CertificateModel[];
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
      this.allcertificate.filter(x => x.mst.toLowerCase().indexOf(search) > -1)
    );
  }

  trangthai: Array<Status> = [
    {
      id_tinh_trang_hoat_dong: 1,
      tinh_trang_hoat_dong: 'Hoạt động'
    },
    {
      id_tinh_trang_hoat_dong: 2,
      tinh_trang_hoat_dong: 'Ngừng hoạt động'
    },
    {
      id_tinh_trang_hoat_dong: 3,
      tinh_trang_hoat_dong: 'Cho thuê lại'
    }
  ]

  resetForm(form?: NgForm) {
    if (form != null)
      form.form.reset();
    this._Service.petrol = {
      id_cua_hang_xang_dau: null,
      ten_cua_hang: '',
      mst: this.mstt,
      dia_chi: '',
      id_phuong_xa: 25195,
      so_dien_thoai: '',
      id_tinh_trang_hoat_dong: 1,
      ten_quan_ly: '',
      ten_nhan_vien: '',
      id_giay_phep: 0,
      san_luong: 0,
      ghi_chu: '',
      time_id: ''
    }
  }

  petrol_data: FormGroup;
  find_mst: FormGroup;

  ngOnInit() {
    this.resetForm();
    this.getQuan_Huyen();
    this.GetAllPhuongXa();
    this.getPetrolInfo();
    this.GetAllGiayPhep();
    this.GetGiayPhep(this.mst);

    this.petrol_data = this.formbuilder.group({
      id_cua_hang_xang_dau: null,
      ten_cua_hang: '',
      mst: this.mstt,
      dia_chi: '',
      id_phuong_xa: 25195,
      so_dien_thoai: '',
      id_tinh_trang_hoat_dong: 1,
      ten_quan_ly: '',
      ten_nhan_vien: '',
      id_giay_phep: 0
    })

    this.find_mst = this.formbuilder.group({
      find_mst: ''
    })

    if (this.id.toString() != 'undefined') {
      this.check_mst = false
    }

    this.mstfilter.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterMST();
      });

    this.phuongxafilter.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterPhuongxa();
      });
  }

  public _onDestroy = new Subject<void>();

  SaveData(input) {
    this._Service.PostPetrol(input).subscribe(
      res => {
        this._info.msgSuccess('Thêm thành công')
        this.router.navigate(['specialized/commecial-management/domestic/petrolstore']);
      },
      err => {
      }
    )
  }

  petrolobject = new PetrolList();
  store1: Array<PetrolList> = new Array<PetrolList>();
  store2: Array<PetrolList> = new Array<PetrolList>();

  getPetrolInfo() {
    this._Service.GetAllPetrolStore().subscribe(all => {
      this.store1 = all.data
      this.store2 = this.store1.filter(x => x.id_cua_hang_xang_dau == this.id)
      this.petrolobject = this.store2[0];

      this._Service.petrol = {
        id_cua_hang_xang_dau: this.petrolobject.id_cua_hang_xang_dau,
        ten_cua_hang: this.petrolobject.ten_cua_hang,
        mst: this.petrolobject.mst,
        dia_chi: this.petrolobject.dia_chi,
        id_phuong_xa: this.petrolobject.id_phuong_xa,
        so_dien_thoai: this.petrolobject.so_dien_thoai,
        id_tinh_trang_hoat_dong: this.petrolobject.id_tinh_trang_hoat_dong,
        ten_quan_ly: this.petrolobject.ten_quan_ly,
        ten_nhan_vien: this.petrolobject.ten_nhan_vien,
        id_giay_phep: this.petrolobject.id_giay_phep,
        time_id: this.petrolobject.time_id,
        ghi_chu: this.petrolobject.ghi_chu,
        san_luong: this.petrolobject.san_luong
      }
    })
  }

  check_mst: boolean = true;
  mstt: string;
  input: PetrolPost;
  onSubmit() {
    this.input = this.petrol_data.value
    this.SaveData(this.input);
  }

  ChooseMST() {
    this.check_mst = false
    this.mstt = this.find_mst.value.find_mst
    this._Service.petrol.mst = this.mstt
    this.GetGiayPhep(this.mstt);
  }

  public exportTOExcel(filename: string, sheetname: string) {
    this.excelService.exportDomTableAsExcelFile(filename, sheetname, this.table.nativeElement);
  }

  Back() {
    this.router.navigate(['specialized/commecial-management/domestic/petrolstore']);
  }
}
