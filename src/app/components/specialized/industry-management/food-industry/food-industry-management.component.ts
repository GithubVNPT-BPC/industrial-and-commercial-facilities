import { Component, Injector } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { District } from 'src/app/_models/district.model';
import { FoodIndustryModel } from 'src/app/_models/APIModel/industry-management.module';
import { FormControl } from '@angular/forms';

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
    displayedColumns: string[] = [];
    fullFieldList: string[] = ['select', 'index'];
    reducedFieldList: string[] = ['select', 'index', 'mst', 'ten_doanh_nghiep', 'nganh_nghe_kd_chinh', 'dia_chi_day_du', 'so_lao_dong_sct', 'cong_suat', 'san_luong', 'so_giay_phep', 'ngay_cap', 'ngay_het_han', 'tinh_trang_hoat_dong'];

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
    }

    dataSource: MatTableDataSource<FoodIndustryModel> = new MatTableDataSource<FoodIndustryModel>();
    filteredDataSource: MatTableDataSource<FoodIndustryModel> = new MatTableDataSource<FoodIndustryModel>();

    isChecked: boolean;
    sanLuongBotMy: number = 0;
    sanLuongRuou: number = 0;

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
    }

    getLinkDefault() {
        this.LINK_DEFAULT = "/specialized/industry-management/food";
        this.TITLE_DEFAULT = "Công nghiệp - Công nghiệp thực phẩm";
        this.TEXT_DEFAULT = "Công nghiệp - Công nghiệp thực phẩm";
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.filteredDataSource.filter = filterValue.trim().toLowerCase();
    }

    getFormParams() {
        return {
            mst: new FormControl(),
            san_luong: new FormControl(),
            cong_suat: new FormControl(),
            tinh_trang_hoat_dong: new FormControl("true"),
            time_id: new FormControl(this.currentYear)
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

    callRemoveService(data) {
        this.industryManagementService.DeleteFoodIndustry(data).subscribe(response => this.successNotify(response), error => this.errorNotify(error));
    }

    applyDistrictFilter(event) {
        let filteredData = [];

        event.value.forEach(element => {
            this.dataSource.data.filter(x => x.id_quan_huyen == element).forEach(x => filteredData.push(x));
        });

        if (!filteredData.length) {
            if (event.value.length)
                this.filteredDataSource.data = [];
            else
                this.filteredDataSource.data = this.dataSource.data;
        }
        else {
            this.filteredDataSource.data = filteredData;
        }
        this._prepareData();
    }

    applyExpireCheck(event) {
        this.filteredDataSource.data = event.checked ? [...this.dataSource.data.filter(d => d.is_expired)] : [...this.dataSource.data];
        this._prepareData();
    }

    showMoreDetail(event) {
        this.displayedColumns = (event.checked) ? this.fullFieldList : this.reducedFieldList;
    }

    showRightUnit(value, type) {
        return value + (type == 1 ? ' tấn' : ' lít');
    }


}