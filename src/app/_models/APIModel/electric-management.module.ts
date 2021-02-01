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
    ten_huyen_thi: string;
    ma_huyen_thi: number;
    cong_suat_thiet_ke: number;
    san_luong_6_thang: number;
    san_luong_nam: number;
    doanh_thu: number;
    trang_thai: string;

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
    dia_chi: string;
    ma_huyen_thi: number;
    nganh_nghe: string;
    nang_luong_tieu_thu: number;
    nang_luong_quy_doi: number;
    suat_tieu_hao: number;

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
}

export class ManageAproveElectronic {
    ten_doanh_nghiep: string;
    dia_chi:string;
    so_dien_thoai:string;
    so_giay_phep:string;
    ngay_cap: string;
    ngay_het_han: string;
    id_group: number;
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