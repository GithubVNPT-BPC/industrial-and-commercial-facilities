export class ECommerceWebsite {
    id: number;
    ten_doanh_nghiep: string;
    dia_chi: string;
    dien_thoai: string;
    email: string;
    id_quan_huyen: number;
    loai_hhdv: string;
    mst: string;
    so_gian_hang: number;
    ten_mien: string;
}

export class ECommerceWebsiteFilterModel {
    id_quan_huyen: number[];
}

export class SaleWebsite {
    dia_chi: string;
    dien_thoai: string;
    ma_so_nganh_nghe: string;
    mst: string;
    nganh_nghe: string;
    ten_mien: string;
    ten_tc_cn: string;
    id_quan_huyen : string;
}

export class SaleWebsiteFilterModel {
    id_quan_huyen: number[];
}