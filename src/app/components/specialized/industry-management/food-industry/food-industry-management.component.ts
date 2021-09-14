import { Component, Injector } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { FoodIndustryModel } from 'src/app/_models/APIModel/industry-management.module';
import { FormControl, Validators } from '@angular/forms';

// Services
import { BaseComponent } from 'src/app/components/specialized/base.component';
import { IndustryManagementService } from 'src/app/_services/APIService/industry-management.service';
import { LoginService } from 'src/app/_services/APIService/login.service';

@Component({
    selector: 'food-industry-management',
    templateUrl: './food-industry-management.component.html',
    styleUrls: ['/../../special_layout.scss'],
})

export class FoodIndustryManagementComponent extends BaseComponent {
    DB_TABLE = 'QLCN_CNTP';
    displayedColumns: string[] = [];
    fullFieldList: string[] = ['select', 'index'];
    reducedFieldList: string[] = ['select', 'index', 'mst', 'ten_doanh_nghiep', 'nganh_nghe_kd_chinh', 'dia_chi_day_du', 
    'so_lao_dong_sct', 'cong_suat', 'san_luong', 'so_giay_phep', 'ngay_cap', 'ngay_het_han', 'tinh_trang_hoat_dong', 'thoi_gian_chinh_sua_cuoi'];

    filterModel = {
        id_quan_huyen: [],
        ngay_cap: [],
    }

    displayedFields = {
        mst: "Mã số thuế",
        ten_doanh_nghiep: "Tên doanh nghiệp",
        nganh_nghe_kd_chinh: "Ngành nghề KD chính",
        dia_chi_day_du: "Địa bàn",
        // email: "Email",
        // ten_thuc_pham: "Tên thực phẩm",
        cong_suat: "Công suất thiết kế/năm",
        san_luong: "Sản lượng/năm",
        von_dieu_le: "Vốn đầu tư",
        so_lao_dong_sct: "Sổ lao động",
        // email_sct: "Email SCT",
        so_giay_phep: "Số giấy phép/Giấy chứng nhận",
        ngay_cap: "Ngày cấp",
        ngay_het_han: "Ngày hết hạn",
        tinh_trang_hoat_dong: "Trạng thái hoạt động",
        thoi_gian_chinh_sua_cuoi: "Thời gian cập nhật"
    }

    foodTypeList = [
        { id_thuc_pham: 1, ten_thuc_pham: 'Bột mỳ'},
        { id_thuc_pham: 2, ten_thuc_pham: 'Rượu'},
        { id_thuc_pham: 3, ten_thuc_pham: 'Bánh ngọt'},
    ]

    dataSource: MatTableDataSource<FoodIndustryModel> = new MatTableDataSource<FoodIndustryModel>();
    filteredDataSource: MatTableDataSource<FoodIndustryModel> = new MatTableDataSource<FoodIndustryModel>();

    isChecked: boolean;
    sanLuongBotMy: number = 0;
    sanLuongRuou: number = 0;
    sanLuongBanhNgot: number = 0;

    constructor(
        private injector: Injector,
        public industryManagementService: IndustryManagementService,
        public _login: LoginService

    ) {
        super(injector);
    }

    authorize: boolean = true

    ngAfterViewInit(): void {
        this.paginatorAgain();
    }

    ngOnInit() {
        super.ngOnInit();
        this.GetFoodIndustryData(this.currentYear);
        this.displayedColumns = this.reducedFieldList;
        this.fullFieldList = this.fullFieldList.length == 2 ? this.fullFieldList.concat(Object.keys(this.displayedFields)) : this.fullFieldList;

        if (this._login.userValue.user_role_id == 5  || this._login.userValue.user_role_id == 1) {
            this.authorize = false
        }
    }

    GetFoodIndustryData(time_id) {
        this.industryManagementService.GetFoodIndustry(time_id).subscribe(result => {
            this.filteredDataSource.data = [];
            if (result.data && result.data.length) {
                result.data.forEach(element => {
                    element.ngay_cap = this.formatDate(element.ngay_cap);
                    element.ngay_het_han = this.formatDate(element.ngay_het_han);
                });

                this.dataSource = new MatTableDataSource<FoodIndustryModel>(result.data);

                this.dataSource.data.forEach(element => {
                    element.is_expired = element.ngay_het_han ? new Date(element.ngay_het_han) < new Date() : false;
                });

                this.filteredDataSource.data = [...this.dataSource.data];
            }
            this._prepareData();
            this.paginatorAgain();
        })
    }

    public _prepareData() {
        let data = this.filteredDataSource.data;
        this.sanLuongBotMy = data.filter(x => x.id_thuc_pham == 1).length ? data.filter(x => x.id_thuc_pham == 1).map(x => x.san_luong || 0).reduce((a, b) => a + b) : 0;
        this.sanLuongRuou = data.filter(x => x.id_thuc_pham == 2).length ? data.filter(x => x.id_thuc_pham == 2).map(x => x.san_luong || 0).reduce((a, b) => a + b) : 0;
        this.sanLuongBanhNgot = data.filter(x => x.id_thuc_pham == 3).length ? data.filter(x => x.id_thuc_pham == 3).map(x => x.san_luong || 0).reduce((a, b) => a + b) : 0;
    }

    getLinkDefault() {
        this.LINK_DEFAULT = "/specialized/industry-management/food";
        this.TITLE_DEFAULT = "Công nghiệp - Công nghiệp thực phẩm";
        this.TEXT_DEFAULT = "Công nghiệp - Công nghiệp thực phẩm";
    }

    getFormParams() {
        return {
            id: new FormControl(),
            mst: new FormControl('', Validators.required),
            san_luong: new FormControl(0, Validators.required),
            cong_suat: new FormControl(0, Validators.required),
            id_thuc_pham: new FormControl('', Validators.required),
            tinh_trang_hoat_dong: new FormControl("true"),
            time_id: new FormControl(this.currentYear)
        }
    }

    setFormParams() {
        if (this.selection.selected.length) {
            let selectedRecord = this.selection.selected[0];
            this.formData.controls['id'].setValue(selectedRecord.id);
            this.formData.controls['mst'].setValue(selectedRecord.mst);
            this.formData.controls['san_luong'].setValue(selectedRecord.san_luong);
            this.formData.controls['cong_suat'].setValue(selectedRecord.cong_suat);
            this.formData.controls['id_thuc_pham'].setValue(selectedRecord.id_thuc_pham);
            this.formData.controls['time_id'].setValue(selectedRecord.time_id);
            this.formData.controls['tinh_trang_hoat_dong'].setValue(selectedRecord.tinh_trang_hoat_dong ? "true" : "false");
        }
    }

    prepareData(data) {
        return data;
    }

    prepareRemoveData(data) {
        let datas = data.map(element => new Object({ id: element.id }));
        return datas;
    }

    callService(data) {
        this.industryManagementService.PostFoodIndustry([data], this.currentYear).subscribe(response => this.successNotify(response), error => this.errorNotify(error));
    }

    callEditService(data){
        this.industryManagementService.PostFoodIndustry([this.formData.value], this.currentYear).subscribe(response => this.successNotify(response), error => this.errorNotify(error));
    }

    callRemoveService(data) {
        this.industryManagementService.DeleteFoodIndustry(data).subscribe(response => this.successNotify(response), error => this.errorNotify(error));
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

    applyExpireCheck(event) {
        this.filteredDataSource.data = event.checked ? [...this.dataSource.data.filter(d => d.is_expired)] : [...this.dataSource.data];
        this._prepareData();
        this.paginatorAgain();
    }

    showMoreDetail(event) {
        this.displayedColumns = (event.checked) ? this.fullFieldList : this.reducedFieldList;
    }

    showRightUnit(value, type) {
        return value + (type == 1 ? ' tấn' : ' lít');
    }


}