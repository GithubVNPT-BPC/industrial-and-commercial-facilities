import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { formatDate, Location } from '@angular/common';
import { InformationService } from 'src/app/shared/information/information.service';
import { ActivatedRoute, Router } from "@angular/router";
import { SelectionModel } from '@angular/cdk/collections';

import { MatDialog } from '@angular/material';

import { InfoUserList, DeleteModel, UserRole, ResetDefaultPassword } from "src/app/_models/user.model";
import { LoginService } from "src/app/_services/APIService/login.service";

import { MatAccordion } from '@angular/material/expansion';
import { MatPaginator } from '@angular/material/paginator';

import { ExcelService } from 'src/app/_services/excelUtil.service';

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
  selector: 'app-manager-user',
  templateUrl: './manager-user.component.html',
  styleUrls: ['/../manager_layout.scss'],
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
export class ManagerUserComponent implements OnInit {

  displayedColumns: string[] = [
    'select',
    'index',
    'user_name',
    'full_name',
    'user_email',
    'user_position',
    'role_id',
    'org_name',
    'status',

    'user_id'
  ];

  @ViewChild('table', { static: false }) table: ElementRef;
  @ViewChild(MatAccordion, { static: false }) accordion: MatAccordion;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  id: string

  constructor(
    public excelService: ExcelService,
    public _Service: LoginService,
    public router: Router,
    public _info: InformationService,
    public dialog: MatDialog,
    private _location: Location,
    public route: ActivatedRoute
  ) {
    this.route.params.subscribe((params) => {
      this.id = params["id"];
    });
  }

  selection = new SelectionModel<InfoUserList>(true, []);

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

  checkboxLabel(row?: InfoUserList): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.user_id + 1}`;
  }

  deletemodel1: Array<DeleteModel> = new Array<DeleteModel>();
  selectionarray: string[];
  removeRows() {
    if (confirm('Bạn Có Chắc Muốn Thao Tác?')) {
      this.selection.selected.forEach(x => {
        this.selectionarray = this.selection.selected.map(item => item.user_id.toString())
        this.deletemodel1.push({
          id: ''
        })
      })
      for (let index = 0; index < this.selectionarray.length; index++) {
        const element = this.deletemodel1[index];
        element.id = this.selectionarray[index]
      }
      this._Service.DeactiveUser(this.deletemodel1).subscribe(res => {
        this._info.msgSuccess('Thành công')
        this.deletemodel1 = []
        this.selection.clear();
        this.paginator.pageIndex = 0;
        window.location.reload();
      },
        err => {
          this._info.msgError('Không thành công')
        }
      )
    }
  }

  resetpassword: string[];
  defaultpassword: Array<ResetDefaultPassword> = new Array<ResetDefaultPassword>();

  ResetPassword() {
    if (confirm('Bạn Có Chắc Muốn Thao Tác?')) {
      this.resetpassword = this.selection.selected.map(x => x.user_name)

      this.defaultpassword.push({
        username: ''
      })

      for (let index = 0; index < this.resetpassword.length; index++) {
        this.defaultpassword[0].username = this.resetpassword[index]
        this._Service.ChangeDefaultPassword(this.defaultpassword[0]).subscribe(res => {
          this._info.msgSuccess('Thành công')
          this.selection.clear();
          this.paginator.pageIndex = 0;
          window.location.reload();
        },
          err => {
            this._info.msgError('Không thành công')
          }
        )
      }
    }
  }

  ngOnInit() {
    this.getBusinessList();
    this.autoOpen();
    this.GetUserRole();
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

  userrole: Array<UserRole> = new Array<UserRole>();

  GetUserRole() {
    this._Service.GetUserRole().subscribe((all) => {
      this.userrole = all as UserRole[];
    });
  }

  dataSource: MatTableDataSource<InfoUserList> = new MatTableDataSource<InfoUserList>();
  dataSource1: MatTableDataSource<InfoUserList> = new MatTableDataSource<InfoUserList>();

  getBusinessList() {
    this._Service.GetUserInfo('user_id', 'desc').subscribe(all => {
      this.dataSource.data = all

      if (this.id == '0') {
        this.dataSource1.data = this.dataSource.data.filter(x => x.status == true && x.role_id != 2)
      }
      else if (this.id == '2') {
        this.dataSource1.data = this.dataSource.data.filter(x => x.status == true && x.role_id == 2)
      }

      this.dataSource1.paginator = this.paginator;
      this.paginator._intl.itemsPerPageLabel = 'Số hàng';
      this.paginator._intl.firstPageLabel = "Trang Đầu";
      this.paginator._intl.lastPageLabel = "Trang Cuối";
      this.paginator._intl.previousPageLabel = "Trang Trước";
      this.paginator._intl.nextPageLabel = "Trang Tiếp";
    })
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
  }

  public ExportTOExcel(filename: string, sheetname: string) {
    this.excelService.exportDomTableAsExcelFile(filename, sheetname, this.table.nativeElement);
  }

  applyExpireCheck(event) {
    if (this.id == '0') {
      this.dataSource1.data = this.dataSource.data.filter(x => x.status == !event.checked && x.role_id != 2)
    }
    else if (this.id == '2') {
      this.dataSource1.data = this.dataSource.data.filter(x => x.status == !event.checked && x.role_id == 2)
    }
  }

  // Back() {
  //   this._location.back();
  // }

  AddUser() {
    this.router.navigate(['manager/add-user/']);
  }

  UpdateUser(id: string) {
    this.router.navigate(['manager/user/' + id]);
  }
}
