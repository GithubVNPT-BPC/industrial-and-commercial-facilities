import { Component, Injector, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAccordion, MatTableDataSource } from '@angular/material';
import { DistrictModel } from 'src/app/_models/APIModel/domestic-market.model';
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
    //
    @ViewChild(MatAccordion, { static: true }) accordion: MatAccordion;
    //
    public districts: DistrictModel[] = [{ id: 1, ten_quan_huyen: 'Thị xã Phước Long' },
    { id: 2, ten_quan_huyen: 'Thành phố Đồng Xoài' },
    { id: 3, ten_quan_huyen: 'Thị xã Bình Long' },
    { id: 4, ten_quan_huyen: 'Huyện Bù Gia Mập' },
    { id: 5, ten_quan_huyen: 'Huyện Lộc Ninh' },
    { id: 6, ten_quan_huyen: 'Huyện Bù Đốp' },
    { id: 7, ten_quan_huyen: 'Huyện Hớn Quản' },
    { id: 8, ten_quan_huyen: 'Huyện Đồng Phú' },
    { id: 9, ten_quan_huyen: 'Huyện Bù Đăng' },
    { id: 10, ten_quan_huyen: 'Huyện Chơn Thành' },
    { id: 11, ten_quan_huyen: 'Huyện Phú Riềng' }];

    tba110KVDataSource: MatTableDataSource<ElectricalPlan110KV> = new MatTableDataSource<ElectricalPlan110KV>();
    tba220KVDataSource: MatTableDataSource<ElectricalPlan110KV> = new MatTableDataSource<ElectricalPlan110KV>();
    tba500KVDataSource: MatTableDataSource<ElectricalPlan110KV> = new MatTableDataSource<ElectricalPlan110KV>();
    dd110KVDataSource: MatTableDataSource<ElectricalPlan110KV> = new MatTableDataSource<ElectricalPlan110KV>();
    dd220KVDataSource: MatTableDataSource<ElectricalPlan110KV> = new MatTableDataSource<ElectricalPlan110KV>();
    dd500KVDataSource: MatTableDataSource<ElectricalPlan110KV> = new MatTableDataSource<ElectricalPlan110KV>();

    displayedColumns: string[] = ['index', 'ten_tram', 'duong_day_so_mach', 'tba', 'tiet_dien_day_dan', 'dien_ap', 'chieu_dai', 'p_max', 'p_min', 'p_tb', 'trang_thai_hoat_dong'];
    constructor(
        private injector: Injector,
        private energyService: EnergyService,
        public _login: LoginService
    ) {
        super(injector);
        // console.log(this.formData)
    }
    trang_thai_hd: any[] = [
        { id_trang_thai_hoat_dong: 1, ten_trang_thai_hoat_dong: 'ĐANG HOẠT ĐỘNG' },
        { id_trang_thai_hoat_dong: 2, ten_trang_thai_hoat_dong: 'KHÔNG HOẠT ĐỘNG' }
    ];

    loai_quy_hoach: any[] = [
        { id_loai_quy_hoach: 1, ten_loai_quy_hoach: 'Trạm biến áp 110KV' },
        { id_loai_quy_hoach: 2, ten_loai_quy_hoach: 'Trạm biến áp 220KV' },
        { id_loai_quy_hoach: 3, ten_loai_quy_hoach: 'Trạm biến áp 500KV' },
        { id_loai_quy_hoach: 4, ten_loai_quy_hoach: 'Đường dây 110KV' },
        { id_loai_quy_hoach: 5, ten_loai_quy_hoach: 'Đường dây 220KV' },
        { id_loai_quy_hoach: 6, ten_loai_quy_hoach: 'Đường dây 500KV' }
    ]

    authorize: boolean = true

    ngOnInit() {
        this.getDataElectric110KV();

        if (this._login.userValue.user_role_id == 4) {
            this.authorize = false
        }
    }

    getDataElectric110KV() {
        this.energyService.LayDuLieuQuyHoachDien110KVDuKien(2020).subscribe(res => {
            this.mappingDataSource(res['data'])
        })
    }

    mappingDataSource(dataSource: ElectricalPlan110KV[]) {
        dataSource.filter(item => {
            switch (item.id_loai_quy_hoach) {
                case 1:
                    this.tba110KVDataSource.data.push(item);
                    break;
                case 2:
                    this.tba220KVDataSource.data.push(item);
                    break;
                case 3:
                    this.dd110KVDataSource.data.push(item);
                    break;

                case 4:
                    this.dd220KVDataSource.data.push(item);
                    break;
                case 5:
                    this.dd500KVDataSource.data.push(item);
                    break;
                case 6:
                    this.tba500KVDataSource.data.push(item);
                    break;
                default:
                    break;
            }
        })
    }

    autoOpen() {
        setTimeout(() => this.accordion.openAll(), 1000);
    }

    applyDistrictFilter(event) {

    }

    applyFilter(event: Event, table_id: number) {
        const filterValue = (event.target as HTMLInputElement).value;
        switch (table_id) {
            case 1:
                this.tba110KVDataSource.filter = filterValue.trim().toLowerCase();
                break;
            case 2:
                this.tba220KVDataSource.filter = filterValue.trim().toLowerCase();
                break;
            case 3:
                this.tba500KVDataSource.filter = filterValue.trim().toLowerCase();
                break;
            case 4:
                this.dd110KVDataSource.filter = filterValue.trim().toLowerCase();
                break;
            case 5:
                this.dd220KVDataSource.filter = filterValue.trim().toLowerCase();
                break;
            case 6:
                this.dd500KVDataSource.filter = filterValue.trim().toLowerCase();
                break;
            default:
                break;
        }
    }

    public prepareData(data) {
        data['tba'] = Number(data['tba']);
        data['p_max'] = Number(data['p_max']);
        data['p_min'] = Number(data['p_min']);
        data['p_tb'] = Number(data['p_tb']);
        data['mang_tai'] = Number(data['mang_tai']);
    }

    public callService(data) {
        let list_data = [data];
        // console.log(list_data)
        this.energyService.CapNhatDuLieuQuyHoachDien110KVDuKien(list_data).subscribe(res => {
            this.successNotify(res);
        })
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