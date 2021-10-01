export class TFEModel {
    id: number;
    mst: string;
    ten_doanh_nghiep: string;
    dia_chi_doanh_nghiep: string;
    ten_hoi_cho: string;
    thoi_gian_bat_dau: Date;
    thoi_gian_ket_thuc: Date;
    dia_diem_to_chuc: string;
    id_phuong_xa: number;
    time_id: number;
    id_trang_thai: number;
    so_luong_gian_hang: number;
    so_van_ban: string;
    co_quan_ban_hanh: string;
    ngay_thang_nam_van_ban: Date;
    san_pham: string;

    thoi_gian_chinh_sua_cuoi: Date
}

export class SDModel {
    ten_doanh_nghiep: string;
    dia_chi_doanh_nghiep: string;
    mst: string;
    ten_chuong_trinh_km: string;
    thoi_gian_bat_dau: Date;
    thoi_gian_ket_thuc: Date;
    hang_hoa_km: string;
    dia_diem_km?: any[];
    ten_hinh_thuc: string;
    so_van_ban: string;
    co_quan_ban_hanh: string;
    ngay_thang_nam_van_ban: Date;
    id_temp?: number;
    id?: number;

    thoi_gian_chinh_sua_cuoi: Date
}

export class dia_diem_km {
    dia_diem: string;
    id_quan_huyen: number;
    id_xttm_km: number;
    id: number;
}