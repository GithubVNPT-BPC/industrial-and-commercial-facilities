import { Component, Injector } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { ConformityAnnouncementModel } from 'src/app/_models/APIModel/certificate-regulation';

import {
  CertificateViewModel
} from 'src/app/_models/APIModel/conditional-business-line.model';
import { environment } from 'src/environments/environment';

import { FormControl } from '@angular/forms';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { BaseComponent } from 'src/app/components/specialized/base.component';
import { IndustryManagementService } from 'src/app/_services/APIService/industry-management.service';
import { EnterpriseService } from 'src/app/_services/APIService/enterprise.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConditionBusinessService } from 'src/app/_services/APIService/Condition-Business.service';

import { LoginService } from 'src/app/_services/APIService/login.service';
import { Validators } from '@angular/forms';

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
  selector: 'app-certificate-regulation',
  templateUrl: './certificate-regulation.component.html',
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
export class CertificateRegulationComponent extends BaseComponent {
  //TS & HTML Variable
  public dataSource: MatTableDataSource<ConformityAnnouncementModel>;
  public filteredDataSource: MatTableDataSource<ConformityAnnouncementModel>;

  displayedFields = {
    mst: "Mã số thuế",
    ten_doanh_nghiep: "Tên doanh nghiệp",
    dia_chi_day_du: "Địa chỉ",
    email: "Email",
    so_dien_thoai: "Số điện thoại",
    ten_san_pham: 'Sản phẩm',
    ten_loai_san_pham: "Loại sản phẩm",
    tieu_chuan_san_pham: 'Tiêu chuẩn sản phẩm',
    noi_cap: 'Nơi cấp',
    ban_cong_bo_hop_quy: "Bản công bố hợp quy",
    ngay_tiep_nhan: "Ngày tiếp nhận",
    thoi_gian_chinh_sua_cuoi: "Thời gian cập nhật"
  }

  //Only TS Variable
  soLuongDoanhNghiep: number;

  ds_sp: any[] = [
    { id_loai_san_pham: 1, ten_san_pham: "Thực phẩm" },
    { id_loai_san_pham: 2, ten_san_pham: "May mặc" },
    { id_loai_san_pham: 3, ten_san_pham: "Giấy-khăn giấy" },
    { id_loai_san_pham: 4, ten_san_pham: "Nhóm 2" },
    { id_loai_san_pham: 5, ten_san_pham: "Sản phẩm khác" },
  ]

  constructor(
    private injector: Injector,
    private modalService: NgbModal,
    private industryManagementService: IndustryManagementService,
    public enterpriseService: EnterpriseService,
    public _login: LoginService,
    public _Service: ConditionBusinessService,
  ) {
    super(injector);
  }

  authorize: boolean = true

  ngOnInit() {
    super.ngOnInit();
    this.GetComformityAnnounceData();

    if (this._login.userValue.user_role_id == 5 || this._login.userValue.user_role_id == 1) {
      this.authorize = false
    }

    this.GetAllGiayPhep();

    this.mstfilter.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterMST();
      });
  }

  public _onDestroy = new Subject<void>();

  getLinkDefault() {
    this.LINK_DEFAULT = "/specialized/industry-management/cr";
    this.TITLE_DEFAULT = "Công nghiệp - Công bố hợp quy";
    this.TEXT_DEFAULT = "Công nghiệp - Công bố hợp quy";
  }

  allcertificate: Array<CertificateViewModel> = new Array<CertificateViewModel>();
  public filterallcertificate: ReplaySubject<CertificateViewModel[]> = new ReplaySubject<CertificateViewModel[]>(1);
  GetAllGiayPhep() {
    this._Service.GetCertificate('').subscribe((allrecords) => {
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

  getFormParams() {
    return {
      id: new FormControl(),
      mst: new FormControl('', Validators.required),
      ten_san_pham: new FormControl('', Validators.required),
      ban_cong_bo_hop_quy: new FormControl(),
      ngay_tiep_nhan: new FormControl(),
      duong_dan_nhan_san_pham: { value: '', disabled: true },
      tieu_chuan_san_pham: new FormControl(),
      noi_cap: new FormControl("Bình Phước"),
      id_loai_san_pham: new FormControl(1, Validators.required),
    }
  }

  id_cbhq: number

  setFormParams() {
    if (this.selection.selected.length) {
      let selectedRecord = this.selection.selected[0];
      this.formData.controls['id'].setValue(selectedRecord.id);
      this.formData.controls['mst'].setValue(selectedRecord.mst);
      this.formData.controls['ten_san_pham'].setValue(selectedRecord.ten_san_pham);
      this.formData.controls['ban_cong_bo_hop_quy'].setValue(selectedRecord.ban_cong_bo_hop_quy);
      this.formData.controls['ngay_tiep_nhan'].setValue(selectedRecord.ngay_tiep_nhan._d);
      this.formData.controls['tieu_chuan_san_pham'].setValue(selectedRecord.tieu_chuan_san_pham);
      this.formData.controls['noi_cap'].setValue(selectedRecord.noi_cap);
      this.formData.controls['id_loai_san_pham'].setValue(selectedRecord.id_loai_san_pham);
      this.id_cbhq = selectedRecord.id;
      this.getfilesbyid();
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filteredDataSource.filter = filterValue.trim().toLowerCase();
  }

  _prepareData() {
    this.soLuongDoanhNghiep = this.filteredDataSource.data.length;
  }

  prepareData(data) {
    data['ngay_tiep_nhan'] = _moment(data['ngay_tiep_nhan']).format('yyyyMMDD');
    return data;
  }

  callService(data) {
    this.industryManagementService.PostComformityAnnounce(data).subscribe(response => {
      this.successNotify(response);
      this.uploadfiles(response.data.last_inserted_id)
    }
      , error => this.errorNotify(error));
  }

  callEditService(data) {
    let body = Object.assign({}, this.formData.value);
    body['ngay_tiep_nhan']  = _moment(body['ngay_tiep_nhan']).format('yyyyMMDD');
    this.industryManagementService.PostComformityAnnounce(body).subscribe(response => this.successNotify(response), error => this.errorNotify(error));
    this.uploadfiles(this.id_cbhq)
    this.deleteFiles();
  }

  prepareRemoveData() {
    let datas = this.selection.selected.map(element => new Object({ id: element.id }));
    return datas;
  }

  callRemoveService(data) {
    this.industryManagementService.DeleteCBHQ(data).subscribe(response => this.successNotify(response), error => this.errorNotify(error));
  }

  fileBin;
  private openPreviewer(content, file_data = false) {
    this.fileurlsviewer = []
    this.filedataviewer = []
    this.fileBin = file_data ? file_data : this.fileBin;
    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', scrollable: true });
  }

  fileurlsviewer = [];
  filedataviewer = [];
  temp = []
  temp_id
  private openFiles(content, id) {
    this.fileurlsviewer = []
    this.filedataviewer = []

    this.temp_id = id
    let fileviewer = this.temp.filter(x => x.id_cbhq == id)
    this.fileurlsviewer = fileviewer.map(x => x.delete)
    this.filedataviewer = fileviewer.map(x => new Object({ data: x.duong_dan }))

    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', scrollable: true });
  }

  openpdffile(data) {
    let url = data
    window.open(url, '_blank');
  }

  filesource: any

  GetComformityAnnounceData() {
    this.industryManagementService.GetComformityAnnounce().subscribe(res => {
      this.filteredDataSource.data = [];
      if (res.data && res.data.length > 0) {
        res.data[0].forEach(element => element.ngay_tiep_nhan = this.formatDate(element.ngay_tiep_nhan));
        this.dataSource = new MatTableDataSource<ConformityAnnouncementModel>(res.data[0]);
        this.filteredDataSource.data = [...this.dataSource.data];
        this.filesource = res.data[1]

        this.temp = this.filesource
        this.temp.forEach(element => {
          element.delete = element.duong_dan
          element.duong_dan = this.serverUrl + element.duong_dan
        });
      }
      this._prepareData();
      this.paginatorAgain();
    })
  }

  fileurls = [];
  filedata = [];
  fileToUpload: Array<File> = []
  onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        var reader = new FileReader();
        reader.onload = (event: any) => {
          this.filedata.push({ data: event.target.result })
        }
        reader.readAsDataURL(event.target.files[i])
        this.fileurls.push(event.target.files[i].name)
        this.fileToUpload.push(event.target.files[i])
      }
    }
  }

  uploadfiles(id_cbhq) {
    if (this.fileToUpload.length != 0) {
      for (const file of this.fileToUpload) {
        this.industryManagementService.PostComformityAnnounceFiles(file, parseInt(id_cbhq)).subscribe(res => {
          // this.successNotify(res);
        })
      }
    }
  }

  serverUrl = environment.apiEndpoint
  filesedit

  getfilesbyid(){
    this.fileToUpload = []
    this.filesDelete = []
    this.fileurls = []
    this.filedata = []
    this.fileurlsedit = []
    this.filedataedit = []

    this.filesedit = this.temp.filter(x => x.id_cbhq == this.id_cbhq)
    this.fileurlsedit = this.filesedit.map(x => x.delete)
    this.filedataedit = this.filesedit.map(x => new Object({ data: x.duong_dan }))
  }

  fileurlsedit = [];
  filedataedit = [];
  filesDelete = [];
  Deletefile(i) {
    this.confirmationDialogService.confirm('Xác nhận', 'Bạn chắc chắn muốn xóa?', 'Đồng ý', 'Đóng')
      .then(confirm => {
        if (confirm) {
          this.filesDelete.push(this.filesedit[i]);
          this.filesedit.splice(i, 1)
          this.fileurlsedit.splice(i, 1)
          this.filedataedit.splice(i, 1)
          return;
        }
      })
      .catch((err) => console.log('Hủy không thao tác: \n' + err));
  }

  deleteFiles() {
    let temp = this.filesDelete.map(x => new Object({ file_name: x.delete }))

    if (temp.length != 0) {
        this.industryManagementService.DeleteComformityAnnounceFiles(temp, this.id_cbhq).subscribe(res => {
            this.successNotify(res)
        }, error => this.errorMessage(error));
    }
  }

  removefile(i) {
    this.confirmationDialogService.confirm('Xác nhận', 'Bạn chắc chắn muốn xóa?', 'Đồng ý', 'Đóng')
      .then(confirm => {
        if (confirm) {
          this.fileurls.splice(i, 1);
          this.filedata.splice(i, 1);
          this.fileToUpload.splice(i, 1);
          return;
        }
      })
      .catch((err) => console.log('Hủy không thao tác: \n' + err));
  }
}
