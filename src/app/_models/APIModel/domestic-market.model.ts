export class DomesticMarketModel {
    public id_san_pham: number = 0;
    public gia_tri: number = null;
    public id: number = null;
    public nguon_so_lieu: string = "";
    public thoi_gian_cap_nhat: string = "";
    public ma_nguoi_cap_nhat: number = null;
    public ten_san_pham: string = "";
};

export class DomesticPriceModel {
    public id_san_pham: number = 0;
    public gia_tri: number = null;
    public id: number = null;
    public nguon_so_lieu: string = "";
    public ngay_cap_nhat: string = "";
    public ma_nguoi_cap_nhat: number = null;
    public ten_san_pham: string = "";
};

export class ForeignMarketModel {
    public id_san_pham: number = 0;
    public gia_tri: number = null;
    public id: number = null;
    public nguon_so_lieu: string = "";
    public ngay_cap_nhat: string = "";
    public ma_nguoi_cap_nhat: number = null;
    public ten_san_pham: string = "";
    public gia: number = null;
    public id_quoc_gia: number = null;
    public create_user: string = '';
    public thi_truong: string = '';
};

export class ExportMarketModel {
    public id: number = 0;
    public ten_san_pham: string = "";
    public id_san_pham: number = 0;
    public san_luong: number = null;
    public tri_gia: number = null;
    public san_luong_ct: number = null;
    public tri_gia_ct: number = null;
    public thang: number = null;
    public nam: number = null;
    public don_vi_tinh: string = "";
}

export class ImportMarketModel {
    public id: number = 0;
    public ten_san_pham: string = "";
    public id_san_pham: number = 0;
    public san_luong: number = null;
    public tri_gia: number = null;
    public san_luong_ct: number = null;
    public tri_gia_ct: number = null;
    public thang: number = null;
    public nam: number = null;
    public don_vi_tinh: string = "";
}

export class ProductValueModel {
    public id_san_pham: number = null;
    public san_luong: number = null;
    public id: number = 0;
    public tri_gia: number = null;
    public thang: number = null;
    public nam: number = null;
    public ten_san_pham: string = "";
    public don_vi_tinh: string = "";
}

export class TopExportModel {
    public id: number = 0;
    public ma_doanh_nghiep: number = null;
    public thang: number = null;
    public nam: number = null;
    public ngay_cap_nhat: string = "";
    public ma_nguoi_cap_nhat: string = "";
    public ten_doanh_nghiep: string = "";
    public dia_chi: string = "";
    public dien_thoai: string = "";
}

export class TopImportModel {
    public id: number = 0;
    public ma_doanh_nghiep: number = null;
    public thang: number = null;
    public nam: number = null;
    public ngay_cap_nhat: string = "";
    public ma_nguoi_cap_nhat: string = "";
    public ten_doanh_nghiep: string = "";
    public dia_chi: string = "";
    public dien_thoai: string = "";
}

export class TopProductModel {
    public id: number = 0;
    public ma_doanh_nghiep: number = null;
    public thang: number = null;
    public nam: number = null;
    public ngay_cap_nhat: string = "";
    public ma_nguoi_cap_nhat: string = "";
    public ten_doanh_nghiep: string = "";
    public dia_chi: string = "";
    public dien_thoai: string = "";
    public cong_xuat: string = "";
    public don_vi_tinh: string = "";
}

export class ProductModel {
    public ma_san_pham: number = null;
    public ten_san_pham: string = "";
    public stt: number = null;
}
export class ImportExportValueModel {
    public tong_san_luong: number = 0;
    public tong_tri_gia: number = 0;
}
export class CompanyDetailModel {
    public id: number;
    public id_loai_hinh_hoat_dong: number;
    public ten_loai_hinh_hoat_dong: string;
    public mst: string;
    public mst_cha: string;
    public sct: boolean;
    public hoat_dong: boolean;
    public dia_chi: string;
    public id_phuong_xa: number;
    public id_quan_huyen: number;
    public dia_chi_day_du: string;
    public nguoi_dai_dien: string;
    public so_dien_thoai: string;
    public ten_doanh_nghiep: String;
}

export class CareerModel {
    id: number;
    ma_nganh_nghe: string;
    ten_nganh_nghe: string;
    ten_kem_ma: string;
}

export class DistrictModel {
    id: number;
    ten_quan_huyen: string;
}

export class SubDistrictModel {
    id: number;
    ten_phuong_xa: string;
    id_quan_huyen: number;
}

export class BusinessTypeModel {
    id: number;
    ten_loai_hinh: string;
}

export class CSTTModel {
    id: number;
    so_gpgcn: number;
    ngay_cap: Date;
    ngay_het_han: Date;
    id_dscstt: string;
}

export class TopBusinessModel {
    public cong_suat_thiet_ke: number;
    public mst: string;
}

