export class ClusterModel{
    id : number;
    ten_cum_cn : string;
    dien_tich_qh : number;
    dien_tich_tl : number;
    dien_tich_qhct : number;
    chu_dau_tu : string;
    id_phuong_xa : number;
    id_quan_huyen : number;
    lien_ket : string;
    id_hien_trang_ht : number;
    id_hien_trang_xlnt : number;
    time_id : number;
    tong_von_dau_tu : string;
    dien_tich_da_dang_dau_tu : number;
    ten_hien_trang_ha_tang : string;
    ten_hien_trang_xlnt : string;
}

export class ClusterFilterModel{
    id_quan_huyen : number[];
    id_hien_trang_ht : number[];
    id_hien_trang_xlnt : number[];
}