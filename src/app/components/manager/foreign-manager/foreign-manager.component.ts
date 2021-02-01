//Import library
import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, QueryList, ViewChildren } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';
import _moment from 'moment';
import { defaultFormat as _rollupMoment, Moment } from 'moment';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS, MatDatepicker } from '@angular/material';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import * as XLSX from 'xlsx';
import { Subject } from 'rxjs';
//Import service
import { KeyboardService } from './../../../shared/services/keyboard.service';
import { ManagerService } from '../../../_services/APIService/manager.service';
//Import model
import { ProductManagerModelList, ForeignManagerModel, NationModel, MODE } from '../../../_models/APIModel/manager.model';
//import component
import { ManagerDirective } from './../../../shared/manager.directive';
import { InformationService } from 'src/app/shared/information/information.service';
import { formatDate } from '@angular/common';

//Moment
const moment = _rollupMoment || _moment;

export const DDMMYY_FORMAT = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD-MM-YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};

@Component({
  selector: 'app-foreign-manager',
  templateUrl: 'foreign-manager.component.html',
  styleUrls: ['../manager_layout.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: DDMMYY_FORMAT },
    { provide: MAT_DATE_LOCALE, useValue: 'vi-VN' },
  ],
})

export class ForeignManagerComponent implements OnInit {

  //Constant
  public readonly FORMAT = 'dd/MM/yyyy';
  public readonly LOCALE = 'en-US';
  public pickedDate = {
    date: new Date()
  }
  //Declare varialbe for ONLY TS
  public rows: number = 0;
  public _mode: MODE = MODE.INSERT;

  //Declare variable for HTML
  public columns: number = 1;
  public timeForeignManager: string;
  public displayedColumns: string[] = ['index', 'ten_san_pham', 'thi_truong', 'gia', 'nguon_so_lieu', 'thoi_gian_cap_nhat'];
  public products: Array<ProductManagerModelList> = new Array<ProductManagerModelList>();
  public nations: Array<NationModel> = new Array<NationModel>();
  public currentRow: number = 0;
  public dataSource: MatTableDataSource<ForeignManagerModel> = new MatTableDataSource<ForeignManagerModel>();

  //ViewChildren
  @ViewChildren(ManagerDirective) inputs: QueryList<ManagerDirective>
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild("TABLE", { static: true }) table: ElementRef;

  public constructor(public _managerService: ManagerService, public _infor: InformationService, public _keyboardservice: KeyboardService) {
  }

  public ngOnInit() {
    this.timeForeignManager = this.getCurrentDate();
    this.getListProduct();
    this.getListNation();
    this.getAllForegionManagerPrevious(this.pickedDate.date);
    this._keyboardservice.keyBoard.subscribe(res => {
      this.move(res)
    })
  }
  //FUNCTION FOR PROCESS FLOW ------------------------------------------------------------------------------------------------------------
  //Get products
  public getListProduct(): void {
    console.log("+ Function: GetListProduct()");
    this._managerService.GetListProduct().subscribe(
      allrecords => {
        this.products = allrecords.data as ProductManagerModelList[];
        this.createDefault();
      },
    );
  }
  //get Nations
  public getListNation(): void {
    console.log("+ Function: GetListNation()");
    this._managerService.GetListNation().subscribe(
      allrecords => {
        this.nations = allrecords.data as NationModel[];
      },
    );
  }
  //Get Foreign market price
  public getAllForegionManagerPrevious(time: Date) {
    this._managerService.GetForeignMarket(_moment(time).format('DD/MM/YYYY')).subscribe(
      allrecords => {
        console.log(allrecords);
        allrecords.data.forEach(row => {
          row.ngay_cap_nhat = formatDate(row.ngay_cap_nhat, this.FORMAT, this.LOCALE).toString();
        });
        this.dataSource = new MatTableDataSource<ForeignManagerModel>(allrecords.data);
        this.rows = this.dataSource.filteredData.length;
        if (this.dataSource.data.length == 0) {
          this._mode = MODE.INSERT;
          this.createDefault();
        } else {
          this._mode = MODE.UPDATE;
        }
        this.dataSource.paginator = this.paginator;
        this.paginator._intl.itemsPerPageLabel = 'Số hàng';
        this.paginator._intl.firstPageLabel = "Trang Đầu";
        this.paginator._intl.lastPageLabel = "Trang Cuối";
        this.paginator._intl.previousPageLabel = "Trang Trước";
        this.paginator._intl.nextPageLabel = "Trang Tiếp";
      },
      //error => this.errorMessage = <any>error
    );
  }

  //Event for "Tải template"
  downloadExcelTemplate(filename: string, sheetname: string) {
    let excelFileName: string;
    let newArray: any[] = [];
    //Format name of Excel will be export
    sheetname = sheetname.replace('/', '_');
    excelFileName = filename + '.xlsx';

    //Alias column name
    let data = Object.values(this.dataSource.data);

    Object.keys(data).forEach((key, index) => {
      newArray.push({
        'STT': index,
        'Mã sản phẩm': data[key].id_san_pham,
        'Tên sản phẩm': data[key].ten_san_pham,
        'Thị trường': '',
        'Giá': '',
        'Nguồn số liệu': '',
      });
    });
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(newArray);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    /* save to file */
    XLSX.utils.book_append_sheet(wb, ws, sheetname);
    XLSX.writeFile(wb, excelFileName);
  }

  //Event for "Nhập từ excel"
  spinnerEnabled = false;
  keys: string[];
  dataSheet = new Subject();
  @ViewChild('inputFile', { static: true }) inputFile: ElementRef;
  isExcelFile: boolean;
  uploadExcel(evt: any) {
    let isExcelFile: boolean;
    let spinnerEnabled = false;
    let dataSheet = new Subject();
    let keys: string[];
    let data, header;
    const target: DataTransfer = <DataTransfer>(evt.target);
    isExcelFile = !!target.files[0].name.match(/(.xls|.xlsx)/);
    if (isExcelFile) {
      let data, header;
      const target: DataTransfer = <DataTransfer>(evt.target);
      this.isExcelFile = !!target.files[0].name.match(/(.xls|.xlsx)/);
      if (target.files.length > 1) {
        this.inputFile.nativeElement.value = '';
      }
      if (this.isExcelFile) {
        this.spinnerEnabled = true;
        const reader: FileReader = new FileReader();
        reader.onload = (e: any) => {
          /* read workbook */
          const bstr: string = e.target.result;
          const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

          /* grab first sheet */
          const wsname: string = wb.SheetNames[0];
          const ws: XLSX.WorkSheet = wb.Sheets[wsname];

          /* save data */
          data = XLSX.utils.sheet_to_json(ws);
          this.dataSource.data = [];
          data.forEach(item => {
            let datarow: ForeignManagerModel = new ForeignManagerModel();
            datarow.thi_truong = item['Thị trường'];
            datarow.gia = item['Giá'];
            datarow.nguon_so_lieu = item['Nguồn số liệu'];
            datarow.ten_san_pham = item['Tên sản phẩm'];
            datarow.id_san_pham = item['Mã sản phẩm'];
            datarow.ngay_cap_nhat = this.getCurrentDate();
            this.dataSource.data.push(datarow);
          });
          this.dataSource = new MatTableDataSource(this.dataSource.data);
          this._infor.msgSuccess("Nhập dữ liệu từ excel thành công!");
        };

        reader.readAsBinaryString(target.files[0]);

        reader.onloadend = (e) => {
          this.spinnerEnabled = false;
          this.keys = Object.keys(data[0]);
          this.dataSheet.next(data)
        }
      } else {
        this.inputFile.nativeElement.value = '';
      }
    }
    // let dataExcel;
    // let jsonFromExcel;
    // const target: DataTransfer = (evt.target) as DataTransfer;
    // const reader: FileReader = new FileReader();

    // reader.onload = (e: any) => {
    //     let bstr: string = e.target.result;

    //     let wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

    //     let wsName: string = wb.SheetNames[0];

    //     let ws: XLSX.WorkSheet = wb.Sheets[wsName];

    //     dataExcel = (XLSX.utils.sheet_to_json(ws, { header: 2 }));
    //     console.log('Data: ', dataExcel);
    //     jsonFromExcel = JSON.stringify(dataExcel);

    //     console.log('JsonData: ', jsonFromExcel);

    // };

    // reader.readAsBinaryString(target.files[0]);
  }

  // Evnet for "Ngày cập nhật giá"
  public getPriceChange(param: any) {
    this.getAllForegionManagerPrevious(param._d);
  }

  // EVENT HTML --------------------------------------------------------------------------------
  //Event for "Lọc dữ liệu"
  public applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  //Event for "Lưu"
  public save() {
    this.dataSource.data.forEach(element => {
      let x: number = + element.gia.toString().replace(',', '').replace(',', '').replace(',', '');
      element.gia = x;
      if(element.ngay_cap_nhat){
        let x = formatDate(this.pickedDate.date, this.FORMAT, this.LOCALE);
        element.ngay_cap_nhat = x;
      }
    });
    this._managerService.PostForeignManager(this.dataSource.data).subscribe(
      next => {
        if (next.id == -1) {
          this._infor.msgError("Lưu lỗi! Lý do: " + next.message);
        }
        else {
          console.log(next);
          this._infor.msgSuccess("Dữ liệu được lưu thành công!");
        }
      },
      error => {
        this._infor.msgError("Không thể thực thi! Lý do: " + error.message);
      }
    );
  }
  //Event for change " Tên sản phẩm"
  public changeProduct(element: any) {
    element.ten_san_pham = this.products.filter(x => x.id_san_pham == element.id_san_pham)[0].ten_san_pham;
  }
  //Event addrow for "Thêm dòng"
  public addRow() {
    let newRow: ForeignManagerModel = new ForeignManagerModel();
    newRow.gia;
    newRow.ngay_cap_nhat = this.getCurrentDate();
    newRow.nguon_so_lieu = "";
    this.dataSource.data.push(newRow);
    this.dataSource = new MatTableDataSource(this.dataSource.data);
    this.dataSource.paginator = this.paginator;
    this.paginator._intl.itemsPerPageLabel = 'Số hàng';
    this.paginator._intl.firstPageLabel = "Trang Đầu";
    this.paginator._intl.lastPageLabel = "Trang Cuối";
    this.paginator._intl.previousPageLabel = "Trang Trước";
    this.paginator._intl.nextPageLabel = "Trang Tiếp";
    this.rows = this.dataSource.filteredData.length;
  }
  //Event addrow for "Xóa dòng"
  public deleteRow() {
    this.dataSource.data.splice(this.currentRow, 1);
    this.dataSource = new MatTableDataSource(this.dataSource.data);
    this.rows = this.dataSource.filteredData.length;
  }
  //Event addrow for "Chèn dòng"
  public insertRow() {
    let data = this.dataSource.data.slice(this.currentRow);
    this.dataSource.data.splice(this.currentRow, this.dataSource.data.length - this.currentRow + 1);
    let newRow: ForeignManagerModel = new ForeignManagerModel();
    newRow.gia;
    newRow.ngay_cap_nhat = this.getCurrentDate();
    newRow.nguon_so_lieu = "";
    this.dataSource.data.push(newRow);
    data.forEach(element => {
      this.dataSource.data.push(element);
    });
    this.dataSource = new MatTableDataSource(this.dataSource.data);
    this.rows = this.dataSource.filteredData.length;
  }
  //Event for changeRow Mattable
  public changeRow(index: number) {
    this.currentRow = index;
  }
  //Event for "Tạo mặc định"
  public createDefault() {
    const HAT_DIEU: number = 2;
    const HAT_TIEU: number = 10;
    const CAO_SU: number = 4;
    const CA_PHE: number = 5;
    // if (this.dataSource.data.length > 0)
    //   if (!confirm("Nếu bạn tạo mặc định sẽ xóa dữ liệu hiện tại! Bạn tiếp tục không?"))
    //     return;
    this.dataSource = new MatTableDataSource<ForeignManagerModel>();;
    this.addRow();
    this.addRow();
    this.addRow();
    this.addRow();
    this.dataSource.data[0].ten_san_pham = this.products.filter(x => x.id_san_pham == HAT_DIEU)[0].ten_san_pham;
    this.dataSource.data[1].ten_san_pham = this.products.filter(x => x.id_san_pham == HAT_TIEU)[0].ten_san_pham;
    this.dataSource.data[2].ten_san_pham = this.products.filter(x => x.id_san_pham == CAO_SU)[0].ten_san_pham;
    this.dataSource.data[3].ten_san_pham = this.products.filter(x => x.id_san_pham == CA_PHE)[0].ten_san_pham;
    this.dataSource.data[0].id_san_pham = this.products.filter(x => x.id_san_pham == HAT_DIEU)[0].id_san_pham;
    this.dataSource.data[1].id_san_pham = this.products.filter(x => x.id_san_pham == HAT_TIEU)[0].id_san_pham;
    this.dataSource.data[2].id_san_pham = this.products.filter(x => x.id_san_pham == CAO_SU)[0].id_san_pham;
    this.dataSource.data[3].id_san_pham = this.products.filter(x => x.id_san_pham == CA_PHE)[0].id_san_pham;
    this.rows = this.dataSource.filteredData.length;
  }

  //Evnent for "Key Arrown"
  public move(object) {
    const inputToArray = this.inputs.toArray()
    let index = inputToArray.findIndex(x => x.element == object.element);
    switch (object.action) {
      case "UP":
        index -= this.columns;
        break;
      case "DOWN":
        index += this.columns;
        break;
      case "LEFT":
        index -= this.rows;
        break;
      case "RIGHT":
        index += this.rows;
        break;
    }
    if (index >= 0 && index < this.inputs.length) {
      inputToArray[index].element.nativeElement.focus();
      // inputToArray[index].element.nativeElement.style.backgroundColor = '#5789D8';
    }
  }
  // FUNTION EXTENTION ----------------------------------------------------------------------------------------------------
  //Get month
  public getMonthAndYear(time: string) {
    let year = time.substr(0, 4);
    let month = time.substr(4, 2);
    let day = time.substr(6, 2);
    let result = day + "/" + month + "/" + year;
    return result as string;
  }
  //Get current month
  public getCurrentMonth() {
    let date = new Date;
    return date.getMonth();
  }
  //Get current Year
  public getCurrentYear() {
    let date = new Date;
    return date.getFullYear();
  }
  public getCurrentDate() {
    let date = new Date;
    return formatDate(date, this.FORMAT, this.LOCALE);
  }
}
