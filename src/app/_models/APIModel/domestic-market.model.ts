//mat-select model
export class ProductModel {
    public id_san_pham: number;
    public ten_san_pham: string;
    public don_vi_tinh: string;
    public xnk: number;
}

export class CareerModel {
    id_nganh_nghe_kinh_doanh: number;
    ma_nganh_nghe: string;
    ten_nganh_nghe: string;
    ten_kem_ma: string;
    combine: string;
}

export class DistrictModel {
    id: number;
    ten_quan_huyen: string;
}

export class SubDistrictModel {
    id_phuong_xa: number;
    ten_phuong_xa: string;
    id_quan_huyen: number;
}

export class DistrictWardModel {
    id_phuong_xa: number;
    ten_phuong_xa: string;
    id_quan_huyen: number;
    ten_quan_huyen: string;
}

export class BusinessTypeModel {
    id_loai_hinh_hoat_dong: number;
    ten_loai_hinh: string;
}

export class FieldModel {
    id_linh_vuc: number;
    ten_linh_vuc: string;
}

export class filter {
    public filed_name: string;
    public detail_name: string;
}
//mat-select model

export class DomesticPriceModel {
    public id: string;
    public id_san_pham: number;
    public gia_ca: number;
    public nguon_so_lieu: string;
    public ngay_cap_nhat: string;
    public ten_san_pham: string;
    public don_vi_tinh1: string;
};

export class ForeignMarketModel {
    public id: string;
    public id_san_pham: number;
    public gia_ca: number;
    public nguon_so_lieu: string;
    public ngay_cap_nhat: string;
    public thi_truong: string;
    public ten_san_pham: string;
    public don_vi_tinh: string;
};

export class ExportMarketModel {
    public id: string;
    public san_luong_thang: number;
    public tri_gia_thang: number;
    public san_luong_thang_tc: number;
    public tri_gia_thang_tc: number;
    public id_san_pham: number;
    public ten_san_pham: string;
    public don_vi_tinh2: string;
    public time_id: string;
}

export class ImportMarketModel {
    public id: string;
    public san_luong_thang: number;
    public tri_gia_thang: number;
    public san_luong_thang_tc: number;
    public tri_gia_thang_tc: number;
    public id_san_pham: number;
    public ten_san_pham: string;
    public don_vi_tinh2: string;
    public time_id: string;
}

export class ProductValueModel {
    public id: string;
    public id_san_pham: number;
    public san_luong: number;
    public tri_gia: number;
    public time_id: string;
    public ten_san_pham: string;
    public don_vi_tinh2: string;
}

export class TopCompanyModel {
    public id: string;
    public id_san_pham: number;
    public mst: string;
    public cong_suat: number;
    public time_id: string;
    public ten_doanh_nghiep: string;
    public dia_chi: string;
    public so_dien_thoai: string;
}

export class PostTopProduct {
    public id: string;
    public id_san_pham: number;
    public mst: string;
    public cong_suat: number;
    public time_id: string;
}

export class CompanyDetailModel {
    public id: number;
    public ten_doanh_nghiep: String;
    public mst: string;
    public mst_cha: string;
    public ten_loai_hinh_hoat_dong: string;
    public nguoi_dai_dien: string;
    public dia_chi_day_du: string;
    public so_dien_thoai: string;
    public email: string;
    public email_sct: string;
    public ngay_bd_kd: string;
    public von_dieu_le: number;
    public quy_mo_tai_san: string;
    public doanh_thu: string;
    public loi_nhuan: string;
    public cong_suat_thiet_ke: number;
    public cong_suat_thiet_ke_sct: number;
    public so_lao_dong: number;
    public so_lao_dong_sct: number;
    public san_luong: number;
    public san_luong_sct: number;
    public nhu_cau_ban: string;
    public nhu_cau_mua: string;
    public nhu_cau_hop_tac: string;
    public tieu_chuan_san_pham: string;
    public hoat_dong: boolean;
    public dia_chi: string;
    public id_phuong_xa: number;
    public id_quan_huyen: string;
    public sct: boolean;
    public id_loai_hinh_hoat_dong: number;

    public id_nganh_nghe: string;
    public id_nganh_nghe_kd: string;
    public nganh_nghe_kd_chinh: string;
    public id_linh_vuc: number;
    public ma_nganh_nghe: string;
    public ten_nganh_nghe: string

    public so_giay_phep: string;
    public ngay_cap: string;
    public ngay_het_han: string;
    public id_loai_giay_phep: number;
    public noi_cap: string;
    public co_quan_cap: string;
    public ghi_chu: string;
    public ten_giay_phep: string;
}

export class CompanyPost {
    public mst: string;
    public id_loai_hinh_hoat_dong: number;
    public mst_parent: string;
    public sct: boolean;
    public hoat_dong: boolean;
    public dia_chi: string;
    public id_phuong_xa: number;
    public nguoi_dai_dien: string;
    public so_dien_thoai: string;
    public ten_doanh_nghiep: string;
    public von_dieu_le: number;

    public ngay_bd_kd: string;
    public so_lao_dong: number;
    public cong_suat_thiet_ke: number;
    public san_luong: number;
    public email: string;
    public so_lao_dong_sct: number;
    public cong_suat_thiet_ke_sct: number;
    public san_luong_sct: number;
    public email_sct: string;
    public tieu_chuan_san_pham: string;
    public doanh_thu: string;
    public quy_mo_tai_san: string;
    public loi_nhuan: string;
    public nhu_cau_ban: string;
    public nhu_cau_mua: string;
    public nhu_cau_hop_tac: string;
    public danh_sach_nganh_nghe: Array<Career>;
}

export class Career {
    id: string;
    ma_nganh_nghe: string;
    id_nganh_nghe_kinh_doanh: string;
    nganh_nghe_kd_chinh: string;
    id_linh_vuc: number
}

export class DeleteModel {
    mst: string;
}

export class DeleteModel1 {
    id: string
}

export class productchart {
    san_luong: number;
    tri_gia: number;
    time_id: number
}

export class exportimportchart {
    tri_gia_thang: number;
    tri_gia_cong_don: number;
    time_id: number;
}

export class domesticchart {
    gia_ca: number;
    ngay_cap_nhat: string;
}

export class foreignchart {
    gia_ca: number;
    ngay_cap_nhat: string;
}
