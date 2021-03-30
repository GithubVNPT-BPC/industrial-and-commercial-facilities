import { Component, Injector } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material';
import { IndustrialExplosivesModel } from 'src/app/_models/APIModel/industrial-explosives.model';
import { BaseComponent } from 'src/app/components/specialized/base.component';

// Services
import { SCTService } from 'src/app/_services/APIService/sct.service';
import { IndustryManagementService } from 'src/app/_services/APIService/industry-management.service';
import { LoginService } from 'src/app/_services/APIService/login.service';

@Component({
    selector: 'industrial-explosives',
    templateUrl: './industrial-explosives.component.html',
    styleUrls: ['/../../special_layout.scss'],
})

export class IndustrialExplosivesComponent extends BaseComponent {

    displayedColumns: string[] = ['select', 'index', 'mst', 'ten_doanh_nghiep',  'nganh_nghe_kd', 'dien_thoai', 'dia_chi', 'so_lao_dong', 'cong_suat', 'san_luong',
        'so_gp_gcn', 'ngay_cap', 'ngay_het_han', 'dang_hoat_dong', 'tinh_hinh_6thang', 'tinh_hinh_ca_nam'];

    totalColumns: string[] = ['select', 'index', 'mst', 'ten_doanh_nghiep', 'nganh_nghe_kd', 'dien_thoai', 'dia_chi', 'so_lao_dong', 'cong_suat', 'san_luong',
        'so_gp_gcn', 'ngay_cap', 'ngay_het_han', 'dang_hoat_dong', 'thuoc_no_6thang', 'kip_no_6thang', 'moi_no_6thang', 'day_no_6thang', 'thuoc_no', 'kip_no',
        'moi_no', 'day_no'];

    dataSource: MatTableDataSource<IndustrialExplosivesModel> = new MatTableDataSource<IndustrialExplosivesModel>();
    filteredDataSource: MatTableDataSource<IndustrialExplosivesModel> = new MatTableDataSource<IndustrialExplosivesModel>();

    tinhTrangHoatDong: any[] = [
        { id: 1, tinh_trang: 'Đang hoạt động' },
        { id: 2, tinh_trang: 'Ngưng hoạt động' },
        { id: 3, tinh_trang: 'Giải thể' }
    ];
    isChecked: boolean;
    tongSoLaoDong: number = 0;
    tongCongSuatThietKe: number = 0;
    tongMucSanLuong: number = 0;
    filterModel = { 
        id_quan_huyen: [], 
        id_tinh_trang_hoat_dong: [],
        ngay_cap: [],
        is_expired: false 
    };

    constructor(
        private injector: Injector,
        public sctService: SCTService,
        public industryManagementService: IndustryManagementService,
        public _login: LoginService
    ) {
        super(injector);
    }

    authorize: boolean = true

    ngOnInit() {
        super.ngOnInit();
        this.getPostExplosiveMatData(this.currentYear);

        if (this._login.userValue.user_role_id == 5  || this._login.userValue.user_role_id == 1) {
            this.authorize = false
        }
    }

    getLinkDefault() {
        this.LINK_DEFAULT = "/specialized/industry-management/explosives";
        this.TITLE_DEFAULT = "Công nghiệp - Vật liệu nổ công nghiệp";
        this.TEXT_DEFAULT = "Công nghiệp - Vật liệu nổ công nghiệp";
    }

    getFormParams() {
        return {
            mst: new FormControl(),
            dia_chi: new FormControl(),
            id_phuong_xa: new FormControl(),
            time_id: new FormControl(2021),
            thuoc_no: new FormControl(0),
            kip_no: new FormControl(0),
            moi_no: new FormControl(0),
            day_no: new FormControl(0),
            thuoc_no_6thang: new FormControl(0),
            kip_no_6thang: new FormControl(0),
            moi_no_6thang: new FormControl(0),
            day_no_6thang: new FormControl(0),
        }
    }

    prepareData(data) {
        data['id_so_giay_phep'] = 1;
        data['id_tinh_trang_hoat_dong'] = 1;
        return data;
    }

    callService(data) {
        this.industryManagementService.PostExplosiveMat([data], data.time_id).subscribe(response => this.successNotify(response), error => this.errorNotify(error));
    }

    prepareRemoveData(data) {
        let datas = data.map(element => new Object({ id: element.id }));
        return datas;
      }
    
    callRemoveService(data) {
        this.industryManagementService.DeleteExplosiveMat(data).subscribe(response => this.successNotify(response), error => this.errorNotify(error));
    }

    getPostExplosiveMatData(time_id) {
        this.industryManagementService.GetExplosiveMat(time_id).subscribe(result => {
            this.filteredDataSource.data = [];
            if (result.data && result.data.length > 0) {
                result.data.forEach(element => {
                    element.ngay_cap = this.formatDate(element.ngay_cap);
                    element.ngay_het_han = this.formatDate(element.ngay_het_han);
                });

                this.dataSource = new MatTableDataSource<IndustrialExplosivesModel>(result.data);
                this.dataSource.data.forEach(element => {
                    element.is_expired = element.ngay_het_han ? new Date(element.ngay_het_han) < new Date() : false;
                });
                this.filteredDataSource.data = [...this.dataSource.data];
            }
            this._prepareData();
            this.paginatorAgain();
        })
    }

    private _prepareData() {
        this.tongSoLaoDong = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => x.so_lao_dong).reduce((a, b) => a + b) : 0;
        this.tongCongSuatThietKe = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => x.cong_suat_thiet_ke).reduce((a, b) => a + b) : 0;
        this.tongMucSanLuong = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => x.san_luong).reduce((a, b) => a + b) : 0;
    }

    applyExpireCheck(event) {
        this.filteredDataSource.data = event.checked ? [...this.dataSource.data.filter(d => d.is_expired)] : [...this.dataSource.data];
        this._prepareData();
        this.paginatorAgain();
    }

    applyFilter(event) {
        if (event.target) {
            const filterValue = (event.target as HTMLInputElement).value;
            this.filteredDataSource.filter = filterValue.trim().toLowerCase();
        } else {
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
        this._prepareData();
        this.paginatorAgain();
    }

    filterArray(dataSource, filters) {
        const filterKeys = Object.keys(filters);
        let filteredData = [...dataSource];
        filterKeys.forEach(filterName => {
            let filterCrits = [];
            if (filters[filterName].length) {
                if (filterName == 'ngay_cap') {
                    filters[filterName].forEach(criteria => {
                        if (criteria && criteria != 0) filterCrits = filterCrits.concat(filteredData.filter(x => x[filterName].toString().includes(criteria)));
                        else filterCrits = filterCrits.concat(filteredData);
                    });
                } else {
                    filters[filterName].forEach(criteria => {
                        filterCrits = filterCrits.concat(filteredData.filter(x => x[filterName] == criteria));
                    });
                }
                filteredData = [...filterCrits];
            }
        });
        return filteredData;
    }
}