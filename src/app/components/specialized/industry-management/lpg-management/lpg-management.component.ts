import { Component, Injector } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { LPGManagementModel } from 'src/app/_models/APIModel/industry-management.module';
import { FormControl } from '@angular/forms';

// Services
import { BaseComponent } from 'src/app/components/specialized/specialized-base.component';
import { IndustryManagementService } from 'src/app/_services/APIService/industry-management.service';

@Component({
    selector: 'lpg-management',
    templateUrl: './lpg-management.component.html',
    styleUrls: ['/../../special_layout.scss'],
})

export class LPGManagementComponent extends BaseComponent {
    displayedColumns: string[] = [];
    fullFieldList: string[] = ['select', 'index']
    reducedFieldList: string[] = ['select', 'index', 'ten_doanh_nghiep', 'nganh_nghe_kd_chinh', 'dia_chi_day_du', 'cong_suat', 'san_luong', 'tinh_trang_hoat_dong'];
    
    dataSource: MatTableDataSource<LPGManagementModel> = new MatTableDataSource<LPGManagementModel>();
    filteredDataSource: MatTableDataSource<LPGManagementModel> = new MatTableDataSource<LPGManagementModel>();
    
    years: number[] = [];
    isChecked: boolean;
    sanLuongSanXuat: number = 0;
    sanLuongKinhDoanh: number = 0;
    year: number;

    displayedFields = {
        mst: "Mã số thuế",
        ten_doanh_nghiep: "Tên doanh nghiệp",
        dia_chi_day_du: "Địa chỉ",
        nganh_nghe_kd_chinh: "Ngành nghề KD chính",
        email: "Email",
        so_lao_dong: "Số lao động",
        cong_suat: "Công suất thiết kế Tấn/năm",
        san_luong: "Sản lượng Tấn/năm",
        von_dieu_le: "Vốn điều lệ",
        so_lao_dong_sct: "Sổ lao động SCT",
        email_sct: "Email SCT",
        so_giay_phep: "Số giấy phép",
        ngay_cap: "Ngày cấp",
        ngay_het_han: "Ngày hết hạn",
        tinh_trang_hoat_dong: "Trạng thái hoạt động",
    }

    constructor(
        private injector: Injector,
        public industryManagementService: IndustryManagementService,
    ) {
        super(injector);
    }

    ngOnInit() {
        super.ngOnInit();
        this.GetLGPManagementData(this.currentYear);
        this.displayedColumns = this.reducedFieldList;
        this.fullFieldList = this.fullFieldList.concat(Object.keys(this.displayedFields));
    }

    getLinkDefault(){
        this.LINK_DEFAULT = "/specialized/industry-management/lpg";
        this.TITLE_DEFAULT = "Công nghiệp - Chiết nạp khí hoá lỏng";
        this.TEXT_DEFAULT = "Công nghiệp - Chiết nạp khí hoá lỏng";
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.filteredDataSource.filter = filterValue.trim().toLowerCase();
    }

    getFormParams() {
        return {
            id: new FormControl(),
            mst: new FormControl(),
            san_luong: new FormControl(),
            cong_suat: new FormControl(),
        }
    }

    setFormParams() {
        if (this.selection.selected.length) {
            let selectedRecord = this.selection.selected[0];
            this.formData.controls['id'].setValue(selectedRecord.id);
            this.formData.controls['mst'].setValue(selectedRecord.mst);
            this.formData.controls['san_luong'].setValue(selectedRecord.san_luong);
            this.formData.controls['cong_suat'].setValue(selectedRecord.cong_suat);
        }
    }

    prepareData(data) {
        data = {...data, ...{
            tinh_trang_hoat_dong: "true",
            time_id: this.currentYear,
        }}
        return data;        
    }

    prepareRemoveData(data) { 
        let datas = data.map(element => new Object({id: element.id}));
        return datas;
    }

    callService(data) {
        this.industryManagementService.PostLPGManagement([data], this.currentYear).subscribe(response => this.successNotify(response), error => this.errorNotify(error));
    }

    callEditService(data) {
        this.industryManagementService.PostLPGManagement([data], this.currentYear).subscribe(response => this.successNotify(response), error => this.errorNotify(error));
    }

    callRemoveService(data) {
        this.industryManagementService.DeleteLPGManagement(data).subscribe(response => this.successNotify(response), error => this.errorNotify(error));
    }

    GetLGPManagementData(time_id: number) {
        this.industryManagementService.GetLPGManagement(time_id).subscribe(result => {
            this.dataSource = new MatTableDataSource<LPGManagementModel>(result.data);
            this.dataSource.data.forEach(element => {
                element.is_expired = element.ngay_het_han ? new Date(element.ngay_het_han) < new Date() : false;
            });

            this.filteredDataSource.data = [...this.dataSource.data];
            this._prepareData();
            this.paginatorAgain();
        })
    }

    private _prepareData() {
        this.sanLuongKinhDoanh = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => x.san_luong || 0).reduce((a, b) => a + b) : 0;
        this.sanLuongSanXuat = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => x.cong_suat || 0).reduce((a, b) => a + b) : 0;
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
    
}