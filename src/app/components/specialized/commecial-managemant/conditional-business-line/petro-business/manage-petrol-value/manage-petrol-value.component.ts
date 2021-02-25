import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatOption, MatSelect, MatTable, MatTableDataSource } from '@angular/material';
import { formatDate } from '@angular/common';
import { Router } from '@angular/router';
import { InformationService } from 'src/app/shared/information/information.service';

import { MatDialog } from '@angular/material';
import { AddSupplyBusinessComponent } from '../add-supply-business/add-supply-business.component';

import {
  PetrolList,
  DistrictModel
} from 'src/app/_models/APIModel/conditional-business-line.model';
import { MatAccordion } from '@angular/material/expansion';
import { MatPaginator } from '@angular/material/paginator';

import { ExcelService } from 'src/app/_services/excelUtil.service';
import { ConditionBusinessService } from 'src/app/_services/APIService/Condition-Business.service';

import { FormControl } from '@angular/forms';
import { MatDatepicker, MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import _moment from 'moment';
import { defaultFormat as _rollupMoment, Moment } from 'moment';
const moment = _rollupMoment || _moment;
export const MY_FORMATS = {
  parse: {
    dateInput: 'YYYY',
  },
  display: {
    dateInput: 'YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-manage-petrol-value',
  templateUrl: './manage-petrol-value.component.html',
  styleUrls: ['../../../../special_layout.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'vi' },
  ],
})
export class ManagePetrolValueComponent implements OnInit {
  displayedColumns: string[] = [
    'index',
    'ten_cua_hang',
    'mst',
    'san_luong',
    'so_giay_phep',
    'ngay_cap',
    'ngay_het_han',
    'dia_chi',
    'ten_quan_huyen',
    'so_dien_thoai',
    'ten_quan_ly',
    'ten_nhan_vien',
    'nguoi_dai_dien',
    'id_cua_hang_xang_dau',
    'tinh_trang_hoat_dong',
  ];
  dataSource: MatTableDataSource<PetrolList> = new MatTableDataSource<PetrolList>();
  dataSource1: MatTableDataSource<PetrolList> = new MatTableDataSource<PetrolList>();

  @ViewChild('table', { static: false }) table: ElementRef;
  @ViewChild(MatAccordion, { static: false }) accordion: MatAccordion;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  constructor(
    public excelService: ExcelService,
    public _Service: ConditionBusinessService,
    public router: Router,
    public _info: InformationService,
    public dialog: MatDialog
  ) {
  }

  public AddBusiness(data: any) {
    const dialogRef = this.dialog.open(AddSupplyBusinessComponent, {
      data: {
        message: 'Dữ liệu top doanh nghiệp sản xuất',
        business_data: data,
      }
    });
  }

  public district: Array<DistrictModel> = new Array<DistrictModel>();
  getQuan_Huyen() {
    this._Service.GetAllDistrict().subscribe((allDistrict) => {
      this.district = allDistrict["data"] as DistrictModel[];
    });
  }

  ngOnInit() {
    this.autoOpen();
    this.getPetrolListbyYear(this.getCurrentYear())
    this.getQuan_Huyen();
  }

  autoOpen() {
    setTimeout(() => this.accordion.openAll(), 1000);
  }

  // ngAfterViewInit(): void {
  //     //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
  //     //Add 'implements AfterViewInit' to the class.
  //     this.accordion.openAll();
  // }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource1.filter = filterValue.trim().toLowerCase();
  }

  SanLuongBanRa: number;
  SLThuongNhan: number;

  getPetrolListbyYear(year: string) {
    this._Service.GetPetrolValue(year).subscribe(all => {
      this.dataSource = new MatTableDataSource<PetrolList>(all.data[0]);
      this.dataSource.data.forEach(element => {
        if (element.ngay_het_han) {
          let temp = this.Convertdate(element.ngay_het_han)
          element.is_het_han = Date.parse(temp) < Date.parse(this.getCurrentDate())
        }
        else {
          element.is_het_han = false
        }
        element.ngay_cap = element.ngay_cap ? this.Convertdate(element.ngay_cap) : null
        element.ngay_het_han = element.ngay_het_han ? this.Convertdate(element.ngay_het_han) : null
      });
      this.dataSource1.data = this.dataSource.data.filter(x => x.is_het_han == false)
      this.SanLuongBanRa = this.dataSource1.data.length ? this.dataSource1.data.map(x => Number(x.san_luong)).reduce((a, b) => a + b) : 0;

      this.dataSource1.paginator = this.paginator;
      this.paginator._intl.itemsPerPageLabel = 'Số hàng';
      this.paginator._intl.firstPageLabel = "Trang Đầu";
      this.paginator._intl.lastPageLabel = "Trang Cuối";
      this.paginator._intl.previousPageLabel = "Trang Trước";
      this.paginator._intl.nextPageLabel = "Trang Tiếp";
    })
  }

  // @ViewChild('dSelect', { static: false }) dSelect: MatSelect;
  // allSelected = false;
  // toggleAllSelection() {
  //     this.allSelected = !this.allSelected;

  //     if (this.allSelected) {
  //         this.dSelect.options.forEach((item: MatOption) => item.select());
  //     } else {
  //         this.dSelect.options.forEach((item: MatOption) => item.deselect());
  //     }
  //     this.dSelect.close();
  // }

  // OpenDetailPetrol(id: number, mst: string) {
  //     let url = this.router.serializeUrl(
  //         this.router.createUrlTree([encodeURI('#') + 'specialized/commecial-management/domestic/add-petrol/' + id + '/' + mst]));
  //     window.open(url.replace('%23', '#'), "_blank");
  // }

  applyDistrictFilter(event) {
    let filteredData = [];

    event.value.forEach(element => {
      this.dataSource.data.filter(x => x.ten_quan_huyen.toLowerCase().includes(element.toLowerCase())).forEach(x => filteredData.push(x));
    });

    if (!filteredData.length) {
      if (event.value.length)
        this.dataSource1.data = [];
      else
        this.dataSource1.data = this.dataSource.data;
    }
    else {
      this.dataSource1.data = filteredData;
    }

    this.SanLuongBanRa = this.dataSource1.data.length ? this.dataSource1.data.map(x => Number(x.san_luong)).reduce((a, b) => a + b) : 0;

  }

  applyExpireCheck(event) {
    this.dataSource1.data = this.dataSource.data.filter(x => x.is_het_han == event.checked)
  }

  public getCurrentDate() {
    let date = new Date;
    return formatDate(date, 'yyyy-MM-dd', 'en-US');
  }

  public getCurrentYear() {
    let date = new Date;
    return formatDate(date, 'yyyy', 'en-US');
  }

  Convertdate(text: string): string {
    let date: string
    date = text.substring(6, 8) + "-" + text.substring(4, 6) + "-" + text.substring(0, 4)
    return date
  }

  public date = new FormControl(_moment());
  public theYear: number;

  public chosenYearHandler(normalizedYear: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.date.value;
    ctrlValue.year(normalizedYear.year());
    this.date.setValue(ctrlValue);
    this.theYear = normalizedYear.year();
    datepicker.close();
    this.getPetrolListbyYear(this.theYear.toString())
  }

  public ExportTOExcel(filename: string, sheetname: string) {
    this.excelService.exportDomTableAsExcelFile(filename, sheetname, this.table.nativeElement);
  }

}