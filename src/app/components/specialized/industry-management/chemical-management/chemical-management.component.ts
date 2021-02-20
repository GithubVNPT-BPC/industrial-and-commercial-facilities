import { Component, Injector } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { District } from 'src/app/_models/district.model';
import { ChemicalManagementModel } from 'src/app/_models/APIModel/industry-management.module';
import { LinkModel } from 'src/app/_models/link.model';

// Services
import { BaseComponent } from 'src/app/components/specialized/specialized-base.component';
import { IndustryManagementService } from 'src/app/_services/APIService/industry-management.service';
import { BreadCrumService } from 'src/app/_services/injectable-service/breadcrums.service';

@Component({
    selector: 'chemical-management',
    templateUrl: './chemical-management.component.html',
    styleUrls: ['/../../special_layout.scss'],
})

export class ChemicalManagementComponent extends BaseComponent {
    //Constant
    private readonly LINK_DEFAULT: string = "/specialized/industry-management/chemical";
    private readonly TITLE_DEFAULT: string = "Công nghiệp - Hoá chất";
    private readonly TEXT_DEFAULT: string = "Công nghiệp - Hoá chất";
    //Variable for only ts
    private _linkOutput: LinkModel = new LinkModel();
    displayedColumns: string[] = [];
    fullFieldList: string[] = ['select', 'index'] // 'mst', 'ten_doanh_nghiep', 'dia_chi_day_du', 'nganh_nghe_kd_chinh', 'email', 'so_lao_dong', 'email_sct', 'so_lao_dong_sct', 'cong_suat','so_giay_phep', 'san_luong', 'ngay_cap', 'ngay_het_han', 'tinh_trang_hoat_dong'];
    reducedFieldList: string[] = ['select', 'index', 'ten_doanh_nghiep', 'dia_chi_day_du', 'nganh_nghe_kd_chinh', 'cong_suat', 'san_luong', 'ngay_cap', 'tinh_trang_hoat_dong'];
    
    displayedFields = {
        mst: "Mã số thuế",
        ten_doanh_nghiep: "Tên doanh nghiệp",
        dia_chi_day_du: "Địa chỉ",
        nganh_nghe_kd_chinh: "Ngành nghề KD chính",
        email: "Email",
        so_lao_dong: "Số lao động",
        cong_suat: "Công suất thiết kế Tấn/năm",
        san_luong: "Sản lượng Tấn/năm",
        so_giay_phep: "Số giấy phép/ Giấy chứng nhận",
        ngay_cap: "Ngày cấp",
        ngay_het_han: "Ngày hết hạn",
        von_dieu_le: "Vốn điều lệ",
        so_lao_dong_sct: "Sổ lao động SCT",
        email_sct: "Email SCT",
        tinh_trang_hoat_dong: "Trạng thái hoạt động",
    }

    dataSource: MatTableDataSource<ChemicalManagementModel> = new MatTableDataSource<ChemicalManagementModel>();
    filteredDataSource: MatTableDataSource<ChemicalManagementModel> = new MatTableDataSource<ChemicalManagementModel>();
    
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
    years: number[] = [];
    year: number;

    constructor(
        private injector: Injector,
        public industryManagementService: IndustryManagementService,
        private _breadCrumService: BreadCrumService
    ) {
        super(injector);
    }

    ngOnInit() {
        super.ngOnInit();
        this.years = this.getYears();
        this.year = new Date().getFullYear() - 1;
        this.getChemicalManagementData(this.year);
        // this.filteredDataSource.filterPredicate = function (data: ChemicalLPGFoodManagementModel, filter): boolean {
        //     return String(data.is_het_han).includes(filter);
        // };
        this.displayedColumns = this.reducedFieldList;
        this.fullFieldList = this.fullFieldList.concat(Object.keys(this.displayedFields));
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

    getChemicalManagementData(time_id: number) {
        this.industryManagementService.GetChemicalManagement(time_id).subscribe(result => {
            if (result.data && result.data.length > 0) {
                let chemicalManagementData = result.data[0];
                let capacityData = result.data[1];
                chemicalManagementData.map((c) => {
                    let matchingList = capacityData.filter(x => x.mst == c.mst);
                    
                    c.san_luong = matchingList.map(x => x.ten_hoa_chat ? x.ten_hoa_chat + ': ' + x.san_luong : x.san_luong).join(', ');
                    c.cong_suat = matchingList.map(x => x.ten_hoa_chat ? x.ten_hoa_chat + ': ' + x.cong_suat : x.cong_suat).join(', ');
                });

                this.dataSource = new MatTableDataSource<ChemicalManagementModel>(chemicalManagementData);
                this.filteredDataSource.data = [...this.dataSource.data];

                // this.dataSource.data.forEach(element => {
                //     element.is_het_han = new Date(element.ngay_het_han) < new Date();
                // });

                // this.sanLuongKinhDoanh = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => parseInt(x.san_luong)||0).reduce((a, b) => a + b) : 0;
                // this.sanLuongSanXuat = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => parseInt(x.cong_suat)||0).reduce((a, b) => a + b) : 0;
                this.filteredDataSource.paginator = this.paginator;
                this.paginator._intl.itemsPerPageLabel = 'Số hàng';
                this.paginator._intl.firstPageLabel = "Trang Đầu";
                this.paginator._intl.lastPageLabel = "Trang Cuối";
                this.paginator._intl.previousPageLabel = "Trang Trước";
                this.paginator._intl.nextPageLabel = "Trang Tiếp";
            }     
        })
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
        // this.sanLuongKinhDoanh = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => parseInt(x.san_luong) || 0).reduce((a, b) => a + b) : 0;
        // this.sanLuongSanXuat = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => parseInt(x.cong_suat)||0).reduce((a, b) => a + b) : 0;
    }

    applyExpireCheck(event) {
        this.filteredDataSource.filter = (event.checked) ? "true" : "";
    }

    showMoreDetail(event) {
        this.displayedColumns = (event.checked) ? this.fullFieldList : this.reducedFieldList;
    }
}