export class ECommerceWebsite {
    id: number;
    ten_doanh_nghiep: string;
    dia_chi: string;
    so_dien_thoai: string;
    email: string;
    id_quan_huyen?: number;
    loai_hang_hoa: string;
    mst: string;
    so_gian_hang: number;
    ten_mien: string;
}

export class ECommerceWebsiteFilterModel {
    id_quan_huyen: number[];
}

export class SaleWebsite {
    dia_chi: string;
    so_dien_thoai: string;
    ma_so_nganh_nghe: string;
    mst: string;
    nganh_nghe: string;
    ten_mien: string;
    ten_doanh_nghiep: string;
    id_quan_huyen: string;
}

export class SaleWebsiteFilterModel {
    id_quan_huyen: number[];
}

export class InformWebsiteModel {
    id_website_ban_hang: number;
    mst: string;
    to_chu_ca_nhan: string;
    dia_diem: string;
    nguoi_dai_dien: string;
    dien_thoai: string;
    ten_mien: string;
    ma_so_nganh_nghe: string;
    san_pham_ban_website: string;
    ghi_chu: string;
}

export class regisWebsiteModel {
    id: number;
    mst_quyet_dinh: string;
    to_chu_ca_nhan: string;
    dia_diem: string;
    nguoi_dai_dien: string;
    dien_thoai: string;
    ten_mien: string;
    san_pham_tren_website: string;
    email: string;
    so_gian_hang: string;
    ghi_chu: string;
    id_quan_huyen: number;
}
