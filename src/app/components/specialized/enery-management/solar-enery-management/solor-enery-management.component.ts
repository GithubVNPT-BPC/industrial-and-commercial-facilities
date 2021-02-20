import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatAccordion, MatOption, MatPaginator, MatSelect, MatTable, MatTableDataSource } from '@angular/material';
import { DistrictModel } from 'src/app/_models/APIModel/domestic-market.model';
import { HydroElectricManagementModel, SolarEneryManagementModel } from 'src/app/_models/APIModel/electric-management.module';
import { LinkModel } from 'src/app/_models/link.model';
import { BreadCrumService } from 'src/app/_services/injectable-service/breadcrums.service';
import { ExcelService } from 'src/app/_services/excelUtil.service';
import { SCTService } from 'src/app/_services/APIService/sct.service';
import { timingSafeEqual } from 'crypto';
import { EnergyService } from 'src/app/_services/APIService/energy.service';


@Component({
  selector: 'app-solar-enery-management',
  templateUrl: './solor-enery-management.component.html',
  styleUrls: ['/../../special_layout.scss'],
})
export class SolarEneryManagementComponent implements OnInit {
  //ViewChild 
  @ViewChild(MatAccordion, { static: true }) accordion: MatAccordion;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('TABLE', { static: false }) table: ElementRef;

  ExportTOExcel(filename: string, sheetname: string) {
    this.excelService.exportDomTableAsExcelFile(filename, sheetname, this.table.nativeElement);
  }

  //Constant variable
  public readonly displayedColumns: string[] = 
  ['index', 'ten_du_an', 'ten_doanh_nghiep', 'ten_huyen_thi', 'cong_suat_thiet_ke', 
  'san_luong_6_thang', 'san_luong_nam', 'doanh_thu', 'trang_thai'];
  //TS & HTML Variable
  public dataSource: MatTableDataSource<SolarEneryManagementModel> = new MatTableDataSource<SolarEneryManagementModel>();
  public filteredDataSource: MatTableDataSource<SolarEneryManagementModel> = new MatTableDataSource<SolarEneryManagementModel>();
  public new_districts: DistrictModel[] = [];
  public districts: DistrictModel[] = [{ id: 1, ten_quan_huyen: 'Thị xã Phước Long' },
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
  //Only TS Variable
  years: number[] = [];
  doanhThu: number;
  congXuat: number;
  sanluongnam: number;
  soLuongDoanhNghiep: number;
  isChecked: boolean;
  currentYear: number = new Date().getFullYear();
  private _linkOutput: LinkModel = new LinkModel();
  constructor(
    private _breadCrumService: BreadCrumService,
    public excelService: ExcelService,
    private sctService: SCTService,
    private energyService: EnergyService
    ) {
  }

  ngOnInit() {
    this.years = this.getYears();
    // this.dataSource.data = this.data;
    this.filteredDataSource.data = [...this.dataSource.data];
    this.caculatorValue();
    this.paginatorAgain();
    this.autoOpen();
    this.initDistricts();
  }

  laydulieuDienMatTroi(){
    this.energyService.LayDuLieuDienMatTroi(this.currentYear).subscribe(res => {
      this.dataSource = new MatTableDataSource<SolarEneryManagementModel>(res.data);
      this.filteredDataSource =  new MatTableDataSource<SolarEneryManagementModel>(res.data)
    })
  }

  initDistricts(){
    this.sctService.LayDanhSachQuanHuyen().subscribe(res => {
      this.new_districts = res.data;
    })
  }

  autoOpen() {
    setTimeout(() => this.accordion.openAll(), 1000);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filteredDataSource.filter = filterValue.trim().toLowerCase();
  }

  get(time_id: number) {

  }

  log(any) {
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
    this.caculatorValue();
    this.paginatorAgain();
  }
  paginatorAgain() {
    if (this.filteredDataSource.data.length) {
      this.filteredDataSource.paginator = this.paginator;
      this.paginator._intl.itemsPerPageLabel = 'Số hàng';
      this.paginator._intl.firstPageLabel = "Trang Đầu";
      this.paginator._intl.lastPageLabel = "Trang Cuối";
      this.paginator._intl.previousPageLabel = "Trang Trước";
      this.paginator._intl.nextPageLabel = "Trang Tiếp";
    }
  }
  caculatorValue() {
    this.doanhThu = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => x.doanh_thu).reduce((a, b) => a + b) : 0;
    this.soLuongDoanhNghiep = this.filteredDataSource.data.length;
    this.congXuat = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => x.cong_suat_thiet_ke).reduce((a, b) => a + b) : 0;
    this.sanluongnam = this.filteredDataSource.data.length ? this.filteredDataSource.data.map(x => x.san_luong_nam).reduce((a, b) => a + b) : 0;
  }
  // isHidden(row : any){
  //     return (this.isChecked)? (row.is_het_han) : false;
  // }

  applyActionCheck(event) {
    this.filteredDataSource.filter = (event.checked) ? "true" : "";
    this.caculatorValue();
    this.paginatorAgain();
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