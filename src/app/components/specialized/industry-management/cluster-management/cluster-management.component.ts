import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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
import * as XLSX from 'xlsx';

@Component({
    selector: 'cluster-management',
    templateUrl: './cluster-management.component.html',
    styleUrls: ['/../../special_layout.scss'],
})

export class ClusterManagementComponent implements OnInit {
    //Constant
    private readonly LINK_DEFAULT: string = "/specialized/industry-management/cluster";
    private readonly TITLE_DEFAULT: string = "Tổng quan cụm công nghiệp";
    private readonly TEXT_DEFAULT: string = "Tổng quan cụm công nghiệp";
    //Variable for only ts
    private _linkOutput: LinkModel = new LinkModel();
    showColumns: string[] = [];
    showSubColumns: string[] = [];
    subColumns: string[] = ['dien_tich_da_dang_dau_tu', 'ten_hien_trang_ha_tang', 'ten_hien_trang_xlnt', 'tong_von_dau_tu'];
    topColumns: string[] = ['index', 'ten_cum_cn', 'dien_tich_qh', 'chu_dau_tu', 'dien_tich_qhct'];
    totalColumns: string[] = ['index', 'ten_cum_cn', 'dien_tich_qh', 'dien_tich_tl', 'chu_dau_tu', 'dien_tich_qhct', 'dien_tich_da_dang_dau_tu', 'ten_hien_trang_ha_tang', 'ten_hien_trang_xlnt', 'tong_von_dau_tu'];
    dataSource: MatTableDataSource<ClusterModel> = new MatTableDataSource<ClusterModel>();
    filteredDataSource: MatTableDataSource<ClusterModel> = new MatTableDataSource<ClusterModel>();
    years: number[] = [];
    districts: District[] = [{ id: 1, ten_quan_huyen: 'Thị xã Phước Long' },
    { id: 2, ten_quan_huyen: 'Thành phố Đồng Xoài' },
    { id: 3, ten_quan_huyen: 'Thị xã Bình Long' },
    { id: 4, ten_quan_huyen: 'Huyện Bù Gia Mập' },
    { id: 5, ten_quan_huyen: 'Huyện Lộc Ninh' },
    { id: 6, ten_quan_huyen: 'Huyện Bù Đốp' },
    { id: 7, ten_quan_huyen: 'Huyện Hớn Quản' },
    { id: 8, ten_quan_huyen: 'Huyện Đồng Phú' },
    { id: 9, ten_quan_huyen: 'Huyện Bù Đăng' },
    { id: 10, ten_quan_huyen: 'Huyện Chơn Thành' },
    { id: 11, ten_quan_huyen: 'Huyện Phú Riềng' }];

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
    filterModel: ClusterFilterModel = { id_hien_trang_ht: [], id_hien_trang_xlnt: [], id_quan_huyen: [] };

    @ViewChild(MatAccordion, { static: false }) accordion: MatAccordion;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild('TABLE', { static: false }) table: ElementRef;

    exportExcel() {
        const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table.nativeElement);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Cụm công nghiệp');

        XLSX.writeFile(wb, 'Cụm công nghiệp.xlsx');

    }

    constructor(
        public sctService: SCTService,
        public router: Router,
        private _breadCrumService: BreadCrumService,
    ) { }

    ngOnInit() {
        this.showColumns = this.topColumns;
        this.showSubColumns = [];
        this.years = this.getYears();
        this.getDanhSachQuanLyCumCongNghiep(2020);
        this.autoOpen();
        this.sendLinkToNext(true);
    }
    public sendLinkToNext(type: boolean) {
        this._linkOutput.link = this.LINK_DEFAULT;
        this._linkOutput.title = this.TITLE_DEFAULT;
        this._linkOutput.text = this.TEXT_DEFAULT;
        this._linkOutput.type = type;
        this._breadCrumService.sendLink(this._linkOutput);
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

    getDanhSachQuanLyCumCongNghiep(time_id: number) {
        this.sctService.GetDanhSachQuanLyCumCongNghiep(time_id).subscribe(result => {
            result.data.sort((a, b) => b.chu_dau_tu.localeCompare(a.chu_dau_tu));
            console.log("result.data:", result.data);
            this.dataSource = new MatTableDataSource<ClusterModel>(result.data);


            this.filteredDataSource.data = [...this.dataSource.data];
            // this.sanLuongKinhDoanh = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => parseInt(x.san_luong)||0).reduce((a, b) => a + b) : 0;
            // this.sanLuongSanXuat = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => parseInt(x.cong_suat)||0).reduce((a, b) => a + b) : 0;
            this.filteredDataSource.paginator = this.paginator;
            this.paginator._intl.itemsPerPageLabel = 'Số cụm công nghiệp đang hiển thị';
            this.paginator._intl.firstPageLabel = "Trang Đầu";
            this.paginator._intl.lastPageLabel = "Trang Cuối";
            this.paginator._intl.previousPageLabel = "Trang Trước";
            this.paginator._intl.nextPageLabel = "Trang Tiếp";
        })
    }

    log(any) {
        console.log(any);
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
}