export class ClusterDetailModel{
    id:number;
    ten_cum: string;
    hinh_anhs: string[];
    dia_chi:string;
    chu_dau_tu: string;
    dien_tich: number;
    quyet_dinh_thanh_lap:string;
    dien_giai: string;
    downloadPDF:string;
    dieu_kien_kinh_doanh : string;
    vi_tri_quy_mo : string;
    quy_mo_dien_tich : string;
    tong_muc_dau_tu : string;
    duong_dan: string;
}

export class ClusterDetailShortModel{
    chi_tieu:string;
    dien_giai:string;
    constructor(chiTieu:string, dienGiai:string){
        this.chi_tieu = chiTieu;
        this.dien_giai = dienGiai;
    }
}
export class IIPIndustrialModel{
    thu_tu:string;
    chi_tieu: string;
    don_vi:string;
    thang_01: number;
    thang_02: number;
    thang_03: number;
    thang_04: number;
    thang_05: number;
    thang_06: number;
    thang_07: number;
    thang_08: number;
    thang_09: number;
    thang_10: number;
    thang_11: number;
    thang_12: number;
}

export class IIPIndustrialMonthModel{
    thu_tu:string;
    chi_tieu: string;
    don_vi: string;
    cung_ky: number;
    luy_ke_cung_ky: number;
    ke_hoach_nam: number;
    thuc_hien_thang_truoc:number;
    thuc_hien_thang:number;
    luy_ke:number;
    thuc_hien_so_voi_thang_truoc:number;
    luy_ke_so_so_voi_cung_ky:number;
    thuc_hien_so_voi_cung_ky:number;
    luy_ke_so_voi_ke_hoach:number;
}