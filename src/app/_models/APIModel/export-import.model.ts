export class ex_im_model {
    ten_san_pham?: string;
    luong_thang?: number;
    gia_tri_thang?: number;
    luong_cong_don?: number;
    gia_tri_cong_don?: number;
    uoc_th_so_cungky_tht?: number;
    uoc_th_so_thg_truoc_tht?: number;
    uoc_th_so_cungky_cong_don?: number;
    uoc_th_so_thg_truoc_cong_don?: number;
    uth_so_khn?: Number;
    id_mat_hang?: number;
    id_quoc_gia?: number;
    ten_tieng_anh?: string;
    ten_quoc_gia?: string;

    isChecked?: boolean;
}


export class new_import_export_model {
    mst: number;
    ten_san_pham: string;
    id_san_pham: string;
    san_luong_thang: number;
    tri_gia_thang: number;
    uoc_thang_so_voi_ki_truoc: number;
    uoc_thang_so_voi_thang_truoc: number;
    san_luong_cong_don: number;
    tri_gia_cong_don: number;
    uoc_cong_don_so_voi_ki_truoc: number;
    uoc_cong_don_so_voi_cong_don_truoc: number; // uth so voi khn
    time_id: string;
    is_tong_cuc: boolean;

    // checked to delete
    isChecked?: boolean;
}

export class Task {
    time_id: number;
    id_san_pham: number;
}


export class data_detail_model {
    ten_san_pham: string;
    id_san_pham: string;
    san_luong_thang: number;
    tri_gia_thang: number;
    uoc_thang_so_voi_ki_truoc: number;
    uoc_thang_so_voi_thang_truoc: number;
    san_luong_cong_don: number;
    tri_gia_cong_don: number;
    uoc_cong_don_so_voi_ki_truoc: number;
    uoc_cong_don_so_voi_cong_don_truoc: number; // uth so voi khn
    time_id: string;
    is_tong_cuc: boolean;

    // checked to delete
    isChecked?: boolean;
    thi_truong: string;
}

export class dialog_detail_model {
    ten_san_pham: string;
    thi_truong: string;
    san_luong_thang: number;
    tri_gia_thang: number;
    san_luong_cong_don: number;
    tri_gia_cong_don: number;
}

export class tong_quan_bg_model {
    id_loai_hang_hoa?: number;
    ten_cua_khau?: string;
    time_id: number;
    id_cua_khau: number;
    san_luong_thang: number;
    tri_gia_thang: number;
    uoc_thang_so_voi_ki_truoc: number;
    uoc_thang_so_voi_thang_truoc: number;
    san_luong_cong_don: number;
    tri_gia_cong_don: number;
    uoc_cong_don_so_voi_cung_ki: number;
    uoc_cong_don_so_voi_ke_hoach_nam: number;
}