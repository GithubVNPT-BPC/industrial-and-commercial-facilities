import { Component, Injector } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material';
import { ConformityAnnouncementModel } from 'src/app/_models/APIModel/certificate-regulation';

import { BaseComponent } from 'src/app/components/specialized/base.component';
import { IndustryManagementService } from 'src/app/_services/APIService/industry-management.service';
import { EnterpriseService } from 'src/app/_services/APIService/enterprise.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import moment from 'moment';
import { LoginService } from 'src/app/_services/APIService/login.service';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-certificate-regulation',
  templateUrl: './certificate-regulation.component.html',
  styleUrls: ['/../../special_layout.scss'],
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
  sanluongnam: number;
  soLuongDoanhNghiep: number;
  isChecked: boolean;
  selectedFile: File = null;
  fileBin;
  mstOptions: [];
  _timeout: any = null;

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
    public _login: LoginService
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
  }

  getLinkDefault() {
    this.LINK_DEFAULT = "/specialized/industry-management/cr";
    this.TITLE_DEFAULT = "Công nghiệp - Công bố hợp quy";
    this.TEXT_DEFAULT = "Công nghiệp - Công bố hợp quy";
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
      id_loai_san_pham: new FormControl('', Validators.required),
      file_name: new FormControl(),
      attachment_id: new FormControl(),
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
      this.formData.controls['ngay_tiep_nhan'].setValue(new Date(selectedRecord.ngay_tiep_nhan));
      this.formData.controls['tieu_chuan_san_pham'].setValue(selectedRecord.tieu_chuan_san_pham);
      this.formData.controls['noi_cap'].setValue(selectedRecord.noi_cap);
      this.formData.controls['id_loai_san_pham'].setValue(selectedRecord.id_loai_san_pham);
      this.formData.controls['file_name'].setValue(selectedRecord.file_name);
      this.formData.controls['attachment_id'].setValue(selectedRecord.attachment_id);
      this.fileBin = selectedRecord.datas;
      this.id_cbhq = selectedRecord.id;
    }
  }

  GetComformityAnnounceData() {
    this.industryManagementService.GetComformityAnnounce().subscribe(res => {
      this.filteredDataSource.data = [];
      if (res.data && res.data.length > 0) {
        res.data.forEach(element => element.ngay_tiep_nhan = this.formatDate(element.ngay_tiep_nhan));
        this.dataSource = new MatTableDataSource<ConformityAnnouncementModel>(res['data']);
        this.filteredDataSource.data = [...this.dataSource.data];
      }
      this._prepareData();
      this.paginatorAgain();
    })
  }

  findEnterpriseByMst(mst) {
    let self = this;
    this._timeout = null;
    if (this._timeout) { //if there is already a timeout in process cancel it
      window.clearTimeout(this._timeout);
    }
    this._timeout = window.setTimeout(() => {
      self.enterpriseService.GetLikeEnterpriseByMst(mst).subscribe(
        results => {
          if (results && results.data && results.data[0].length) {
            self.mstOptions = results.data[0];
          }
        },
        error => this.errorMessage = <any>error
      );
      self._timeout = null;
    }, 2000);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filteredDataSource.filter = filterValue.trim().toLowerCase();
  }

  onFileSelected(event) {
    if (event.target.files.length) {
      this.selectedFile = <File>event.target.files[0];
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.fileBin = event.target.result;
      }
      reader.readAsDataURL(this.selectedFile);
      this.formData.controls['file_name'].setValue(event.target.files[0].name);
    }
  }

  _prepareData() {
    this.soLuongDoanhNghiep = this.filteredDataSource.data.length;
  }

  switchView() {
    super.switchView();
    this.selectedFile = null;
    this.fileBin = null;
  }

  resetAll() {
    super.resetAll();
    this.selectedFile = null;
    this.fileBin = null;
  }

  clearTable(event) {
    super.clearTable(event);
    this.selectedFile = null;
    this.fileBin = null;
  }

  applyActionCheck(event) {
    this.filteredDataSource.filter = (event.checked) ? "true" : "";
    this.paginatorAgain();
  }

  prepareRemoveData() {
    let datas = this.selection.selected.map(element => new Object({ id: element.id }));
    return datas;
  }

  prepareData(data) {
    data['ngay_tiep_nhan'] = moment(data['ngay_tiep_nhan']).format('yyyyMMDD');
    if (this.selectedFile !== null) {
      data['attachment'] = { file_name: this.selectedFile.name, binary: this.fileBin }
    }
    return data;
  }

  callService(data) {
    this.industryManagementService.PostComformityAnnounce(data).subscribe(response => this.successNotify(response), error => this.errorNotify(error));
  }

  callEditService(data) {
    let body = Object.assign({}, this.formData.value);
    // if (data.attachment_id && this.selectedFile) {
    //   data['attachment'] = { file_name: this.selectedFile.name ? this.selectedFile.name : 'old_file', binary: this.fileBin, id: data.attachment_id }
    // }
    if (this.selectedFile !== null) {
      // data['attachment'] = { file_name: this.selectedFile.name, binary: this.fileBin }
      body['attachment'] = { file_name: this.selectedFile.name, binary: this.fileBin };
    }
    this.industryManagementService.UpdateComformityAnnounce(body).subscribe(response => this.successNotify(response), error => this.errorNotify(error));
  }

  callRemoveService(data) {
    this.industryManagementService.DeleteCBHQ(data).subscribe(response => this.successNotify(response), error => this.errorNotify(error));
  }

  private openPreviewer(content, file_data = false) {
    this.fileBin = file_data ? file_data : this.fileBin;
    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', scrollable: true });
  }

  formatDateTime(date) {
    return date._i.slice(6, 8) + '/' + date._i.slice(4, 6) + '/' + date._i.slice(0, 4);
  }
}
