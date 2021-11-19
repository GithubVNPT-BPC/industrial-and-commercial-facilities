import { Component, ViewChild, ElementRef, OnInit, AfterViewInit, Inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';

import { MarketService } from 'src/app/_services/APIService/market.service';
import { ClusterFilterModel, ClusterModel, ClusterBusiness, PostClusterBusiness } from 'src/app/_models/APIModel/cluster.model';
import { IndustryManagementService } from 'src/app/_services/APIService/industry-management.service';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SAVE } from 'src/app/_enums/save.enum';
import { InformationService } from 'src/app/shared/information/information.service';
import { ExcelService } from 'src/app/_services/excelUtil.service';

@Component({
  selector: 'app-cluster-business',
  templateUrl: './cluster-business.component.html',
  styleUrls: ['../../../special_layout.scss'],
})
export class ClusterBusinessComponent implements OnInit {
  @ViewChild('TABLE', { static: false }) table: ElementRef;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  public displayedColumns: string[] = ['select', 'index', 'ten_doanh_nghiep', 'mst', 'dia_chi', 'so_dien_thoai', 'nganh_nghe_kd_chinh', 'cong_suat', 'chi_tiet_doanh_nghiep', 'id_ccn'];

  field: string;
  // public clustermodel: ClusterModel;
  typeOfSave: SAVE;
  deletestatus: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ClusterBusinessComponent>,
    public marketService: MarketService,
    public router: Router,
    public info: InformationService,
    public excelService: ExcelService,
    public indService: IndustryManagementService,
  ) {
  }

  ngOnInit(): void {
    this.field = this.data.message;
    // this.clustermodel = this.data.cluster_data;

    this.typeOfSave = this.data.typeOfSave;
    switch (this.typeOfSave) {
      case SAVE.CLUSTER:
        this.GetExistClusterBusiness()
        break;
      case SAVE.ADD:
        this.deletestatus = true
        this.GetAllCompany();
        this.GetClusterBusiness();
        break;
      default:
        break;
    }
  }

  OpenDetailCompany(mst: string) {
    window.open('/#/public/partner/search/' + mst, "_blank");
  }

  public ExportTOExcel(filename, sheetname) {
    this.excelService.exportDomTableAsExcelFile(filename, sheetname, this.table.nativeElement);
  }

  clusterbusinesslist: Array<ClusterBusiness> = new Array<ClusterBusiness>();

  public GetExistClusterBusiness() {
    this.indService.GetClusterBusiness(this.data.cluster_data).subscribe(
      allrecords => {
        let companytemp = allrecords.data[0].map(a => {
          let temp = allrecords.data[1].filter(b => b.mst === a.mst)

          let temp3 = temp.map(c => c.nganh_nghe_kd_chinh)
          if (temp3 == undefined || temp3 == null) {
            a.nganh_nghe_kd_chinh = null
          }
          else {
            a.nganh_nghe_kd_chinh = temp3.join('; ')
          }

          return a
        })

        this.clusterbusinesslist = companytemp
        this.dataSource = new MatTableDataSource<ClusterBusiness>(allrecords.data[0]);
        this.dataSource.paginator = this.paginator;
        this.paginator._intl.itemsPerPageLabel = 'Số hàng';
        this.paginator._intl.firstPageLabel = "Trang Đầu";
        this.paginator._intl.lastPageLabel = "Trang Cuối";
        this.paginator._intl.previousPageLabel = "Trang Trước";
        this.paginator._intl.nextPageLabel = "Trang Tiếp";
      });
  }

  public GetClusterBusiness() {
    this.indService.GetClusterBusiness(this.data.cluster_data).subscribe(
      allrecords => {
        this.clusterbusinesslist = allrecords.data[0]
      });
  }

  filtercompany: Array<ClusterBusiness> = new Array<ClusterBusiness>();
  dataSource: MatTableDataSource<ClusterBusiness> = new MatTableDataSource();

  GetAllCompany() {
    this.marketService.GetAllCompany().subscribe(
      allrecords => {

        let companytemp = allrecords.data[0].map(a => {
          let temp = allrecords.data[1].filter(b => b.mst === a.mst)

          let temp3 = temp.map(c => c.nganh_nghe_kd_chinh)
          if (temp3 == undefined || temp3 == null) {
            a.nganh_nghe_kd_chinh = null
          }
          else {
            a.nganh_nghe_kd_chinh = temp3.join('; ')
          }

          return a
        })

        this.filtercompany = companytemp.filter(x => this.clusterbusinesslist.map(y => y.mst).indexOf(x.mst) < 0)
        this.dataSource = new MatTableDataSource<ClusterBusiness>(this.filtercompany);

        this.dataSource.paginator = this.paginator;
        this.paginator._intl.itemsPerPageLabel = 'Số hàng';
        this.paginator._intl.firstPageLabel = "Trang Đầu";
        this.paginator._intl.lastPageLabel = "Trang Cuối";
        this.paginator._intl.previousPageLabel = "Trang Trước";
        this.paginator._intl.nextPageLabel = "Trang Tiếp";
      });
  }

  public save() {
    switch (this.typeOfSave) {
      case SAVE.ADD:
        let temp = this.selection.selected.map(x => new Object({
          id: null,
          id_ccn: this.data.cluster_data,
          mst: x.mst,
        }))

        this.indService.PostClusterBusiness(temp).subscribe(
          next => {
            if (next.id == -1) {
              this.info.msgError("Lưu lỗi! Lý do: " + next.message);
            }
            else {
              this.info.msgSuccess("Dữ liệu được lưu thành công!");
              this.dialogRef.close();
            }
          },
          error => {
            this.info.msgError(error.message);
          }
        )
        break;
      default:
        break;
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  selection = new SelectionModel<ClusterBusiness>(true, []);

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

  checkboxLabel(row?: ClusterBusiness): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

  removeRows() {
    if (confirm('Bạn Có Chắc Muốn Xóa?')) {
      let temp = this.selection.selected.map(x => new Object({ id: x.id_dn }))
      this.indService.DeleteClusterBusiness(temp).subscribe(res => {
        this.info.msgSuccess('Xóa thành công')
        this.dialogRef.close()
        this.selection.clear();
        this.paginator.pageIndex = 0;
      })
    }
  }
}
