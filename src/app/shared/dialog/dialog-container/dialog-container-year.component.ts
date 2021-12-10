import { AfterViewInit, Component, ComponentFactoryResolver, ComponentRef, Inject, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogService } from 'src/app/_services/injectable-service/dialog.service';
import * as XLSX from "xlsx";

@Component({
  selector: 'app-dialog-container-year',
  templateUrl: './dialog-container-year.component.html',
  styles: []
})
export class DialogContainerYearComponent implements OnInit, AfterViewInit  {
  years: number[] = Array(10).fill(1).map((element, index) => new Date().getFullYear() + 5 - index);
  periods: any[] = [
    { id: 1, title: "6 tháng đầu năm" },
    { id: 2, title: "6 tháng cuối năm" }
  ];
  selectType: number = 3;
  nameSheet: string = "";
  disBtn: boolean = true;
  name: string = 'Chưa chọn file'
  @Input('data') data: string;
  @ViewChild('dialog-container', { 
    read: ViewContainerRef,
    static: true,
  }) dialogContainer: ViewContainerRef;

  componentRef: ComponentRef<DialogContainerYearComponent>;
  isShowPeriod: boolean = false;
  reportTypes = [
    // { ma_so: null, noi_dung: '' }, 
    // { ma_so: 1, noi_dung: 'Tháng' }, 
    // { ma_so: 2, noi_dung: 'Quý' }, 
    { ma_so: 3, noi_dung: '6 Tháng' },
    { ma_so: 4, noi_dung: 'Năm' }
  ];

  constructor(
    private dialogService: DialogService,
    public dialog: MatDialogRef<DialogContainerYearComponent>,
    @Inject(MAT_DIALOG_DATA) dataDialog
    ) { 
      this.nameSheet = dataDialog['nameSheet']
    }

  ngOnInit() {
    this.dialogService.close$.subscribe(reason => {
      this.dialogContainer.clear();

      if (this.componentRef) {
        this.componentRef.destroy();
      }
    });

    this.changeReportType();
    this.changePeriod();
  }

  ngAfterViewInit(): void {

  }

  ngOnDestroy() {
    if (this.componentRef) {
      this.componentRef.destroy();
    }
  }

  renderComponent() {
    const container = this.dialogContainer;
    container.clear();
    const injector = container.injector;

    const cfr: ComponentFactoryResolver = injector.get(ComponentFactoryResolver);

    const componentFactory = cfr.resolveComponentFactory(DialogContainerYearComponent);

    const componentRef = container.createComponent(componentFactory, 0, injector);
    componentRef.changeDetectorRef.detectChanges();
    this.componentRef = componentRef;
    this.data = this.componentRef.instance.data;
  }

  uploadExcel(e){
    console.log(e);
    this.name = e.target.files[0].name;
    this.handleFile(e);
  }

  public handleFile(e) {

    /* wire up file reader */
    const target: any = <any>(e.target);
    if (target.files.length !== 1) {
      throw new Error('Cannot use multiple files');
    }
    let reader: FileReader = new FileReader();
    reader.readAsBinaryString(target.files[0]);
    reader.onload = (e: any) => {
      /* create workbook */
      const binarystr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(binarystr, { type: 'binary' });

      /* selected the first sheet */
      const ws: XLSX.WorkSheet = wb.Sheets[this.nameSheet];

      // data ws to json format
      let data = XLSX.utils.sheet_to_json(ws);
      
      // set data to service object
      this.dialogService.setDataTransformer(data);
    };
  }

  save(){
    this.dialogService.getDataTransform() ? this.dialog.close(this.time_id) : this.dialog.close(false);
  }


  changeReportType() {
    console.log(this.selectType);

    switch (this.selectType) {
      // case 1:
      //   this.periods = this.months;
      //   break;
      // case 2:
      //   this.periods = this.quarters;
      //   break;
      case 3: 
        this.changePeriod();
        this.isShowPeriod = true;
        break;
      case 4: 
        this.changePeriod();
        this.isShowPeriod = false;
        break;
      default:
        break;
    }
    // this.tempObject.time_id = null;
    // this.selectedPeriod = null;
  }

  time_id: number = 0;
  selectedYear: number = new Date().getFullYear();
  selectedPeriod: number = new Date().getMonth() + 1 > 6 ? 2 : 1;
  changePeriod() {
    switch (this.selectType) {
      case 1:
        this.time_id = this.selectedYear * 100 + this.selectedPeriod;
        break;
      case 2:
        this.time_id = Number(this.selectedYear + this.selectedPeriod.toString());
        break;
      case 3:
        // this.time_id = Number(this.selectedYear + this.selectedPeriod.toString());;
        this.time_id = this.selectedYear;
        break;
      case 4:
        this.time_id = this.selectedYear;
        break;
    }
  }
}
