import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatOption, MatSelect, MatTable, MatTableDataSource } from '@angular/material';
import { element } from 'protractor';
import { MatAccordion } from '@angular/material/expansion';
import { MatPaginator } from '@angular/material/paginator';
import { District } from 'src/app/_models/district.model';
import { ChemicalLPGFoodManagementModel } from 'src/app/_models/APIModel/industry-management.module';
import { BreadCrumService } from 'src/app/_services/injectable-service/breadcrums.service';
import { LinkModel } from 'src/app/_models/link.model';

// Services
import { ReportService } from 'src/app/_services/APIService/report.service';
import { SCTService } from 'src/app/_services/APIService/sct.service';
import { ExcelService } from 'src/app/_services/excelUtil.service';

@Component({
    selector: 'lpg-management',
    templateUrl: './lpg-management.component.html',
    styleUrls: ['/../../special_layout.scss'],
})

export class LPGManagementComponent implements OnInit {
    //Constant
    private readonly LINK_DEFAULT: string = "/specialized/industry-management/lpg";
    private readonly TITLE_DEFAULT: string = "Công nghiệp - Chiết nạp khí hoá lỏng";
    private readonly TEXT_DEFAULT: string = "Công nghiệp - Chiết nạp khí hoá lỏng";
    //Variable for only ts
    private _linkOutput: LinkModel = new LinkModel();
    displayedColumns: string[] = [];
    displayedColumns1: string[] = ['index', 'ten_doanh_nghiep', 'mst', 'dia_chi', 'nganh_nghe_kd', 'email', 'so_lao_dong', 'cong_suat', 'san_luong', 'so_gp_gcn', 'ngay_cap', 'ngay_het_han', 'trang_thai_hoat_dong'];
    displayedColumns2: string[] = ['index', 'ten_doanh_nghiep', 'dia_chi', 'nganh_nghe_kd', 'cong_suat', 'san_luong', 'trang_thai_hoat_dong'];
    dataSource: MatTableDataSource<ChemicalLPGFoodManagementModel> = new MatTableDataSource<ChemicalLPGFoodManagementModel>();
    filteredDataSource: MatTableDataSource<ChemicalLPGFoodManagementModel> = new MatTableDataSource<ChemicalLPGFoodManagementModel>();
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
    isChecked: boolean;
    sanLuongSanXuat: number = 0;
    sanLuongKinhDoanh: number = 0;
    year: number;

    @ViewChild('table', { static: false }) table: ElementRef;
    @ViewChild(MatAccordion, { static: false }) accordion: MatAccordion;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

    constructor(
        public excelService: ExcelService,
        public sctService: SCTService, 
        private _breadCrumService: BreadCrumService
    ) {}

    // ngAfterViewInit(): void {
    //     this.accordion.openAll();
    // }

    autoOpen() {
        setTimeout(() => this.accordion.openAll(), 1000);
    }

    ngOnInit() {
        this.years = this.getYears();
        this.year = new Date().getFullYear() - 1;
        this.getDanhSachQuanLyChietNapLPG(this.year);
        this.filteredDataSource.filterPredicate = function (data: ChemicalLPGFoodManagementModel, filter): boolean {
            return String(data.is_het_han).includes(filter);
        };
        this.displayedColumns = this.displayedColumns2;
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

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.filteredDataSource.filter = filterValue.trim().toLowerCase();
    }

    getDanhSachQuanLyChietNapLPG(time_id: number) {
        this.sctService.GetDanhSachQuanLyChietNapLPG(time_id).subscribe(result => {
            this.dataSource = new MatTableDataSource<ChemicalLPGFoodManagementModel>(result.data);

            this.dataSource.data.forEach(element => {
                element.is_het_han = new Date(element.ngay_het_han) < new Date();
            });

            this.filteredDataSource.data = [...this.dataSource.data];
            this.sanLuongKinhDoanh = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => parseInt(x.san_luong) || 0).reduce((a, b) => a + b) : 0;
            this.sanLuongSanXuat = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => parseInt(x.cong_suat) || 0).reduce((a, b) => a + b) : 0;
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

    applyDistrictFilter(event) {
        let filteredData = [];

        event.value.forEach(element => {
            this.dataSource.data.filter(x => x.id_quan_huyen == element).forEach(x => filteredData.push(x));
        });

        if (!filteredData.length) {
            if (event.value.length)
                this.filteredDataSource.data = [];
            else
                this.filteredDataSource.data = this.dataSource.data;
        }
        else {
            this.filteredDataSource.data = filteredData;
        }
        this.sanLuongKinhDoanh = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => parseInt(x.san_luong) || 0).reduce((a, b) => a + b) : 0;
        this.sanLuongSanXuat = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => parseInt(x.cong_suat) || 0).reduce((a, b) => a + b) : 0;
    }

    // isHidden(row : any){
    //     return (this.isChecked)? (row.is_het_han) : false;
    // }

    applyExpireCheck(event) {
        console.log(event);
        this.filteredDataSource.filter = (event.checked) ? "true" : "";
    }

    showMoreDetail(event) {
        this.displayedColumns = (event.checked) ? this.displayedColumns1 : this.displayedColumns2;
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