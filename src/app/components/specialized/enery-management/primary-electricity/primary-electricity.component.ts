import { Component, Injector } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatTableDataSource } from '@angular/material';
import { DialogContainerComponent } from 'src/app/shared/dialog/dialog-container/dialog-container.component';
import { EnergyService } from 'src/app/_services/APIService/energy.service';
import { LoginService } from 'src/app/_services/APIService/login.service';
import { DialogService } from 'src/app/_services/injectable-service/dialog.service';
import { BaseComponent } from '../../base.component';


export class Group {
    ten_cong_trinh;
    id_loai_cong_trinh;
}

@Component({
    selector: 'primary-electricity',
    templateUrl: './primary-electricity.component.html',
    styleUrls: ['/../../special_layout.scss'],
})
export class PrimaryElectricityComponent extends BaseComponent {
    DB_TABLE = 'QLNL_DIEN_SO_CAP';
    dataSource = new MatTableDataSource<any | Group>(
        []
    );
    filteredDataSource = new MatTableDataSource<any | Group>([]);
    allData: any[];
    groupByColumns: string[] = [];

    fields = {
        ten_cong_trinh: 'Tên công trình',
        id_giai_doan: 'Giai đoạn',
        cong_suat: 'Công suất (MW)',
        ten_quan_huyen: 'Địa điểm quy hoạch',
        nam_khoi_cong: 'Năm khởi công',
        nam_van_hanh: 'Năm đưa vào vận hành'
    }

    displayedColumns: string[] = ['select', 'ten_cong_trinh', 'id_giai_doan', 'cong_suat', 'ten_quan_huyen', 'nam_khoi_cong', 'nam_van_hanh', 'ghi_chu'];

    authorize: boolean = true

    periodYear = [
        { id: 1, name: 'Giai đoạn 2021-2030' },
        { id: 2, name: 'Giai đoạn 2031-2050' },
    ]

    danhmuc = [
        { id: 1, name: 'Thủy điện' },
        { id: 2, name: 'Điện mặt trời' },
        { id: 3, name: 'Điện sinh Khối' },
        { id: 4, name: 'Các nguồn điện khác' }
    ]

    reportTypes = [
        // { ma_so: null, noi_dung: '' },
        // { ma_so: 1, noi_dung: 'Tháng' },
        // { ma_so: 2, noi_dung: 'Quý' },
        { ma_so: 3, noi_dung: '6 Tháng' },
        // { ma_so: 4, noi_dung: 'Năm' }
    ];

    half = [
        { id: 1, name: '6 tháng đầu năm' },
        { id: 2, name: '6 tháng cuối năm' }
    ];

    months: number[] = [null, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    selectedYear: number = new Date().getFullYear();
    years: number[] = [];
    quarters: number[] = [null, 1, 2, 3, 4];
    periods: any[];
    selectedPeriod: number = 1;
    selectType: number = 3;
    selectTypeStreet: number = 0;
    so_luong: number = 0;
    selectedPeriodYear: number = 0;
    selectedTypePro: number = 0;
    isShowPeriod: boolean = true;
    selectedPeriodSearch: number = 1;
    selectTypeSearch: number = 3;
    selectedYearSearch: number = new Date().getFullYear();
    selectTypeStreetSearch: number = 0;
    selectedTypeProSearch: number = 0;

    constructor(
        private injector: Injector,
        private energyService: EnergyService,
        public _login: LoginService,
        private dialogService: DialogService,
        public matDialog: MatDialog,
    ) {
        super(injector);
        this.groupByColumns = ['id_loai_cong_trinh', 'id_giai_doan']
    }

    ngOnInit() {
        super.ngOnInit();
        this.years = this.InitialYears();
        this.changePeriodSearch();

        this.getDataElectric110KV(this.time_id, this.selectedTypeProSearch, 0);

        if (this._login.userValue.user_role_id == 4 || this._login.userValue.user_role_id == 1) {
            this.authorize = false
        }
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.filteredDataSource.filter = filterValue.trim().toLowerCase();
    }

    getDataElectric110KV(time_id, id_loai_cong_trinh, id_giai_doan) {
        this.energyService.GetDuLieuDienSoCap(time_id, id_loai_cong_trinh, id_giai_doan).subscribe(result => {
            this.filteredDataSource.data = [];
            if (result.data && result.data.length > 0) {
                this.dataSource = new MatTableDataSource<any | Group>(result.data);
                this.dataSource.data.forEach(x => {
                    x.ten_giai_doan = x.id_giai_doan == 1 ? 'Giai đoạn 2021-2030' : 'Giai đoạn 2031-2050'
                })

                this.filteredDataSource.data = this.addGroups([...this.dataSource.data], this.groupByColumns);
                this.so_luong = this.filteredDataSource.data.filter(i => !i['is_group']).length
            }
            // this._prepareData();
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
                    result['ten_cong_trinh'] = this.danhmuc.find(item => item.id == row['id_loai_cong_trinh']).name;
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
        data['ten_cong_trinh'] = data['ten_cong_trinh'];
        data['cong_suat'] = Number(data['cong_suat']);
        data['id_dia_diem_quy_hoach'] = data['id_dia_diem_quy_hoach'];
        data['nam_khoi_cong'] = Number(data['nam_khoi_cong']);
        data['nam_van_hanh'] = Number(data['nam_van_hanh']);
        data['time_id'] = this.time_id;
        data['id_loai_cong_trinh'] = Number(data['id_loai_cong_trinh']);
        data['id_giai_doan'] = Number(data['id_giai_doan']);
        data['year'] = Number(data['year']);
        data['halfofyear'] = Number(data['halfofyear']);

        return data;
    }

    public callService(data) {

        this.energyService.ThemDuLieuDienSoCap([data])
            .subscribe(response => {
                this.successNotify(response), error => this.errorNotify(error)
            });
    }

    prepareRemoveData(data) {
        let datas = data.map(element => new Object({ id: element.id }));
        return datas;
    }

    callRemoveService(data) {
        this.energyService.XoaDienSoCap(data).subscribe(response => this.successNotify(response), error => this.errorNotify(error));
    }

    getFormParams() {
        return {
            id: new FormControl(0),
            ten_cong_trinh: new FormControl('', Validators.required),
            cong_suat: new FormControl(),
            id_dia_diem_quy_hoach: new FormControl('', Validators.required),
            nam_khoi_cong: new FormControl(),
            nam_van_hanh: new FormControl(),
            ghi_chu: new FormControl(),
            id_giai_doan: new FormControl('', Validators.required),
            time_id: new FormControl('', Validators.required),
            id_loai_cong_trinh: new FormControl('', Validators.required),
            year: new FormControl(),
            halfofyear: new FormControl()
        }
    }

    setPeriodTime(item) {
        this.selectTypeStreet = item.loai_tram;
    }

    setFormParams() {
        if (this.selection.selected.length) {
            let selectedRecord = this.selection.selected[0];
            let objectList = this.getFormParams();
            for (let o in objectList) {
                this.formData.controls[o].setValue(selectedRecord[o]);
            }
            this.selectedYear = parseInt(this.time_id.toString().substring(0, 4));
            this.selectedPeriod = parseInt(this.time_id.toString().substring(4, 5));
        }
    }
    getLinkDefault() {
        //Constant
        this.LINK_DEFAULT = "/specialized/enery-management/";
        this.TITLE_DEFAULT = "Quy hoạch phát triển lưới điện - Quy hoạch điện 110KV trở lên";
        this.TEXT_DEFAULT = "Quy hoạch phát triển lưới điện - Quy hoạch điện 110KV trở lên";
    }

    changeReportType(s) {
        switch (s) {
            case 1:
                this.periods = this.months;
                break;
            case 2:
                this.periods = this.quarters;
                break;
            case 3:
                this.isShowPeriod = true;
                break;
            case 4: this.periods = [];
                this.isShowPeriod = false;
                break;
            default: this.periods = [];
        }
    }

    time_id: number = 0;
    changePeriodSearch() {
        switch (this.selectTypeSearch) {
            case 3:
                this.time_id = Number(this.selectedYearSearch + this.selectedPeriodSearch.toString());
                break;
            case 4:
                this.time_id = this.selectedYearSearch;
                break;
        }
    }

    changePeriod() {
        switch (this.selectType) {
            case 3:
                this.time_id = Number(this.selectedYear + this.selectedPeriod.toString());
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
        this.getDataElectric110KV(this.time_id, this.selectedTypeProSearch, 0);
    }

    isGroup(index, item): boolean {
        return item.loai_tram;
    }

    getnamePeriod(id) {
        this.periodYear.find(i => {
            if (i.id == id)
                return i.name.toString();
            return "";
        })
    }

    uploadExcel(e) {
        // open dialog upload excel file 
        this.openDialog("Quy hoạch nguồn điện sơ cấp");
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
                this.energyService.ThemDuLieuDienSoCap(body).subscribe(res => this.successNotify(res), err => this.errorNotify(err));
            }

        })
    }

    handleData(time_id) {
        let ls: any[] = [];
        let dataExcel = this.dialogService.getDataTransform();
        for (let i = 1; i < dataExcel.length; i++) {
            let body: any = {};
            body['ten_cong_trinh'] = dataExcel[i]['__EMPTY'];
            body['cong_suat'] = dataExcel[i]['__EMPTY_2'];
            body['id_dia_diem_quy_hoach'] = dataExcel[i]['__EMPTY_7'];
            body['nam_khoi_cong'] = dataExcel[i]['__EMPTY_1'];
            body['nam_van_hanh'] = dataExcel[i]['__EMPTY_3'];
            body['time_id'] = time_id;
            body['id_giai_doan'] = dataExcel[i]['__EMPTY_9'];
            body['id_loai_cong_trinh'] = dataExcel[i]['__EMPTY_8'];
            body['ghi_chu'] = dataExcel[i]['__EMPTY_10'];
            
            
            ls.push(body)
        }
        return ls;
    }

}