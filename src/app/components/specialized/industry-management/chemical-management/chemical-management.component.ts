import { Component, Injector } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { District } from 'src/app/_models/district.model';
import { ChemicalManagementModel } from 'src/app/_models/APIModel/industry-management.module';
import { FormControl } from '@angular/forms';

// Services
import { BaseComponent } from 'src/app/components/specialized/specialized-base.component';
import { IndustryManagementService } from 'src/app/_services/APIService/industry-management.service';

@Component({
    selector: 'chemical-management',
    templateUrl: './chemical-management.component.html',
    styleUrls: ['/../../special_layout.scss'],
})

export class ChemicalManagementComponent extends BaseComponent {

    displayedColumns: string[] = [];
    fullFieldList: string[] = ['select', 'index'];
    reducedFieldList: string[] = ['select', 'index', 'ten_doanh_nghiep', 'dia_chi_day_du', 'nganh_nghe_kd_chinh', 'computed_cong_suat', 'computed_san_luong', 'ngay_cap', 'tinh_trang_hoat_dong'];

    displayedFields = {
        mst: "Mã số thuế",
        ten_doanh_nghiep: "Tên doanh nghiệp",
        dia_chi_day_du: "Địa chỉ",
        nganh_nghe_kd_chinh: "Ngành nghề KD chính",
        email: "Email",
        so_lao_dong: "Số lao động",
        computed_cong_suat: "Công suất thiết kế Tấn/năm",
        computed_san_luong: "Sản lượng Tấn/năm",
        so_giay_phep: "Số giấy phép/ Giấy chứng nhận",
        ngay_cap: "Ngày cấp",
        ngay_het_han: "Ngày hết hạn",
        von_dieu_le: "Vốn điều lệ",
        so_lao_dong_sct: "Sổ lao động SCT",
        email_sct: "Email SCT",
        tinh_trang_hoat_dong: "Trạng thái hoạt động",
    }

    dataSource: MatTableDataSource<ChemicalManagementModel> = new MatTableDataSource<ChemicalManagementModel>();
    filteredDataSource: MatTableDataSource<ChemicalManagementModel> = new MatTableDataSource<ChemicalManagementModel>();

    isChecked: boolean;
    sanLuongSanXuat: number = 0;
    sanLuongKinhDoanh: number = 0;

    public chemistryNameList = [];

    constructor(
        private injector: Injector,
        public industryManagementService: IndustryManagementService,
    ) {
        super(injector);
    }

    ngOnInit() {
        super.ngOnInit();
        this.getChemicalManagementData(this.currentYear);
        this.displayedColumns = this.reducedFieldList;
        this.fullFieldList = this.fullFieldList.concat(Object.keys(this.displayedFields));
    }

    getLinkDefault() {
        //Constant
        this.LINK_DEFAULT = "/specialized/industry-management/chemical";
        this.TITLE_DEFAULT = "Công nghiệp - Hoá chất";
        this.TEXT_DEFAULT = "Công nghiệp - Hoá chất";
    }

    public switchView() {
        super.switchView();
        if (this.chemistryNameList.length == 0 && this.view == 'form') this.getChemicalNameListData();
    }

    private addQtyRow(event) {
        event.preventDefault();
        let self = this;
        function createItem() {
            return self.formBuilder.group({
                id_hoa_chat: [],
                san_luong: [],
                cong_suat: [],
            });
        }

        let details = this.formData.get('details');
        details.push(createItem());
    }

    private removeQtyRow(event, index) {
        event.preventDefault();
        this.formData.get('details').removeAt(index);
    }

    getFormParams() {
        return {
            mst: new FormControl(),
            time_id: new FormControl({value: this.currentYear}),
            details: this.formBuilder.array([
                this.formBuilder.group({
                    id_hoa_chat: [],
                    san_luong: [],
                    cong_suat: [],
                })
            ])
        }
    }

    prepareData(data) {
        let details = data.details;
        details.map(e => {
            e['mst'] = data['mst'];
            e['time_id'] = data['time_id'];
        });

        data = {
            chemistryData: {
                mst: data.mst,
                tinh_trang_hoat_dong: "true",
                time_id: data['time_id'],
            },
            chemistryQtyData: details,
            time_id: data['time_id'],
        }
        return data;
    }

    callService(data) {
        let self = this;
        let chemistryData = data.chemistryData;
        let chemistryQtyData = data.chemistryQtyData;
        this.industryManagementService.PostChemicalManagement([chemistryData], data.time_id).subscribe(response => {
            if (response.id != -1) {
                self.industryManagementService.PostChemicalManagementQty(chemistryQtyData, data.time_id).subscribe(response => self.successNotify(response), error => self.errorNotify(error));
            }
        }, error => this.errorNotify(error));
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.filteredDataSource.filter = filterValue.trim().toLowerCase();
    }

    getChemicalManagementData(time_id: number) {
        this.industryManagementService.GetChemicalManagement(time_id).subscribe(result => {
            if (result.data && result.data.length > 0) {
                let chemicalManagementData = result.data[0];
                let capacityData = result.data[1];
                chemicalManagementData.map((c) => {
                    let matchingList = capacityData.filter(x => x.mst == c.mst);

                    c.computed_san_luong = matchingList.map(x => x.ten_hoa_chat ? x.ten_hoa_chat + ': ' + x.san_luong : x.san_luong).join(', ');
                    
                    c.computed_cong_suat = matchingList.map(x => x.ten_hoa_chat ? x.ten_hoa_chat + ': ' + x.cong_suat : x.cong_suat).join(', ');
                    c.san_luong = matchingList.length ? matchingList.map(x => x.san_luong ? parseInt(x.san_luong) : 0).reduce((a, b) => a + b) : 0;
                    c.cong_suat = matchingList.length ? matchingList.map(x => x.cong_suat ? parseInt(x.cong_suat) : 0).reduce((a, b) => a + b) : 0;
                });

                this.dataSource = new MatTableDataSource<ChemicalManagementModel>(chemicalManagementData);
                this.dataSource.data.forEach(element => {
                    element.is_expired = element.ngay_het_han ? new Date(element.ngay_het_han) < new Date() : false;
                });

                this.filteredDataSource.data = [...this.dataSource.data.filter(d => !d.is_expired)];
                this._prepareData();
                this.paginatorAgain();
            }
        })
    }

    private _prepareData() {
        this.sanLuongKinhDoanh = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => parseInt(x.san_luong) || 0).reduce((a, b) => a + b) : 0;
        this.sanLuongSanXuat = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => parseInt(x.cong_suat) || 0).reduce((a, b) => a + b) : 0;
    }

    getChemicalNameListData() {
        this.industryManagementService.GetChemicalNameList().subscribe(result => {
            if (result.data && result.data.length > 0) this.chemistryNameList = result.data;
        })
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

    prepareRemoveData() {
        let datas = this.selection.selected.map(element => new Object({ id: element.id }));
        return datas;
    }

    callRemoveService(data) {
        // this.industryManagementService.deleteMultiLevel(data).subscribe(res => {
        //     this.successNotify(res);
        // });
    }
}