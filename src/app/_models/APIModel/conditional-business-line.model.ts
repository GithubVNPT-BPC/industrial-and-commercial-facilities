export class DeleteModel {
    id: string;
}

export class PetrolList {
    id_cua_hang_xang_dau: string;
    ten_cua_hang: string;
    mst: string;
    dia_chi: string;
    id_phuong_xa: number;
    so_dien_thoai: string;
    id_giay_phep: number;
    id_tinh_trang_hoat_dong: number;
    ten_quan_ly: string;
    ten_nhan_vien: string;
    nguoi_dai_dien: string;
    so_giay_phep: string;
    ngay_cap: string;
    ngay_het_han: string;
    tinh_trang_hoat_dong: string;
    time_id: string;
    san_luong: string;
    ghi_chu: string;
    is_het_han: boolean;
    ten_quan_huyen: string;

    id_thuong_nhan: string;
    ten_thuong_nhan: string;
    dia_chi_tn: string;
    so_dien_thoai_tn: string;
    id_san_luong: string;
    id: string;
}

export class PetrolPost {
    public id_cua_hang_xang_dau: string;
    public ten_cua_hang: string;
    public mst: string;
    public dia_chi: string;
    public id_phuong_xa: number;
    public so_dien_thoai: string;
    public id_tinh_trang_hoat_dong: number;
    public ten_quan_ly: string;
    public ten_nhan_vien: string;
    public id_giay_phep: number;
}

export class PetrolValuePost {
    id: string;
    id_cua_hang_xang_dau: string;
    time_id: string;
    san_luong: number;
    ghi_chu: string;
}

export class PostBusinessmanValue {
    id: string;
    id_thuong_nhan: string;
    id_linh_vuc: number;
    id_quan_ly: string;
}

export class Businessman {
    id_thuong_nhan: string;
    ten_thuong_nhan: string;
    dia_chi: string;
    so_dien_thoai: string;
}

export class ConditionalBusinessLineModel {
    id: number;
    mst: string;
    id_giay_phep_kinh_doanh: number;
    id_loai_hinh_quan_ly: number;
    id_phuong_xa?: number;
    cong_suat?: string;
    dia_chi: string;
    dien_thoai: string;
    don_vi_san_luong?: string;
    don_vi_tri_gia?: string;
    ngay_cap?: Date;
    ngay_het_han?: Date;
    org_id?: number;
    san_luong?: number;
    so_giay_phep?: string;
    ten_doanh_nghiep?: string;
    time_id?: number;
    tri_gia?: number;
    danh_sach_thuong_nhan: string;
    id_quan_huyen: number;
    is_het_han: boolean;
    ten_cua_hang: string;
    ghi_chu: string;
    dia_chi_cua_hang: string;
}

//mat-select model
export class DistrictModel {
    id: number;
    ten_quan_huyen: string;
}

export class SubDistrictModel {
    id_phuong_xa: number;
    ten_phuong_xa: string;
    id_quan_huyen: number;
}

export class CertificateModel {
    public id_giay_phep: number;
    public mst: string;
    public so_giay_phep: string;
    public ngay_cap: string;
    public ngay_het_han: string;
    public id_loai_giay_phep: number;
    public noi_cap: string;
    public co_quan_cap: string;
    public ghi_chu: string;
    public id_linh_vuc: number;
    public ten_giay_phep: string;
}
export class BusinessmanSelect {
    id_thuong_nhan: number;
    ten_thuong_nhan: string;
    dia_chi: string;
    so_dien_thoai: string;
}
//mat-select model