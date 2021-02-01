import { Component, OnInit, ViewChild } from '@angular/core';
import { MatAccordion, MatPaginator, MatTableDataSource } from '@angular/material';
import { DistrictModel } from 'src/app/_models/APIModel/domestic-market.model';
import { ElectricalPlan } from 'src/app/_models/APIModel/electric-management.module';
import { LinkModel } from 'src/app/_models/link.model';

@Component({
    selector: 'future-electrical-plan',
    templateUrl: './future-electrical-plan.component.html',
    styleUrls: ['/../../special_layout.scss'],
})

export class FutureElectricalPlanComponent implements OnInit {
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

    tba110KVDataSource: MatTableDataSource<ElectricalPlan> = new MatTableDataSource<ElectricalPlan>();
    tba220KVDataSource: MatTableDataSource<ElectricalPlan> = new MatTableDataSource<ElectricalPlan>();
    tba500KVDataSource: MatTableDataSource<ElectricalPlan> = new MatTableDataSource<ElectricalPlan>();
    dd110KVDataSource: MatTableDataSource<ElectricalPlan> = new MatTableDataSource<ElectricalPlan>();
    dd220KVDataSource: MatTableDataSource<ElectricalPlan> = new MatTableDataSource<ElectricalPlan>();
    dd500KVDataSource: MatTableDataSource<ElectricalPlan> = new MatTableDataSource<ElectricalPlan>();

    data: Array<ElectricalPlan> = [
        { ten_tram: 'Xi Măng An Phú', duong_day_so_mach: 'T1', tba: 40, tiet_dien_day_dan: '', dien_ap: '', chieu_dai: 0, p_max: 0, p_min: 0, p_tb: 0, mang_tai: 0, trang_thai_hoat_dong: 1, loai_quy_hoach: 1 },
        { ten_tram: 'KCN Minh Hưng', duong_day_so_mach: 'T1', tba: 40, tiet_dien_day_dan: '', dien_ap: '', chieu_dai: 0, p_max: 0, p_min: 0, p_tb: 0, mang_tai: 0, trang_thai_hoat_dong: 1, loai_quy_hoach: 1 },
        { ten_tram: 'KCN Đồng Xoài', duong_day_so_mach: 'T1', tba: 25, tiet_dien_day_dan: '', dien_ap: '', chieu_dai: 0, p_max: 0, p_min: 0, p_tb: 0, mang_tai: 0, trang_thai_hoat_dong: 1, loai_quy_hoach: 1 },
        { ten_tram: 'Xi măng Minh Tâm', duong_day_so_mach: 'T1', tba: 80, tiet_dien_day_dan: '', dien_ap: '', chieu_dai: 0, p_max: 0, p_min: 0, p_tb: 0, mang_tai: 0, trang_thai_hoat_dong: 1, loai_quy_hoach: 1 },
        { ten_tram: 'Nâng công suất trạm Chơn Thành từ 40MVA lên 80MVA', duong_day_so_mach: 'T2', tba: 40, tiet_dien_day_dan: '', dien_ap: '', chieu_dai: 0, p_max: 0, p_min: 0, p_tb: 0, mang_tai: 0, trang_thai_hoat_dong: 1, loai_quy_hoach: 1 },
        { ten_tram: 'Nâng công suất trạm Bù Đăng từ 25MVA lên 50MVA', duong_day_so_mach: 'T2', tba: 25, tiet_dien_day_dan: '', dien_ap: '', chieu_dai: 0, p_max: 0, p_min: 0, p_tb: 0, mang_tai: 0, trang_thai_hoat_dong: 1, loai_quy_hoach: 1 },
        { ten_tram: 'Chơn Thành', duong_day_so_mach: '', tba: 500, tiet_dien_day_dan: '', dien_ap: '', chieu_dai: 0, p_max: 0, p_min: 0, p_tb: 0, mang_tai: 0, trang_thai_hoat_dong: 1, loai_quy_hoach: 2 },
        { ten_tram: 'Nâng công suất trạm biến áp Bình Long 2 từ (250 thành 250+250 MVA)', duong_day_so_mach: '', tba: 250, tiet_dien_day_dan: '', dien_ap: '', chieu_dai: 0, p_max: 0, p_min: 0, p_tb: 0, mang_tai: 0, trang_thai_hoat_dong: 1, loai_quy_hoach: 2 },
        { ten_tram: 'Phước Long ', duong_day_so_mach: '', tba: 250, tiet_dien_day_dan: '', dien_ap: '', chieu_dai: 0, p_max: 0, p_min: 0, p_tb: 0, mang_tai: 0, trang_thai_hoat_dong: 1, loai_quy_hoach: 2 },
        { ten_tram: 'Bình Long đầu chuyển tiếp trên 2 mạch ĐD Bình Long 2 và Chơn Thành', duong_day_so_mach: '', tba: 250, tiet_dien_day_dan: '', dien_ap: '', chieu_dai: 0, p_max: 0, p_min: 0, p_tb: 0, mang_tai: 0, trang_thai_hoat_dong: 1, loai_quy_hoach: 2 },
        { ten_tram: 'Chơn Thành', duong_day_so_mach: '', tba: 1800, tiet_dien_day_dan: '', dien_ap: '', chieu_dai: 0, p_max: 0, p_min: 0, p_tb: 0, mang_tai: 0, trang_thai_hoat_dong: 1, loai_quy_hoach: 6 },
        { ten_tram: 'Đường dây đấu nối trạm xi măng An Phú', duong_day_so_mach: '2', tba: 0, tiet_dien_day_dan: '', dien_ap: '', chieu_dai: 18, p_max: 0, p_min: 0, p_tb: 0, mang_tai: 0, trang_thai_hoat_dong: 1, loai_quy_hoach: 3 },
        { ten_tram: 'Đường dây đấu nối trạm 110kV KCN Minh Hưng', duong_day_so_mach: '2', tba: 0, tiet_dien_day_dan: '', dien_ap: '', chieu_dai: 1, p_max: 0, p_min: 0, p_tb: 0, mang_tai: 0, trang_thai_hoat_dong: 1, loai_quy_hoach: 3 },
        { ten_tram: 'Đường dây đấu nối trạm 110kV KCN Đồng Xoài', duong_day_so_mach: '2', tba: 0, tiet_dien_day_dan: '', dien_ap: '', chieu_dai: 10, p_max: 0, p_min: 0, p_tb: 0, mang_tai: 0, trang_thai_hoat_dong: 1, loai_quy_hoach: 3 },
        { ten_tram: 'Cải tại đường dây 2 mạch Bình Long - trạm 110kV Bình Long ', duong_day_so_mach: '1', tba: 0, tiet_dien_day_dan: '', dien_ap: '', chieu_dai: 20, p_max: 0, p_min: 0, p_tb: 0, mang_tai: 0, trang_thai_hoat_dong: 1, loai_quy_hoach: 3 },
        { ten_tram: 'Đường dây mạch kép Tây Ninh - Bình Long 2', duong_day_so_mach: '', tba: 0, tiet_dien_day_dan: '', dien_ap: '', chieu_dai: 64, p_max: 0, p_min: 0, p_tb: 0, mang_tai: 0, trang_thai_hoat_dong: 1, loai_quy_hoach: 4 },
        { ten_tram: 'Đường dây 4 mạch Chơn Thành - rẽ Bình Long 2 - Mỹ Phước ', duong_day_so_mach: '', tba: 0, tiet_dien_day_dan: '', dien_ap: '', chieu_dai: 10, p_max: 0, p_min: 0, p_tb: 0, mang_tai: 0, trang_thai_hoat_dong: 1, loai_quy_hoach: 4 },
        { ten_tram: 'Đường dây mạch kép Chơn Thành - Bến Cát ', duong_day_so_mach: '', tba: 0, tiet_dien_day_dan: '', dien_ap: '', chieu_dai: 50, p_max: 0, p_min: 0, p_tb: 0, mang_tai: 0, trang_thai_hoat_dong: 1, loai_quy_hoach: 4 },
        { ten_tram: 'Đường dây mạch kép Phước Long - Bình Long - Đăk Nông', duong_day_so_mach: '', tba: 0, tiet_dien_day_dan: '', dien_ap: '', chieu_dai: 5, p_max: 0, p_min: 0, p_tb: 0, mang_tai: 0, trang_thai_hoat_dong: 1, loai_quy_hoach: 4 },
        { ten_tram: 'Đường dây 4 mạch Bình Long - Bình Long 2 - Chơn Thành', duong_day_so_mach: '', tba: 0, tiet_dien_day_dan: '', dien_ap: '', chieu_dai: 4, p_max: 0, p_min: 0, p_tb: 0, mang_tai: 0, trang_thai_hoat_dong: 1, loai_quy_hoach: 4 },
        { ten_tram: 'Đường dây 500KV Chơn Thành - Đức Hoà (2 mạch)', duong_day_so_mach: '', tba: 0, tiet_dien_day_dan: '', dien_ap: '', chieu_dai: 127, p_max: 0, p_min: 0, p_tb: 0, mang_tai: 0, trang_thai_hoat_dong: 1, loai_quy_hoach: 5 },
        { ten_tram: 'Đường dây 500KV Pleiku2 - Cầu Bông (4 mạch)', duong_day_so_mach: '', tba: 0, tiet_dien_day_dan: '', dien_ap: '', chieu_dai: 102.371, p_max: 0, p_min: 0, p_tb: 0, mang_tai: 0, trang_thai_hoat_dong: 1, loai_quy_hoach: 5 },
    ]

    displayedColumns: string[] = ['index', 'ten_tram', 'duong_day_so_mach', 'tba', 'tiet_dien_day_dan', 'dien_ap', 'chieu_dai', 'p_max', 'p_min', 'p_tb', 'trang_thai_hoat_dong'];

    ngOnInit() {
        this.tba110KVDataSource.data = this.data.filter(x => x.loai_quy_hoach == 1);
        this.tba220KVDataSource.data = this.data.filter(x => x.loai_quy_hoach == 2);
        this.tba500KVDataSource.data = this.data.filter(x => x.loai_quy_hoach == 6);
        this.dd110KVDataSource.data = this.data.filter(x => x.loai_quy_hoach == 3);
        this.dd220KVDataSource.data = this.data.filter(x => x.loai_quy_hoach == 4);
        this.dd500KVDataSource.data = this.data.filter(x => x.loai_quy_hoach == 5);
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
}