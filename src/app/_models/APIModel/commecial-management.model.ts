export class MarketModel {
    id_phuong_xa: number;
    id_quan_huyen: number;
    ten_quan_huyen: string;
    ten_phuong_xa: string;
    DIA_CHI: string;
    id: number;
    ten_cho: string;
    is_thanh_thi: boolean;
    dien_tich: number;
    id_hang_cho: number;
    id_tinh_chat_cho: number;
    so_diem_kinh_doanh: number;
    so_ho_kinh_doanh_co_dinh: number;
    hien_trang_hoat_dong: string;
    de_xuat_thuc_hien: string;
    ke_hoach_thuc_hien: string;
    uu_tien_de_xuat_dau_tu: number;
    htql_so_nguoi: number;
    htql_ban_ql: number;
    htql_to_ql: number;
    htql_dn_htx: number;
    hinh_thuc_quan_ly: string;
    id_hinh_thuc_su_dung_dat: number;
    hinh_thuc_su_dung_dat: string;
    ttll_cq_ho_ten: string;
    ttll_cq_dien_thoai: string;
    ttll_dn_ho_ten: string;
    ttll_dn_dien_thoai: string;
    vdt_tong: number;
    vdt_ngan_sach: number;
    vdt_xa_hoi_hoa: number;
    nam: string;
    xay_moi: string;
    nang_cap: string;
    ghi_chu: string;
    loai_hang_cho: string;
    tinh_chat_cho: string;
}

export class MarketTypeModel {
    id: number;
    name: string;
}

export class MarketCommonModel {
    huyen: string;
    tongsocho: number;
    chohang1: number;
    chohang2: number;
    chohang3: number;
}

export class SuperMarketCommonModel {
    ten_sieu_thi_TTTM: string;
    dia_diem: string;
    id_dia_ban: number;
    dia_ban: string;
    nha_nuoc: number;
    ngoai_nha_nuoc: number;
    co_von_dau_tu_nuoc_ngoai: number;
    von_khac: number;
    tong_hop: string;
    chuyen_doanh: string;
    nam_xay_dung: string;
    nam_ngung_hoat_dong: string;
    dien_tich_dat: number;
    id_phan_hang: number;
    phan_hang: string;
    so_lao_dong: number;
    ten_chu_dau_tu: string;
    giay_dang_ky_kinh_doanh: string;
    dia_chi: string;
    dien_thoai: string;
    ho_va_ten: string;
    dia_chi1: string;
    dien_thoai1: string;
}

export class SuperMarketFilterModel {
    id_quan_huyen: number[] = [];
    id_phan_hang: string[] = [];
}

export class ConvenienceStoreModel {
    tencuahang: string;
    sanphamkinhdoanh: string;
    scndkkd: string;
    ngaycap: Date;
    noicap: string;
    diachi: string;
    sogcn: string;
    ngaycapgcn: Date;
    ngayhethangcn: Date;
    sdtlienhe: string;
    id_quan_huyen: number;
    is_het_han?: boolean;
}
export class StoreFilterModel {
    id_quan_huyen: number[] = [];
    is_het_han: boolean = null;
    ngaycapgcn: number = 0;
}

export class FoodCommonModel {
    tendoanhnghiep: string;
    diachi: string;
    sanphamkinhdoanh: string;
    scndkkd: string;
    ngaycap: Date;
    noicap: string;
    tennddpl: string;
    sdtnddpl: string;
    id_quan_huyen: number;
}

export class FoodFilterModel {
    id_quan_huyen: number[] = [];
    sanphamkinhdoanh: string[] = [];
}