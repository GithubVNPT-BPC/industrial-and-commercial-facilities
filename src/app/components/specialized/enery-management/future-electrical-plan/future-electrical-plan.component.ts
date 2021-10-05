import { Component, Injector } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatTableDataSource } from '@angular/material';
import { DialogContainerComponent } from 'src/app/shared/dialog/dialog-container/dialog-container.component';
import { ElectricalPlan110KV } from 'src/app/_models/APIModel/electric-management.module';
import { EnergyService } from 'src/app/_services/APIService/energy.service';
import { LoginService } from 'src/app/_services/APIService/login.service';
import { DialogService } from 'src/app/_services/injectable-service/dialog.service';
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
        public _login: LoginService,
        private dialogService: DialogService,
        public matDialog: MatDialog
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
    // selectedPeriod: number = new Date().getMonth() <= 6 ? 1 : 2;
    selectedPeriod: number = 1
    periodYear = [
        { id: 1, name: 'Giai đoạn 2021-2030' },
        { id: 2, name: 'Giai đoạn 2031-2050' },
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
    
    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.filteredDataSource.filter = filterValue.trim().toLowerCase();
      }

    getDataElectric110KV() {
        this.energyService.LayDuLieuQuyHoachDuongDay(this.time_id, this.selectedTypePro, this.selectedPeriod).subscribe(result => {
            this.filteredDataSource.data = [];
            if (result.data && result.data.length > 0) {
                this.dataSource = new MatTableDataSource<any | Group>(result.data);
                this.dataSource.data.forEach(x => {
                    x.ten_giai_doan = x.id_giai_doan == 1 ? 'Giai đoạn 2021-2030' : 'Giai đoạn 2031-2050'
                })

                this.filteredDataSource.data = this.addGroups([...this.dataSource.data], this.groupByColumns);
                this.so_luong = this.filteredDataSource.data.filter(i => !i['is_group']).length
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
            id_loai_duong_day: new FormControl('', Validators.required),
            id_giai_doan: new FormControl('', Validators.required),
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

    uploadExcel(e) {
        // open dialog upload excel file 
        this.openDialog("Quy hoạch tuyến đường dây");
    }

    openDialog(nameSheet) {
        const dialogConfig = new MatDialogConfig();
        console.log(window.innerWidth);
        if (window.innerWidth > 375) {
            dialogConfig.width = window.innerWidth * 0.7 + 'px';
            dialogConfig.height = window.innerHeight * 0.4 + 'px';
        } else {
            dialogConfig.width = window.innerWidth * 0.8 + 'px';
            dialogConfig.height = window.innerHeight * 0.2 + 'px';
        }
        dialogConfig.data = {
            nameSheet: nameSheet,
        };
        let dialogRef = this.matDialog.open(DialogContainerComponent, dialogConfig);

        dialogRef.afterClosed().subscribe(res => {
            console.log(res);
            if (res) {
                console.log(this.handleData(res));
                const body = this.handleData(res);
                this.energyService.CapNhatDuLieuQuyHoachDuongDay(body).subscribe(res => this.successNotify(res), err => this.errorNotify(err));
            }

        })
    }

    handleData(time_id) {
        let ls: any[] = [];
        let dataExcel = this.dialogService.getDataTransform();
        for (let i = 1; i < dataExcel.length; i++) {
            let body: any = {};
            body['ten_cong_trinh'] = dataExcel[i]['__EMPTY'];
            body['so_mach'] = dataExcel[i]['__EMPTY_4'];
            body['huong_tuyen_duong_day'] = dataExcel[i]['__EMPTY_2'];
            body['nam_khoi_cong'] = dataExcel[i]['__EMPTY_1'];
            body['nam_van_hanh'] = dataExcel[i]['__EMPTY_3'];
            body['id_giai_doan'] = dataExcel[i]['__EMPTY_7'];
            body['id_loai_duong_day'] = dataExcel[i]['__EMPTY_8'];
            body['time_id'] = time_id;

            ls.push(body)
        }
        return ls;
    }
}