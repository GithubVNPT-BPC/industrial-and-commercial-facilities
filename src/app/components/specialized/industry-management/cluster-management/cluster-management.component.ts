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
import { SAVE } from 'src/app/_enums/save.enum';
import { ClusterBusinessComponent } from './cluster-business/cluster-business.component';
import { InformationService } from 'src/app/shared/information/information.service';

@Component({
    selector: 'cluster-management',
    templateUrl: './cluster-management.component.html',
    styleUrls: ['/../../special_layout.scss'],
})

export class ClusterManagementComponent extends BaseComponent {

    totalColumns: string[] = ['select', 'index', 
    // 'cap_nhat_dn_ccn', 'them_dn_ccn', 
    'ten_cum_cn', 'dien_tich_qh', 'dien_tich_tl', 'chu_dau_tu', 'dien_tich_qhct', 'dien_tich_da_dang_dau_tu', 'ten_hien_trang_ha_tang', 'ten_hien_trang_xlnt', 'tong_von_dau_tu', 'thoi_gian_chinh_sua_cuoi'];
    dataSource: MatTableDataSource<ClusterModel> = new MatTableDataSource<ClusterModel>();
    filteredDataSource: MatTableDataSource<ClusterModel> = new MatTableDataSource<ClusterModel>();

    hienTrangHaTang: any[] = [
        { id: 1, ten_hien_trang_ha_tang: 'Xong' },
        { id: 2, ten_hien_trang_ha_tang: 'Cơ bản xong' },
        { id: 3, ten_hien_trang_ha_tang: 'Đang đầu tư' },
        { id: 4, ten_hien_trang_ha_tang: 'Chưa đầu tư' },
    ];

    hienTrangXLNT: any[] = [{ id: 1, ten_hien_trang_xlnt: 'Đã hoạt động' },
    { id: 2, ten_hien_trang_xlnt: 'Đã đầu tư, chưa hoạt động' },
    { id: 3, ten_hien_trang_xlnt: 'Đang đầu tư' },
    { id: 4, ten_hien_trang_xlnt: 'Chưa đầu tư' }];

    filterModel: ClusterFilterModel = { id_htdtht: [], id_htdthtxlnt: [], id_quan_huyen: [] };

    trang_thai_hd: any[] = [
        { id_trang_thai_hoat_dong: 1, ten_trang_thai_hoat_dong: 'Đã thành lập' },
        { id_trang_thai_hoat_dong: 2, ten_trang_thai_hoat_dong: 'Đã quy hoạch' },
        { id_trang_thai_hoat_dong: 3, ten_trang_thai_hoat_dong: 'chưa có nhà đầu tư' },
    ];

    constructor(
        public indService: IndustryManagementService,
        public _info: InformationService,
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
        this.getDanhSachQuanLyCumCongNghiep();
        this.initWards();
        if (this._login.userValue.user_role_id == 5 || this._login.userValue.user_role_id == 1) {
            this.authorize = false
        }
    }

    getLinkDefault() {
        this.LINK_DEFAULT = "/specialized/industry-management/cluster";
        this.TITLE_DEFAULT = "Công nghiệp - Tổng quan cụm công nghiệp";
        this.TEXT_DEFAULT = "Công nghiệp - Tổng quan cụm công nghiệp";
    }

    imagesSource: string[] = [];
    sanLuongSanXuat: number = 0;
    sanLuongKinhDoanh: number = 0;
    soccn_thanhlap: number = 0;
    tongso_dn: number = 0;

    getDanhSachQuanLyCumCongNghiep() {
        this.indService.GetDanhSachQuanLyCumCongNghiep().subscribe(result => {
            this.filteredDataSource.data = [];
            if (result.data && result.data.length > 0) {
                this.dataSource = new MatTableDataSource<ClusterModel>(result.data[0]);
                let temp = (result.data[0].map(x=>x.chu_dau_tu)).filter(s=>s != null)
                let temp1 = temp.filter(function(elem, index, self) {
                    return index === self.indexOf(elem);}).length
                this.soccn_thanhlap = temp1
                this.tongso_dn = result.data[2].length    
                this.filteredDataSource.data = [...this.dataSource.data];
                this.imagesSource = result.data[1];
            }
            // this.sanLuongKinhDoanh = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => parseInt(x.san_luong)||0).reduce((a, b) => a + b) : 0;
            // this.sanLuongSanXuat = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => parseInt(x.cong_suat)||0).reduce((a, b) => a + b) : 0;
            this.paginatorAgain();
        })
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

    serverUrl = environment.apiEndpoint
    id_cnn: number;
    imageUrl = [];
    imageurlsedit = [];
    imageurlseditstring: string[] = [];
    imagesDelete = [];
    getImagesfromId() {
        this.imageurls = []
        this.imageurlseditstring = []
        this.imagesDelete = []
        this.fileToUpload = []
        this.imageUrl = [...this.imagesSource];
        this.imageUrl.forEach(x => {
            x.delete = x.duong_dan
            x.duong_dan = this.serverUrl + x.duong_dan
        })
        this.imageurlsedit = this.imageUrl.filter(x => x.id_cum_cong_nghiep == this.id_cnn)
        this.imageurlseditstring = this.imageurlsedit.map(x => x.duong_dan)
    }

    imageurls = [];
    base64String: string;
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

    DeleteImage(event) {
        this.confirmationDialogService.confirm('Xác nhận', 'Bạn chắc chắn muốn xóa?', 'Đồng ý', 'Đóng')
            .then(confirm => {
                if (confirm) {
                    let indexImage = event.target.id;
                    this.imagesDelete.push(this.imageurlsedit[indexImage]);
                    this.imageurlsedit.splice(indexImage, 1)
                    this.imageurlseditstring.splice(indexImage, 1);
                    return;
                }
            })
            .catch((err) => console.log('Hủy không thao tác: \n' + err));
    }

    removeImage(i) {
        this.confirmationDialogService.confirm('Xác nhận', 'Bạn chắc chắn muốn xóa?', 'Đồng ý', 'Đóng')
            .then(confirm => {
                if (confirm) {
                    this.imageurls.splice(i, 1);
                    this.fileToUpload.splice(i, 1);
                    return;
                }
            })
            .catch((err) => console.log('Hủy không thao tác: \n' + err));
    }

    filename: string
    fileToUpload1: Array<File> = []
    onSelectFile1(event) {
        if (event.target.files && event.target.files[0]) {
            this.filename = event.target.files[0].name
            this.fileToUpload1 = event.target.files[0]
        }
    }

    public callService(data) {
        this.indService.PostDataGroupCompany(data).subscribe(response => {
            this.uploadImages(response.data.last_inserted_id);
            this.uploadFile(response.data.last_inserted_id);
            this.successNotify(response)
        }, error => this.errorNotify(error));
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

    deleteImages() {
        let temp = this.imagesDelete.map(x => new Object({ file_name: x.delete }))

        if (temp.length != 0) {
            this.indService.DeleteImageGroupCompany(temp, this.id_cnn).subscribe(res => {
                this.successNotify(res)
            }, error => this.errorMessage(error));
        }
    }

    oldfile: string;
    deleteFile() {
        let temp = []
        if (this.oldfile) {
            temp.push({ file_name: this.oldfile })
        }
        if (temp.length != 0) {
            this.indService.DeleteFileGroupCompany(temp, this.id_cnn).subscribe(res => {
                this.successNotify(res)
            }, error => this.errorMessage(error));
        }
    }

    prepareRemoveData(data) {
        let datas = data.map(element => new Object({ id: element.id }));
        return datas;
    }

    callRemoveService(data) {
        this.indService.DeleteClusterManagement(data).subscribe(response => this.successNotify(response), error => this.errorNotify(error));
    }

    public editclusterbusiness(data: any) {
        const dialogRef = this.dialog.open(ClusterBusinessComponent, {
            data: {
                message: 'Chỉnh sửa DN thuộc CCN',
                cluster_data: data,
                typeOfSave: SAVE.CLUSTER,
            }
        });
    }

    public addclusterbusiness(data: any) {
        const dialogRef = this.dialog.open(ClusterBusinessComponent, {
            data: {
                message: 'Thêm DN thuộc CCN',
                cluster_data: data,
                typeOfSave: SAVE.ADD,
            }
        });
    }

    public openDetailCluster(id: string) {
        this.router.navigate(['/specialized/industry-management/cluster/' + id]);
    }
}