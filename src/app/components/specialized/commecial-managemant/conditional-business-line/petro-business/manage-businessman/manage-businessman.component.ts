import { Component, ElementRef, OnInit, ViewChild, QueryList, ViewChildren } from '@angular/core';
import { MatOption, MatSelect, MatTable, MatTableDataSource } from '@angular/material';
import { formatDate, Location } from '@angular/common';
import { NgForm, NumberValueAccessor } from '@angular/forms';
import { FormBuilder, FormGroup, FormArray, Validators } from "@angular/forms";
import { InformationService } from 'src/app/shared/information/information.service';
import { ActivatedRoute, Router } from "@angular/router";
import { SelectionModel } from '@angular/cdk/collections';
import { CommonFuntions } from 'src/app/components/specialized/commecial-managemant/conditional-business-line/common-functions.service';

import { MatDialog } from '@angular/material';
import { UpdateBusinessmanComponent } from '../update-businessman/update-businessman.component';

import {
  DeleteModel,
  Businessman,
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
  selector: 'app-manage-businessman',
  templateUrl: './manage-businessman.component.html',
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
export class ManageBusinessmanComponent implements OnInit {
  displayedColumns: string[] = [
    'select',
    'index',
    'ten_thuong_nhan',
    'dia_chi',
    'so_dien_thoai',
    'thoi_gian_chinh_sua_cuoi',

    'id_linh_vuc'
  ];


  @ViewChild('table', { static: false }) table: ElementRef;
  @ViewChild(MatAccordion, { static: false }) accordion: MatAccordion;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  type: string;
  id_linh_vuc: number;

  constructor(
    public excelService: ExcelService,
    public _Service: ConditionBusinessService,
    public router: Router,
    public _info: InformationService,
    public dialog: MatDialog,
    private _location: Location,
    public route: ActivatedRoute
  ) {
    this.route.params.subscribe((params) => {
      this.type = params["type"];
      this.id_linh_vuc = params["id_linh_vuc"];
    });
  }

  // public AddBusiness(data: any) {
  //   const dialogRef = this.dialog.open(UpdateBusinessmanComponent, {
  //     data: {
  //       message: 'Dữ liệu top doanh nghiệp sản xuất',
  //       business_data: data,
  //     }
  //   });
  // }

  selection = new SelectionModel<Businessman>(true, []);

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    // const numRows = this.dataSource.data.length;
    const numRows = this.dataSource.connect().value.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.connect().value.forEach(row => this.selection.select(row));
  }

  checkboxLabel(row?: Businessman): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id_thuong_nhan + 1}`;
  }

  deletemodel1: Array<DeleteModel> = new Array<DeleteModel>();
  selectionarray: string[];
  removeRows() {
    if (confirm('Bạn Có Chắc Muốn Xóa?')) {
      this.selection.selected.forEach(x => {
        this.selectionarray = this.selection.selected.map(item => item.id_thuong_nhan)
        this.deletemodel1.push({
          id: ''
        })
      })
      for (let index = 0; index < this.selectionarray.length; index++) {
        const element = this.deletemodel1[index];
        element.id = this.selectionarray[index]
      }
      console.log(this.deletemodel1)
      this._Service.DeleteBusinessman(this.deletemodel1).subscribe(res => {
        this._info.msgSuccess('Xóa thành công')
        this.ngOnInit();
        this.deletemodel1 = []
        this.selection.clear();
        this.paginator.pageIndex = 0;
      })
    }
  }

  ngOnInit() {
    this.getBusinessList();
    this.autoOpen();
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
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  dataSource: MatTableDataSource<Businessman> = new MatTableDataSource<Businessman>();
  filterdatasource: Array<Businessman> = new Array<Businessman>();
  filterdatasource1: Array<Businessman> = new Array<Businessman>();

  getBusinessList() {
    this._Service.GetBusinessman().subscribe(all => {
      this.filterdatasource = all.data
      this.filterdatasource1 = this.filterdatasource.filter(x => x.id_linh_vuc == this.id_linh_vuc)

      this.dataSource.data = this.filterdatasource1

      this.dataSource.paginator = this.paginator;
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
  //         this.router.createUrlTree(['specialized/commecial-management/domestic/add-petrol/' + id + '/' + mst]));
  //     window.open(url, "_blank");
  // }

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
    // this.getPetrolListbyYear(this.theYear.toString())
  }

  public ExportTOExcel(filename: string, sheetname: string) {
    this.excelService.exportDomTableAsExcelFile(filename, sheetname, this.table.nativeElement);
  }

  // Back() {
  //   this._location.back();
  // }

  id: string = undefined

  AddBusiness(id: number, type: string, id_linh_vuc: number) {
    this.router.navigate(['specialized/commecial-management/domestic/updatebusiness/' + id + '/' + type + '/' + id_linh_vuc]);
  }

  Back() {
    switch (this.type) {
      case 'Tobacco':
        this.router.navigate(['specialized/commecial-management/domestic/tobacco']);
        break;
      case 'Petrol':
        this.router.navigate(['specialized/commecial-management/domestic/petrol']);
        break;
      case 'Liquor':
        this.router.navigate(['specialized/commecial-management/domestic/liquor']);
        break;
      case 'LPG':
        this.router.navigate(['specialized/commecial-management/domestic/lpg']);
        break;
    }
  }
}
