import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatOption, MatSelect, MatTable, MatTableDataSource } from '@angular/material';
import { formatDate } from '@angular/common';
import { Router } from '@angular/router';
import { InformationService } from 'src/app/shared/information/information.service';

import { MatDialog } from '@angular/material';
import { AddSupplyBusinessComponent } from '../add-supply-business/add-supply-business.component';
import { SelectionModel } from '@angular/cdk/collections';


import {
  PetrolList,
  DistrictModel,
  DeleteModel
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

  // public AddSupplyBusiness(data: any) {
  //   const dialogRef = this.dialog.open(AddSupplyBusinessComponent, {
  //     data: {
  //       petrolvalue_data: data,
  //     }
  //   });
  // }

  selection = new SelectionModel<PetrolList>(true, []);

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    // const numRows = this.dataSource.data.length;
    const numRows = this.dataSource1.connect().value.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource1.connect().value.forEach(row => this.selection.select(row));
  }

  checkboxLabel(row?: PetrolList): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

  deletemodel1: Array<DeleteModel> = new Array<DeleteModel>();
  selectionarray: string[];
  removeRows() {
    if (confirm('Bạn Có Chắc Muốn Xóa?')) {
      this.selection.selected.forEach(x => {
        this.selectionarray = this.selection.selected.map(item => item.id_san_luong)
        this.deletemodel1.push({
          id: ''
        })
      })
      for (let index = 0; index < this.selectionarray.length; index++) {
        const element = this.deletemodel1[index];
        element.id = this.selectionarray[index]
      }
      this._Service.DeletePetrolValue(this.deletemodel1).subscribe(res => {
        this._info.msgSuccess('Xóa thành công')
        this.ngOnInit();
        this.deletemodel1 = []
        this.selection.clear();
        this.paginator.pageIndex = 0;
      })
    }
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
  SLDoanhNghiep: number;

  displayedColumns: string[] = [
    'select',
    'index',
    'mst',
    'ten_doanh_nghiep',
    'ten_cua_hang',
    'dia_chi',
    'so_dien_thoai',
    'so_giay_phep',
    'ngay_cap',
    'ngay_het_han',
    'nguoi_dai_dien',
    'ten_quan_ly',
    'ten_nhan_vien',
    'ten_thuong_nhan',
    'san_luong',
    'tinh_trang_hoat_dong',
    'ghi_chu',

    'ten_quan_huyen',
    'id_cua_hang_xang_dau',
    'id_san_luong',
    'time_id'
  ];
  dataSource: MatTableDataSource<PetrolList> = new MatTableDataSource<PetrolList>();
  dataSource1: MatTableDataSource<PetrolList> = new MatTableDataSource<PetrolList>();
  dataSource3: MatTableDataSource<PetrolList> = new MatTableDataSource<PetrolList>();
  petrollist: Array<PetrolList> = new Array<PetrolList>();
  petrollist1: Array<PetrolList> = new Array<PetrolList>();
  petrollist2: Array<PetrolList> = new Array<PetrolList>();

  getPetrolListbyYear(year: string) {
    this._Service.GetPetrolValue(year).subscribe(all => {
      this.petrollist = all.data[0];
      this.petrollist1 = all.data[1];
      this.petrollist2 = this.petrollist.map(x => {
        let temp = this.petrollist1.filter(y => y.id_san_luong == x.id_san_luong)

        let temp1 = temp.map(z => z.ten_thuong_nhan)
        if (temp1 == undefined || temp1 == null) {
          x.ten_thuong_nhan = null
        }
        else {
          x.ten_thuong_nhan = temp1.join('; ')
        }

        let temp2 = temp.map(z => z.dia_chi_tn)
        if (temp2 == undefined || temp2 == null) {
          x.dia_chi_tn = null
        }
        else {
          x.dia_chi_tn = temp2.join('; ')
        }

        let temp3 = temp.map(z => z.so_dien_thoai_tn)
        if (temp3 == undefined || temp3 == null) {
          x.so_dien_thoai_tn = null
        }
        else {
          x.so_dien_thoai_tn = temp3.join('; ')
        }

        return x
      })

      this.dataSource.data = this.petrollist2
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
      this.SLThuongNhan = this.petrollist1.length;
      let unique = [...new Set(this.dataSource1.data.map(x => x.mst))]
      this.SLDoanhNghiep = unique.length;

      this.dataSource1.paginator = this.paginator;
      this.paginator._intl.itemsPerPageLabel = 'Số hàng';
      this.paginator._intl.firstPageLabel = "Trang Đầu";
      this.paginator._intl.lastPageLabel = "Trang Cuối";
      this.paginator._intl.previousPageLabel = "Trang Trước";
      this.paginator._intl.nextPageLabel = "Trang Tiếp";
    })
  }

  // Reload() {
  //   location.reload();
  // }

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
    let unique = [...new Set(this.dataSource1.data.map(x => x.mst))]
    this.SLDoanhNghiep = unique.length;
  }

  applyExpireCheck(event) {
    this.dataSource1.data = this.dataSource.data.filter(x => x.is_het_han == event.checked)
    this.SanLuongBanRa = this.dataSource1.data.length ? this.dataSource1.data.map(x => Number(x.san_luong)).reduce((a, b) => a + b) : 0;
    let unique = [...new Set(this.dataSource1.data.map(x => x.mst))]
    this.SLDoanhNghiep = unique.length;
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

  AddSupplyBusiness(id: string, time: string) {
    this.router.navigate(['specialized/commecial-management/domestic/supplybusiness/' + id + '/' + time]);
  }

  ManageStore() {
    this.router.navigate(['specialized/commecial-management/domestic/petrolstore']);
  }

  type: string = 'Petrol'
  id_linh_vuc: number = 6

  ManageBusiness(type: string, id_linh_vuc: number) {
    this.router.navigate(['specialized/commecial-management/domestic/managebusiness/' + type + '/' + id_linh_vuc]);
  }

  Back() {
    this.router.navigate(['specialized/commecial-management/domestic/cbl']);
  }

  OpenDetailPetrol(id: number, mst: string, time: string, id_san_luong: string) {
    this.router.navigate(['specialized/commecial-management/domestic/update-petrol/' + id + '/' + mst + '/' + time + '/' + id_san_luong])
  }

}
