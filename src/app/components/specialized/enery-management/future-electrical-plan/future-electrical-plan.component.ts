import { Component, Injector } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material';
import { ElectricalPlan110KV } from 'src/app/_models/APIModel/electric-management.module';
import { EnergyService } from 'src/app/_services/APIService/energy.service';
import { LoginService } from 'src/app/_services/APIService/login.service';
import { BaseComponent } from '../../base.component';

@Component({
    selector: 'future-electrical-plan',
    templateUrl: './future-electrical-plan.component.html',
    styleUrls: ['/../../special_layout.scss'],
})

export class FutureElectricalPlanComponent extends BaseComponent {

    dataSource: MatTableDataSource<ElectricalPlan110KV> = new MatTableDataSource<ElectricalPlan110KV>();
    filteredDataSource: MatTableDataSource<ElectricalPlan110KV> = new MatTableDataSource<ElectricalPlan110KV>();

    displayedColumns: string[] = ['select', 'index', 'ten_tram', 'duong_day_so_mach', 'tba', 'tiet_dien_day_dan', 'dien_ap', 'chieu_dai', 'p_max', 'p_min', 'p_tb', 'trang_thai_hoat_dong'];
    constructor(
        private injector: Injector,
        private energyService: EnergyService,
        public _login: LoginService
    ) {
        super(injector);
    }
    trang_thai_hd: any[] = [
        { id_trang_thai_hoat_dong: 1, ten_trang_thai_hoat_dong: 'Hoạt động' },
        { id_trang_thai_hoat_dong: 2, ten_trang_thai_hoat_dong: 'Ngừng hoạt động' }
    ];

    loai_quy_hoach = {
        1: 'Trạm biến áp 110KV',
        2: 'Trạm biến áp 220KV',
        3: 'Trạm biến áp 500KV',
        4: 'Đường dây 110KV',
        5: 'Đường dây 220KV',
        6: 'Đường dây 500KV',
    }
    selectedType = "1";
    authorize: boolean = true

    ngOnInit() {
        super.ngOnInit();
        this.getDataElectric110KV(this.selectedType);

        if (this._login.userValue.user_role_id == 4  || this._login.userValue.user_role_id == 1) {
            this.authorize = false
        }
    }

    getDataElectric110KV(id_loai) {
        this.selectedType = id_loai;
        this.energyService.LayDuLieuQuyHoachDien110KVDuKien(id_loai).subscribe(result => {
            this.filteredDataSource.data = [];
            if (result.data && result.data.length > 0) {
                this.dataSource = new MatTableDataSource<ElectricalPlan110KV>(result.data);
                this.filteredDataSource.data = [...this.dataSource.data];
                
            }
            // this._prepareData();
            this.paginatorAgain();
        })
    }

    public prepareData(data) {
        data['tba'] = Number(data['tba']);
        data['p_max'] = Number(data['p_max']);
        data['p_min'] = Number(data['p_min']);
        data['p_tb'] = Number(data['p_tb']);
        data['mang_tai'] = Number(data['mang_tai']);
        return data;
    }

    public callService(data) {
        this.energyService.CapNhatDuLieuQuyHoachDien110KVDuKien([data]).subscribe(response => this.successNotify(response), error => this.errorNotify(error));
    }

    prepareRemoveData(data) {
        let datas = data.map(element => new Object({ id: element.id }));
        return datas;
      }
    
    callRemoveService(data) {
        this.energyService.DeleteDuLieuQuyHoachDien110KVDuKien(data).subscribe(response => this.successNotify(response), error => this.errorNotify(error));
    }

    getFormParams() {
        return {
            ten_tram: new FormControl(''),
            duong_day: new FormControl(''),
            tba: new FormControl(''),
            tiet_dien_day_dan: new FormControl(''),
            dien_ap: new FormControl(''),
            chieu_dai: new FormControl(''),
            p_max: new FormControl(''),
            p_min: new FormControl(''),
            p_tb: new FormControl(''),
            mang_tai: new FormControl(''),
            id_trang_thai_hoat_dong: new FormControl(''),
            id_loai_quy_hoach: new FormControl(''),
        }
    }
}