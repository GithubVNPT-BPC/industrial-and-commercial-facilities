export class IndustrialExplosivesModel {
    cong_suat_thiet_ke: number;
    cong_suat_thiet_ke_sct: number;
    day_no: number;
    day_no_6thang: number;
    dia_chi: string;
    dia_chi_day_du: null
    id: number;
    id_phuong_xa: number;
    id_so_giay_phep: number;
    id_tinh_trang_hoat_dong: number;
    kip_no: number;
    kip_no_6thang: number;
    moi_no: number;
    moi_no_6thang: number;
    mst: string;
    nganh_nghe_kd_chinh: string;
    ngay_cap: string;
    ngay_het_han: string;
    san_luong: number;
    san_luong_sct: number;
    so_dien_thoai: string;
    so_giay_phep: string;
    so_lao_dong: number;
    ten_doanh_nghiep: string;
    ten_tinh_trang_hoat_dong: string;
    thuoc_no: number;
    thuoc_no_6thang: number;
    time_id: number;
    is_expired: boolean;

    thoi_gian_chinh_sua_cuoi: Date
}

export class IndustrialExplosivesFilterModel {
    id_quan_huyen: number[];
    is_het_han: boolean;
    id_tinh_trang_hoat_dong: number[];
}