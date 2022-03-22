import { Component, Injector } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { ChemicalManagementModel } from 'src/app/_models/APIModel/industry-management.module';
import { FormControl, Validators } from '@angular/forms';

// Services
import { BaseComponent } from 'src/app/components/specialized/base.component';
import { IndustryManagementService } from 'src/app/_services/APIService/industry-management.service';
import { LoginService } from 'src/app/_services/APIService/login.service';

@Component({
    selector: 'chemical-management',
    templateUrl: './chemical-management.component.html',
    styleUrls: ['/../../special_layout.scss'],
})

export class ChemicalManagementComponent extends BaseComponent {
    DB_TABLE = 'QLCN_HC'
    displayedColumns: string[] = [];
    fullFieldList: string[] = ['select', 'index'];
    reducedFieldList: string[] = ['select', 'index', 'mst', 'ten_doanh_nghiep', 'dia_chi_day_du', 'nganh_nghe_kd_chinh', 'email', 
    'so_lao_dong', 'congSuatList', 'sanLuongList', 'so_giay_phep', 'ngay_cap', 'ngay_het_han', 'tinh_trang_hoat_dong', 'thoi_gian_chinh_sua_cuoi'];

    displayedFields = {
        id: "ID",
        mst: "Mã số thuế",
        ten_doanh_nghiep: "Tên doanh nghiệp",
        dia_chi_day_du: "Địa chỉ",
        nganh_nghe_kd_chinh: "Ngành nghề KD chính",
        email: "Email",
        so_lao_dong: "Số lao động",
        ten_loai_hinh: "Loại hình",
        congSuatList: "Công suất thiết kế Tấn/năm",
        sanLuongList: "Sản lượng Tấn/năm",
        so_giay_phep: "Số giấy phép/ Giấy chứng nhận",
        ngay_cap: "Ngày cấp",
        ngay_het_han: "Ngày hết hạn",
        von_dieu_le: "Vốn điều lệ",
        so_lao_dong_sct: "Sổ lao động SCT",
        email_sct: "Email SCT",
        tinh_trang_hoat_dong: "Trạng thái hoạt động",

        thoi_gian_chinh_sua_cuoi: "Thời gian cập nhật"
    }

    filterModel = {
        id_quan_huyen: [],
        nganh_nghe_kd_chinh: [],
        ngay_cap: [],
    }

    dataSource: MatTableDataSource<ChemicalManagementModel> = new MatTableDataSource<ChemicalManagementModel>();
    filteredDataSource: MatTableDataSource<ChemicalManagementModel> = new MatTableDataSource<ChemicalManagementModel>();

    isChecked: boolean;
    sanLuongSanXuat: number = 0;
    sanLuongKinhDoanh: number = 0;

    public chemistryNameList = [];

    private typeList = [
        {id_loai_hinh_hoat_dong: 1, name: "Sản xuất" },
        {id_loai_hinh_hoat_dong: 2, name: "Kinh doanh" },
    ]

    constructor(
        private injector: Injector,
        public industryManagementService: IndustryManagementService,
        public _login: LoginService
    ) {
        super(injector);
    }

    authorize: boolean = true

    ngOnInit() {
        super.ngOnInit();
        // this.getChemicalManagementData(this.currentYear);
        this.getChemicalManagementData(0);
        this.displayedColumns = this.reducedFieldList;
        this.fullFieldList = this.fullFieldList.concat(Object.keys(this.displayedFields));

        if (this._login.userValue.user_role_id == 5  || this._login.userValue.user_role_id == 1) {
            this.authorize = false
        }
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
                id_loai_hinh_hoat_dong: [],
                ten_hoa_chat: []
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
            id_qlcn_hc: new FormControl(),
            mst: new FormControl('', Validators.required),
            time_id: new FormControl(this.currentYear),
            details: this.formBuilder.array([
                this.formBuilder.group({
                    id: [],
                    id_hoa_chat: [],
                    san_luong: [],
                    cong_suat: [],
                    id_loai_hinh_hoat_dong: [],
                    ten_hoa_chat: []
                })
            ])
        }
    }

    setFormParams(){
        if (this.selection.selected.length) {
            let selectedRecord = this.selection.selected[0];
            this.formData.controls['id_qlcn_hc'].setValue(selectedRecord.id_qlcn_hc);
            this.formData.controls['mst'].setValue(selectedRecord.mst);
            this.formData.controls['time_id'].setValue(selectedRecord.time_id);

            let details = this.formData.get('details');
            details.controls = [];
            for (let cs of selectedRecord.congSuatList) {
                details.push(this.formBuilder.group({
                    id: [cs.id],
                    id_hoa_chat: [cs.id_hoa_chat],
                    san_luong: [cs.san_luong],
                    cong_suat: [cs.cong_suat],
                    id_loai_hinh_hoat_dong: [cs.id_loai_hinh_hoat_dong],
                    ten_hoa_chat: [cs.ten_hoa_chat]
                }));
            }
        }
    }

    prepareData(data) {
        let details = data.details;
        details.map(e => {
            e['mst'] = data['mst'];
            e['time_id'] = data['time_id'];
            e['id_hoa_chat'] = 1; // hard value 
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

    // public prepareEditData(data) {
    //     function _compareChangedData(prevData, curData) {
    //         return Object.keys(curData).reduce((diff, key) => {
    //             if (prevData[key] === curData[key]) return diff
    //             return {
    //               ...diff,
    //               [key]: curData[key]
    //             }
    //         }, {});        
    //     }

    //     let chemistryData = {
    //         pKey : {id_qlcn_hc : data.id_qlcn_hc},
    //         modDatas : {
    //             mst: data.mst,
    //             time_id: data.time_id,
    //         },
    //         table: 'QLCN_HC',
    //     }        

    //     let chemistryQtyDatas = data.details.map(x => {
    //         return {
    //             pKey : {id : x.id},
    //             modDatas : {
    //                 san_luong: x.san_luong,
    //                 cong_suat: x.cong_suat,
    //                 ten_hoa_chat: x.ten_hoa_chat,
    //                 id_loai_hinh_hoat_dong: x.id_loai_hinh_hoat_dong
    //             },
    //             table: 'QLCN_HC_SL',
    //         }
    //     });

    //     return {
    //         chemistryData: chemistryData,
    //         chemistryQtyDatas: chemistryQtyDatas,
    //     };
    // }

    public callEditService(data) {
        let chemistryData = data['chemistryData'];
        let chemistryQtyDatas = data['chemistryQtyDatas'];

        this.sctService.UpdateRecord(chemistryData).subscribe(response => this.successNotify(response), error => this.errorNotify(error));
        chemistryQtyDatas.forEach(data => {
            this.sctService.UpdateRecord(data).subscribe(response => this.successNotify(response), error => this.errorNotify(error));
        });
    }

    getChemicalManagementData(time_id: number) {
        this.industryManagementService.GetChemicalManagement(time_id).subscribe(result => {
            this.filteredDataSource.data = [];
            if (result.data && result.data.length > 0) {
                let chemicalManagementData = result.data[0];
                let capacityData = result.data[1];
                chemicalManagementData.map((c) => {
                    let matchingList = capacityData.filter(x => x.mst == c.mst);

                    c.sanLuongList = matchingList;
                    c.congSuatList = matchingList;
                    
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
                console.log(this.filteredDataSource.data, this.getFormParams());
            }
            this._prepareData();
            this.paginatorAgain();
        })
    }

    _prepareData() {
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
        this.filteredDataSource.data = event.checked ? [...this.dataSource.data.filter(d => d.is_expired)] : [...this.dataSource.data];
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
                } else if (filterName == 'ngay_cap') {
                    filters[filterName].forEach(criteria => {
                        if (criteria && criteria !=0) filterCrits = filterCrits.concat(filteredData.filter(x => x[filterName].toString().includes(criteria)));
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
        filteredData = filteredData.filter((v, i, a) => a.findIndex(t => (t.id_qlcn_hc === v.id_qlcn_hc)) === i)
        return filteredData;
    }
}