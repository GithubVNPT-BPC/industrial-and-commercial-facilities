export class Businessman{
    id : number;
    id_thuong_nhan : number;
    mst : number;
    ten_thuong_nhan : string;
    dia_chi? : string;
    dien_thoai? : string;
}

export class ConditionalBusinessLineModel {
    id : number;
    mst : string;
    id_giay_phep_kinh_doanh : number;
    id_loai_hinh_quan_ly : number;
    id_phuong_xa? : number;
    cong_suat? : string;
    dia_chi : string;
    dien_thoai : string;
    don_vi_san_luong? : string;
    don_vi_tri_gia? : string;
    ngay_cap? : Date;
    ngay_het_han? : Date;
    org_id? : number;
    san_luong? : number;
    so_giay_phep? : string;
    ten_doanh_nghiep? : string;
    time_id? : number;
    tri_gia? : number;
    danh_sach_thuong_nhan : string;
    id_quan_huyen : number;
    is_het_han : boolean;
    ten_cua_hang : string;
    ghi_chu : string;
    dia_chi_cua_hang : string;
}