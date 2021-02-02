//Import library
import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, QueryList, ViewChildren, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material';
import { FormControl } from '@angular/forms';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { formatDate } from '@angular/common';
import * as XLSX from 'xlsx';
import { Subject } from 'rxjs';

//Import component
import { ManagerDirective } from './../../../shared/manager.directive';

//Import Service
import { ManagerService } from '../../../_services/APIService/manager.service';
import { LoginService } from 'src/app/_services/APIService/login.service';
import { KeyboardService } from './../../../shared/services/keyboard.service';
import { MarketService } from 'src/app/_services/APIService/market.service';
import { InformationService } from 'src/app/shared/information/information.service';

//Import Model
import { ProductManagerModelList, DomesticManagerModel, MODE } from '../../../_models/APIModel/manager.model';

//Moment
import { defaultFormat as _rollupMoment, Moment } from 'moment';
import * as _moment from 'moment';
import { NONE_TYPE } from '@angular/compiler/src/output/output_ast';
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
  selector: 'app-domestic-manager',
  templateUrl: 'domestic-manager.component.html',
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

export class DomesticManagerComponent implements OnInit {

  //Constant
  public readonly FORMAT = 'dd/MM/yyyy';
  public readonly LOCALE = 'en-GB';
  public readonly RANK_LABLE = (page: number, pageSize: number, length: number) => {
    if (length == 0 || pageSize == 0) { return `0 của ${length}`; }

    length = Math.max(length, 0);

    const startIndex = page * pageSize;

    // If the start index exceeds the list length, do not try and fix the end index to the end.
    const endIndex = startIndex < length ?
      Math.min(startIndex + pageSize, length) :
      startIndex + pageSize;

    return `${startIndex + 1} - ${endIndex} của ${length}`;
  }

  //Declare variable for only TS  
  public _rows: number = 0;
  public _currentRow: number = 0;
  public _mode: MODE = MODE.UPDATE;


  //Declare varialbe for TS & HTML
  public timeDomesticManager: string;
  public columns: number = 1;
  public displayedColumns: string[] = ['index', 'ten_san_pham', 'gia', 'nguon_so_lieu', 'ngay_cap_nhat'];
  public products: Array<ProductManagerModelList> = new Array<ProductManagerModelList>();
  public dataSource: MatTableDataSource<DomesticManagerModel> = new MatTableDataSource<DomesticManagerModel>();
  //ViewChild
  @ViewChildren(ManagerDirective) inputs: QueryList<ManagerDirective>
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild("TABLE", { static: true }) table: ElementRef;

  date = new FormControl(moment);
  pickedDate = {
    date: new Date()
  }

  public readonly format = 'dd/MM/yyyy';
  public readonly locale = 'en-US';

  /**
   * Create service
   * @param managerService Service call API get/post/put data
   * @param keyboardservice Service support key arrown over report's fields
   * @param marketService Service call API get data
   * @param loginService Service check login of user
   */
  public constructor(public _managerService: ManagerService,
    public _keyboardservice: KeyboardService,
    public _infor: InformationService,
    public _loginService: LoginService) {
    console.log("* DomesticManagerComponent constructed!")
  }

  /**
   * 1. Create current time on selector timer
   * 2. Get all products to ListProduct
   * 3. Get Domestic price on time of selector
   * 4. Regist key arrown
   */
  public ngOnInit() {
    // this.timeDomesticManager = _moment(this.pickedDate.date).format('DD/MM/YYYY');
    this.timeDomesticManager = this.getCurrentDate();
    this.getListProduct();
    this.getPreviousDomesticManager(this.pickedDate.date);
    this._keyboardservice.keyBoard.subscribe(res => {
      this.move(res)
    })
  }
  // FUNCION USE FOR PROCESS-FLOW -----------------------------------------------------------------------------------------------------

  public getListProduct(): void {
    console.log("+ Function: GetListProduct()");
    this._managerService.GetListProduct().subscribe(
      allrecords => {
        this.products = allrecords.data as ProductManagerModelList[];
        console.log(allrecords)
      },
      //error => this.errorMessage = <any>error
    );
  }

  public getPriceChange(param: any) {
    this.getPreviousDomesticManager(param._d);
  }

  //Get domestic market price
  public getPreviousDomesticManager(time: Date): void {
    let formattedDate = formatDate(time, this.format, this.locale);
    this._managerService.GetDomesticMarketByTime(formattedDate).subscribe(
      allrecords => {
        console.log(allrecords)
        allrecords.data.forEach(row => {
          row.ngay_cap_nhat = formatDate(row.ngay_cap_nhat, this.FORMAT, this.LOCALE).toString();
        });
        this.dataSource = new MatTableDataSource<DomesticManagerModel>(allrecords.data);
        this._rows = this.dataSource.filteredData.length;
        if (this.dataSource.data.length == 0) {
          this._mode = MODE.INSERT;
          this.createDefault();
        }
        else {
          this._mode = MODE.UPDATE;
        }
        this._paginatorAgain();
      });
    //error => this.errorMessage = <any>error
  }

  //FUNCTION USE FOR HTML/EVENT-----------------------------------------------------------------------------------------------------------------
  public save() {
    this._loginService.userValue.user_id;
    this.dataSource.data.forEach(element => {
      if (element.gia) {
        let x: number = + element.gia.toString().replace(',', '').replace(',', '').replace(',', '');
        element.gia = x;
      }
      if (element.ngay_cap_nhat) {
        let x = formatDate(this.pickedDate.date, this.FORMAT, this.LOCALE);
        element.ngay_cap_nhat = x;
      }
    });
    // // if(this._mode == MODE.INSERT)
    // // {
    console.log(this.dataSource);
    this._managerService.PostDomesticManager(this.dataSource.data).subscribe(
      next => {
        if (next.id == -1) {
          this._infor.msgError("Lưu lỗi! Lý do: " + next.message);
        }
        else {
          this._infor.msgSuccess("Dữ liệu được lưu thành công!");
          this._mode = MODE.UPDATE;
        }
      },
      error => {
        this._infor.msgError("Không thể thực thi! Lý do: " + error.message);
      }
    );
    // }
    // else{
    //Thực hiện update
    // }

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
            let datarow: DomesticManagerModel = new DomesticManagerModel();
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

  //Event button "Lọc dữ liệu"
  public applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  //Envet Key Arrown move
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
        index -= this._rows;
        break;
      case "RIGHT":
        index += this._rows;
        break;
    }
    if (index >= 0 && index < this.inputs.length) {
      inputToArray[index].element.nativeElement.focus();
      // inputToArray[index].element.nativeElement.style.backgroundColor = '#5789D8';
    }
  }

  //Event select combobox "Tên sản phẩm"
  public changeProduct(element: any) {
    element.ten_san_pham = this.products.filter(x => x.ma_san_pham == element.id_san_pham)[0].ten_san_pham;
  }

  //Event Add row "Thêm dòng"
  public addRow(): void {
    let newRow: DomesticManagerModel = new DomesticManagerModel();
    newRow.gia;
    newRow.ngay_cap_nhat = this.getCurrentDate();
    newRow.nguon_so_lieu = "";
    newRow.ma_nguoi_cap_nhat = this._loginService.userValue.user_id;
    this.dataSource.data.push(newRow);
    this._rows = this.dataSource.filteredData.length;
    this.dataSource = new MatTableDataSource(this.dataSource.data);
    this._paginatorAgain();
  }

  //Evnet "Xóa dòng"
  public deleteRow(): void {
    this.dataSource.data.splice(this._currentRow, 1);
    this.dataSource = new MatTableDataSource(this.dataSource.data);
    this._rows = this.dataSource.filteredData.length;
  }

  //Evnet "Chèn dòng"
  public insertRow(): void {
    let data = this.dataSource.data.slice(this._currentRow);
    this.dataSource.data.splice(this._currentRow, this.dataSource.data.length - this._currentRow + 1);
    let newRow: DomesticManagerModel = new DomesticManagerModel();
    newRow.gia;
    newRow.ngay_cap_nhat = this.getCurrentDate();
    newRow.nguon_so_lieu = "";
    newRow.ma_nguoi_cap_nhat = this._loginService.userValue.user_id;
    this.dataSource.data.push(newRow);
    data.forEach(element => {
      this.dataSource.data.push(element);
    });
    this.dataSource = new MatTableDataSource(this.dataSource.data);
    this._rows = this.dataSource.filteredData.length;
  }

  //Event Change row
  public changeRow(index: number) {
    this._currentRow = index;
  }

  //FUNCTION EXTENTIONS-----------------------------------------------------------------------------------------------------------------
  //Create default table values
  public createDefault() {
    const HAT_DIEU: number = 2;
    const HAT_TIEU: number = 10;
    const CAO_SU: number = 4;
    const CA_PHE: number = 5;
    // if (this.dataSource.data.length > 0)
    //   if (!confirm("Nếu bạn tạo mặc định sẽ xóa dữ liệu hiện tại! Bạn tiếp tục không?"))
    //     return;
    this.dataSource = new MatTableDataSource<DomesticManagerModel>();
    this.addRow();
    this.addRow();
    this.addRow();
    this.addRow();
    this.dataSource.data[0].ten_san_pham = this.products.filter(x => x.ma_san_pham == HAT_DIEU)[0].ten_san_pham;
    this.dataSource.data[1].ten_san_pham = this.products.filter(x => x.ma_san_pham == HAT_TIEU)[0].ten_san_pham;
    this.dataSource.data[2].ten_san_pham = this.products.filter(x => x.ma_san_pham == CAO_SU)[0].ten_san_pham;
    this.dataSource.data[3].ten_san_pham = this.products.filter(x => x.ma_san_pham == CA_PHE)[0].ten_san_pham;
    this.dataSource.data[0].id_san_pham = this.products.filter(x => x.ma_san_pham == HAT_DIEU)[0].ma_san_pham;
    this.dataSource.data[1].id_san_pham = this.products.filter(x => x.ma_san_pham == HAT_TIEU)[0].ma_san_pham;
    this.dataSource.data[2].id_san_pham = this.products.filter(x => x.ma_san_pham == CAO_SU)[0].ma_san_pham;
    this.dataSource.data[3].id_san_pham = this.products.filter(x => x.ma_san_pham == CA_PHE)[0].ma_san_pham;
    console.log(this.dataSource.data);
    this._rows = this.dataSource.filteredData.length;
  }

  //Get current time
  public getMonthAndYear(time: string): string {
    let year = time.substr(0, 4);
    let month = time.substr(4, 2);
    let day = time.substr(6, 2);
    let result = day + "/" + month + "/" + year;
    console.log(result);
    return result as string;
  }

  public getCurrentDate(): string {
    let date = new Date();
    return date.toLocaleDateString(this.LOCALE);
  }
  //FUNCTION FOR ONLY TS
  private _paginatorAgain() {
    this.dataSource.paginator = this.paginator;
    console.log("paginator", this.paginator);
    this.paginator._intl.itemsPerPageLabel = 'Số hàng';
    this.paginator._intl.firstPageLabel = "Trang Đầu";
    this.paginator._intl.lastPageLabel = "Trang Cuối";
    this.paginator._intl.previousPageLabel = "Trang Trước";
    this.paginator._intl.nextPageLabel = "Trang Tiếp";
    this.paginator._intl.getRangeLabel = this.RANK_LABLE;
  }
}
