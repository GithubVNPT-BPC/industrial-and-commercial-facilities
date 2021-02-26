import { Component, Injector } from '@angular/core';
import {  FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material';
import { ConformityAnnouncementModel } from 'src/app/_models/APIModel/certificate-regulation';

import { BaseComponent } from 'src/app/components/specialized/specialized-base.component';
import { IndustryManagementService } from 'src/app/_services/APIService/industry-management.service';

import moment from 'moment';

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
    // duong_dan_nhan_san_pham: "Đường dẫn",
    ban_cong_bo_hop_quy: "Bản công bố hợp quy",
    ngay_tiep_nhan: "Ngày tiếp nhận",
  }

  //Only TS Variable
  sanluongnam: number;
  soLuongDoanhNghiep: number;
  isChecked: boolean;
  
  ds_sp: any[] = [
    {id_loai_san_pham: 1, ten_san_pham: "Thực phẩm"},
    {id_loai_san_pham: 2,	ten_san_pham: "May mặc"}
  ]

  constructor(
    private injector: Injector,
    private industryManagementService: IndustryManagementService
  ) {
      super(injector);
  }

  ngOnInit() {
    super.ngOnInit();
    this.GetComformityAnnounceData(); 
  }

  getLinkDefault(){
    this.LINK_DEFAULT = "/specialized/industry-management/cr";
    this.TITLE_DEFAULT = "Công nghiệp - Công bố hợp quy";
    this.TEXT_DEFAULT = "Công nghiệp - Công bố hợp quy";
  } 

  getFormParams() {
    return {
      mst: new FormControl(),
      ten_san_pham: new FormControl(),
      ban_cong_bo_hop_quy: new FormControl(),
      ngay_tiep_nhan: new FormControl(),
      // duong_dan_nhan_san_pham: new FormControl(),
      tieu_chuan_san_pham: new FormControl(),
      noi_cap: new FormControl(),
      id_loai_san_pham: new FormControl(),
    }
  }

  GetComformityAnnounceData() {
    this.industryManagementService.GetComformityAnnounce().subscribe(res => {
      if (res.data && res.data.length > 0 ) {
        this.dataSource = new MatTableDataSource<ConformityAnnouncementModel>(res['data']);
        this.filteredDataSource = new MatTableDataSource<ConformityAnnouncementModel>(res['data']);
        this._prepareData();
        this.paginatorAgain();
      }
    })
  }

  prepareData(data) {
    data['ngay_tiep_nhan'] = moment(data['ngay_tiep_nhan']).format('yyyyMMDD');
    return data;
  }

  callService(data) {
    this.industryManagementService.PostComformityAnnounce([data]).subscribe(response => this.successNotify(response), error => this.errorNotify(error));
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filteredDataSource.filter = filterValue.trim().toLowerCase();
  }

  private _prepareData() {
    this.soLuongDoanhNghiep = this.filteredDataSource.data.length;
  }

  applyActionCheck(event) {
    this.filteredDataSource.filter = (event.checked) ? "true" : "";
    this.paginatorAgain();
  }

  prepareRemoveData() {
    let datas = this.selection.selected.map(element => new Object({ id: element.id }));
    return datas;
  }

  callRemoveService(data) {
      this.industryManagementService.DeleteCBHQ(data).subscribe(res => {
          this.successNotify(res);
      });
  }

}
