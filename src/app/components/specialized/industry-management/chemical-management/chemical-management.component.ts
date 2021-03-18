import { Component, Injector } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { ChemicalManagementModel } from 'src/app/_models/APIModel/industry-management.module';
import { FormControl } from '@angular/forms';

// Services
import { BaseComponent } from 'src/app/components/specialized/base.component';
import { IndustryManagementService } from 'src/app/_services/APIService/industry-management.service';

@Component({
    selector: 'chemical-management',
    templateUrl: './chemical-management.component.html',
    styleUrls: ['/../../special_layout.scss'],
})

export class ChemicalManagementComponent extends BaseComponent {

    displayedColumns: string[] = [];
    fullFieldList: string[] = ['select', 'index'];
    reducedFieldList: string[] = ['select', 'index', 'mst', 'ten_doanh_nghiep', 'dia_chi_day_du', 'nganh_nghe_kd_chinh', 'email', 'so_lao_dong', 'computed_cong_suat', 'computed_san_luong', 'so_giay_phep', 'ngay_cap', 'ngay_het_han', 'tinh_trang_hoat_dong'];

    displayedFields = {
        mst: "Mã số thuế",
        ten_doanh_nghiep: "Tên doanh nghiệp",
        dia_chi_day_du: "Địa chỉ",
        nganh_nghe_kd_chinh: "Ngành nghề KD chính",
        email: "Email",
        so_lao_dong: "Số lao động",
        ten_loai_hinh: "Loại hình",
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

    filterModel = {
        id_quan_huyen: [],
        nganh_nghe_kd_chinh: [],
    }

    dataSource: MatTableDataSource<ChemicalManagementModel> = new MatTableDataSource<ChemicalManagementModel>();
    filteredDataSource: MatTableDataSource<ChemicalManagementModel> = new MatTableDataSource<ChemicalManagementModel>();

    isChecked: boolean;
    sanLuongSanXuat: number = 0;
    sanLuongKinhDoanh: number = 0;

    public chemistryNameList = [];
    
    private typeList = [
        { name: "Sản xuất"},
        { name: "Kinh doanh"},
    ]

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
        this.displayedColumns = this.reducedFieldList;
        if (this.chemistryNameList.length == 0 && this.view == 'form') this.getChemicalNameListData();
    }

    resetAll() {
        super.resetAll();
        this.displayedColumns = this.reducedFieldList;
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
            // FIX: Hard code 'id_loai_hinh', must fix later
            e['id_loai_hinh'] = data['id_loai_hinh'];
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

    getChemicalManagementData(time_id: number) {
        this.industryManagementService.GetChemicalManagement(time_id).subscribe(result => {
            this.filteredDataSource.data = [];
            if (result.data && result.data.length > 0) {
                let chemicalManagementData = result.data[0];
                let capacityData = result.data[1];
                chemicalManagementData.map((c) => {
                    let matchingList = capacityData.filter(x => x.mst == c.mst);

                    c.computed_san_luong = matchingList.map(x => x.ten_hoa_chat ? x.ten_hoa_chat + ': ' + x.san_luong : x.san_luong).join(', ');
                    
                    c.computed_cong_suat = matchingList.map(x => x.ten_hoa_chat ? x.ten_hoa_chat + ': ' + x.cong_suat : x.cong_suat).join(', ');
                    c.san_luong = matchingList.length ? matchingList.map(x => x.san_luong ? parseInt(x.san_luong) : 0).reduce((a, b) => a + b) : 0;
                    c.cong_suat = matchingList.length ? matchingList.map(x => x.cong_suat ? parseInt(x.cong_suat) : 0).reduce((a, b) => a + b) : 0;
                    c.chemistryQtyIds = matchingList.map(element => new Object({ id: element.id }));
                });

                
                chemicalManagementData.forEach(element => {
                    element.ngay_cap = this.formatDate(element.ngay_cap);
                    element.ngay_het_han = this.formatDate(element.ngay_het_han);
                    element.is_expired = element.ngay_het_han ? new Date(element.ngay_het_han) < new Date() : false;
                });

                this.dataSource = new MatTableDataSource<ChemicalManagementModel>(chemicalManagementData);
                this.filteredDataSource.data = [...this.dataSource.data];
            }
            this._prepareData();
            this.paginatorAgain();
        })
    }

    private _prepareData() {
        let data = this.filteredDataSource.data;
        this.sanLuongKinhDoanh = data.length ? data.map(x => parseInt(x.san_luong) || 0).reduce((a, b) => a + b) : 0;
        this.sanLuongSanXuat = data.length ? data.map(x => parseInt(x.cong_suat) || 0).reduce((a, b) => a + b) : 0;
    }

    getChemicalNameListData() {
        this.industryManagementService.GetChemicalNameList().subscribe(result => {
            if (result.data && result.data.length > 0) this.chemistryNameList = result.data;
        })
    }

    applyExpireCheck(event) {
        this.filteredDataSource.data = event.checked ? [...this.dataSource.data.filter(d => d.is_expired)]: [...this.dataSource.data];
        this._prepareData();
    }

    showMoreDetail(event) {
        this.displayedColumns = (event.checked) ? this.fullFieldList : this.reducedFieldList;
    }

    prepareRemoveData() {
        let data = this.selection.selected;
        let chemistryDetailsIds = data.map(element => element.chemistryQtyIds)
        let datas = {
            chemistryIds: data.map(element => new Object({ id: element.id_qlcn_hc })),
            chemistryDetailsIds: [].concat.apply([], chemistryDetailsIds)
        }
        return datas;
    }

    callRemoveService(datas) {
        let self = this;
        let chemistryIds = datas.chemistryIds;
        let chemistryDetailsIds = datas.chemistryDetailsIds;
        this.industryManagementService.DeleteChemistryQty(chemistryDetailsIds).subscribe(response => {
            if (response.id != -1) {
                self.industryManagementService.DeleteChemistry(chemistryIds).subscribe(response => self.successNotify(response), error => self.errorNotify(error));
            }
        }, error => this.errorNotify(error));
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
                if (filterName == 'nganh_nghe_kd_chinh') {
                    filters[filterName].forEach(criteria => {
                        filterCrits = filterCrits.concat(filteredData.filter(x => x[filterName].trim().toLowerCase().includes(criteria.trim().toLowerCase())));
                    });
                } else {
                    filters[filterName].forEach(criteria => {
                        filterCrits = filterCrits.concat(filteredData.filter(x => x[filterName] == criteria));
                    });
                }
                filteredData = [...filterCrits];
            }
        });
        filteredData = filteredData.filter((v,i,a) => a.findIndex(t => (t.id_qlcn_hc === v.id_qlcn_hc)) === i)
        return filteredData;
    }
}