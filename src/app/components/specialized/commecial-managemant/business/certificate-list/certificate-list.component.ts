import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { formatDate, Location } from '@angular/common';
import { InformationService } from 'src/app/shared/information/information.service';
import { ActivatedRoute, Router } from "@angular/router";
import { SelectionModel } from '@angular/cdk/collections';

import { MatDialog } from '@angular/material';

import { LinkModel } from 'src/app/_models/link.model';
import { BreadCrumService } from 'src/app/_services/injectable-service/breadcrums.service';

import {
  DeleteModel,
  CertificateViewModel,
  FieldList
} from 'src/app/_models/APIModel/conditional-business-line.model';
import { MatAccordion } from '@angular/material/expansion';
import { MatPaginator } from '@angular/material/paginator';

import { ExcelService } from 'src/app/_services/excelUtil.service';
import { ConditionBusinessService } from 'src/app/_services/APIService/Condition-Business.service';

import { FormControl } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
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
  selector: 'app-certificate-list',
  templateUrl: './certificate-list.component.html',
  styleUrls: ['../../../special_layout.scss'],
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
export class CertificateListComponent implements OnInit {
  displayedColumns: string[] = [
    'select',
    'index',
    'mst',
    'ten_doanh_nghiep',
    'so_giay_phep',
    'ten_linh_vuc',
    'ngay_cap',
    'ngay_het_han',
    'noi_cap',
    'co_quan_cap',
    'ghi_chu',
    'id_giay_phep',
    'thoi_gian_chinh_sua_cuoi'
  ];

  @ViewChild('table', { static: false }) table: ElementRef;
  @ViewChild(MatAccordion, { static: false }) accordion: MatAccordion;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  status: string;

  constructor(
    public excelService: ExcelService,
    public _Service: ConditionBusinessService,
    public router: Router,
    public _info: InformationService,
    public dialog: MatDialog,
    private _location: Location,
    public route: ActivatedRoute,
    private _breadCrumService: BreadCrumService,
  ) {
    this.route.params.subscribe((params) => {
      this.status = params["status"]
    });
  }

  protected LINK_DEFAULT: string = "";
  protected TITLE_DEFAULT: string = "QUẢN LÝ GIẤY PHÉP";
  protected TEXT_DEFAULT: string = "QUẢN LÝ GIẤY PHÉP";
  private _linkOutput: LinkModel = new LinkModel();

  private sendLinkToNext(type: boolean): void {
    this._linkOutput.link = this.LINK_DEFAULT;
    this._linkOutput.title = this.TITLE_DEFAULT;
    this._linkOutput.text = this.TEXT_DEFAULT;
    this._linkOutput.type = type;
    this._breadCrumService.sendLink(this._linkOutput);
  }

  // public AddBusiness(data: any) {
  //   const dialogRef = this.dialog.open(UpdateCertificateModelComponent, {
  //     data: {
  //       message: 'Dữ liệu top doanh nghiệp sản xuất',
  //       business_data: data,
  //     }
  //   });
  // }

  selection = new SelectionModel<CertificateViewModel>(true, []);

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.connect().value.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.connect().value.forEach(row => this.selection.select(row));
  }

  checkboxLabel(row?: CertificateViewModel): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id_giay_phep + 1}`;
  }

  deletemodel1: Array<DeleteModel> = new Array<DeleteModel>();
  selectionarray: string[];
  removeRows() {
    if (confirm('Bạn Có Chắc Muốn Xóa?')) {
      this.selection.selected.forEach(x => {
        this.selectionarray = this.selection.selected.map(item => item.id_giay_phep.toString())
        this.deletemodel1.push({
          id: ''
        })
      })
      for (let index = 0; index < this.selectionarray.length; index++) {
        const element = this.deletemodel1[index];
        element.id = this.selectionarray[index]
      }
      this._Service.DeleteCertificate(this.deletemodel1).subscribe(res => {
        this._info.msgSuccess('Xóa thành công')
        this.ngOnInit();
        this.deletemodel1 = []
        this.selection.clear();
        this.paginator.pageIndex = 0;
      })
    }
  }

  public Field: Array<FieldList> = new Array<FieldList>();

  GetLinhVuc() {
    this._Service.GetField().subscribe((allrecords) => {
      this.Field = allrecords.data as FieldList[];
    });
  }

  isChecked: boolean
  showbutton: boolean
  isExpired : boolean = false
  isNearlyExpired : boolean = false

  ngOnInit() {
    this.sendLinkToNext(true)
    if (this.status == 'false') {
      this.isChecked = false
      this.showbutton = false
      this.isExpired = false
    }
    else {
      this.isChecked = true
      this.showbutton = true
      this.isExpired = true
    }
    this.getBusinessList();
    this.autoOpen();
    // this.GetLinhVuc();
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

  dataSource: MatTableDataSource<CertificateViewModel> = new MatTableDataSource<CertificateViewModel>();
  filteredDataSource: MatTableDataSource<CertificateViewModel> = new MatTableDataSource<CertificateViewModel>();
  certificate: Array<CertificateViewModel> = new Array<CertificateViewModel>();

  getBusinessList() {
    this._Service.GetCertificate('FILTER').subscribe(all => {
      this.certificate = all.data

      this.certificate.forEach(element => {
        if (element.ngay_het_han) {
          element.is_het_han = element.ngay_het_han < this.getCurrentDate()
          element.is_gan_het_han = element.ngay_het_han < this.getDate3Months()
        }
        else {
          element.is_het_han = false
          element.is_gan_het_han = false
        }
        element.ngay_cap = element.ngay_cap ? this.Convertdate(element.ngay_cap) : null
        element.ngay_het_han = element.ngay_het_han ? this.Convertdate(element.ngay_het_han) : null
      });

      if (this.status == 'true') {
        this.dataSource.data = this.certificate.filter(x => x.is_het_han == true)
      }
      else {
        this.dataSource.data = this.certificate
      }

      this.dataSource.filterPredicate = (data: CertificateViewModel, filter: string): boolean => {
        const dataStr = Object.keys(data).reduce((currentTerm: string, key: string) => {
          return (currentTerm + (data as { [key: string]: any })[key] + '◬');
        }, '').normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  
        const transformedFilter = filter.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  
        return dataStr.indexOf(transformedFilter) != -1;
      }
      this.dataSource.paginator = this.paginator;
      this.paginator._intl.itemsPerPageLabel = 'Số hàng';
      this.paginator._intl.firstPageLabel = "Trang Đầu";
      this.paginator._intl.lastPageLabel = "Trang Cuối";
      this.paginator._intl.previousPageLabel = "Trang Trước";
      this.paginator._intl.nextPageLabel = "Trang Tiếp";
    })
  }

  SendEmail() {
    var cond = 1;
    if (this.isExpired && this.isNearlyExpired)
      cond = 1
    if (this.isExpired && !this.isNearlyExpired)
      cond = 2
    if (!this.isExpired && this.isNearlyExpired)
      cond = 3
      
    this._Service.SendEmail(cond).subscribe(all => {
      this._info.msgSuccess('Gửi mail thành công')
    })
  }

  applyExpireCheck(event) {
    this.showbutton = this.isExpired || this.isNearlyExpired
    if (event.checked) {
      this.dataSource.data = this.certificate.filter(x => x.is_het_han == event.checked)
    } else {
      this.dataSource.data = this.certificate
    }

    this.dataSource.data = this.isExpired ? [...this.certificate.filter(d => d.is_het_han)] : [...this.certificate];

    if (this.isExpired)
      this.dataSource.data = this.isNearlyExpired ? [...this.certificate.filter(d => d.is_gan_het_han || d.is_het_han)]
        : [...this.dataSource.data];
    else
      this.dataSource.data = this.isNearlyExpired ? [...this.certificate.filter(d => d.is_gan_het_han && !d.is_het_han)] : [...this.certificate];

  }

  public getCurrentDate() {
    let date = new Date;
    return formatDate(date, 'yyyyMMdd', 'en-US');
  }

  public getDate3Months(){
      let date = new Date;
      date.setMonth(date.getMonth() + 3)
      return formatDate(date, 'yyyyMMdd', 'en-US');
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

  AddCertificate(id: number) {
    this.router.navigate(['/specialized/commecial-management/domestic/add-certificate/' + id]);
  }

  Back() {
    this.router.navigate(['/specialized/commecial-management/domestic/search']);
  }

}
