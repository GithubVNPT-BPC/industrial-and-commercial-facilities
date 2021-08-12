import { Component, Injector } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material';
import { ElectricalPlan110KV } from 'src/app/_models/APIModel/electric-management.module';
import { EnergyService } from 'src/app/_services/APIService/energy.service';
import { LoginService } from 'src/app/_services/APIService/login.service';
import { BaseComponent } from '../../base.component';


export class Group {
    
    loai_duong_day;
}

@Component({
    selector: 'current-electrical-plan',
    templateUrl: './current-electrical-plan.component.html',
    styleUrls: ['/../../special_layout.scss'],
})
export class CurrentElectricalPlanComponent extends BaseComponent {
    DB_TABLE = 'QLNL_HTNCC';
    dataSource = new MatTableDataSource<any | Group>(
        []
    );
    filteredDataSource = new MatTableDataSource<any | Group>([]);
    allData: any[];
    groupByColumns: string[] = [];

    displayedColumns: string[] = ['select', 'tuyen_duong_day', 'so_mach', 'km', 'cong_suat_thiet_ke', 'cong_suat_hien_huu', 'dat', 'ghi_chu'];
    displayColumnHeader1: string[] = ['select',  'tuyen_duong_day', 'quy_mo_thiet_ke', 'thong_so_hien_huu', 'ghi_chu'];
    displayColumnHeader: string[] = ['so_mach', 'km', 'cong_suat_thiet_ke', 'cong_suat_hien_huu', 'dat'];

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

    loai_duong_day = [
        {id: 1, name : 'Đường dây 110KV'},
        {id: 2, name : 'Đường dây 220KV'},
        {id: 3, name :'Đường dây 500KV'}
    ]
    

    authorize: boolean = true

    reportTypes = [
        { ma_so: null, noi_dung: '' }, 
        { ma_so: 1, noi_dung: 'Tháng' }, 
        { ma_so: 2, noi_dung: 'Quý' }, 
        // { ma_so: 3, noi_dung: '6 Tháng' }, 
        { ma_so: 4, noi_dung: 'Năm' }
    ];
    months: number[] = [null, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    selectedYear: number = new Date().getFullYear();
    years: number[] = [];
    quarters: number[] = [null, 1, 2, 3, 4];
    periods: Object[];
    selectedPeriod: number = 0;
    selectType: number = 4;
    selectTypeStreet: number = 0;
    constructor(
        private injector: Injector,
        private energyService: EnergyService,
        public _login: LoginService
    ) {
        super(injector);
        this.groupByColumns = ['loai_duong_day']
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
        this.energyService.LayDuLieuHienTrangDuongDay110KV(this.time_id, this.selectTypeStreet).subscribe(result => {
            this.filteredDataSource.data = [];
            if (result.data && result.data.length > 0) {
                this.dataSource = new MatTableDataSource<any>(result.data);

                this.filteredDataSource.data = this.addGroups([...this.dataSource.data], this.groupByColumns);
                console.log(this.filteredDataSource.data);

            }
            // this._prepareData();
            this.paginatorAgain();
        })
    }

    addGroups(data: any[], groupByColumns: string[]) {
        const rootGroup = new Group();
        return this.getSublevel(data, 0, groupByColumns, rootGroup);
    }

    getSublevel(data: any[], level: number, groupByColumns: string[], parent: Group): any[] {
        if (level >= groupByColumns.length) {
            return data;
        }
        const groups = this.uniqueBy(
            data.map(
                row => {
                    const result = new Group();
                    
                    for (let i = 0; i <= level; i++) {
                        result[groupByColumns[i]] = row[groupByColumns[i]];
                    }
                    return result;
                }
            ),
            JSON.stringify);

        const currentColumn = groupByColumns[level];
        let subGroups = [];
        groups.forEach(group => {
            const rowsInGroup = data.filter(row => group[currentColumn] === row[currentColumn]);
            group.totalCounts = rowsInGroup.length;
            const subGroup = this.getSublevel(rowsInGroup, level + 1, groupByColumns, group);
            subGroup.unshift(group);
            subGroups = subGroups.concat(subGroup);
        });
        return subGroups;
    }

    uniqueBy(a, key) {
        const seen = {};
        return a.filter((item) => {
            const k = key(item);
            return seen.hasOwnProperty(k) ? false : (seen[k] = true);
        });
    }

    public prepareData(data) {
        data['so_mach'] = Number(data['so_mach']);
        data['km'] = Number(data['km']);
        data['cong_suat_thiet_ke'] = Number(data['cong_suat_thiet_ke']);
        data['cong_suat_hien_huu'] = Number(data['cong_suat_hien_huu']);
        data['dat'] = Number(data['dat']);
        data['time_id'] = this.time_id;
        data['loai_duong_day'] = this.selectTypeStreet;
        return data;
    }

    public callService(data) {
        debugger
        this.energyService.CapNhatDuLieuHienTrangDuongDay110KV(data)
        .subscribe(response => {
            this.successNotify(response), error => this.errorNotify(error)
        });
    }

    prepareRemoveData(data) {
        let datas = data.map(element => new Object({ id: element.id }));
        return datas;
    }

    callRemoveService(data) {
        this.energyService.DeleteDuLieuQuyHoachDien110KV(data).subscribe(response => this.successNotify(response), error => this.errorNotify(error));
    }

    getFormParams() {
        return {
            id: new FormControl(0),
            tuyen_duong_day: new FormControl(''),
            so_mach: new FormControl(''),
            km: new FormControl(''),
            cong_suat_thiet_ke: new FormControl(''),
            cong_suat_hien_huu: new FormControl(''),
            dat: new FormControl(''),
            ghi_chu: new FormControl(''),
        }
    }
    setFormParams() {
        if (this.selection.selected.length) {
            let selectedRecord = this.selection.selected[0];
            this.formData.controls['id'].setValue(selectedRecord.id);
            this.formData.controls['tuyen_duong_day'].setValue(selectedRecord.tuyen_duong_day);
            this.formData.controls['so_mach'].setValue(selectedRecord.so_mach);
            this.formData.controls['km'].setValue(selectedRecord.km);
            this.formData.controls['cong_suat_thiet_ke'].setValue(selectedRecord.cong_suat_thiet_ke);
            this.formData.controls['cong_suat_hien_huu'].setValue(selectedRecord.cong_suat_hien_huu);
            this.formData.controls['dat'].setValue(selectedRecord.dat);
            this.formData.controls['ghi_chu'].setValue(selectedRecord.ghi_chu);
        }
    }
    getLinkDefault() {
        //Constant
        this.LINK_DEFAULT = "/specialized/enery-management/electrical_plan";
        this.TITLE_DEFAULT = "Quy hoạch phát triển lưới điện - Quy hoạch điện 100KV trở lên";
        this.TEXT_DEFAULT = "Quy hoạch phát triển lưới điện - Quy hoạch điện 100KV trở lên";
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
            case 3: this.periods = null;
                break;
            case 4: this.periods = null;
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
                this.time_id = this.selectedYear*100 + this.selectedPeriod;
                break;
            case 2:
                this.time_id = Number (this.selectedYear + this.selectedPeriod.toString());
                break;
            // case 3: this.periods = null;
            //     break;
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

    search(){
        this.getDataElectric110KV();
    }

    isGroup(index, item): boolean {
        return item.loai_duong_day;
    }

}