import { Component, Injector } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material';
import { EnergyService } from 'src/app/_services/APIService/energy.service';
import { LoginService } from 'src/app/_services/APIService/login.service';
import { BaseComponent } from '../../base.component';


export class Group {
    ten_tram;
    loai_tram;
}

@Component({
    selector: 'current-power-station',
    templateUrl: './current-power-station.component.html',
    styleUrls: ['/../../special_layout.scss'],
})
export class CurrentPowerStationComponent extends BaseComponent {
    DB_TABLE = 'QLNL_HIENTRANG_TRAM_BIEN_AP';
    dataSource = new MatTableDataSource<any | Group>(
        []
    );
    filteredDataSource = new MatTableDataSource<any | Group>([]);
    allData: any[];
    groupByColumns: string[] = [];

    displayedColumns: string[] = ['select', 'ten_tram', 'so_may', 'dung_luong_thiet_ke', 'dung_luong_hien_huu', 'dat', 'ghi_chu'];
    displayColumnHeader1: string[] = ['select', 'ten_tram', 'quy_mo_thiet_ke', 'thong_so_hien_huu', 'ghi_chu'];
    displayColumnHeader: string[] = ['so_may', 'dung_luong_thiet_ke', 'dung_luong_hien_huu', 'dat'];

    trang_thai_hd: any[] = [
        { id_trang_thai_hoat_dong: 1, ten_trang_thai_hoat_dong: 'ĐANG HOẠT ĐỘNG' },
        { id_trang_thai_hoat_dong: 2, ten_trang_thai_hoat_dong: 'KHÔNG HOẠT ĐỘNG' }
    ];
    loai_quy_hoach_2 = {
        1: 'Trạm biến áp 110KV',
        2: 'Trạm biến áp 220KV',
        3: 'Trạm biến áp 500KV',
        4: 'Đường dây 110KV',
        5: 'Đường dây 220KV',
        6: 'Đường dây 500KV',
    }

    loai_quy_hoach = {
        1: 'Trạm biến áp 110KV',
        2: 'Trạm biến áp 220KV',
        3: 'Trạm biến áp 500KV',
    }

    loai_tram = [
        { id: 1, name: 'Trạm biến áp 110KV' },
        { id: 2, name: 'Trạm biến áp 220KV' },
        { id: 3, name: 'Trạm biến áp 500KV' },

    ]


    authorize: boolean = true

    reportTypes = [
        // { ma_so: null, noi_dung: '' },
        // { ma_so: 1, noi_dung: 'Tháng' },
        // { ma_so: 2, noi_dung: 'Quý' },
        { ma_so: 3, noi_dung: '6 Tháng' }, 
        { ma_so: 4, noi_dung: 'Năm' }
    ];
    months: number[] = [null, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    selectedYear: number = new Date().getFullYear();
    years: number[] = [];
    quarters: number[] = [null, 1, 2, 3, 4];
    half: number[] =[null, 1, 2];
    periods: Object[];
    selectedPeriod: number = 0;
    selectType: number = 4;
    selectTypeStreet: number = 0;
    so_luong: number = 0;
    isShowPeriod: boolean = false;

    constructor(
        private injector: Injector,
        private energyService: EnergyService,
        public _login: LoginService
    ) {
        super(injector);
        this.groupByColumns = ['loai_tram']
    }

    ngOnInit() {
        super.ngOnInit();
        this.years = this.InitialYears();
        this.changePeriod();

        this.getDataElectric110KV();

        if (this._login.userValue.user_role_id == 4 || this._login.userValue.user_role_id == 1) {
            this.authorize = false
        }
    }

    getDataElectric110KV() {
        this.energyService.LayDuLieuHienTrangTram110KV(this.time_id, this.selectTypeStreet).subscribe(result => {
            this.filteredDataSource.data = [];
            if (result.data && result.data.length > 0) {
                this.dataSource = new MatTableDataSource<any | Group>(result.data);

                this.filteredDataSource.data = this.addGroups([...this.dataSource.data], this.groupByColumns);
                this.so_luong = this.filteredDataSource.data.filter(i => !i['is_group']).length
                console.log(this.filteredDataSource.data)
            }
            // this._prepareData();
            this.paginatorAgain();
        })
    }

    addGroups(data: any[], groupByColumns: string[]) {
        return this.getSublevel(data, groupByColumns);
    }

    getSublevel(data: any[], groupByColumns: string[]): any[] {
        const groups = this.uniqueBy(
            data.map(
                row => {
                    const result = new Group();
                    result[groupByColumns[0]] = row[groupByColumns[0]];
                    return result;
                }
            ),
            JSON.stringify);

        const currentColumn = groupByColumns[0];
        let subGroups = [];
        groups.forEach(group => {
            const rowsInGroup = data.filter(row => group[currentColumn] === row[currentColumn]);
            group.totalCounts = rowsInGroup.length;
            group['ten_tram'] = this.getName(group[currentColumn]);
            group['is_group'] = true;
            const subGroup = rowsInGroup;
            // this.getSublevel(rowsInGroup, 1, groupByColumns, group);
            subGroup.unshift(group);
            subGroups = subGroups.concat(subGroup);
        });
        return subGroups;
    }

    getName(loai_tram) {
        switch (loai_tram) {
            case 1:
                return "Trạm biến áp 110KV"
            case 2:
                return "Trạm biến áp 220KV"
            case 3:
                return "Trạm biến áp 500KV"
            default:
                return ""
        }
    }

    uniqueBy(a, key) {
        const seen = {};
        return a.filter((item) => {
            const k = key(item);
            return seen.hasOwnProperty(k) ? false : (seen[k] = true);
        });
    }

    public prepareData(data) {
        data['so_may'] = Number(data['so_may']);
        data['dung_luong_thiet_ke'] = Number(data['dung_luong_thiet_ke']);
        data['dung_luong_hien_huu'] = Number(data['dung_luong_hien_huu']);
        data['dat'] = Number(data['dat']);
        data['time_id'] = this.time_id;
        data['loai_tram'] = this.selectTypeStreet;
        return data;
    }

    public callService(data) {

        this.energyService.CapNhatDuLieuHienTrangTram110KV(data)
            .subscribe(response => {
                this.successNotify(response), error => this.errorNotify(error)
            });
    }

    prepareRemoveData(data) {
        let datas = data.map(element => new Object({ id: element.id }));
        return datas;
    }

    callRemoveService(data) {
        this.energyService.DeleteDuLieuTram(data).subscribe(response => this.successNotify(response), error => this.errorNotify(error));
    }

    getFormParams() {
        return {
            id: new FormControl(0),
            ten_tram: new FormControl('', Validators.required),
            so_may: new FormControl(0),
            dung_luong_thiet_ke: new FormControl(0),
            dung_luong_hien_huu: new FormControl(0),
            dat: new FormControl(0),
            ghi_chu: new FormControl(''),
        }
    }

    setPeriodTime(item) {
        this.selectTypeStreet = item.loai_tram;
    }

    setFormParams() {
        if (this.selection.selected.length) {
            let selectedRecord = this.selection.selected[0];
            this.formData.controls['id'].setValue(selectedRecord.id);
            this.formData.controls['ten_tram'].setValue(selectedRecord.ten_tram);
            this.formData.controls['so_may'].setValue(selectedRecord.so_may);
            this.formData.controls['dung_luong_thiet_ke'].setValue(selectedRecord.dung_luong_thiet_ke);
            this.formData.controls['dung_luong_hien_huu'].setValue(selectedRecord.dung_luong_hien_huu);
            this.formData.controls['dat'].setValue(selectedRecord.dat);
            this.formData.controls['ghi_chu'].setValue(selectedRecord.ghi_chu);
            this.setPeriodTime(selectedRecord);
        }
    }
    getLinkDefault() {
        //Constant
        this.LINK_DEFAULT = "/specialized/enery-management/";
        this.TITLE_DEFAULT = "Quy hoạch phát triển lưới điện - Hiện trạng vận hành hệ thống điện";
        this.TEXT_DEFAULT = "Quy hoạch phát triển lưới điện - Hiện trạng vận hành hệ thống điện";
    }

    changeReportType() {
        console.log(this.selectType);

        switch (this.selectType) {
            case 1:
                this.periods = this.months;
                break;
            case 2:
                this.periods = this.quarters;
                break;
            case 3: this.periods = this.half;
                this.isShowPeriod = true;
                break;
            case 4: this.periods = [];
                this.isShowPeriod = false;
                break;
            default: this.periods = [];
        }
        // this.tempObject.time_id = null;
        // this.selectedPeriod = null;
    }

    time_id: number = 0;
    changePeriod() {
        switch (this.selectType) {
            case 1:
                this.time_id = this.selectedYear * 100 + this.selectedPeriod;
                break;
            case 2:
                this.time_id = Number(this.selectedYear + this.selectedPeriod.toString());
                break;
            case 3: 
                this.time_id = Number(this.selectedYear + this.selectedPeriod.toString());;
                break;
            case 4:
                this.time_id = this.selectedYear;
                break;
        }
    }


    InitialYears() {
        let returnYear: Array<any> = [];
        let currentDate = new Date();
        let nextYear = currentDate.getFullYear() - 1;
        for (let index = 0; index < 5; index++) {
            returnYear.push(nextYear + index);
        }
        return returnYear;
    }

    search() {
        this.getDataElectric110KV();
    }

    isGroup(index, item): boolean {
        return item.loai_tram;
    }

}