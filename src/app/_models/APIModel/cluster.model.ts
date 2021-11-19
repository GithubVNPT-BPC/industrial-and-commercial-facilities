export class ClusterModel {
    id: number;
    ten_cum: string;
    dien_tich_theo_qh: number;
    dien_tich_da_thanh_lap: number;
    dien_tich_qhct: number;
    chu_dau_tu: string;
    id_phuong_xa: number;
    id_quan_huyen: number;
    lien_ket: string;
    id_htdtht: number;
    id_htdthtxlnt: number;
    time_id: number;
    nhu_cau_von: string;
    dien_tich_ddtht: number;
    hien_trang_dau_tu_ha_tang: string;
    hien_trang_dau_tu_he_thong_xu_ly_nuoc_thai: string;

    thoi_gian_chinh_sua_cuoi: Date
}

export class ClusterFilterModel {
    id_quan_huyen: number[];
    id_htdtht: number[];
    id_htdthtxlnt: number[];
}

export class ClusterBusiness {
    public id_dn: string;
    public id: string;
    public id_ccn: number;
    public mst: string;
    public ten_doanh_nghiep: string;
    public dia_chi: string;
    public so_dien_thoai: string;
    public nganh_nghe_kd_chinh: string;
    public cong_suat: number
}

export class PostClusterBusiness {
    public id: string;
    public id_ccn: number;
    public mst: string;
}