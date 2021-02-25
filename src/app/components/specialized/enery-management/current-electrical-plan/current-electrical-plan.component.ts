import { Component, ViewChild, Injector } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAccordion, MatPaginator, MatTableDataSource } from '@angular/material';
import { DistrictModel } from 'src/app/_models/APIModel/domestic-market.model';
import { ElectricalPlan, ElectricalPlan110KV } from 'src/app/_models/APIModel/electric-management.module';
import { LinkModel } from 'src/app/_models/link.model';
import { EnergyService } from 'src/app/_services/APIService/energy.service';
import { BaseComponent } from '../../specialized-base.component';

@Component({
    selector: 'current-electrical-plan',
    templateUrl: './current-electrical-plan.component.html',
    styleUrls: ['/../../special_layout.scss'],
})

export class CurrentElectricalPlanComponent extends BaseComponent {
    formData: any = this.formData;
    
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
    years: number[] = [2021, 2020, 2019, 2018, 2017, 2016, 2015]
    constructor(
        private injector: Injector,
        private energyService: EnergyService
    ) {
        super(injector);
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
    currentYear: number = new Date().getFullYear();
    tba110KVDataSource: MatTableDataSource<ElectricalPlan110KV> = new MatTableDataSource<ElectricalPlan110KV>();
    tba220KVDataSource: MatTableDataSource<ElectricalPlan110KV> = new MatTableDataSource<ElectricalPlan110KV>();
    tba500KVDataSource: MatTableDataSource<ElectricalPlan110KV> = new MatTableDataSource<ElectricalPlan110KV>();
    dd110KVDataSource: MatTableDataSource<ElectricalPlan110KV> = new MatTableDataSource<ElectricalPlan110KV>();
    dd220KVDataSource: MatTableDataSource<ElectricalPlan110KV> = new MatTableDataSource<ElectricalPlan110KV>();
    dd500KVDataSource: MatTableDataSource<ElectricalPlan110KV> = new MatTableDataSource<ElectricalPlan110KV>();

    data: Array<ElectricalPlan> = [
        { ten_tram: 'Phước Long', duong_day_so_mach: 'T1', tba: 40, tiet_dien_day_dan: '', dien_ap: '110/23/15', chieu_dai: 0, p_max: 25.4, p_min: 10.65, p_tb: 17.43, mang_tai: 64.14, trang_thai_hoat_dong: 1, loai_quy_hoach: 1 },
        { ten_tram: 'Phước Long', duong_day_so_mach: 'T2', tba: 25, tiet_dien_day_dan: '', dien_ap: '110/23/15', chieu_dai: 0, p_max: 13.26, p_min: 5.6, p_tb: 9.18, mang_tai: 53.59, trang_thai_hoat_dong: 1, loai_quy_hoach: 1 },
        { ten_tram: 'Lộc Ninh', duong_day_so_mach: 'T1', tba: 25, tiet_dien_day_dan: '', dien_ap: '110/23/15', chieu_dai: 0, p_max: 13.26, p_min: 5.6, p_tb: 9.18, mang_tai: 53.59, trang_thai_hoat_dong: 1, loai_quy_hoach: 1 },
        { ten_tram: 'Lộc Ninh', duong_day_so_mach: 'T2', tba: 25, tiet_dien_day_dan: '', dien_ap: '110/23/15', chieu_dai: 0, p_max: 8.54, p_min: 4.94, p_tb: 6.42, mang_tai: 34.52, trang_thai_hoat_dong: 1, loai_quy_hoach: 1 },
        { ten_tram: 'Đồng Xoài', duong_day_so_mach: 'T1', tba: 40, tiet_dien_day_dan: '', dien_ap: '110/23/15', chieu_dai: 0, p_max: 32.71, p_min: 11.16, p_tb: 16.07, mang_tai: 79.55, trang_thai_hoat_dong: 1, loai_quy_hoach: 1 },
        { ten_tram: 'Đồng Xoài', duong_day_so_mach: 'T2', tba: 40, tiet_dien_day_dan: '', dien_ap: '110/23/15', chieu_dai: 0, p_max: 31.5, p_min: 18.48, p_tb: 25.8, mang_tai: 90.03, trang_thai_hoat_dong: 1, loai_quy_hoach: 1 },
        { ten_tram: 'Chơn Thành', duong_day_so_mach: 'T1', tba: 40, tiet_dien_day_dan: '', dien_ap: '110/23/15', chieu_dai: 0, p_max: 35.65, p_min: 18.48, p_tb: 25.8, mang_tai: 90.03, trang_thai_hoat_dong: 1, loai_quy_hoach: 1 },
        { ten_tram: 'Bù Đốp', duong_day_so_mach: 'T2', tba: 40, tiet_dien_day_dan: '', dien_ap: '110/23/15', chieu_dai: 0, p_max: 17.04, p_min: 8.5, p_tb: 12.35, mang_tai: 43.04, trang_thai_hoat_dong: 1, loai_quy_hoach: 1 },
        { ten_tram: 'Bù Đăng', duong_day_so_mach: 'T1', tba: 25, tiet_dien_day_dan: '', dien_ap: '110/23/15', chieu_dai: 0, p_max: 15.66, p_min: 7.29, p_tb: 11.35, mang_tai: 63.27, trang_thai_hoat_dong: 1, loai_quy_hoach: 1 },
        { ten_tram: 'Bình Long', duong_day_so_mach: 'T1', tba: 40, tiet_dien_day_dan: '', dien_ap: '110/23/15', chieu_dai: 0, p_max: 31.63, p_min: 22.23, p_tb: 26.22, mang_tai: 79.88, trang_thai_hoat_dong: 1, loai_quy_hoach: 1 },
        { ten_tram: 'Bình Long', duong_day_so_mach: 'T2', tba: 40, tiet_dien_day_dan: '', dien_ap: '110/23/15', chieu_dai: 0, p_max: 23.77, p_min: 17.6, p_tb: 20.09, mang_tai: 60.03, trang_thai_hoat_dong: 1, loai_quy_hoach: 1 },
        { ten_tram: 'Xi Măng Bình Phước', duong_day_so_mach: 'T1', tba: 40, tiet_dien_day_dan: '', dien_ap: '110/6', chieu_dai: 0, p_max: 30, p_min: 0, p_tb: 0, mang_tai: 0, trang_thai_hoat_dong: 1, loai_quy_hoach: 1 },
        { ten_tram: 'Xi Măng Bình Phước', duong_day_so_mach: 'T2', tba: 40, tiet_dien_day_dan: '', dien_ap: '110/6', chieu_dai: 0, p_max: 30, p_min: 0, p_tb: 0, mang_tai: 0, trang_thai_hoat_dong: 1, loai_quy_hoach: 1 },
        { ten_tram: 'Ve Dan', duong_day_so_mach: 'T1', tba: 7.5, tiet_dien_day_dan: '', dien_ap: '110/6', chieu_dai: 0, p_max: 3, p_min: 0, p_tb: 0, mang_tai: 0, trang_thai_hoat_dong: 1, loai_quy_hoach: 1 },
        { ten_tram: 'Bình Long 2', duong_day_so_mach: '', tba: 250, tiet_dien_day_dan: '', dien_ap: '220/110', chieu_dai: 0, p_max: 210, p_min: 120, p_tb: 0, mang_tai: 88, trang_thai_hoat_dong: 1, loai_quy_hoach: 2 },
        { ten_tram: 'Đường dây 177 Bình Long 2 - rẽ XM Bình Phước - 172 Chơn Thành', duong_day_so_mach: '1', tba: 0, tiet_dien_day_dan: 'AC185', dien_ap: '', chieu_dai: 22.64, p_max: 0, p_min: 0, p_tb: 0, mang_tai: 0, trang_thai_hoat_dong: 1, loai_quy_hoach: 3 },
        { ten_tram: 'Đường dây 175 Bình Long 2 - 172 Bình Long', duong_day_so_mach: '1', tba: 0, tiet_dien_day_dan: '2xAC185', dien_ap: '', chieu_dai: 20.4, p_max: 106, p_min: 0, p_tb: 0, mang_tai: 63.9, trang_thai_hoat_dong: 1, loai_quy_hoach: 3 },
        { ten_tram: 'Đường dây 176 Bình Long 2 - 172 Dầu Tiếng', duong_day_so_mach: '1', tba: 0, tiet_dien_day_dan: '2xAC185', dien_ap: '', chieu_dai: 83.4, p_max: 55.5, p_min: 0, p_tb: 0, mang_tai: 66.9, trang_thai_hoat_dong: 1, loai_quy_hoach: 3 },
        { ten_tram: 'Đường dây 171 Bình Long 2 - 172 Thác Mơ', duong_day_so_mach: '1', tba: 0, tiet_dien_day_dan: 'AC185', dien_ap: '', chieu_dai: 63.43, p_max: 0, p_min: 0, p_tb: 0, mang_tai: 0, trang_thai_hoat_dong: 1, loai_quy_hoach: 3 },
        { ten_tram: 'Đường dây 172 Bình Long 2 - 172 Lộc Ninh', duong_day_so_mach: '1', tba: 0, tiet_dien_day_dan: 'AC185', dien_ap: '', chieu_dai: 6.77, p_max: 42.4, p_min: 0, p_tb: 0, mang_tai: 51, trang_thai_hoat_dong: 1, loai_quy_hoach: 3 },
        { ten_tram: 'Đường dây 174 Bình Long 2 - 174 Lộc Ninh', duong_day_so_mach: '1', tba: 0, tiet_dien_day_dan: 'AC185', dien_ap: '', chieu_dai: 6.12, p_max: 0, p_min: 0, p_tb: 0, mang_tai: 0, trang_thai_hoat_dong: 0, loai_quy_hoach: 3 },
        { ten_tram: 'Đường dây 173 Bình Long 2 - 172 Cần đơn ', duong_day_so_mach: '1', tba: 0, tiet_dien_day_dan: 'AC185', dien_ap: '', chieu_dai: 47, p_max: 0, p_min: 0, p_tb: 0, mang_tai: 0, trang_thai_hoat_dong: 1, loai_quy_hoach: 3 },
        { ten_tram: 'Đường dây 178 Bình Long 2 - TĐ Srok Phu Miêng ', duong_day_so_mach: '1', tba: 0, tiet_dien_day_dan: 'AC185', dien_ap: '', chieu_dai: 21, p_max: 51, p_min: 0, p_tb: 0, mang_tai: 61.4, trang_thai_hoat_dong: 1, loai_quy_hoach: 3 },
        { ten_tram: 'Đường dây 173 Thác Mơ - 171 Lộc Ninh', duong_day_so_mach: '1', tba: 0, tiet_dien_day_dan: 'AC185', dien_ap: '', chieu_dai: 58.77, p_max: 44.9, p_min: 0, p_tb: 0, mang_tai: 54.1, trang_thai_hoat_dong: 1, loai_quy_hoach: 3 },
        { ten_tram: 'Đường dây 174 Thác Mơ - 171 Bù Đăng', duong_day_so_mach: '1', tba: 0, tiet_dien_day_dan: 'AC185', dien_ap: '', chieu_dai: 37.78, p_max: 15.6, p_min: 0, p_tb: 0, mang_tai: 18.8, trang_thai_hoat_dong: 1, loai_quy_hoach: 3 },
        { ten_tram: 'Đường dây nhánh rẽ thủy điện Đăk Glun', duong_day_so_mach: '1', tba: 0, tiet_dien_day_dan: 'AC150', dien_ap: '', chieu_dai: 14.37, p_max: 0, p_min: 0, p_tb: 0, mang_tai: 0, trang_thai_hoat_dong: 1, loai_quy_hoach: 3 },
        { ten_tram: 'Đường dây 171 Thác Mơ - 171 Phước Long', duong_day_so_mach: '1', tba: 0, tiet_dien_day_dan: '2xAC185', dien_ap: '', chieu_dai: 11.88, p_max: 119.5, p_min: 0, p_tb: 0, mang_tai: 72, trang_thai_hoat_dong: 1, loai_quy_hoach: 3 },
        { ten_tram: 'Đường dây 172 Phước Long - 171 Đồng Xoài', duong_day_so_mach: '1', tba: 0, tiet_dien_day_dan: '2xAC185', dien_ap: '', chieu_dai: 37.25, p_max: 87, p_min: 0, p_tb: 0, mang_tai: 104.8, trang_thai_hoat_dong: 1, loai_quy_hoach: 3 },
        { ten_tram: 'Đường dây nhánh rẽ Ve Dan 1', duong_day_so_mach: '2', tba: 0, tiet_dien_day_dan: '2xAC185', dien_ap: '', chieu_dai: 0.61, p_max: 0.2, p_min: 0, p_tb: 0, mang_tai: 0.3, trang_thai_hoat_dong: 1, loai_quy_hoach: 3 },
        { ten_tram: 'Đường dây 172 Phú Giáo - 172 Đồng Xoài', duong_day_so_mach: '1', tba: 0, tiet_dien_day_dan: '2xAC185', dien_ap: '', chieu_dai: 31.78, p_max: 48.1, p_min: 0, p_tb: 0, mang_tai: 58, trang_thai_hoat_dong: 1, loai_quy_hoach: 3 },
        { ten_tram: 'Đường dây Phú Giáo - Thủy điện Trị An', duong_day_so_mach: '1', tba: 0, tiet_dien_day_dan: 'AC185', dien_ap: '', chieu_dai: 29, p_max: 0, p_min: 0, p_tb: 0, mang_tai: 0, trang_thai_hoat_dong: 1, loai_quy_hoach: 3 },
        { ten_tram: 'Đường dây 171 TĐ Cần Đơn - 171 Bù Đốp', duong_day_so_mach: '1', tba: 0, tiet_dien_day_dan: 'AC185', dien_ap: '', chieu_dai: 7.45, p_max: 40.1, p_min: 0, p_tb: 0, mang_tai: 48.3, trang_thai_hoat_dong: 1, loai_quy_hoach: 3 },
        { ten_tram: 'Đường dây 172 Bù Đốp - 173 Lộc Ninh', duong_day_so_mach: '1', tba: 0, tiet_dien_day_dan: 'AC185', dien_ap: '', chieu_dai: 29.15, p_max: 27.9, p_min: 0, p_tb: 0, mang_tai: 33.6, trang_thai_hoat_dong: 1, loai_quy_hoach: 3 },
        { ten_tram: 'Đường dây 171 Bình Long - 171 XM Tây Ninh', duong_day_so_mach: '1', tba: 0, tiet_dien_day_dan: 'AC185', dien_ap: '', chieu_dai: 27.5, p_max: 19.6, p_min: 0, p_tb: 0, mang_tai: 23.7, trang_thai_hoat_dong: 1, loai_quy_hoach: 3 },
        { ten_tram: 'Đường dây Bình Long - Tây Ninh', duong_day_so_mach: '1', tba: 0, tiet_dien_day_dan: 'AC185', dien_ap: '', chieu_dai: 89, p_max: 0, p_min: 0, p_tb: 0, mang_tai: 0, trang_thai_hoat_dong: 1, loai_quy_hoach: 3 },
        { ten_tram: 'Đường dây 172 Bù Đăng - 173 Đăk Rấp ', duong_day_so_mach: '1', tba: 0, tiet_dien_day_dan: 'AC185', dien_ap: '', chieu_dai: 60.42, p_max: 19.6, p_min: 0, p_tb: 0, mang_tai: 23.7, trang_thai_hoat_dong: 1, loai_quy_hoach: 3 },
        { ten_tram: 'Đường dây nhánh rẽ XM Bình Phước', duong_day_so_mach: '2', tba: 0, tiet_dien_day_dan: 'AC185', dien_ap: '', chieu_dai: 5.38, p_max: 26.4, p_min: 0, p_tb: 0, mang_tai: 31.8, trang_thai_hoat_dong: 1, loai_quy_hoach: 3 },
        { ten_tram: 'Đường dây 272 Đăk Nông - 273 Bình Long', duong_day_so_mach: '', tba: 0, tiet_dien_day_dan: '3xACSR 330', dien_ap: '', chieu_dai: 128.2, p_max: 308, p_min: 0, p_tb: 0, mang_tai: 38.3, trang_thai_hoat_dong: 1, loai_quy_hoach: 4 },
        { ten_tram: 'Đường dây 271 Đăk Nông - 274 Bình Long', duong_day_so_mach: '', tba: 0, tiet_dien_day_dan: '3xACSR 330', dien_ap: '', chieu_dai: 128.2, p_max: 308, p_min: 0, p_tb: 0, mang_tai: 38.3, trang_thai_hoat_dong: 1, loai_quy_hoach: 4 },
        { ten_tram: 'Đường dây 271 Mỹ Phước - 276 Bình Long', duong_day_so_mach: '', tba: 0, tiet_dien_day_dan: 'ACSR 795MCM', dien_ap: '', chieu_dai: 73, p_max: 152, p_min: 0, p_tb: 0, mang_tai: 51.5, trang_thai_hoat_dong: 1, loai_quy_hoach: 4 },
        { ten_tram: 'Đường dây 272 Mỹ Phước - 275 Bình Long', duong_day_so_mach: '', tba: 0, tiet_dien_day_dan: 'ACSR 795MCM', dien_ap: '', chieu_dai: 73, p_max: 152, p_min: 0, p_tb: 0, mang_tai: 51.5, trang_thai_hoat_dong: 1, loai_quy_hoach: 4 },
        { ten_tram: 'Đường dây 500KV Đăk Nông - Cầu Bông (1 mạch)', duong_day_so_mach: '', tba: 0, tiet_dien_day_dan: '', dien_ap: '', chieu_dai: 90.576, p_max: 0, p_min: 0, p_tb: 0, mang_tai: 0, trang_thai_hoat_dong: 1, loai_quy_hoach: 5 },
        { ten_tram: 'Đường dây 500KV Pleiku - Cầu Bông (2 mạch)', duong_day_so_mach: '', tba: 0, tiet_dien_day_dan: '', dien_ap: '', chieu_dai: 102.371, p_max: 0, p_min: 0, p_tb: 0, mang_tai: 0, trang_thai_hoat_dong: 1, loai_quy_hoach: 5 },
    ]

    displayedColumns: string[] = ['index', 'ten_tram', 'duong_day_so_mach', 'tba', 'tiet_dien_day_dan', 'dien_ap', 'chieu_dai', 'p_max', 'p_min', 'p_tb', 'trang_thai_hoat_dong'];

    ngOnInit() {
        super.ngOnInit();
        this.getDataElectric110KV();
    }

    getDataElectric110KV() {
        this.energyService.LayDuLieuQuyHoachDien110KV(this.currentYear).subscribe(res => {
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
                    this.tba500KVDataSource.data.push(item);
                    break;

                case 4:
                    this.dd110KVDataSource.data.push(item);
                    break;
                case 5:
                    this.dd220KVDataSource.data.push(item);
                    break;
                case 6:
                    this.dd500KVDataSource.data.push(item);
                    break;
                default:
                    break;
            }
        })
        this.accordion.openAll();
        console.log(this.tba110KVDataSource);
    }

    // autoOpen() {
    //     setTimeout(() => this.accordion.openAll(), 1000);
    // }

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

    // switchView() {
    //     console.log(this.formData)
    // }

    public prepareData(data) {
        data['tba'] = Number(data['tba']);
        data['p_max'] = Number(data['p_max']);
        data['p_min'] = Number(data['p_min']);
        data['p_tb'] = Number(data['p_tb']);
        data['mang_tai'] = Number(data['mang_tai']);
        return data;
    }

    public callService(data) {
        let list_data = [data];
        // console.log(list_data)
        this.energyService.CapNhatDuLieuQuyHoachDien110KV(list_data).subscribe(res => {
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