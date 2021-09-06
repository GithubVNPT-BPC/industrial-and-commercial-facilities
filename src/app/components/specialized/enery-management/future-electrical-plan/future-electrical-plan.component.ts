import { Component, Injector } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material';
import { ElectricalPlan110KV } from 'src/app/_models/APIModel/electric-management.module';
import { EnergyService } from 'src/app/_services/APIService/energy.service';
import { LoginService } from 'src/app/_services/APIService/login.service';
import { BaseComponent } from '../../base.component';

export class Group {
    ten_cong_trinh;
    id_loai_duong_day;
}

@Component({
    selector: 'future-electrical-plan',
    templateUrl: './future-electrical-plan.component.html',
    styleUrls: ['/../../special_layout.scss'],
})
export class FutureElectricalPlanComponent extends BaseComponent {
    DB_TABLE = 'QLNL_QUY_HOACH_DUONG_DAY';
    dataSource: MatTableDataSource<ElectricalPlan110KV> = new MatTableDataSource<ElectricalPlan110KV>();
    filteredDataSource: MatTableDataSource<ElectricalPlan110KV> = new MatTableDataSource<ElectricalPlan110KV>();

    displayedColumns: string[] = [
        'select', 'ten_cong_trinh', 'giai_doan', 'so_mach',
        'huong_tuyen_duong_day',
        'nam_khoi_cong', 'nam_van_hanh'
    ];
    so_luong: number = 0;
    groupByColumns: any;
    constructor(
        private injector: Injector,
        private energyService: EnergyService,
        public _login: LoginService
    ) {
        super(injector);
        this.groupByColumns = ['id_loai_duong_day']
    }

    loai_duong_day = [
        { id: 3, name: 'Đường dây 500KV' },
        { id: 2, name: 'Đường dây 220KV' },
        { id: 1, name: 'Đường dây 110KV' },
        { id: 0, name: 'Tất cả' }
    ]

    selectedType = 11;
    authorize: boolean = true;
    periods: Object = [
        { id: 1, name: '6 tháng đầu năm' },
        { id: 2, name: '6 tháng cuối năm' }
    ];
    selectedYear: number = new Date().getFullYear();
    selectedPeriod: number = new Date().getMonth() <= 6 ? 1 : 2;
    periodYear = [
        { id: 0, name: 'Tất cả' },
        { id: 1, name: 'Giai đoạn 2021-2025' },
        { id: 2, name: 'Giai đoạn 2026-2030' },
        { id: 3, name: 'Giai đoạn 2031-2035' },

    ]
    selectedTypePro: number = 0;
    years: number[] = [];
    time_id: number = 0;

    ngOnInit() {
        super.ngOnInit();
        this.years = this.InitialYears();
        this.changePeriod();
        this.getDataElectric110KV();
        if (this._login.userValue.user_role_id == 4 || this._login.userValue.user_role_id == 1) {
            this.authorize = false
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

    getDataElectric110KV() {
        this.energyService.LayDuLieuQuyHoachDuongDay(this.time_id, this.selectedTypePro, this.selectedPeriod).subscribe(result => {
            this.filteredDataSource.data = [];
            if (result.data && result.data.length > 0) {
                this.dataSource = new MatTableDataSource<any | Group>(result.data);

                this.filteredDataSource.data = this.addGroups([...this.dataSource.data], this.groupByColumns);
                this.so_luong = this.filteredDataSource.data.filter(i => !i['is_group']).length
                console.log(this.filteredDataSource.data)
            }
            this.paginatorAgain();
        })
    }

    addGroups(data: any[], groupByColumns: string[]) {
        return this.getSublevel(data, groupByColumns[0]);
    }

    getSublevel(data: any[], groupByColumns: string): any[] {
        const groups = this.uniqueBy(
            data.map(
                row => {
                    const result = new Group();
                    result[groupByColumns] = row[groupByColumns];
                    result['ten_cong_trinh'] = this.loai_duong_day.find(item => item.id == row['id_loai_duong_day']).name;
                    result['is_group'] = true;
                    return result;
                }
            ),
            JSON.stringify);

        const currentColumn = groupByColumns;
        let subGroups = [];
        groups.forEach(group => {
            const rowsInGroup = data.filter(row => group[currentColumn] === row[currentColumn]);
            group.totalCounts = rowsInGroup.length;
            const subGroup = rowsInGroup;
            subGroup.sort((a, b) => { return (a.id_giai_doan - b.id_giai_doan) });
            // this.getSublevel(rowsInGroup, 1, groupByColumns, group);
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
        return data;
    }

    public callService(data) {
        this.energyService.CapNhatDuLieuQuyHoachDuongDay([data]).subscribe(response => this.successNotify(response), error => this.errorNotify(error));
    }

    prepareRemoveData(data) {
        let datas = data.map(element => new Object({ id: element.id }));
        return datas;
    }

    callRemoveService(data) {
        this.energyService.DeleteDuLieuQuyHoachDuongDay(data).subscribe(response => this.successNotify(response), error => this.errorNotify(error));
    }

    getFormParams() {
        return {
            id: new FormControl(0),
            ten_cong_trinh: new FormControl(''),
            so_mach: new FormControl(''),
            huong_tuyen_duong_day: new FormControl(''),
            nam_khoi_cong: new FormControl(''),
            nam_van_hanh: new FormControl(''),
            id_loai_duong_day: new FormControl(''),
            id_giai_doan: new FormControl(''),
            nam: new FormControl(''),
            ky: new FormControl('')
        }
    }
    setFormParams() {
        if (this.selection.selected.length) {
            let selectedRecord = this.selection.selected[0];
            const form = this.getFormParams();
            for (const i in form) {
                this.formData.controls[i].setValue(selectedRecord[i]);
            }
        }
    }

    changePeriod() {
        this.time_id = this.selectedYear * 10 + this.selectedPeriod;
    }

    search() {
        this.getDataElectric110KV();
    }
}