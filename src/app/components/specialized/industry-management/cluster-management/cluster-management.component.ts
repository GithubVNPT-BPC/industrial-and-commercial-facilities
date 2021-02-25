import { Component, OnInit, ViewChild, ElementRef, Injector } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material';
import { element } from 'protractor';
import { ReportService } from 'src/app/_services/APIService/report.service';
import { SCTService } from 'src/app/_services/APIService/sct.service';
import { MatAccordion } from '@angular/material/expansion';
import { MatPaginator } from '@angular/material/paginator';
import { District } from 'src/app/_models/district.model';
import { ClusterFilterModel, ClusterModel } from 'src/app/_models/APIModel/cluster.model';
import { each } from 'highcharts';
import { Router } from '@angular/router';
import { LinkModel } from 'src/app/_models/link.model';
import { BreadCrumService } from 'src/app/_services/injectable-service/breadcrums.service';
import { ExcelService } from 'src/app/_services/excelUtil.service';
import { BaseComponent } from '../../specialized-base.component';
import { FormControl } from '@angular/forms';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { IndustryManagementService } from 'src/app/_services/APIService/industry-management.service';


@Component({
    selector: 'cluster-management',
    templateUrl: './cluster-management.component.html',
    styleUrls: ['/../../special_layout.scss'],
})

export class ClusterManagementComponent extends BaseComponent {
    
    showColumns: string[] = [];
    showSubColumns: string[] = [];
    subColumns: string[] = ['dien_tich_da_dang_dau_tu', 'ten_hien_trang_ha_tang', 'ten_hien_trang_xlnt', 'tong_von_dau_tu'];
    topColumns: string[] = ['index', 'ten_cum_cn', 'dien_tich_qh', 'chu_dau_tu', 'dien_tich_qhct'];
    totalColumns: string[] = ['index', 'ten_cum_cn', 'dien_tich_qh', 'dien_tich_tl', 'chu_dau_tu', 'dien_tich_qhct', 'dien_tich_da_dang_dau_tu', 'ten_hien_trang_ha_tang', 'ten_hien_trang_xlnt', 'tong_von_dau_tu'];
    dataSource: MatTableDataSource<ClusterModel> = new MatTableDataSource<ClusterModel>();
    filteredDataSource: MatTableDataSource<ClusterModel> = new MatTableDataSource<ClusterModel>();
    years: number[] = [];
    // districts: District[] = [{ id: 1, ten_quan_huyen: 'Thị xã Phước Long' },
    // { id: 2, ten_quan_huyen: 'Thành phố Đồng Xoài' },
    // { id: 3, ten_quan_huyen: 'Thị xã Bình Long' },
    // { id: 4, ten_quan_huyen: 'Huyện Bù Gia Mập' },
    // { id: 5, ten_quan_huyen: 'Huyện Lộc Ninh' },
    // { id: 6, ten_quan_huyen: 'Huyện Bù Đốp' },
    // { id: 7, ten_quan_huyen: 'Huyện Hớn Quản' },
    // { id: 8, ten_quan_huyen: 'Huyện Đồng Phú' },
    // { id: 9, ten_quan_huyen: 'Huyện Bù Đăng' },
    // { id: 10, ten_quan_huyen: 'Huyện Chơn Thành' },
    // { id: 11, ten_quan_huyen: 'Huyện Phú Riềng' }];

    hienTrangHaTang: any[] = [{ id: 1, ten_hien_trang_ha_tang: 'Đang hoạt động' },
    { id: 2, ten_hien_trang_ha_tang: 'Có quy hoạch chi tiết' },
    { id: 3, ten_hien_trang_ha_tang: 'Có Giấy phép xây dựng' },
    { id: 4, ten_hien_trang_ha_tang: 'Đang xây dựng' },
    { id: 5, ten_hien_trang_ha_tang: 'Có Quyết định thành lập' }];

    hienTrangXLNT: any[] = [{ id: 1, ten_hien_trang_xlnt: 'Chưa có' },
    { id: 2, ten_hien_trang_xlnt: 'Có' },
    { id: 3, ten_hien_trang_xlnt: 'Đang xây dựng' }];

    isChecked: boolean = false;
    sanLuongSanXuat: number = 0;
    sanLuongKinhDoanh: number = 0;
    filterModel: ClusterFilterModel = { id_htdtht: [], id_htdthtxlnt: [], id_quan_huyen: [] };

    @ViewChild(MatAccordion, { static: false }) accordion: MatAccordion;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild('TABLE', { static: false }) table: ElementRef;

    ExportTOExcel(filename: string, sheetname: string) {
        this.excelService.exportDomTableAsExcelFile(filename, sheetname, this.table.nativeElement);
    }

    constructor(
        public excelService: ExcelService,
        public indService: IndustryManagementService,
        public router: Router,
        private injector: Injector
    ) {
        super(injector)
    }

    ngOnInit() {
        super.ngOnInit();
        this.showColumns = this.topColumns;
        this.showSubColumns = [];
        this.years = this.getYears();
        this.getDanhSachQuanLyCumCongNghiep();
        this.autoOpen();
        this.initWards();
    }
    
    getLinkDefault(){
        this.LINK_DEFAULT = "/specialized/industry-management/cluster";
        this.TITLE_DEFAULT = "Công nghiệp - Tổng quan cụm công nghiệp";
        this.TEXT_DEFAULT = "Công nghiệp - Tổng quan cụm công nghiệp";
    }

    applyFilter() {
        let filteredData = this.filterArray(this.dataSource.data, this.filterModel);
        if (!filteredData.length) {
            if (this.filterModel)
                this.filteredDataSource.data = [];
            else
                this.filteredDataSource.data = this.dataSource.data;
        }
        else {
            this.filteredDataSource.data = filteredData;
        }
    }

    // ngAfterViewInit(): void {
    //     this.accordion.openAll();
    // }

    autoOpen() {
        setTimeout(() => this.accordion.openAll(), 1000);
    }

    getDanhSachQuanLyCumCongNghiep() {
        this.indService.GetDanhSachQuanLyCumCongNghiep().subscribe(result => {
            // result.data.sort((a, b) => b.chu_dau_tu.localeCompare(a.chu_dau_tu));
            this.dataSource = new MatTableDataSource<ClusterModel>(result.data[0]);
            this.filteredDataSource.data = [...this.dataSource.data];
            // this.sanLuongKinhDoanh = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => parseInt(x.san_luong)||0).reduce((a, b) => a + b) : 0;
            // this.sanLuongSanXuat = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => parseInt(x.cong_suat)||0).reduce((a, b) => a + b) : 0;
            // this.filteredDataSource.paginator = this.paginator;
            // this.paginator._intl.itemsPerPageLabel = 'Số cụm công nghiệp đang hiển thị';
            // this.paginator._intl.firstPageLabel = "Trang Đầu";
            // this.paginator._intl.lastPageLabel = "Trang Cuối";
            // this.paginator._intl.previousPageLabel = "Trang Trước";
            // this.paginator._intl.nextPageLabel = "Trang Tiếp";
        })
    }

    log(any) {
    }

    getYears() {
        return Array(5).fill(1).map((element, index) => new Date().getFullYear() - index);
    }

    changeTable(event) {
        this.isChecked = event.checked;
        if (this.isChecked) {
            this.showColumns = this.totalColumns;
            this.showSubColumns = this.subColumns;
        }
        else {
            this.showColumns = this.topColumns;
            this.showSubColumns = [];
        }
    }

    public openDetailCluster(id: string) {
        let url = this.router.serializeUrl(
            this.router.createUrlTree([encodeURI('#') + '/specialized/industry-management/cluster/' + id]));
        window.open(url.replace('%23', '#'), "_blank");
    }

    // applyDistrictFilter(event) {
    //     let filteredData = [];

    //     event.value.forEach(element => {
    //         this.dataSource.data.filter(x => x.id_quan_huyen == element).forEach(x => filteredData.push(x));
    //     });

    //     if (!filteredData.length) {
    //         if (event.value.length)
    //             this.filteredDataSource.data = [];
    //         else
    //             this.filteredDataSource.data = this.dataSource.data;
    //     }
    //     else {
    //         this.filteredDataSource.data = filteredData;
    //     }
    //     // this.sanLuongKinhDoanh = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => parseInt(x.san_luong) || 0).reduce((a, b) => a + b) : 0;
    //     // this.sanLuongSanXuat = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => parseInt(x.cong_suat)||0).reduce((a, b) => a + b) : 0;
    // }

    filterArray(array, filters) {
        const filterKeys = Object.keys(filters);
        let temp = [...array];
        filterKeys.forEach(key => {
            let temp2 = [];
            if (filters[key].length) {
                filters[key].forEach(criteria => {
                    temp2 = temp2.concat(temp.filter(x => x[key] == criteria));
                });
                temp = [...temp2];
            }
        })
        return temp;
    }
    @ViewChild('autosize', {static: false}) autosize: CdkTextareaAutosize;
    getFormParams(){
        return{
            ten_cum: new FormControl(''),
            chu_dau_tu: new FormControl(''),
            dien_tich_theo_qh: new FormControl(0),
            dien_tich_da_thanh_lap: new FormControl(0),
            dia_chi: new FormControl(''),
            id_phuong_xa: new FormControl(),
            quyet_dinh_thanh_lap: new FormControl(''),
            quyet_dinh_quy_hoach_chi_tiet: new FormControl(''),
            quyet_dinh_danh_gia_dtm: new FormControl(''),
            dieu_kien_kinh_doanh: new FormControl(''),
            vi_tri_quy_mo: new FormControl(''),
            tong_muc_dau_tu: new FormControl(0),
            quy_mo_dien_tich: new FormControl(0),
            dien_giai: new FormControl(''),
            duong_dan: new FormControl(''),
            dien_tich_qhct: new FormControl(0),
            dien_tich_ddtht: new FormControl(0),
            id_htdtht: new FormControl(),
            id_htdthtxlnt: new FormControl(),
            id_trang_thai_hoat_dong: new FormControl(),
            nhu_cau_von: new FormControl(0),
        }
    }

    trang_thai_hd: any[] = [
        { id_trang_thai_hoat_dong: 1, ten_trang_thai_hoat_dong: 'Đã thành lập' },
        { id_trang_thai_hoat_dong: 2, ten_trang_thai_hoat_dong: 'Đã quy hoạch' },
        { id_trang_thai_hoat_dong: 2, ten_trang_thai_hoat_dong: 'chưa có nhà đầu tư' },
    ];

    public prepareData(data) { 
        return data 
    }

    public callService(data) {
        // console.log(data);
        this.indService.GetDanhSachQuanLyCumCongNghiep().subscribe(res => {
            // result.data.sort((a, b) => b.chu_dau_tu.localeCompare(a.chu_dau_tu));
            this.successNotify(res);
            this.autopaging();
        })
    }
}