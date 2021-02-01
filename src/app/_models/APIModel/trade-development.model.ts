export class TFE {
    Ten_doanh_nghiep: string;
    Dia_chi: string;
    Ma_so_thue: string;
    Ten_Hoi_cho: string;
    Thoi_gian_to_chuc: string;
    Dia_diem_to_chuc: string;
    Ke_hoach: string;
    So_luong_gian_hang_du_kien: string;
    San_pham_ban_tai_hoi_cho: string;
    So_Van_ban: string;
    Co_quan_ban_hanh: string;
    Ngay_thang_nam: string;
    Id_quan_huyen : number;
}

export class TFEFilterModel{
    Id_Quan_huyen : number[]=[];
}

export class SD {
    Ten_doanh_nghiep: string;
    Dia_chi: string;
    Ma_so_thue: string;
    Ten_chuong_trinh_KM: string;
    Thoi_gian_KM: string;
    Hang_hoa_dung_de_KM: string;
    Dia_diem_KM: string;
    Hinh_thuc_KM: string;
    So_Van_ban: string;
    Co_quan_ban_hanh: string;
    Ngay_thang_nam: string;
    Id_quan_huyen : number;
}
export class SDFilterModel{
    Id_quan_huyen : number[]=[];
    Hinh_thuc_KM : string[] = [];
}
