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

@Component({
    selector: 'detail-cluster-management',
    templateUrl: './detail-cluster-management.component.html',
    styleUrls: ['../../../special_layout.scss'],
})
export class DetailClusterManagementComponent implements OnInit {
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
        private indService : IndustryManagementService
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
    _getClusterDetail(id_cluster: number) {
        this.indService.GetDetailGroupCompany(id_cluster).subscribe(res => {
            this._clusterDetail = res['data'][0][0];
            this.handelData();
        });   
    }
    
    handelData(){
            let dataTableTemp: ClusterDetailShortModel[] = [];
            dataTableTemp.push(new ClusterDetailShortModel("Tên cụm công nghiệp", this._clusterDetail.ten_cum));
            dataTableTemp.push(new ClusterDetailShortModel("Chủ đầu tư", this._clusterDetail.chu_dau_tu));
            dataTableTemp.push(new ClusterDetailShortModel("Địa chỉ", this._clusterDetail.dia_chi));
            let coSoPhapLy: string = "";
            // this._clusterDetail.co_so_phap_lys.forEach(element => coSoPhapLy += element + "<br>");
            dataTableTemp.push(new ClusterDetailShortModel("Cơ sở pháp lý", this._clusterDetail.quyet_dinh_thanh_lap));
            let dieuKienKinhDoanh: string = "";
            // this._clusterDetail.dang_ki_kinh_doanh.forEach(element => dieuKienKinhDoanh += element + "<br>");
            dataTableTemp.push(new ClusterDetailShortModel("Điều kiện Kinh doanh", this._clusterDetail.dieu_kien_kinh_doanh));
            let viTriQuyMo: string = "";
            // this._clusterDetail.vi_tri_quy_mo.forEach(element => viTriQuyMo += element + "<br>");
            dataTableTemp.push(new ClusterDetailShortModel("Vị trí, quy mô", this._clusterDetail.vi_tri_quy_mo));
            dataTableTemp.push(new ClusterDetailShortModel("Tổng mức đầu tư", this._clusterDetail.tong_muc_dau_tu));
            dataTableTemp.push(new ClusterDetailShortModel("Quy mô, diện tích", this._clusterDetail.quy_mo_dien_tich));
            dataTableTemp.push(new ClusterDetailShortModel("Diễn giải", this._clusterDetail.dien_giai));
            this.dataSource.data = dataTableTemp;
        // }
    }
}