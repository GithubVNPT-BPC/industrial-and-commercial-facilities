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
    phanloai: string[] = [];
}

export class StoreCommonModel {
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