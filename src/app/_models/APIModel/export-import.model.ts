export class ex_im_model{
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
    ten_quoc_gia?:string;
}


export class new_import_export_model{
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
}
