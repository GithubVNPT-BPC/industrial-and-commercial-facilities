import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatOption, MatSelect, MatTable, MatTableDataSource } from '@angular/material';
import { element } from 'protractor';
import { MatAccordion } from '@angular/material/expansion';
import { MatPaginator } from '@angular/material/paginator';
import { District } from 'src/app/_models/district.model';
import { ChemicalLPGFoodManagementModel } from 'src/app/_models/APIModel/industry-management.module';
import { IndustrialExplosivesFilterModel, IndustrialExplosivesModel } from 'src/app/_models/APIModel/industrial-explosives.model';
import { filter } from 'rxjs/operators';

// Services
import { ReportService } from 'src/app/_services/APIService/report.service';
import { SCTService } from 'src/app/_services/APIService/sct.service';
import { ExcelService } from 'src/app/_services/excelUtil.service';

@Component({
    selector: 'industrial-explosives',
    templateUrl: './industrial-explosives.component.html',
    styleUrls: ['/../../special_layout.scss'],
})

export class IndustrialExplosivesComponent implements OnInit {
    displayedColumns: string[] = ['index', 'ten_doanh_nghiep', 'mst', 'nganh_nghe_kd', 'dien_thoai', 'dia_chi', 'so_lao_dong', 'cong_suat', 'san_luong', 'so_gp_gcn', 'ngay_cap', 'ngay_het_han', 'dang_hoat_dong', 'tinh_hinh_6thang', 'tinh_hinh_ca_nam'];
    totalColumns: string[] = ['index', 'ten_doanh_nghiep', 'mst', 'nganh_nghe_kd', 'dien_thoai', 'dia_chi', 'so_lao_dong', 'cong_suat', 'san_luong', 'so_gp_gcn', 'ngay_cap', 'ngay_het_han', 'dang_hoat_dong', 'thuoc_no_6thang', 'kip_no_6thang', 'moi_no_6thang', 'day_no_6thang', 'thuoc_no', 'kip_no', 'moi_no', 'day_no'];
    dataSource: MatTableDataSource<IndustrialExplosivesModel> = new MatTableDataSource<IndustrialExplosivesModel>();
    filteredDataSource: MatTableDataSource<IndustrialExplosivesModel> = new MatTableDataSource<IndustrialExplosivesModel>();
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
    tinhTrangHoatDong: any[] = [{ id: 1, tinh_trang: 'Đang hoạt động' },
    { id: 2, tinh_trang: 'Ngưng hoạt động' },
    { id: 3, tinh_trang: 'Giải thể' }];
    isChecked: boolean;
    tongSoLaoDong: number = 0;
    tongCongSuatThietKe: number = 0;
    tongMucSanLuong: number = 0;
    year : number;
    filterModel: IndustrialExplosivesFilterModel = { id_quan_huyen: [], id_tinh_trang_hoat_dong: [], is_het_han: false };

    @ViewChild('table', { static: false }) table: ElementRef;
    @ViewChild(MatAccordion, { static: false }) accordion: MatAccordion;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

    constructor(
        public excelService: ExcelService,
        public sctService: SCTService
    ) {}

    ngOnInit() {
        this.years = this.getYears();
        this.year = new Date().getFullYear() - 1;
        this.getDanhSachQuanLyVatLieuNoCongNghiep(this.year);
        this.filteredDataSource.filterPredicate = function (data: IndustrialExplosivesModel, filter): boolean {
            return String(data.is_het_han).includes(filter);
        };
        this.autoOpen();
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.filteredDataSource.filter = filterValue.trim().toLowerCase();
    }

    // ngAfterViewInit(): void {
    //     this.accordion.openAll();
    // }

    autoOpen() {
        setTimeout(() => this.accordion.openAll(), 1000);
    }

    applySelectFilter() {
        // console.log(this.filterModel)
        let filteredData = this.filterArray(this.dataSource.data, this.filterModel);
        // console.log(filteredData)
        if (!filteredData.length) {
            if (this.filterModel.id_quan_huyen.length || this.filterModel.id_tinh_trang_hoat_dong.length || this.filterModel.is_het_han)
                this.filteredDataSource.data = [];
            else
                this.filteredDataSource.data = this.dataSource.data;
        }
        else {
            this.filteredDataSource.data = filteredData;
        }
    }

    getDanhSachQuanLyVatLieuNoCongNghiep(time_id: number) {
        this.sctService.GetDanhSachQuanLyVatLieuNoCongNghiep(time_id).subscribe(result => {
            this.dataSource = new MatTableDataSource<IndustrialExplosivesModel>(result.data);

            this.dataSource.data.forEach(element => {
                element.is_het_han = new Date(element.ngay_het_han) < new Date();
            });

            this.filteredDataSource.data = [...this.dataSource.data];

            this.tongSoLaoDong = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => x.so_lao_dong).reduce((a, b) => a + b) : 0;
            this.tongCongSuatThietKe = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => x.cong_suat_thiet_ke).reduce((a, b) => a + b) : 0;
            this.tongMucSanLuong = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => x.san_luong).reduce((a, b) => a + b) : 0;
            this.filteredDataSource.paginator = this.paginator;
            this.paginator._intl.itemsPerPageLabel = 'Số hàng';
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

    filterArray(array, filters) {
        const filterKeys = Object.keys(filters);
        let temp = [...array];
        filterKeys.forEach(key => {
            let temp2 = [];
            if (key == 'is_het_han') {
                temp2 = (filters[key]) ? temp2.concat(temp.filter(x => x[key] == true)) : temp;
                temp = [...temp2];
            }
            else
                if (filters[key].length) {
                    filters[key].forEach(criteria => {
                        temp2 = temp2.concat(temp.filter(x => x[key] == criteria));
                    });
                    temp = [...temp2];
                }
        })
        return temp;
    }
    
    public ExportTOExcel(filename: string, sheetname: string) {
        this.excelService.exportDomTableAsExcelFile(filename, sheetname, this.table.nativeElement);
    }

    @ViewChild('dSelect', { static: false }) dSelect: MatSelect;
    allSelected = false;
    toggleAllSelection() {
        this.allSelected = !this.allSelected;  // to control select-unselect

        if (this.allSelected) {
            this.dSelect.options.forEach((item: MatOption) => item.select());
        } else {
            this.dSelect.options.forEach((item: MatOption) => item.deselect());
        }
        this.dSelect.close();
    }
}