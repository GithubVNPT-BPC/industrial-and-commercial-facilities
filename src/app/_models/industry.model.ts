export class ClusterDetailModel{
    id:number;
    ten_cum_cong_nghiep: string;
    hinh_anhs: string[];
    dia_chi:string;
    chu_dau_tu: string;
    dien_tich: number;
    co_so_phap_lys:string[];
    dien_giai: string;
    downloadPDF:string;
    dang_ki_kinh_doanh : string[];
    vi_tri_quy_mo : string[];
    quy_mo_dien_tich : string;
    tong_muc_dau_tu : string;
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
    thang_1: number;
    thang_2: number;
    thang_3: number;
    thang_4: number;
    thang_5: number;
    thang_6: number;
    thang_7: number;
    thang_8: number;
    thang_9: number;
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