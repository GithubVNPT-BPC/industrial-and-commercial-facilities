import { Component, Injector } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { District } from 'src/app/_models/district.model';
import { FoodIndustryModel } from 'src/app/_models/APIModel/industry-management.module';
import { FormControl } from '@angular/forms';

// Services
import { BaseComponent } from 'src/app/components/specialized/base.component';
import { IndustryManagementService } from 'src/app/_services/APIService/industry-management.service';

@Component({
    selector: 'food-industry-management',
    templateUrl: './food-industry-management.component.html',
    styleUrls: ['/../../special_layout.scss'],
})

export class FoodIndustryManagementComponent extends BaseComponent {
    //Constant
  
    displayedColumns: string[] = [];
    fullFieldList: string[] = ['select', 'index'];
    reducedFieldList: string[] = ['select', 'index', 'ten_doanh_nghiep', 'nganh_nghe_kd_chinh', 'dia_chi_day_du', 'cong_suat', 'san_luong', 'tinh_trang_hoat_dong'];
    
    displayedFields = {
        mst: "Mã số thuế",
        ten_doanh_nghiep: "Tên doanh nghiệp",
        nganh_nghe_kd_chinh: "Ngành nghề KD chính",
        dia_chi_day_du: "Địa chỉ",
        // email: "Email",
        // ten_thuc_pham: "Tên thực phẩm",
        san_luong: "Sản lượng/năm",
        cong_suat: "Công suất thiết kế/năm",
        von_dieu_le: "Vốn đầu tư",
        // so_lao_dong_sct: "Sổ lao động SCT",
        // email_sct: "Email SCT",
        so_giay_phep: "Số giấy phép",
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
    
    ) {
        super(injector);
    }

    ngOnInit() {
        super.ngOnInit();
        this.GetFoodIndustryData(this.currentYear);
        this.displayedColumns = this.reducedFieldList;
        this.fullFieldList = this.fullFieldList.concat(Object.keys(this.displayedFields));
    }

    GetFoodIndustryData(time_id) {
        this.industryManagementService.GetFoodIndustry(time_id).subscribe(result => {
            if (result.data && result.data.length) {
                result.data.forEach(element => {
                    element.ngay_cap = this.formatDate(element.ngay_cap);
                    element.ngay_het_han = this.formatDate(element.ngay_het_han);
                });
                
                this.dataSource = new MatTableDataSource<FoodIndustryModel>(result.data);
                this.dataSource.data.forEach(element => {
                    element.is_expired = !element.tinh_trang_hoat_dong;
                });
                this.filteredDataSource.data = [...this.dataSource.data.filter(d => !d.is_expired)];
                this._prepareData();
                this.paginatorAgain();
            }
        })
    }

    private _prepareData() {
        this.sanLuongBotMy = this.filteredDataSource.data.length ? this.filteredDataSource.data.filter(x => x.id_thuc_pham == 1).map(x => x.san_luong || 0).reduce((a, b) => a + b) : 0;
        this.sanLuongRuou = this.filteredDataSource.data.length ? this.filteredDataSource.data.filter(x => x.id_thuc_pham == 2).map(x => x.san_luong || 0).reduce((a, b) => a + b) : 0;
    }

    getLinkDefault(){
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
        }
    }

    prepareData(data) {
        data = {...data, ...{
            tinh_trang_hoat_dong: "true",
            time_id: this.currentYear,
        }}
        return data;        
    }

    callService(data) {
        this.industryManagementService.PostFoodIndustry([data], this.currentYear).subscribe(response => this.successNotify(response), error => this.errorNotify(error));
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
        this.filteredDataSource.data = [...this.dataSource.data.filter(d => d.is_expired == event.checked ? true:false)];
        this._prepareData();
    }

    showMoreDetail(event) {
        this.displayedColumns = (event.checked) ? this.fullFieldList : this.reducedFieldList;
    }

    showRightUnit(value, type) {
        return value + (type == 1 ? ' tấn' : ' lít');
    }
}