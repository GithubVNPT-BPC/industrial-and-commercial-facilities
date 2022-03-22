import { Component, Injector } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material';
import { IndustrialExplosivesModel } from 'src/app/_models/APIModel/industrial-explosives.model';
import { BaseComponent } from 'src/app/components/specialized/base.component';
import { Router } from '@angular/router';

// Services
import { SCTService } from 'src/app/_services/APIService/sct.service';
import { IndustryManagementService } from 'src/app/_services/APIService/industry-management.service';
import { EnterpriseService } from 'src/app/_services/APIService/enterprise.service';
import { LoginService } from 'src/app/_services/APIService/login.service';

@Component({
    selector: 'industrial-explosives',
    templateUrl: './industrial-explosives.component.html',
    styleUrls: ['/../../special_layout.scss'],
})

export class IndustrialExplosivesComponent extends BaseComponent {
    DB_TABLE = 'QLCN_VLNCN';
    displayedColumns: string[] = ['select', 'index', 'mst', 'ten_doanh_nghiep', 'nganh_nghe_kd_chinh', 'so_dien_thoai', 'dia_chi', 'so_lao_dong', 'cong_suat', 'san_luong',
        'so_gp_gcn', 'ngay_cap', 'ngay_het_han', 'dang_hoat_dong', 'thoi_gian_chinh_sua_cuoi', 'tinh_hinh_6thang', 'tinh_hinh_ca_nam'];

    totalColumns: string[] = ['select', 'index', 'mst', 'ten_doanh_nghiep', 'nganh_nghe_kd_chinh', 'so_dien_thoai', 'dia_chi', 'so_lao_dong', 'cong_suat', 'san_luong',
        'so_gp_gcn', 'ngay_cap', 'ngay_het_han', 'dang_hoat_dong', 'thoi_gian_chinh_sua_cuoi', 'thuoc_no_6thang', 'kip_no_6thang', 'moi_no_6thang', 'day_no_6thang', 'thuoc_no', 'kip_no',
        'moi_no', 'day_no'];

    dataSource: MatTableDataSource<IndustrialExplosivesModel> = new MatTableDataSource<IndustrialExplosivesModel>();
    filteredDataSource: MatTableDataSource<IndustrialExplosivesModel> = new MatTableDataSource<IndustrialExplosivesModel>();

    tinhTrangHoatDong: any[] = [
        { id: 1, tinh_trang: 'Đang hoạt động' },
        { id: 2, tinh_trang: 'Ngưng hoạt động' },
        { id: 3, tinh_trang: 'Giải thể' }
    ];
    isChecked: boolean;
    tongDoanhNghiep: number = 0;
    tongSoLaoDong: number = 0;
    tongCongSuatThietKe: number = 0;
    tongMucSanLuong: number = 0;

    giayCndkkdList = [];
    _timeout: any = null;
    mstOptions: [];

    filterModel = {
        id_quan_huyen: [],
        id_tinh_trang_hoat_dong: [],
        ngay_cap: [],
        is_expired: false
    };

    constructor(
        private injector: Injector,
        public router: Router,
        public sctService: SCTService,
        public industryManagementService: IndustryManagementService,
        public enterpriseService: EnterpriseService,
        public _login: LoginService
    ) {
        super(injector);
    }

    authorize: boolean = true

    ngOnInit() {
        super.ngOnInit();
        // this.getPostExplosiveMatData(this.currentYear);
        this.getPostExplosiveMatData(0);
        this.initDistrictWard();
        if (this._login.userValue.user_role_id == 5 || this._login.userValue.user_role_id == 1) {
            this.authorize = false
        }
        this.filterModel.is_expired = false
    }

    ngAfterViewInit() {
        this.paginator = this.filteredDataSource.paginator;
    }

    resetAll() {
        super.resetAll();
    }

    getLinkDefault() {
        this.LINK_DEFAULT = "/specialized/industry-management/explosives";
        this.TITLE_DEFAULT = "Công nghiệp - Vật liệu nổ công nghiệp";
        this.TEXT_DEFAULT = "Công nghiệp - Vật liệu nổ công nghiệp";
    }

    getFormParams() {
        return {
            id: new FormControl(),
            mst: new FormControl('', Validators.required),
            dia_chi: new FormControl(),
            id_phuong_xa: new FormControl('', Validators.required),
            time_id: new FormControl(this.currentYear),
            id_so_giay_phep: new FormControl('', Validators.required),
            id_tinh_trang_hoat_dong: new FormControl(1),

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

    setFormParams() {
        if (this.selection.selected.length) {
            let selectedRecord = this.selection.selected[0];
            this.formData.controls['id'].setValue(selectedRecord.id);
            this.formData.controls['mst'].setValue(selectedRecord.mst);
            this.formData.controls['dia_chi'].setValue(selectedRecord.dia_chi);
            this.formData.controls['id_phuong_xa'].setValue(selectedRecord.id_phuong_xa);
            this.formData.controls['time_id'].setValue(selectedRecord.time_id);
            this.formData.controls['id_so_giay_phep'].setValue(selectedRecord.id_so_giay_phep);
            this.formData.controls['id_tinh_trang_hoat_dong'].setValue(selectedRecord.tinh_trang_hoat_dong);

            this.formData.controls['thuoc_no'].setValue(selectedRecord.thuoc_no);
            this.formData.controls['kip_no'].setValue(selectedRecord.kip_no);
            this.formData.controls['moi_no'].setValue(selectedRecord.moi_no);
            this.formData.controls['day_no'].setValue(selectedRecord.day_no);
            this.formData.controls['thuoc_no_6thang'].setValue(selectedRecord.thuoc_no_6thang);
            this.formData.controls['kip_no_6thang'].setValue(selectedRecord.kip_no_6thang);
            this.formData.controls['moi_no_6thang'].setValue(selectedRecord.moi_no_6thang);
            this.formData.controls['day_no_6thang'].setValue(selectedRecord.day_no_6thang);
        }
    }

    prepareData(data) {
        return data;
    }

    callService(data) {
        this.industryManagementService.PostExplosiveMat([data], data.time_id).subscribe(response => this.successNotify(response), error => this.errorNotify(error));
    }

    callEditService(data) {
        let body = Object.assign({}, this.formData.value);
        // console.log(this.formData.value);
        this.industryManagementService.PostExplosiveMat([body], body.time_id).subscribe(response => this.successNotify(response), error => this.errorNotify(error));
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

    _prepareData() {
        this.tongDoanhNghiep = this.filteredDataSource.data.length ? new Set(this.filteredDataSource.data.map(x => x.mst)).size : 0;
        this.tongSoLaoDong = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => x.so_lao_dong || 0).reduce((a, b) => a + b) : 0;
        this.tongCongSuatThietKe = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => x.cong_suat_thiet_ke || 0).reduce((a, b) => a + b) : 0;
        this.tongMucSanLuong = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => x.san_luong || 0).reduce((a, b) => a + b) : 0;
    }

    findEnterpriseByMst(mst) {
        let self = this;
        this._timeout  = null;
         if(this._timeout){ //if there is already a timeout in process cancel it
           window.clearTimeout(this._timeout);
         }
         this._timeout = window.setTimeout(() => {
            self.enterpriseService.GetLikeEnterpriseByMst(mst).subscribe(
              results => {
                if (results && results.data && results.data[0].length) {
                  self.mstOptions = results.data[0];
                  self.giayCndkkdList = results.data[2];
                }
              },
              error => this.errorMessage = <any>error
            );
            self._timeout = null;
         }, 2000);
    }

    addLicenseInfo(event) {
        event.preventDefault();
        let mst = this.formData.controls.mst.value;
        let redirectPage = '/#/specialized/commecial-management/domestic/add-certificate/undefined?mst=' + mst;
        window.open(redirectPage, "_blank");
    }

    applyExpireCheck(event) {
        this.filteredDataSource.data = event.checked ? [...this.dataSource.data.filter(d => d.is_expired)] : [...this.dataSource.data];
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