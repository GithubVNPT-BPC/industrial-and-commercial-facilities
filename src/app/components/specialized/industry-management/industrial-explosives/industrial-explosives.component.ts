import { Component, Injector } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatOption, MatSelect, MatTable, MatTableDataSource } from '@angular/material';
import { MatAccordion } from '@angular/material/expansion';
import { MatPaginator } from '@angular/material/paginator';
import { District } from 'src/app/_models/district.model';
import { IndustrialExplosivesFilterModel, IndustrialExplosivesModel } from 'src/app/_models/APIModel/industrial-explosives.model';
import { BaseComponent } from 'src/app/components/specialized/specialized-base.component';

// Services
import { SCTService } from 'src/app/_services/APIService/sct.service';
import { IndustryManagementService } from 'src/app/_services/APIService/industry-management.service';

@Component({
    selector: 'industrial-explosives',
    templateUrl: './industrial-explosives.component.html',
    styleUrls: ['/../../special_layout.scss'],
})

export class IndustrialExplosivesComponent extends BaseComponent {
    
    displayedColumns: string[] = ['select', 'index', 'ten_doanh_nghiep', 'mst', 'nganh_nghe_kd', 'dien_thoai', 'dia_chi', 'so_lao_dong', 'cong_suat', 'san_luong', 
    'so_gp_gcn', 'ngay_cap', 'ngay_het_han', 'dang_hoat_dong', 'tinh_hinh_6thang', 'tinh_hinh_ca_nam'];
    
    totalColumns: string[] = ['select', 'index', 'ten_doanh_nghiep', 'mst', 'nganh_nghe_kd', 'dien_thoai', 'dia_chi', 'so_lao_dong', 'cong_suat', 'san_luong', 
    'so_gp_gcn', 'ngay_cap', 'ngay_het_han', 'dang_hoat_dong', 'thuoc_no_6thang', 'kip_no_6thang', 'moi_no_6thang', 'day_no_6thang', 'thuoc_no', 'kip_no', 
    'moi_no', 'day_no'];

    dataSource: MatTableDataSource<IndustrialExplosivesModel> = new MatTableDataSource<IndustrialExplosivesModel>();
    filteredDataSource: MatTableDataSource<IndustrialExplosivesModel> = new MatTableDataSource<IndustrialExplosivesModel>();
    
    years: number[] = [];
    districts: District[] = []
    tinhTrangHoatDong: any[] = [
        { id: 1, tinh_trang: 'Đang hoạt động' },
        { id: 2, tinh_trang: 'Ngưng hoạt động' },
        { id: 3, tinh_trang: 'Giải thể' }
    ];
    isChecked: boolean;
    tongSoLaoDong: number = 0;
    tongCongSuatThietKe: number = 0;
    tongMucSanLuong: number = 0;
    filterModel: IndustrialExplosivesFilterModel = { id_quan_huyen: [], id_tinh_trang_hoat_dong: [], is_het_han: false };

    constructor(
        private injector: Injector,
        public sctService: SCTService,
        public industryManagementService: IndustryManagementService,
    ) {
        super(injector);
    }

    ngOnInit() {
        super.ngOnInit();
        this.years = this.getYears();
        this.getPostExplosiveMatData(this.currentYear);
        // this.filteredDataSource.filterPredicate = function (data: IndustrialExplosivesModel, filter): boolean {
        //     return String(data.is_het_han).includes(filter);
        // };
        this.getDistrictData();
    }

    getDistrictData(){
        this.sctService.LayDanhSachQuanHuyen().subscribe(res => {
            if(res.success) this.districts = res.data;
        })
    }

    getFormParams() {
        return {
          mst: new FormControl(),
          dia_chi: new FormControl(),
          id_phuong_xa: new FormControl(),
          
          thuoc_no: new FormControl(),
          kip_no: new FormControl(),
          moi_no: new FormControl(),
          day_no: new FormControl(),
          thuoc_no_6thang: new FormControl(),
          kip_no_6thang: new FormControl(),
          moi_no_6thang: new FormControl(),
          day_no_6thang: new FormControl(),
        }
    }

    prepareData(data) {
        data['id_so_giay_phep'] = 1;
        data['id_tinh_trang_hoat_dong'] = 1;
        data['time_id'] = this.currentYear;
        return data;
    }

    callService(data) {
        this.industryManagementService.PostExplosiveMat([data], this.currentYear).subscribe(response => this.successNotify(response), error => this.errorNotify(error));
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.filteredDataSource.filter = filterValue.trim().toLowerCase();
    }

    applySelectFilter() {
        let filteredData = this.filterArray(this.dataSource.data, this.filterModel);
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

    getPostExplosiveMatData(time_id) {
        this.industryManagementService.GetExplosiveMat(time_id).subscribe(result => {
            if (result.data && result.data.length > 0) {
                this.dataSource = new MatTableDataSource<IndustrialExplosivesModel>(result.data);
                this.filteredDataSource.data = [...this.dataSource.data];

                this.tongSoLaoDong = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => x.so_lao_dong).reduce((a, b) => a + b) : 0;
                this.tongCongSuatThietKe = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => x.cong_suat_thiet_ke).reduce((a, b) => a + b) : 0;
                this.tongMucSanLuong = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => x.san_luong).reduce((a, b) => a + b) : 0;
                
                this.filteredDataSource.paginator = this.paginator;
                this.filteredDataSource.paginator._intl.itemsPerPageLabel = 'Số hàng';
                this.filteredDataSource.paginator._intl.firstPageLabel = "Trang Đầu";
                this.filteredDataSource.paginator._intl.lastPageLabel = "Trang Cuối";
                this.filteredDataSource.paginator._intl.previousPageLabel = "Trang Trước";
                this.filteredDataSource.paginator._intl.nextPageLabel = "Trang Tiếp";
            }
            
        })
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
}