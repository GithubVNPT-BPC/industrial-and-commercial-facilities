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
export class ImportExportValueModel{
    public tong_san_luong: number = 0;
    public tong_tri_gia: number = 0;
}
export class CompanyDetailModel {
    public id: number;
    public ten_doanh_nghiep: string;

    public id_nganh_nghe: string;
    public ten_nganh_nghe: string;
    public dia_chi: string;
    public dia_chi_day_du: string;
    public nganh_nghe_kem_ma: string;

    public id_phuong_xa: number;
    public id_quan_huyen: number;
    public ten_quan_huyen: string;
    public nganh_nghe_kd: string;
    public nguoi_dai_dien: string;
    public dien_thoai: string;
    public mst: string;
    public so_giay_cndkkd: string;
    public ngay_cap_gcndkkd: Date;
    public so_gpgcn : string;
    public ngay_cap : Date;
    public ngay_het_han : Date;

    public id_loai_hinh: number;
    public loai_hinh_doanh_nghiep: string;
    public von_kinh_doanh: number;
    public ngay_bat_dau_kd: Date;
    public email: string;
    public so_lao_dong: number;
    public cong_suat_thiet_ke: number;
    public san_luong: number;
    public tieu_chuan_san_pham: string;

    public id_danh_sach_co_so_truc_thuoc: number;
    public doanh_thu: number;
    public quy_mo_tai_san: number;
    public loi_nhuan: number;
    public nhu_cau_ban: string;
    public nhu_cau_mua: string;
    public nhu_cau_hop_tac: string;
    public email_sct: string;
    public so_lao_dong_sct: number;
    public cong_suat_thiet_ke_sct: number;
    public san_luong_sct: number;
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

