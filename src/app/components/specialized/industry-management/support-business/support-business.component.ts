import { Component, Injector } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { ClusterFilterModel, ClusterModel } from 'src/app/_models/APIModel/cluster.model';
import { Router } from '@angular/router';
import { BaseComponent } from '../../base.component';
import { FormControl, FormGroup } from '@angular/forms';
import { IndustryManagementService } from 'src/app/_services/APIService/industry-management.service';
import { LoginService } from 'src/app/_services/APIService/login.service';
import { environment } from 'src/environments/environment';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-support-business',
  templateUrl: './support-business.component.html',
  styleUrls: ['/../../special_layout.scss'],
})
export class SupportBusinessComponent extends BaseComponent {

  serverUrl = environment.apiEndpoint
  id_cnn: number;
  showColumns: string[] = [];
  showSubColumns: string[] = [];
  subColumns: string[] = ['dien_tich_da_dang_dau_tu', 'ten_hien_trang_ha_tang', 'ten_hien_trang_xlnt', 'tong_von_dau_tu'];
  topColumns: string[] = ['select', 'index', 'ten_cum_cn', 'dien_tich_qh', 'chu_dau_tu', 'dien_tich_qhct', 'thoi_gian_chinh_sua_cuoi'];
  totalColumns: string[] = ['select', 'index', 'ten_cum_cn', 'dien_tich_qh', 'dien_tich_tl', 'chu_dau_tu', 'dien_tich_qhct', 'thoi_gian_chinh_sua_cuoi', 'dien_tich_da_dang_dau_tu', 'ten_hien_trang_ha_tang', 'ten_hien_trang_xlnt', 'tong_von_dau_tu'];
  dataSource: MatTableDataSource<ClusterModel> = new MatTableDataSource<ClusterModel>();
  filteredDataSource: MatTableDataSource<ClusterModel> = new MatTableDataSource<ClusterModel>();
  imageUrl: string[] = [];
  imagesSource: string[] = [];
  imagesDelete: string[] = [];

  hienTrangHaTang: any[] = [
    { id: 1, ten_hien_trang_ha_tang: 'Đang hoạt động' },
    { id: 2, ten_hien_trang_ha_tang: 'Có quy hoạch chi tiết' },
    { id: 3, ten_hien_trang_ha_tang: 'Có Giấy phép xây dựng' },
    { id: 4, ten_hien_trang_ha_tang: 'Đang xây dựng' },
    { id: 5, ten_hien_trang_ha_tang: 'Có Quyết định thành lập' }
  ];

  hienTrangXLNT: any[] = [{ id: 1, ten_hien_trang_xlnt: 'Chưa có' },
  { id: 2, ten_hien_trang_xlnt: 'Có' },
  { id: 3, ten_hien_trang_xlnt: 'Đang xây dựng' }];

  isChecked: boolean = false;
  sanLuongSanXuat: number = 0;
  sanLuongKinhDoanh: number = 0;
  filterModel: ClusterFilterModel = { id_htdtht: [], id_htdthtxlnt: [], id_quan_huyen: [] };

  trang_thai_hd: any[] = [
    { id_trang_thai_hoat_dong: 1, ten_trang_thai_hoat_dong: 'Đã thành lập' },
    { id_trang_thai_hoat_dong: 2, ten_trang_thai_hoat_dong: 'Đã quy hoạch' },
    { id_trang_thai_hoat_dong: 3, ten_trang_thai_hoat_dong: 'chưa có nhà đầu tư' },
  ];

  constructor(
    public indService: IndustryManagementService,
    public router: Router,
    private injector: Injector,
    public _login: LoginService,
    public dialog: MatDialog
  ) {
    super(injector)
  }

  authorize: boolean = true

  ngOnInit() {
    super.ngOnInit();
    this.showColumns = this.totalColumns;
    this.showSubColumns = [];
    this.getDanhSachQuanLyCumCongNghiep();
    this.initWards();
    if (this._login.userValue.user_role_id == 5 || this._login.userValue.user_role_id == 1) {
      this.authorize = false
    }
    this.initInforImages();
  }

  initInforImages() {
    this.id_cnn = 0;
    this.imagesDelete = [];
    this.imageUrl = [];
    this.fileToUpload = [];
  }

  getLinkDefault() {
    this.LINK_DEFAULT = "/specialized/industry-management/cluster";
    this.TITLE_DEFAULT = "Công nghiệp - Tổng quan cụm công nghiệp";
    this.TEXT_DEFAULT = "Công nghiệp - Tổng quan cụm công nghiệp";
  }

  getDanhSachQuanLyCumCongNghiep() {
    this.indService.GetDanhSachQuanLyCumCongNghiep().subscribe(result => {
      this.filteredDataSource.data = [];
      if (result.data && result.data.length > 0) {
        this.dataSource = new MatTableDataSource<ClusterModel>(result.data[0]);
        this.filteredDataSource.data = [...this.dataSource.data];
        this.imagesSource = result.data[1];
      }
      // this.sanLuongKinhDoanh = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => parseInt(x.san_luong)||0).reduce((a, b) => a + b) : 0;
      // this.sanLuongSanXuat = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => parseInt(x.cong_suat)||0).reduce((a, b) => a + b) : 0;
      this.paginatorAgain();
    })
  }

  changeTable(event) {
    this.isChecked = event.checked;
    if (this.isChecked) {
      this.showColumns = this.totalColumns;
      this.showSubColumns = this.subColumns;
    }
    else {
      this.showColumns = this.topColumns;
      this.showSubColumns = [];
    }
  }

  public openDetailCluster(id: string) {
    this.router.navigate(['/specialized/industry-management/cluster/' + id]);
  }

  setFormParams() {
    if (this.selection.selected.length) {
      let selectedRecord = this.selection.selected[0];
      this.formData.controls['ten_cum'].setValue(selectedRecord.ten_cum);
      this.formData.controls['chu_dau_tu'].setValue(selectedRecord.chu_dau_tu);
      this.formData.controls['dien_tich_theo_qh'].setValue(selectedRecord.dien_tich_theo_qh);
      this.formData.controls['dien_tich_da_thanh_lap'].setValue(selectedRecord.dien_tich_da_thanh_lap);
      this.formData.controls['dia_chi'].setValue(selectedRecord.dia_chi);
      this.formData.controls['id_phuong_xa'].setValue(selectedRecord.id_phuong_xa);
      this.formData.controls['quyet_dinh_thanh_lap'].setValue(selectedRecord.quyet_dinh_thanh_lap);
      this.formData.controls['quyet_dinh_quy_hoach_chi_tiet'].setValue(selectedRecord.quyet_dinh_quy_hoach_chi_tiet);
      this.formData.controls['quyet_dinh_danh_gia_dtm'].setValue(selectedRecord.quyet_dinh_danh_gia_dtm);
      this.formData.controls['dieu_kien_kinh_doanh'].setValue(selectedRecord.dieu_kien_kinh_doanh);
      this.formData.controls['vi_tri_quy_mo'].setValue(selectedRecord.vi_tri_quy_mo);
      this.formData.controls['tong_muc_dau_tu'].setValue(selectedRecord.tong_muc_dau_tu);
      this.formData.controls['quy_mo_dien_tich'].setValue(selectedRecord.quy_mo_dien_tich);
      this.formData.controls['dien_giai'].setValue(selectedRecord.dien_giai);
      this.formData.controls['duong_dan'].setValue('');
      this.formData.controls['dien_tich_qhct'].setValue(selectedRecord.dien_tich_qhct);
      this.formData.controls['dien_tich_ddtht'].setValue(selectedRecord.dien_tich_ddtht);
      this.formData.controls['id_htdtht'].setValue(selectedRecord.id_htdtht);
      this.formData.controls['id_htdthtxlnt'].setValue(selectedRecord.id_htdthtxlnt);
      this.formData.controls['id_trang_thai_hoat_dong'].setValue(selectedRecord.id_trang_thai_hoat_dong);
      this.formData.controls['nhu_cau_von'].setValue(selectedRecord.nhu_cau_von);
      // set value id to update
      this.id_cnn = selectedRecord.id;
      this.oldfile = selectedRecord.duong_dan;
      this.filename = selectedRecord.duong_dan;
      this.getImagesfromId();
    }
  }

  getFormParams() {
    return {
      ten_cum: new FormControl(''),
      chu_dau_tu: new FormControl(''),
      dien_tich_theo_qh: new FormControl(0),
      dien_tich_da_thanh_lap: new FormControl(0),
      dia_chi: new FormControl(''),
      id_phuong_xa: new FormControl(),
      quyet_dinh_thanh_lap: new FormControl(''),
      quyet_dinh_quy_hoach_chi_tiet: new FormControl(''),
      quyet_dinh_danh_gia_dtm: new FormControl(''),
      dieu_kien_kinh_doanh: new FormControl(''),
      vi_tri_quy_mo: new FormControl(''),
      tong_muc_dau_tu: new FormControl(0),
      quy_mo_dien_tich: new FormControl(0),
      dien_giai: new FormControl(''),
      duong_dan: new FormControl(),
      dien_tich_qhct: new FormControl(0),
      dien_tich_ddtht: new FormControl(0),
      id_htdtht: new FormControl(),
      id_htdthtxlnt: new FormControl(),
      id_trang_thai_hoat_dong: new FormControl(),
      nhu_cau_von: new FormControl(),
    }
  }

  public prepareData(data) {
    data['duong_dan'] = "";
    return data
  }

  imageDeleteFrom: FormGroup;
  imageurls = [];
  base64String: string;
  imagePath: string;

  removeImageEdit(i, imagepath) {
    this.imageDeleteFrom.value.id = i;
    this.imageDeleteFrom.value.ImagePath = imagepath;
  }

  removeImage(i) {
    this.imageurls.splice(i, 1);
    this.fileToUpload.splice(i, 1);
  }

  fileToUpload: Array<File> = []

  onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        var reader = new FileReader();
        reader.onload = (event: any) => {
          this.imageurls.push({ base64String: event.target.result, });
        }
        reader.readAsDataURL(event.target.files[i]);
        this.fileToUpload.push(event.target.files[i])
      }
    }
  }

  fileToUpload1: Array<File> = []
  filename: string

  onSelectFile1(event) {
    if (event.target.files && event.target.files[0]) {
      this.filename = event.target.files[0].name
      this.fileToUpload1 = event.target.files[0]
    }
  }

  uploadImages(id_cnn) {
    if (this.fileToUpload.length != 0) {
      for (const image of this.fileToUpload) {
        this.indService.PostImageGroupCompany(image, parseInt(id_cnn)).subscribe(res => {
          // this.successNotify(res);
        })
      }
    }
  }

  uploadFile(id_cnn) {
    if (this.fileToUpload1.length != 0) {
      this.indService.PostFileGroupCompany(this.fileToUpload1, parseInt(id_cnn)).subscribe(res => {
        // this.successNotify(res);
      })
    }
  }

  imageurlsedit = [];

  getImagesfromId() {
    let temList = [];
    this.imageUrl = [...this.imagesSource];
    for (const imageObject of this.imageUrl) {
      if (this.id_cnn === imageObject['id_cum_cong_nghiep']) {
        imageObject['delete'] = imageObject['duong_dan']
        imageObject['duong_dan'] = this.serverUrl + imageObject['duong_dan'];
        temList.push(imageObject['duong_dan']);
      }
    }
    this.imageurlsedit = [...temList];
  }

  deleteImages() {
    if (this.fileToUpload.length != 0) {
      let tem = [];
      this.imagesDelete.forEach(element => {
        tem.push({ file_name: element['delete'] });
      });
      this.indService.DeleteImageGroupCompany(tem, this.id_cnn).subscribe(res => {
        this.successNotify(res)
      }, error => this.errorMessage(error));
    }
  }

  oldfile: string;

  deleteFile() {
    if (this.fileToUpload1.length != 0) {
      let temp = []
      temp.push({ file_name: this.oldfile })
      this.indService.DeleteFileGroupCompany(temp, this.id_cnn).subscribe(res => {
        this.successNotify(res)
      }, error => this.errorMessage(error));
    }
  }

  DeleteImage(event) {
    let indexImage = event.target.id;
    this.imagesDelete.push(this.imageUrl[indexImage]);
    this.imageurlsedit.splice(indexImage, 1);
  }

  public callService(data) {
    this.indService.PostDataGroupCompany(data).subscribe(response => {
      this.uploadImages(response.data.last_inserted_id);
      this.uploadFile(response.data.last_inserted_id);
      this.successNotify(response)
    }, error => this.errorNotify(error));
  }

  public callEditService(data) {
    let body = Object.assign({}, this.formData.value);
    body.id = this.selection.selected[0].id;
    this.indService.PostDataGroupCompany(body).subscribe(response => {
      this.successNotify(response)
    }, error => this.errorNotify(error));
    this.uploadImages(this.id_cnn);
    this.uploadFile(this.id_cnn)
    this.deleteImages();
    this.deleteFile();
  }

  prepareRemoveData(data) {
    let datas = data.map(element => new Object({ id: element.id }));
    return datas;
  }

  callRemoveService(data) {
    this.indService.DeleteClusterManagement(data).subscribe(response => this.successNotify(response), error => this.errorNotify(error));
  }

}
