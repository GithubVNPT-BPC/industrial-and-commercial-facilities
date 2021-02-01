export class IndustrialExplosivesModel{
    id : number;
    mst : number;
    id_giay_phep : number;
    id_phuong_xa? : number;
    cong_suat_thiet_ke : number;
    dia_chi : string;
    dien_thoai : string;
    ngay_cap? : Date;
    ngay_het_han? : Date;
    san_luong? : number;
    so_gp_gcn : string;
    ten_doanh_nghiep? : string;
    time_id? : number;
    tri_gia? : number;
    danh_sach_thuong_nhan : string;
    id_quan_huyen : number;
    is_het_han : boolean;
    dang_hoat_dong : string;
    nganh_nghe_kd : string;
    so_lao_dong? : number;
    day_no : number;
    kip_no : number;
    thuoc_no : number;
    moi_no : number;
    day_no_6thang : number;
    kip_no_6thang : number;
    thuoc_no_6thang : number;
    moi_no_6thang : number;
    id_tinh_trang_hoat_dong : number;
}

export class IndustrialExplosivesFilterModel{
    id_quan_huyen : number[];
    is_het_han : boolean;
    id_tinh_trang_hoat_dong : number[];
}