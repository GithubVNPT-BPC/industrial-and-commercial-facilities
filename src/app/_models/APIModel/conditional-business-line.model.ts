export class DeleteModel {
    id: string;
}

export class PetrolList {
    id_cua_hang_xang_dau: number;
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
    san_luong: number;
    ghi_chu: string;
    is_het_han: boolean;
    ten_quan_huyen: string;
    ten_doanh_nghiep: string;

    id_thuong_nhan: string;
    ten_thuong_nhan: string;
    dia_chi_tn: string;
    so_dien_thoai_tn: string;
    id_san_luong: string;
    id: string;
}

export class SumStore {
    id: number;
    is_het_han: boolean;
    ngay_het_han: string;
}

export class TobaccoList {
    id_thuoc_la: string;
    mst: string;
    so_luong: number;
    tri_gia: number;
    time_id: string;
    dia_chi_day_du: string;
    id_quan_huyen: number;
    ten_quan_huyen: string;
    so_dien_thoai: string;
    nguoi_dai_dien: string;
    ten_doanh_nghiep: string;
    so_giay_phep: string
    ngay_cap: string;
    ngay_het_han: string;
    is_het_han: boolean;
    ghi_chu: string;
    tinh_trang_hoat_dong: string;
    id_tinh_trang_hoat_dong: number;

    id_thuong_nhan: string;
    ten_thuong_nhan: string;
    dia_chi_tn: string;
    so_dien_thoai_tn: string;
    id_san_luong: string;
    id: string;
}

export class LiquorList {
    id_ruou: string;
    mst: string;
    so_luong: number;
    tri_gia: number;
    time_id: string;
    dia_chi_day_du: string;
    id_quan_huyen: number;
    ten_quan_huyen: string;
    so_dien_thoai: string;
    nguoi_dai_dien: string;
    ten_doanh_nghiep: string;
    so_giay_phep: string
    ngay_cap: string;
    ngay_het_han: string;
    is_het_han: boolean;
    ghi_chu: string;
    tinh_trang_hoat_dong: string;
    id_tinh_trang_hoat_dong: number;

    id_thuong_nhan: string;
    ten_thuong_nhan: string;
    dia_chi_tn: string;
    so_dien_thoai_tn: string;
    id_san_luong: string;
    id: string;
}

export class LPGList {
    id_lpg: string;
    mst: string;
    so_luong: number;
    time_id: string;
    dia_chi_day_du: string;
    id_quan_huyen: number;
    ten_quan_huyen: string;
    so_dien_thoai: string;
    nguoi_dai_dien: string;
    ten_doanh_nghiep: string;
    so_giay_phep: string
    ngay_cap: string;
    ngay_het_han: string;
    is_het_han: boolean;
    ghi_chu: string;
    tinh_trang_hoat_dong: string;
    id_tinh_trang_hoat_dong: number;

    id_thuong_nhan: string;
    ten_thuong_nhan: string;
    dia_chi_tn: string;
    so_dien_thoai_tn: string;
    id_san_luong: string;
    id: string;
}

export class PetrolPost {
    id_cua_hang_xang_dau: number;
    ten_cua_hang: string;
    mst: string;
    dia_chi: string;
    id_phuong_xa: number;
    so_dien_thoai: string;
    id_tinh_trang_hoat_dong: number;
    ten_quan_ly: string;
    ten_nhan_vien: string;
    id_giay_phep: number;

    time_id: string;
    san_luong: number;
    ghi_chu: string;
}

export class PetrolStore {
    id_cua_hang_xang_dau: number;
    ten_cua_hang: string;
    mst: string;
    dia_chi: string;
    id_phuong_xa: number;
    so_dien_thoai: string;
    id_tinh_trang_hoat_dong: number;
    ten_quan_ly: string;
    ten_nhan_vien: string;
    id_giay_phep: number;
}

export class PetrolValuePost {
    id: string;
    id_cua_hang_xang_dau: number;
    time_id: string;
    san_luong: number;
    ghi_chu: string;
}

export class PetrolValuePostNEW {
    id: string;
    id_cua_hang_xang_dau: number;
    time_id: string;
    san_luong: number;
    ghi_chu: string;
    danh_sach_thuong_nhan: Array<PostBusinessmanValue>;
}

export class TobaccoPost {
    id: string;
    mst: string;
    so_luong: number;
    tri_gia: number;
    time_id: string;
    ghi_chu: string;
    id_tinh_trang_hoat_dong: number;
}

export class TobaccoPostNEW {
    id: string;
    mst: string;
    so_luong: number;
    tri_gia: number;
    time_id: string;
    ghi_chu: string;
    id_tinh_trang_hoat_dong: number;
    danh_sach_thuong_nhan: Array<PostBusinessmanValue>;
}

export class LiquorPost {
    id: string;
    mst: string;
    so_luong: number;
    tri_gia: number;
    time_id: string;
    ghi_chu: string;
    id_tinh_trang_hoat_dong: number;
}

export class LiquorPostNEW {
    id: string;
    mst: string;
    so_luong: number;
    tri_gia: number;
    time_id: string;
    ghi_chu: string;
    id_tinh_trang_hoat_dong: number;
    danh_sach_thuong_nhan: Array<PostBusinessmanValue>;
}

export class LPGPost {
    id: string;
    mst: string;
    so_luong: number;
    time_id: string;
    ghi_chu: string;
    id_tinh_trang_hoat_dong: number;
}

export class LPGPostNEW {
    id: string;
    mst: string;
    so_luong: number;
    time_id: string;
    ghi_chu: string;
    id_tinh_trang_hoat_dong: number;
    danh_sach_thuong_nhan: Array<PostBusinessmanValue>;
}

export class PostBusinessmanValue {
    id: string;
    id_thuong_nhan: string;
    id_linh_vuc: number;
    id_quan_ly: number;
}

export class Businessman {
    id_thuong_nhan: string;
    ten_thuong_nhan: string;
    dia_chi: string;
    so_dien_thoai: string;
    id_linh_vuc: number;
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

export class Status {
    id_tinh_trang_hoat_dong: number;
    tinh_trang_hoat_dong: string;
}

export class CertificateModel {
    id_giay_phep: number;
    mst: string;
    so_giay_phep: string;
    ngay_cap: string;
    ngay_het_han: string;
    id_loai_giay_phep: number;
    noi_cap: string;
    co_quan_cap: string;
    ghi_chu: string;
    id_linh_vuc: number;
}

export class CertificateViewModel {
    id_giay_phep: number;
    mst: string;
    so_giay_phep: string;
    ngay_cap: string;
    ngay_het_han: string;
    id_loai_giay_phep: number;
    noi_cap: string;
    co_quan_cap: string;
    ghi_chu: string;
    id_linh_vuc: number;
    ten_linh_vuc: string;
    ten_doanh_nghiep: string;
    is_het_han: boolean;
}

export class CertificateType {
    id_loai_giay_phep: number;
    ten_giay_phep: string;
}

export class FieldList {
    id_linh_vuc: number;
    ten_linh_vuc: string;
}

export class BusinessmanSelect {
    id_thuong_nhan: number;
    ten_thuong_nhan: string;
    id_linh_vuc: number;
}

export class StoreSelect {
    mst: string;
    storeselect: string;
    id_cua_hang_xang_dau: number;
}
//mat-select model