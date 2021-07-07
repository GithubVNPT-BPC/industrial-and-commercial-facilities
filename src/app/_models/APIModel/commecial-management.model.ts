
export class MarketTypeModel {
    id: number;
    name: string;
}

export class MarketModel {
    id_phuong_xa: number;
    id_quan_huyen: number;
    ten_quan_huyen: string;
    ten_phuong_xa: string;
    dia_chi: string;
    id: number;
    ten_cho: string;
    id_tinh_chat_kinh_doanh: number;
    id_tinh_chat_cho: number;
    id_loai_cho: number;
    id_hang_cho: number;
    nam_xay_dung: string;
    nam_nang_cap: string;
    dau_tu: number;
    so_ho_duoi_30: number;
    so_chuyen_doi_chuc_nang: number;
    so_chuyen_doi_hinh_thuc_quan_ly: number;
    ke_hoach_dau_tu: number;
    von_nstw: number;
    von_nsdp: number;
    von_dn_htx_hkd: number;
    von_khac: number;
    id_hinh_thuc_quan_ly: number;
    hinh_thuc_quan_ly: string;
    ban_quan_ly: number;
    to_quan_ly: number;
    doanh_nghiep: number;
    hop_tac_xa: number;
    ho_kinh_doanh: number;
    tong_von: number;
    so_nguoi: number;
    loai_hang_cho: string;
    tinh_chat_cho: string;
    ten_loai_cho: string;
    ten_hinh_thuc_quan_ly: string;
    ten_tinh_chat_kinh_doanh: string;
    thoi_gian_chinh_sua_cuoi: Date
}

export class SuperMarketCommonModel {
    ten_sieu_thi_TTTM: string;
    dia_diem: string;
    id_dia_ban: number;
    dia_ban: string;
    nha_nuoc: number;
    ngoai_nha_nuoc: number;
    co_von_dau_tu_nuoc_ngoai: number;
    von_khac: number;
    tong_hop: string;
    chuyen_doanh: string;
    nam_xay_dung: string;
    nam_ngung_hoat_dong: string;
    dien_tich_dat: number;
    id_phan_hang: number;
    phan_hang: string;
    so_lao_dong: number;
    ten_chu_dau_tu: string;
    giay_dang_ky_kinh_doanh: string;
    dia_chi: string;
    dien_thoai: string;
    ho_va_ten: string;
    dia_chi1: string;
    dien_thoai1: string;
    business_area_id: number;
}

export class ConvenienceStoreModel {
    id: number;
    ten_cua_hang: string;
    mst: string;
    id_spkd: number;
    dia_chi: string;
    id_phuong_xa: number;
    so_dien_thoai: string;
    id_giay_cndkkd: number;
    id_giay_atvstp: number;
    dia_chi_day_du: string;
    so_chung_nhan: string;
    ngay_cap_giay_chung_nhan: string;
    noi_cap_giay_chung_nhan: string;
    so_giay_phep: string;
    ngay_cap_giay_phep: string;
    ngay_het_han_giay_phep: string;
    ten_san_pham: string;
    id_quan_huyen: number;
    is_expired: boolean;
}

export class FoodCommerceModel {
    id: number;
    ten_cua_hang: string;
    mst: string;
    id_spkd: number;
    dia_chi: string;
    id_phuong_xa: number;
    so_dien_thoai: string;
    id_giay_cndkkd: number;
    id_giay_atvstp: number;
    dia_chi_day_du: string;
    so_giay_phep: string;
    ngay_cap: string;
    noi_cap: string;
    ten_san_pham: string;
    nguoi_dai_dien: string;
    id_quan_huyen: number;
    is_het_han: boolean;
    ngay_het_han: string;
}

export class CountrySideModel {
    id: number;
    id_phuong_xa: number;
    ten_phuong_xa: string;
    id_quan_huyen: number;
    ten_quan_huyen: number;
    cho_truyen_thong: string;
    nam_dat_TC_7: string;
    nam_dat_NTM: string;
    th_6_thang_nam_cung_ky_dat_TC_7: string;
    th_6_thang_nam_cung_ky_cho_dat_NTM: string;
    nam_bc_kh_6_thang_nam_dat_TC_7: string;
    nam_bc_kh_6_thang_nam_cho_dat_NTM: string;
    nam_bc_ut_6_thang_nam_dat_TC_7: string;
    nam_bc_ut_6_thang_nam_cho_dat_NTM: string;
}
