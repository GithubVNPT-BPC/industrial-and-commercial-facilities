import { Component, OnInit, ViewChild, Injector } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { ClusterFilterModel, ClusterModel } from 'src/app/_models/APIModel/cluster.model';
import { Router } from '@angular/router';
import { BaseComponent } from '../../base.component';
import { FormControl } from '@angular/forms';
import { IndustryManagementService } from 'src/app/_services/APIService/industry-management.service';
import { LoginService } from 'src/app/_services/APIService/login.service';

@Component({
    selector: 'cluster-management',
    templateUrl: './cluster-management.component.html',
    styleUrls: ['/../../special_layout.scss'],
})

export class ClusterManagementComponent extends BaseComponent {

    showColumns: string[] = [];
    showSubColumns: string[] = [];
    subColumns: string[] = ['dien_tich_da_dang_dau_tu', 'ten_hien_trang_ha_tang', 'ten_hien_trang_xlnt', 'tong_von_dau_tu'];
    topColumns: string[] = ['select', 'index', 'ten_cum_cn', 'dien_tich_qh', 'chu_dau_tu', 'dien_tich_qhct'];
    totalColumns: string[] = ['select', 'index', 'ten_cum_cn', 'dien_tich_qh', 'dien_tich_tl', 'chu_dau_tu', 'dien_tich_qhct', 'dien_tich_da_dang_dau_tu', 'ten_hien_trang_ha_tang', 'ten_hien_trang_xlnt', 'tong_von_dau_tu'];
    dataSource: MatTableDataSource<ClusterModel> = new MatTableDataSource<ClusterModel>();
    filteredDataSource: MatTableDataSource<ClusterModel> = new MatTableDataSource<ClusterModel>();
    imageUrl: string = "";
    fileToUpload: File = null;

    hienTrangHaTang: any[] = [{ id: 1, ten_hien_trang_ha_tang: 'Đang hoạt động' },
    { id: 2, ten_hien_trang_ha_tang: 'Có quy hoạch chi tiết' },
    { id: 3, ten_hien_trang_ha_tang: 'Có Giấy phép xây dựng' },
    { id: 4, ten_hien_trang_ha_tang: 'Đang xây dựng' },
    { id: 5, ten_hien_trang_ha_tang: 'Có Quyết định thành lập' }];

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
        { id_trang_thai_hoat_dong: 2, ten_trang_thai_hoat_dong: 'chưa có nhà đầu tư' },
    ];

    constructor(
        public indService: IndustryManagementService,
        public router: Router,
        private injector: Injector,
        public _login: LoginService
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
    }

    getLinkDefault() {
        this.LINK_DEFAULT = "/specialized/industry-management/cluster";
        this.TITLE_DEFAULT = "Công nghiệp - Tổng quan cụm công nghiệp";
        this.TEXT_DEFAULT = "Công nghiệp - Tổng quan cụm công nghiệp";
    }

    applyFilter() {
        let filteredData = this.filterArray(this.dataSource.data, this.filterModel);
        if (!filteredData.length) {
            if (this.filterModel)
                this.filteredDataSource.data = [];
            else
                this.filteredDataSource.data = this.dataSource.data;
        }
        else {
            this.filteredDataSource.data = filteredData;
        }
    }

    getDanhSachQuanLyCumCongNghiep() {
        this.indService.GetDanhSachQuanLyCumCongNghiep().subscribe(result => {
            // result.data.sort((a, b) => b.chu_dau_tu.localeCompare(a.chu_dau_tu));
            this.dataSource = new MatTableDataSource<ClusterModel>(result.data[0]);
            this.filteredDataSource.data = [...this.dataSource.data];
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

    // applyDistrictFilter(event) {
    //     let filteredData = [];

    //     event.value.forEach(element => {
    //         this.dataSource.data.filter(x => x.id_quan_huyen == element).forEach(x => filteredData.push(x));
    //     });

    //     if (!filteredData.length) {
    //         if (event.value.length)
    //             this.filteredDataSource.data = [];
    //         else
    //             this.filteredDataSource.data = this.dataSource.data;
    //     }
    //     else {
    //         this.filteredDataSource.data = filteredData;
    //     }
    //     // this.sanLuongKinhDoanh = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => parseInt(x.san_luong) || 0).reduce((a, b) => a + b) : 0;
    //     // this.sanLuongSanXuat = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => parseInt(x.cong_suat)||0).reduce((a, b) => a + b) : 0;
    // }

    filterArray(array, filters) {
        const filterKeys = Object.keys(filters);
        let temp = [...array];
        filterKeys.forEach(key => {
            let temp2 = [];
            if (filters[key].length) {
                filters[key].forEach(criteria => {
                    temp2 = temp2.concat(temp.filter(x => x[key] == criteria));
                });
                temp = [...temp2];
            }
        })
        return temp;
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
            nhu_cau_von: new FormControl(0),
        }
    }

    public prepareData(data) {
        data['duong_dan'] = this.fileToUpload;
        return data
    }

    public callService(data) {
        this.indService.PostDataGroupCompany(data).subscribe(res => {
            // result.data.sort((a, b) => b.chu_dau_tu.localeCompare(a.chu_dau_tu));
            this.successNotify(res);
            this.autopaging();
        })
    }

    prepareRemoveData(data) {
        let datas = data.map(element => new Object({ id: element.id }));
        return datas;
      }
    
    callRemoveService(data) {
    this.indService.DeleteClusterManagement(data).subscribe(response => this.successNotify(response), error => this.errorNotify(error));
    }

    handleFileInput(file: FileList) {
        this.fileToUpload = file.item(0);
        //Show image preview
        var reader = new FileReader();
        reader.onload = (event: any) => {
            this.imageUrl = event.target.result;
        }
        reader.readAsDataURL(this.fileToUpload);
    }

}