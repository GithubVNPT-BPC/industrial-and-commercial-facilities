import { Component, Injector } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';

import { BlockElectricModel } from 'src/app/_models/APIModel/electric-management.module';

import { EnergyService } from 'src/app/_services/APIService/energy.service';

import { BaseComponent } from 'src/app/components/specialized/base.component';
import { LoginService } from 'src/app/_services/APIService/login.service';

@Component({
    selector: 'app-difference-electric',
    templateUrl: './difference-electric.component.html',
    styleUrls: ['/../../special_layout.scss']
})
export class DifferenceElectricComponent extends BaseComponent {
    DB_TABLE = 'QLNL_CNDK'
    //Constant variable
    public readonly displayedColumns: string[] = ['select', 'index', 'ten_du_an', 'ten_doanh_nghiep', 'ten_quan_huyen', 'cong_suat_thiet_ke', 'san_luong_6_thang',
        'san_luong_nam', 'doanh_thu_6_thang', 'doanh_thu_nam', 'id_trang_thai_hoat_dong', 'thoi_gian_chinh_sua_cuoi'];
    //TS & HTML Variable
    public dataSource: MatTableDataSource<BlockElectricModel> = new MatTableDataSource<BlockElectricModel>();
    public filteredDataSource: MatTableDataSource<BlockElectricModel> = new MatTableDataSource<BlockElectricModel>();

    //Only TS Variable
    doanhThu: number;
    congXuat: number;
    sanluongnam: number;
    soLuongDoanhNghiep: number;
    isChecked: boolean;
    doanhThu6t: number;
    sanluong6t: number;

    constructor(
        private injector: Injector,
        private energyService: EnergyService,
        public _login: LoginService
    ) {
        super(injector);
    }

    authorize: boolean = true

    ngOnInit() {
        super.ngOnInit();
        this.getDataDiffElectric(this.currentYear);

        if (this._login.userValue.user_role_id == 4 || this._login.userValue.user_role_id == 1) {
            this.authorize = false
        }
    }

    getLinkDefault() {
        this.LINK_DEFAULT = "/specialized/enery-management/diffelectric";
        this.TITLE_DEFAULT = "Hiện trạng các nguồn điện sơ cấp - Nguồn điện khác";
        this.TEXT_DEFAULT = "Hiện trạng các nguồn điện sơ cấp - Nguồn điện khác";
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.filteredDataSource.filter = filterValue.trim().toLowerCase();
    }

    getFormParams() {
        return {
            id: new FormControl(),
            ten_du_an: new FormControl('', Validators.required),
            ten_doanh_nghiep: new FormControl('', Validators.required),
            id_quan_huyen: new FormControl('', Validators.required),
            cong_suat_thiet_ke: new FormControl(0, Validators.required),
            san_luong_6_thang: new FormControl(0, Validators.required),
            san_luong_nam: new FormControl(0, Validators.required),
            doanh_thu_6_thang: new FormControl(0, Validators.required),
            doanh_thu_nam: new FormControl(0, Validators.required),
            time_id: new FormControl(this.currentTime, Validators.required),
            id_trang_thai_hoat_dong: new FormControl('', Validators.required),
        }
    }

    setFormParams() {
        if (this.selection.selected.length) {
            let selectedRecord = this.selection.selected[0];
            let objectList = this.getFormParams();
            for (let o in objectList) {
                this.formData.controls[o].setValue(selectedRecord[o]);
            }
        }
    }

    prepareData(data) {
        return data;
    }

    callService(data) {
        this.energyService.PostDiffkElectricData([data], this.currentYear).subscribe(response => this.successNotify(response), error => this.errorNotify(error));
    }

    prepareRemoveData(data) {
        let datas = data.map(element => new Object({ id: element.id }));
        return datas;
    }

    callRemoveService(data) {
        this.energyService.DeleteDiffElectric(data).subscribe(response => this.successNotify(response), error => this.errorNotify(error));
    }

    getDataDiffElectric(time_id: any) {
        this.energyService.LayDuLieunguonDienKhac(time_id).subscribe(res => {
            this.filteredDataSource.data = [];
            if (res.data && res.data.length > 0) {
                this.filteredDataSource = new MatTableDataSource<BlockElectricModel>(res['data']);
                this.dataSource = new MatTableDataSource<BlockElectricModel>(res['data']);
            }
            this.caculatorValue();
            this.paginatorAgain();
        })
    }

    caculatorValue() {
        this.doanhThu = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => x.doanh_thu_nam).reduce((a, b) => a + b) : 0;
        this.soLuongDoanhNghiep = this.filteredDataSource.data.length;
        this.congXuat = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => x.cong_suat_thiet_ke).reduce((a, b) => a + b) : 0;
        this.sanluongnam = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => x.san_luong_nam).reduce((a, b) => a + b) : 0;

        this.doanhThu6t = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => x['doanh_thu_6_thang']).reduce((a, b) => a + b) : 0;
        this.sanluong6t = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => x.san_luong_6_thang).reduce((a, b) => a + b) : 0;
    }

    applyActionCheck(event) {
        event.checked
            ? this.filteredDataSource.data = this.filteredDataSource.data.filter(item => item.id_trang_thai_hoat_dong = 0)
            : this.filteredDataSource.data = this.dataSource.data;
        // this.filteredDataSource.filter = (event.checked) ? "true" : "";
        this.caculatorValue();
    }

    applyDistrictFilter(event) {
        let filteredData = [];

        event.value.forEach(element => {
            this.dataSource.data.filter(x => x['id_quan_huyen'] == element).forEach(x => filteredData.push(x));
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
        this.caculatorValue();
        this.paginatorAgain();
    }

}
