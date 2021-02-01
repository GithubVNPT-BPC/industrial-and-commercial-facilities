export class DomesticManagerModel {
    public id_san_pham: number = 0;
    public gia_ca: any;
    public nguon_so_lieu: string = "";
    public ngay_cap_nhat: string = "";
    // public ma_nguoi_cap_nhat?: number = null;
    public ten_san_pham?: string = "";
    public id?: number;
    public don_vi_tinh?: string;
}

export class ExportManagerModel {
    public id: number = 0;
    public id_san_pham: number = null;
    public ten_san_pham: string = '';
    public san_luong: number = null;
    public tri_gia: number = null;
    public don_vi_tinh: string = '';
    public thang: number;
    public nam: number;
    public san_luong_ct: number = null;
    public tri_gia_ct: number = null;
}

export class ImportManagerModel {
    public id: number = 0;
    public id_san_pham: number = null;
    public ten_san_pham: string = '';
    public san_luong: number = null;
    public tri_gia: number = null;
    public don_vi_tinh: string = '';
    public thang: number;
    public nam: number;
    public san_luong_ct: number = null;
    public tri_gia_ct: number = null;
}
export class ProductManagerModel {
    public id: number = 0;
    public id_san_pham: number = null;
    public ten_san_pham: string = '';
    public san_luong: number = null;
    public tri_gia: number = null;
    public don_vi_tinh: string = '';
    public thang: number = null;
    public nam: number = null;
}

export class TopPartner {
    public id_doanh_nghiep: number = 0;
    public ten_doanh_nghiep: number = null;
    public cong_suat: number = null;
}

export class ProductManagerModelList {
    public id_san_pham: number;
    public ten_san_pham: string;
    public stt: number;
}

export class ForeignManagerModel {
    public id_san_pham: number = 0;
    public ten_san_pham: string = '';
    public ngay_cap_nhat: string = '';
    public gia: number = null;
    public nguon_so_lieu: string = '';
    public thi_truong: string = '';
    public create_user: string = '';
}

export class NationModel {
    public id: number;
    public ten_tieng_anh: string;
    public ten_tieng_viet: string;
}

export class ShortCompanyModel {
    public id: number;
    public ten_doanh_nghiep: string;
    public dia_chi_day_du: string;
    public dien_thoai: string;
}

export enum MODE{
    INSERT = 1,
    UPDATE = 2,
    DELETE = 3,
    VIEW = 4
}