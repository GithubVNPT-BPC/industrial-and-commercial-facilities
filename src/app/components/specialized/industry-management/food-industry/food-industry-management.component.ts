import { Component, Injector } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { District } from 'src/app/_models/district.model';
import { FoodIndustryModel } from 'src/app/_models/APIModel/industry-management.module';
import { FormControl } from '@angular/forms';

// Services
import { BaseComponent } from 'src/app/components/specialized/specialized-base.component';
import { IndustryManagementService } from 'src/app/_services/APIService/industry-management.service';

@Component({
    selector: 'food-industry-management',
    templateUrl: './food-industry-management.component.html',
    styleUrls: ['/../../special_layout.scss'],
})

export class FoodIndustryManagementComponent extends BaseComponent {
    //Constant
  
    displayedColumns: string[] = [];
    fullFieldList: string[] = ['select', 'index'] //, 'ten_doanh_nghiep', 'mst', 'email', 'nganh_nghe_kd_chinh', 'dia_chi_day_du', 'don_vi', 'von_dieu_le', 'cong_suat', 'ten_thuc_pham', 'san_luong', 'so_lao_dong_sct', 'email_sct', 'so_giay_phep', 'ngay_cap', 'ngay_het_han', 'tinh_trang_hoat_dong'];
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
    
    years: number[] = [];
    year : number;
    districts: District[] = [{ id: 1, ten_quan_huyen: 'Thị xã Phước Long' },
    { id: 2, ten_quan_huyen: 'Thành phố Đồng Xoài' },
    { id: 3, ten_quan_huyen: 'Thị xã Bình Long' },
    { id: 4, ten_quan_huyen: 'Huyện Bù Gia Mập' },
    { id: 5, ten_quan_huyen: 'Huyện Lộc Ninh' },
    { id: 6, ten_quan_huyen: 'Huyện Bù Đốp' },
    { id: 7, ten_quan_huyen: 'Huyện Hớn Quản' },
    { id: 8, ten_quan_huyen: 'Huyện Đồng Phú' },
    { id: 9, ten_quan_huyen: 'Huyện Bù Đăng' },
    { id: 10, ten_quan_huyen: 'Huyện Chơn Thành' },
    { id: 11, ten_quan_huyen: 'Huyện Phú Riềng' }];
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
        this.years = this.getYears();
        this.year = new Date().getFullYear() - 1;
        this.GetFoodIndustryData(this.year);
        // this.filteredDataSource.filterPredicate = function (data: ChemicalLPGFoodManagementModel, filter): boolean {
        //     return String(data.is_het_han).includes(filter);
        // };
        this.displayedColumns = this.reducedFieldList;
        this.fullFieldList = this.fullFieldList.concat(Object.keys(this.displayedFields));
        
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

    GetFoodIndustryData(time_id) {
        this.industryManagementService.GetFoodIndustry(time_id).subscribe(result => {
            this.dataSource = new MatTableDataSource<FoodIndustryModel>(result.data);
            this.filteredDataSource.data = [...this.dataSource.data];
            this.dataSource.data = [...this.dataSource.data];
            // this.dataSource.data.forEach(element => {
            //     element.is_het_han = new Date(element.ngay_het_han) < new Date();
            // });

            // this.sanLuongBotMy = this.filteredDataSource.data.length ? this.filteredDataSource.data.filter(x => x.loai_sp == 1).map(x => parseInt(x.san_luong) || 0).reduce((a, b) => a + b) : 0;
            // this.sanLuongRuou = this.filteredDataSource.data.length ? this.filteredDataSource.data.filter(x => x.loai_sp == 2).map(x => parseInt(x.san_luong) || 0).reduce((a, b) => a + b) : 0;
            this.filteredDataSource.paginator = this.paginator;
            this.paginator._intl.itemsPerPageLabel = 'Số hàng';
            this.paginator._intl.firstPageLabel = "Trang Đầu";
            this.paginator._intl.lastPageLabel = "Trang Cuối";
            this.paginator._intl.previousPageLabel = "Trang Trước";
            this.paginator._intl.nextPageLabel = "Trang Tiếp";
        })
    }

    getYears() {
        return Array(5).fill(1).map((element, index) => new Date().getFullYear() - index);
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
        // this.sanLuongBotMy = this.filteredDataSource.data.length ? this.filteredDataSource.data.filter(x => x.loai_sp == 1).map(x => parseInt(x.san_luong) || 0).reduce((a, b) => a + b) : 0;
        // this.sanLuongRuou = this.filteredDataSource.data.length ? this.filteredDataSource.data.filter(x => x.loai_sp == 2).map(x => parseInt(x.san_luong) || 0).reduce((a, b) => a + b) : 0;
    }

    applyExpireCheck(event) {
        let filterEntity = new FoodIndustryModel();
        if(event.checked){
            this.filteredDataSource.data = this.filteredDataSource.data.filter(item=> {
                return item.tinh_trang_hoat_dong ==  false;
            });
        }else{
            this.filteredDataSource.data = this.dataSource.data;
        }
    }

    showMoreDetail(event) {
        this.displayedColumns = (event.checked) ? this.fullFieldList : this.reducedFieldList;
    }

    showRightUnit(value, type) {
        return value + (type == 1 ? ' tấn' : ' lít');
    }
}