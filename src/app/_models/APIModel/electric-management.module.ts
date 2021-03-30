import { NumberValueAccessor } from '@angular/forms';

export class HydroElectricManagementModel {
    // mst: string;
    // ten_doanh_nghiep: string;
    // ten_phuong_xa: string;
    // ten_huyen_thi: string;
    // ma_huyen_thi: number;
    // cong_xuat_thiet_ke: number;
    // luong_nuoc_xa: number;
    // dung_tich_ho: number;
    // san_luong_6_thang: number;
    // san_luong_nam: number;
    // doanh_thu: number;
    // trang_thai: string;

    Tdn: string;
    mst: string;
    Dd: string;
    Cx: string;
    Lnxbq: string;
    Dthc: number;
    Sl6tck: number;
    Slnck: number;
    Dt: number;
    trang_thai: string;

    Paupttcctvhd: string;
    Pdpauptt: string;
    Paupvthkcdhctd: string;
    Qtvhhctd: string;
    Qtdhctd: string;
    Kdd: string;
    Ldhtcbvhd: string;
    Btct: string;
    Lcsdlhctd: string;
    Pabvdhctd: string;
    Bcdgatdhctd: string;
    Bchtatdhctd: string;
    Tkdkatdhctd: string;

}

export class SolarEneryManagementModel {
    mst: string;
    ten_du_an: string;
    ten_doanh_nghiep: string;
    dia_diem: string;
    ma_huyen_thi?: number;
    cong_suat_thiet_ke: number;
    san_luong_6_thang: number;
    san_luong_nam: number;
    doanh_thu: number;
    ten_trang_thai_hoat_dong: string;
    id_trang_thai_hoat_dong: number;
    id_quan_huyen: number;
}

export class ElectricityDevelopmentModel {
    chi_tieu: string;
    ten_huyen_thi: string;
    ma_huyen_thi: number;
    trung_ap_3p: number;
    trung_ap_1p: number;
    ha_ap_3p: number;
    ha_ap_1p: number;
    so_tram_bien_ap: number;
    cong_xuat_bien_ap: number;
}

export class ElectricityDevelopment35KVModel {
    // chi_tieu: string;
    // ten_huyen_thi: string;
    // ma_huyen_thi: number;
    trung_ap_3_pha: number;
    trung_ap_1_pha: number;
    ha_ap_3_pha: number;
    ha_ap_1_pha: number;
    so_tram: number;
    cong_suat: number;
    id_quan_huyen: number;
    dia_diem: string;
    dia_ban: string;
    time_id: number;
    id_trang_thai_hoat_dong: number;
    ten_trang_thai_hoat_dong: string;
}

export class RuralElectricModel {
    // thu_tu: string;
    // ma_huyen_thi: number;
    // ten_huyen_thi: string;
    // tong_ho_su_dung_dien: number;
    // tong_ho_co_dien: number;
    // tong_ho_khong_co_dien: number;
    // ty_le: number;
    // tieu_chi_1: string;
    // tieu_chi_2: string;
    // tieu_chi_3: string;

    db: string;
    t1: number;
    cd1: number;
    tl1: number;
    t2: number;
    cd2: number;
    ccd2: number;
    tl2: number;
    tc4_1: string;
    tc4_2: string;
    tc4_3: string;

}

export class PowerProductionModel {
    // chi_tieu: string;
    // san_luong_nam_truoc: number;
    // san_luong_nam_thuc_hien: number;
    // so_sanh_cung_ky: number;
    ctcy: string;
    dvt: string;
    t112019: number;
    lk11t2019: number;
    khn2020: number;
    t102020: number;
    t112020: number;
    lk11t2020: number;
    tht11stt: number;
    tht11sck: number;
    lktsck: number;
    lktskh: number;
}

export class UserForcusEnergy {
    mst: string;
    ten_doanh_nghiep: string;
    dia_diem: string;
    ma_huyen_thi?: number;
    nganh_nghe_san_xuat: string;
    nang_luong_tieu_thu: number;
    nang_luong_quy_doi: number;
    suat_tieu_hao_1_dv_sp: number;
    id_quan_huyen?: number;
}

export class BlockElectricModel{
    ten_du_an: string;
    ten_doanh_nghiep: string;
    dia_chi:string;
    cong_xuat_thiet_ke:number;
    san_luong_6_thang:number;
    san_luong_nam:number;
    doanh_thu:number;
    trang_thai:string;
    dia_diem?: string;
    cong_suat_thiet_ke?: number;
}

export class ManageAproveElectronic {
    ten_doanh_nghiep: string;
    dia_chi:string;
    so_dien_thoai?:string;
    so_giay_phep:string;
    ngay_cap: string;
    ngay_het_han: string;
    id_group?: number;
    dien_thoai?: string;
    is_expired: boolean;
}

export class ElectricalPlan {
    ten_tram: string;
    duong_day_so_mach: string;
    tba: number;
    tiet_dien_day_dan: string;
    dien_ap: string;
    chieu_dai: number;
    p_max: number;
    p_min: number;
    p_tb: number;
    mang_tai: number;
    loai_quy_hoach: number;
    trang_thai_hoat_dong: number;
}

export class HydroEnergyModel {
    ten_doanh_nghiep: string;
    cong_suat_thiet_ke: number
    dung_tich_ho_chua: number;
    san_luong_6_thang: number;
    san_luong_nam: number;
    doanh_thu: number;
    phuong_an_ung_pho_thien_tai_ha_du: string;
    phe_duyet_phuong_an_ung_pho_thien_tai: string;
    phuong_an_ung_pho_khan_cap: string;
    quy_trinh_van_hanh_ho_chua: string;
    quan_trac_dap_ho: string;
    kiem_dinh_dap: string;
    lap_dat_he_thong_canh_bao_ha_du: string;
    bao_trinh_cong_trinh: string;
    lap_co_so_du_lieu_ho_chua_thuy_dien: string;
    phuong_an_bao_ve_dap_ho_chua_thuy_dien: string;
    bao_cao_danh_gia_an_toan: string;
    bao_cao_hien_trang_an_toan_dap_ho: string;
    to_khai_dang_ky_an_toan_dap_ho: string;
    luong_nuoc_xa_binh_quan: string;
    dia_diem: string;
}

export class KeyEnergyModel {
    ten_khach_hang: string;
    dia_chi: string;
    nganh_nghe: string;
    dien: number;
    than: number;
    DO: number;
    FO: number;
    xang: number;
    LPG: number;
    go: number;
    nang_luong_quy_doi: number;
}

export class ElectricalPlan110KV {
    ten_tram: string;
    duong_day: string;
    tba: number;
    tiet_dien_day_dan: string;
    dien_ap: string;
    chieu_dai: number;
    p_max: number;
    p_min: number;
    p_tb: number;
    mang_tai: number;
    id_loai_quy_hoach: number;
    id_trang_thai_hoat_dong: number;
    ten_trang_thai_hoat_dong: string;
    id_giai_doan?: number;
}

export class New_RuralElectricModel {
    dia_ban: string;
    tong_so_ho: number;
    tong_so_ho_co_dien: number;
    
    nong_thon_tong_so_ho: number;
    nong_thon_tong_so_ho_co_dien: number;
    ccd2: number;
    
    tieu_chi_41: boolean;
    tieu_chi_42: boolean;
    tieu_chi_43: boolean;

}