export class ReportOject {
    //To declare
    obj_id: number;
    obj_code: string;
    obj_name: string;
    start_date: string;
    end_date: string;
    assign_org: number;
    create_date: Date;
    create_user: string;
    grant_type: number;
    id: number;
    input_fr: Date;
    input_to: Date;
    obj_type: number;
    org_id: number;
    parent_id: number;
    period_id: number;
    state_id: number;
    status: number;
    submit_type: number;
    time_id: string;
    tpl_path: number;
    update_date: Date;
    update_user: string;
    org_name: string;
    status_name: string;
    submit_type_name: string;
    time_id_text: string;
}

export class ReportIndicator {
    //To declare
    ind_id: number;
    ind_code: string;
    ind_name: string;
    ind_type: number;
    ind_unit: string;
    parent_id: number;
    formula: string;
    obj_id: number;
    ind_index: string;
}

export class ReportAttribute {
    //To declare
    attr_id: number;
    attr_code: string;
    attr_name: string;
    attr_type: number;
    attr_type_name: string;
    parent_id: number;
    formula: string;
    min_col_width: number;
    max_col_width: number;
    short_name: string;
    fld_code: string;
    is_default: number;
    is_hidden: number;
    obj_id: number;
    cell: any = (element: any, name: string) => `${element[name]}`;
}

export class ReportDatarow {
    //To declare
    ind_id: number;
    ind_name: string;
    ind_type: number;
    ind_unit: string;
    ind_parent_id: number;
    ind_formula: string;
    fd01: Date;
    fd02: Date;
    fd03: Date;
    fd04: Date;
    fd05: Date;
    fn01: number;
    fn02: number;
    fn03: number;
    fn04: number;
    fn05: number;
    fn06: number;
    fn07: number;
    fn08: number;
    fn09: number;
    fn10: number;
    fn11: number;
    fn12: number;
    fn13: number;
    fn14: number;
    fn15: number;
    fn16: number;
    fn17: number;
    fn18: number;
    fn19: number;
    fn20: number;
    fn21: number;
    fn22: number;
    fn23: number;
    fn24: number;
    fn25: number;
    fn26: number;
    fn27: number;
    fn28: number;
    fn29: number;
    fn30: number;
    fn31: number;
    fn32: number;
    fn33: number;
    fn34: number;
    fn35: number;
    fn36: number;
    fn37: number;
    fn38: number;
    fn39: number;
    fn40: number;
    fc01: string;
    fc02: string;
    fc03: string;
    fc04: string;
    fc05: string;
    fc06: string;
    fc07: string;
    fc08: string;
    fc09: string;
    fc10: string;
    fc11: string;
    fc12: string;
    fc13: string;
    fc14: string;
    fc15: string;
    fc16: string;
    fc17: string;
    fc18: string;
    fc19: string;
    fc20: string;
    fc21: string;
    fc22: string;
    fc23: string;
    fc24: string;
    fc25: string;
    parent_id: number;
}

export class ReportColumn {
    attr_id: number;
    attr_code: string;
    attr_name: string;
    attr_type: number;
    fld_code: string;
    parent_id: number;
    formula: string;
}

export class ReportTable {
    ind_id: number;
    ind_name: string;
    ind_type: number;
    ind_unit: string;
    ind_parent_id: number;
    ind_formula: string;
    ind_index: string;
    fd01: Date;
    fd02: Date;
    fd03: Date;
    fd04: Date;
    fd05: Date;
    fn01: number;
    fn02: number;
    fn03: number;
    fn04: number;
    fn05: number;
    fn06: number;
    fn07: number;
    fn08: number;
    fn09: number;
    fn10: number;
    fn11: number;
    fn12: number;
    fn13: number;
    fn14: number;
    fn15: number;
    fn16: number;
    fn17: number;
    fn18: number;
    fn19: number;
    fn20: number;
    fn21: number;
    fn22: number;
    fn23: number;
    fn24: number;
    fn25: number;
    fn26: number;
    fn27: number;
    fn28: number;
    fn29: number;
    fn30: number;
    fn31: number;
    fn32: number;
    fn33: number;
    fn34: number;
    fn35: number;
    fn36: number;
    fn37: number;
    fn38: number;
    fn39: number;
    fn40: number;
    fc01: string;
    fc02: string;
    fc03: string;
    fc04: string;
    fc05: string;
    fc06: string;
    fc07: string;
    fc08: string;
    fc09: string;
    fc10: string;
    fc11: string;
    fc12: string;
    fc13: string;
    fc14: string;
    fc15: string;
    fc16: string;
    fc17: string;
    fc18: string;
    fc19: string;
    fc20: string;
    fc21: string;
    fc22: string;
    fc23: string;
    fc24: string;
    fc25: string;
}

export class HeaderMerge {
    colDefault: number = 0;
    colName: string = "";
    colText: string = "";
    colLenght: number = 0;
}
export class ToltalHeaderMerge {
    headerMerge: HeaderMerge[] = [];
    headerColName: Array<string> = [];
}

export class SummaryReportModel {
    ma_chi_tieu: string;
    ten_chi_tieu: string;
    don_vi_tinh: string;
    thuc_hien_cung_ki_nam_truoc: number;
    luy_ke_cung_ki_nam_truoc: number;
    thuc_hien_thang_12_nam_truoc: number;
    ke_hoach_nam: number;
    thuc_hien_ki_truoc: number;
    thuc_hien_thang: number;
    luy_ke_thang: number;
    ke_hoach_nam_sau: number;
    so_sanh_thuc_hien_voi_ki_truoc: number;
    so_sanh_thuc_hien_voi_cung_ki: number;
    so_sanh_luy_ke_voi_cung_ki: number;
    so_sanh_luy_ke_voi_ke_hoach_nam: number;
}

export class AnnualEcommerceReportModel {
    id: number;
    ten_chi_tieu: string;
    ma_so: string;
    tong_so: number;
    nha_nuoc: number;
    ngoai_nha_nuoc: number;
    von_dau_tu_nuoc_ngoai: number;
    khu_vuc_khac: number;
    time_id: number;
}

export class bcskhdt_thang {
    idx: string;
    indicator: string;
    indicatorname: string;
    indunit: string;
    th_nam_truoc: string;
    kh_nam: string;
    th_thang_truoc: string;
    gc_th_thang_truoc: string;
    th_thang: string;
    gc_th_thang: string;
    luy_ke: string;
    ck_th_thang: string;
    ck_gc_th_thang: string;
    ck_luy_ke: string;
    ss_th_thang_sck: string;
    ss_th_thang_skh: string;
    ss_luy_ke_sck: string;
    ss_luy_ke_skh: string;
}
