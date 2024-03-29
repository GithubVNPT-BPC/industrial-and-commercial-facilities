export class ChemicalLPGFoodManagementModel {
    id: number;
    mst: string;
    time_id: string;
    tinh_trang_hoat_dong: boolean;
    cong_suat: number;
    san_luong: number;
    id_thuc_pham: number;
    id_so_giay_phep: number;
    ten_doanh_nghiep: string;
    dia_chi_day_du: string;
    id_quan_huyen: number;
    nganh_nghe_kd_chinh: string;
    email: string;
    so_lao_dong: null;
    email_sct: string;
    so_lao_dong_sct: string;
    von_dieu_le: number;
    so_giay_phep: string;
    ngay_cap: string;
    ngay_het_han: string;
    ten_thuc_pham: string;
    don_vi: string;
}

export class FoodIndustryModel {
    id: number;
    mst: string;
    time_id: string;
    tinh_trang_hoat_dong: boolean;
    cong_suat: number;
    san_luong: number;
    id_thuc_pham: number;
    id_so_giay_phep: number;
    ten_doanh_nghiep: string;
    dia_chi_day_du: string;
    id_quan_huyen: number;
    nganh_nghe_kd_chinh: string;
    email: string;
    so_lao_dong: null;
    email_sct: string;
    so_lao_dong_sct: string;
    von_dieu_le: number;
    so_giay_phep: string;
    ngay_cap: string;
    ngay_het_han: string;
    ten_thuc_pham: string;
    don_vi: string;
    is_expired: boolean;
    is_nearly_expired: boolean;

    thoi_gian_chinh_sua_cuoi: Date
}

export class LPGManagementModel {
    id: number;
    mst: string;
    time_id: string;
    tinh_trang_hoat_dong: boolean;
    cong_suat: number;
    san_luong: number;
    id_so_giay_phep: number;
    ten_doanh_nghiep: string;
    dia_chi_day_du: string;
    id_quan_huyen: number;
    nganh_nghe_kd_chinh: string;
    email: string;
    so_lao_dong: null;
    email_sct: string;
    so_lao_dong_sct: string;
    von_dieu_le: number;
    so_giay_phep: string;
    ngay_cap: string;
    ngay_het_han: string;
    is_expired: boolean;
    is_nearly_expired: boolean;

    thoi_gian_chinh_sua_cuoi: Date
}

export class ChemicalManagementModel {
    id_qlcn_hc: number;
    mst: string;
    time_id: string;
    tinh_trang_hoat_dong: boolean;
    id_so_giay_phep: number;
    ten_doanh_nghiep: string;
    dia_chi_day_du: string;
    id_quan_huyen: number;
    nganh_nghe_kd_chinh: string;
    email: string;
    so_lao_dong: number;
    email_sct: string;
    so_lao_dong_sct: string;
    so_giay_phep: string;
    ngay_cap: string;
    ngay_het_han: string;
    cong_suat: string;
    san_luong: string;
    is_expired: boolean;
    is_nearly_expired: boolean;
    id_loai_hinh: number;
    ten_loai_hinh: string;

    thoi_gian_chinh_sua_cuoi: Date
}