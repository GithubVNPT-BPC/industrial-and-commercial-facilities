import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material';
import { SCTService } from 'src/app/_services/APIService/sct.service';
import { District } from 'src/app/_models/district.model';
import { ClusterFilterModel, ClusterModel } from 'src/app/_models/APIModel/cluster.model';
import { ClusterDetailModel, ClusterDetailShortModel } from 'src/app/_models/industry.model';
import { ActivatedRoute } from '@angular/router';
import { LinkModel } from 'src/app/_models/link.model';
import { BreadCrumService } from 'src/app/_services/injectable-service/breadcrums.service';
import { IndustryManagementService } from 'src/app/_services/APIService/industry-management.service';
import { environment } from 'src/environments/environment';
import { MatCarousel, MatCarouselComponent } from '@ngmodule/material-carousel';
import { Router } from '@angular/router';
import { ClusterBusinessComponent } from '../cluster-business/cluster-business.component';
import { MatDialog } from '@angular/material';
import { SAVE } from 'src/app/_enums/save.enum';
import { InformationService } from 'src/app/shared/information/information.service';

@Component({
    selector: 'detail-cluster-management',
    templateUrl: './detail-cluster-management.component.html',
    styleUrls: ['../../../special_layout.scss'],
})
export class DetailClusterManagementComponent implements OnInit {

    serverUrl = environment.apiEndpoint
    topColumns: string[] = ['index', 'chi_tieu', 'dien_giai'];
    dataSource: MatTableDataSource<ClusterDetailShortModel> = new MatTableDataSource<ClusterDetailShortModel>();
    public data: ClusterDetailModel[] = [
    ]
    //Constant
    private readonly LINK_DEFAULT: string = "/specialized/industry-management/cluster";
    private readonly TITLE_DEFAULT: string = "Chi tiết - Cụm công nghiệp";
    private readonly TEXT_DEFAULT: string = "Chi tiết - Cụm công nghiệp";
    //Variable for only ts
    private _linkOutput: LinkModel = new LinkModel();

    public _clusterDetail: ClusterDetailModel = new ClusterDetailModel();
    private _id: number = 0;
    public tenCumCongNghiep: string;
    @ViewChild('table', { static: false }) table: MatTable<ClusterModel>;

    constructor(
        private _breadCrumService: BreadCrumService,
        public route: ActivatedRoute,
        private indService: IndustryManagementService,
        public router: Router,
        public dialog: MatDialog,
        public _info: InformationService,
    ) {
        this.route.params.subscribe(params => {
            this._id = params['id'];
        });
    }

    ngOnInit() {
        this._getClusterDetail(this._id);
        this.sendLinkToNext(true);
    }

    public sendLinkToNext(type: boolean) {
        this._linkOutput.link = this.LINK_DEFAULT;
        this._linkOutput.title = this.TITLE_DEFAULT;
        this._linkOutput.text = this.TEXT_DEFAULT;
        this._linkOutput.type = type;
        this._breadCrumService.sendLink(this._linkOutput);
    }

    imageurls = [];
    imageUrl: string[]
    imagesSource: string[]
    fileSource: string

    _getClusterDetail(id_cluster: number) {
        this.indService.GetDetailGroupCompany(id_cluster).subscribe(res => {
            this._clusterDetail = res['data'][0][0];
            this.fileSource = this._clusterDetail.duong_dan;

            this.imagesSource = res.data[1];

            let temList = [];
            this.imageUrl = [...this.imagesSource];
            for (const imageObject of this.imageUrl) {
                if (this._id == imageObject['id_cum_cong_nghiep']) {
                    imageObject['image'] = this.serverUrl + imageObject['duong_dan'];
                    temList.push(imageObject['image']);
                }
            }
            this.imageurls = [...temList];
            this.handelData();
        });
    }

    handelData() {
        let dataTableTemp: ClusterDetailShortModel[] = [];
        dataTableTemp.push(new ClusterDetailShortModel("Tên cụm công nghiệp", this._clusterDetail.ten_cum));
        dataTableTemp.push(new ClusterDetailShortModel("Chủ đầu tư", this._clusterDetail.chu_dau_tu));
        dataTableTemp.push(new ClusterDetailShortModel("Địa chỉ", this._clusterDetail.dia_chi));
        dataTableTemp.push(new ClusterDetailShortModel("Cơ sở pháp lý", this._clusterDetail.quyet_dinh_thanh_lap));
        dataTableTemp.push(new ClusterDetailShortModel("Điều kiện Kinh doanh", this._clusterDetail.dieu_kien_kinh_doanh));
        dataTableTemp.push(new ClusterDetailShortModel("Vị trí, quy mô", this._clusterDetail.vi_tri_quy_mo));
        dataTableTemp.push(new ClusterDetailShortModel("Tổng mức đầu tư", this._clusterDetail.tong_muc_dau_tu));
        dataTableTemp.push(new ClusterDetailShortModel("Quy mô, diện tích", this._clusterDetail.quy_mo_dien_tich));
        dataTableTemp.push(new ClusterDetailShortModel("Diễn giải", this._clusterDetail.dien_giai));
        this.dataSource.data = dataTableTemp;
    }

    public DownloadFile() {
        if (this.fileSource != null) {
            // window.location.href = this.indService.Downloadfile(this.fileSource)
            window.open(this.indService.Downloadfile(this.fileSource), "_blank");
        }
        else {
            this._info.msgWaring('Chưa upload file cho CCN này')
        }
    }

    public addclusterbusiness() {
        const dialogRef = this.dialog.open(ClusterBusinessComponent, {
            data: {
                message: 'Thêm DN thuộc CCN',
                cluster_data: this._id,
                typeOfSave: SAVE.ADD,
            }
        });
    }

    public editclusterbusiness() {
        const dialogRef = this.dialog.open(ClusterBusinessComponent, {
            data: {
                message: 'Danh sách DN thuộc CCN',
                cluster_data: this._id,
                typeOfSave: SAVE.CLUSTER,
            }
        });
    }

    public Back() {
        this.router.navigate(['/specialized/industry-management/cluster/']);
    }
}