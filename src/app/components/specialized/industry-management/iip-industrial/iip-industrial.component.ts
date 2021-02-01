//Import library
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material';
import { MatAccordion } from '@angular/material/expansion';
import { MatPaginator } from '@angular/material/paginator';
//Import service
import { BreadCrumService } from 'src/app/_services/injectable-service/breadcrums.service';
//Import Model
import { IIPIndustrialModel } from 'src/app/_models/industry.model';
import { LinkModel } from 'src/app/_models/link.model';
import { ActivatedRoute, Router } from '@angular/router';
import * as XLSX from 'xlsx';

@Component({
    selector: 'iip-industrial',
    templateUrl: './iip-industrial.component.html',
    styleUrls: ['/../../special_layout.scss'],
})

export class IipIndustrialComponent implements OnInit {
    //Constant variable -----------------------------------------------------------
    private readonly REDIRECT_PAGE: string = "/specialized/industry-management/iip/iip-detail";
    private readonly LINK_DEFAULT: string = "/specialized/industry-management/iip";
    private readonly TITLE_DEFAULT: string = "Chỉ số sản xuất công nghiệp";
    private readonly TEXT_DEFAULT: string = "Chỉ số sản xuất công nghiệp";
    public readonly DISPLAY_COLS: string[] = ['index', 'chi_tieu', 'don_vi', 'thang_1', 'thang_2', 'thang_3',
        'thang_4', 'thang_5', 'thang_6', 'thang_7', 'thang_8', 'thang_9', 'thang_10', 'thang_11', 'thang_12'];
    private readonly DATA_DEFAULT: IIPIndustrialModel[] = [
        { thu_tu: "I", chi_tieu: "Chỉ số sản xuất công nghiệp (IIP) giá so sánh năm 2010", don_vi: "%", thang_1: 110.52, thang_2: 110.52, thang_3: 104.46, thang_4: 93.84, thang_5: 104.1, thang_6: 116.35, thang_7: 111.21, thang_8: 115.2, thang_9: 117.04, thang_10: 116.32, thang_11: 119.5, thang_12: 0 },
        { thu_tu: "1", chi_tieu: "Công nghiệp khai khoáng", don_vi: "%", thang_1: 50.92, thang_2: 50.92, thang_3: 87.62, thang_4: 58.15, thang_5: 83.13, thang_6: 92.29, thang_7: 83.72, thang_8: 94.9, thang_9: 105.69, thang_10: 101.32, thang_11: 108.12, thang_12: 0 },
        { thu_tu: "2", chi_tieu: "Công nghiệp chế biến, chế tạo", don_vi: "%", thang_1: 113.94, thang_2: 113.94, thang_3: 105.13, thang_4: 94.55, thang_5: 103.77, thang_6: 117.16, thang_7: 111.89, thang_8: 115.9, thang_9: 118.14, thang_10: 117.51, thang_11:120.72, thang_12: 0 },
        { thu_tu: "3", chi_tieu: "Công nghiệp sản xuất, phân phối điện, khí đốt", don_vi: "%", thang_1: 98.47, thang_2: 98.47, thang_3: 103.53, thang_4: 100.43, thang_5: 120.69, thang_6: 115.38, thang_7: 109.75, thang_8: 108.48, thang_9: 101.17, thang_10: 102.3, thang_11: 105.09, thang_12: 0 },
        { thu_tu: "4", chi_tieu: "Cung cấp nước, quản lý và xử lý nước thải, rác thải", don_vi: "%", thang_1: 119.76, thang_2: 119.76, thang_3: 94.33, thang_4: 112.7, thang_5: 114.21, thang_6: 105.15, thang_7: 115.95, thang_8: 121.8, thang_9: 118.57, thang_10: 103.33, thang_11: 101.36, thang_12: 0 },
        { thu_tu: "II", chi_tieu: "Một số sản phẩm công nghiệp chủ yếu", don_vi: null, thang_1: null, thang_2: null, thang_3: null, thang_4: null, thang_5: null, thang_6: null, thang_7: null, thang_8: null, thang_9: null, thang_10: null, thang_11: null, thang_12: null },
        { thu_tu: "1", chi_tieu: "Đá xây dựng khác", don_vi: "M3", thang_1: 187778.154200283, thang_2: 187778.154200283, thang_3: 255612, thang_4: 184893, thang_5: 262238, thang_6: 265206.401033809, thang_7: 205169.5, thang_8: 211774.304054183, thang_9: 218839, thang_10: 217011.248810571, thang_11: 229385.25, thang_12: 0 },
        { thu_tu: "2", chi_tieu: "Hạt điều nhân", don_vi: "Tấn", thang_1: 14979.675541935, thang_2: 14979.675541935, thang_3: 16827, thang_4: 16509, thang_5: 20915, thang_6: 22489.6479164076, thang_7: 17576.79, thang_8: 18647.2217457345, thang_9: 20693, thang_10: 22034.3586275181, thang_11: 22335.979, thang_12: 0 },
        { thu_tu: "3", chi_tieu: "Vải dệt nổi vòng, vải sonin từ sợi nhân tạo", don_vi: "1000 m2", thang_1: 1650, thang_2: 1650, thang_3: 1500, thang_4: 1200, thang_5: 1555, thang_6: 1750, thang_7: 1735, thang_8: 1750, thang_9: 1500, thang_10: 1550, thang_11: 1520, thang_12: 0 },
        { thu_tu: "4", chi_tieu: "Dịch vụ in từ sợi và vải (gồm cả đồ để mặc)", don_vi: "Triệu đồng", thang_1: 80498.0818816427, thang_2: 80498.0818816427, thang_3: 76096, thang_4: 69208, thang_5: 80534, thang_6: 89971.058260979, thang_7: 87910.72, thang_8: 89157.6781594863, thang_9: 90716, thang_10: 91688.571786206, thang_11: 92605.457, thang_12: 0 },
        { thu_tu: "5", chi_tieu: "Dịch vụ hoàn thiện sản phẩm dệt khác", don_vi: "Triệu đồng", thang_1: 57662.6225928212, thang_2: 57662.6225928212, thang_3: 56322, thang_4: 50309, thang_5: 57688, thang_6: 58848.486510168, thang_7: 57498.86, thang_8: 58316.4688941088, thang_9: 59825, thang_10: 60721.0611743829, thang_11: 61328.271, thang_12: 0 },
        { thu_tu: "6", chi_tieu: "Quần áo các loại", don_vi: "1000 cái ", thang_1: 4712.66, thang_2: 4712.66, thang_3: 3434, thang_4: 4434, thang_5: 4708, thang_6: 4829, thang_7: 4889, thang_8: 3989.20083572735, thang_9: 4879, thang_10: 4899, thang_11: 4944 , thang_12: 0 },
        { thu_tu: "7", chi_tieu: "Giày, dép có đế hoặc mũ bằng da", don_vi: "1000 đôi", thang_1: 725.339764117785, thang_2: 725.339764117785, thang_3: 602, thang_4: 500, thang_5: 500, thang_6: 818.91359603218, thang_7: 828.41, thang_8: 709.332265875185, thang_9: 668, thang_10: 770.360852925096, thang_11: 500, thang_12: 0 },
        { thu_tu: "8", chi_tieu: "Dịch vụ sản xuất giày, dép", don_vi: "Triệu đồng", thang_1: 37946.1638799953, thang_2: 37946.1638799953, thang_3: 37353, thang_4: 38190, thang_5: 38778, thang_6: 39952.9964747356, thang_7: 39298.49, thang_8: 39885.0372455863, thang_9: 31443, thang_10: 31446.5408805031, thang_11:31761, thang_12: 0 },
        { thu_tu: "9", chi_tieu: "Gỗ cưa xẻ các loại", don_vi: "M3", thang_1: 16624.2797002457, thang_2: 16624.2797002457, thang_3: 16217, thang_4: 16834, thang_5: 117866, thang_6: 19719, thang_7: 20746, thang_8: 16469.4912486605, thang_9: 16450, thang_10: 21696, thang_11:  21927, thang_12: 0 },
        { thu_tu: "10", chi_tieu: "Ván ép từ gỗ và các vật liệu tương tự", don_vi: "M3", thang_1: 94313.0579944295, thang_2: 94313.0579944295, thang_3: 89927, thang_4: 84859, thang_5: 97928, thang_6: 101551.140322587, thang_7: 101493.31, thang_8: 102153.943122504, thang_9: 142487, thang_10: 78282.0624999518, thang_11: 79025, thang_12: 0 },
        { thu_tu: "11", chi_tieu: "Bao bì và túi bằng giấy nhăn và bìa nhăn", don_vi: "1000 chiếc", thang_1: 6500, thang_2: 6500, thang_3: 6366, thang_4: 4456, thang_5: 3496, thang_6: 6750, thang_7: 13211, thang_8: 6750, thang_9: 12976, thang_10: 10385, thang_11: 10500, thang_12: 0 },
        { thu_tu: "12", chi_tieu: "Các hợp chất từ cao su các loại nhựa tự nhiên tương tự, ở dạng nguyên sinh hoặc tấm lỏ hoặc dải", don_vi: "Tấn", thang_1: 3705, thang_2: 3705, thang_3: 3287, thang_4: 3800, thang_5: 1565, thang_6: 3646.25, thang_7: 3122.01, thang_8: 3200, thang_9: 3531, thang_10: 3242, thang_11:3750, thang_12: 0 },
        { thu_tu: "13", chi_tieu: "Dịch vụ sản xuất tấm, phiến, ống và các mặt nghiêng bằng plastic", don_vi: "Tấn", thang_1: 15510.658606427, thang_2: 15510.658606427, thang_3: 15112, thang_4: 7555, thang_5: 15667, thang_6: 16060.9193574042, thang_7: 16029.45, thang_8: 15985.9099184675, thang_9: 17415, thang_10: 17960.7406818724, thang_11: 18119.685, thang_12: 0 },
        { thu_tu: "14", chi_tieu: "Xi măng Portland đen", don_vi: "Tấn", thang_1: 106703, thang_2: 106703, thang_3: 140000, thang_4: 100000, thang_5: 101700, thang_6: 110550, thang_7: 112750, thang_8: 112180, thang_9: 111600, thang_10: 115800, thang_11: 116700, thang_12: 0 },
        { thu_tu: "15", chi_tieu: "Chì chưa gia công", don_vi: "Tấn", thang_1: 2400, thang_2: 2400, thang_3: 2350, thang_4: 1175, thang_5: 1200, thang_6: 1225, thang_7: 1250, thang_8: 1300, thang_9: 1250, thang_10: 1285, thang_11: 1295, thang_12: 0 },
        { thu_tu: "16", chi_tieu: "Dịch vụ sản xuất bao bì bằng kim loại", don_vi: "Triệu đồng", thang_1: 23576.063446287, thang_2: 23576.063446287, thang_3: 20871, thang_4: 10448, thang_5: 10828, thang_6: 27362.3894603862, thang_7: 29110.63, thang_8: 28236.56494734, thang_9: 53289, thang_10: 40995.6787900612, thang_11: 40274.576, thang_12: 0 },
        { thu_tu: "17", chi_tieu: "Tủ, bàn, đồ nội thất bàng gỗ", don_vi: "Chiếc", thang_1: 94587.83, thang_2: 94587.83, thang_3: 77507, thang_4: 38757, thang_5: 107320, thang_6: 101.382, thang_7: 87.756, thang_8: 87340.6868972367, thang_9: 87784, thang_10: 95285, thang_11: 77623, thang_12: 0 },
        { thu_tu: "18", chi_tieu: "Điện sản xuất", don_vi: "Triệu KWh", thang_1: 73.4, thang_2: 73.4, thang_3: 75, thang_4: 77, thang_5: 125, thang_6: 121.655329289428, thang_7: 121.66, thang_8: 121.655329289428, thang_9: 118, thang_10: 129.698656845754, thang_11:132.714, thang_12: 0 },
    ]
    //TS & HTML variable -----------------------------------------------------------
    public dataSource: MatTableDataSource<IIPIndustrialModel> = new MatTableDataSource<IIPIndustrialModel>();
    public year: number = 2020;
    public years: number[] = [2019, 2020];
    //Only TS Variable ------------------------------------------------------------
    private _linkOutput: LinkModel = new LinkModel();
    //ViewChild & Input & Output -------------------------------------------------
    @ViewChild(MatAccordion, { static: false }) accordion: MatAccordion;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild('TABLE', { static: false }) table: ElementRef;

    exportExcel() {
        const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table.nativeElement);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Chỉ số sản xuất công nghiệp');

        XLSX.writeFile(wb, 'Chỉ số sản xuất công nghiệp.xlsx');

    }

    //Contructor + Init + Destroy
    constructor(
        private _breadCrumService: BreadCrumService,
        private _router: Router
    ) { }

    ngOnInit() {
        this.year = 2020;
        this.initData();
        this.sendLinkToNext(true);
    }
    //HTML & TS Function ----------------------------------------------------------
    public ChangeYear(year: number): void {
        if (year == 2020) {
            this.dataSource = new MatTableDataSource(this.DATA_DEFAULT);
            this.dataSource.paginator = this.paginator;
        }
        else {
            this.dataSource = new MatTableDataSource();
            this.dataSource.paginator = this.paginator;
        }
    }
    public OpenDetail(month: number, year: number) {
        this._router.navigate([this.REDIRECT_PAGE], { queryParams: { year: year, month: month } });
        //     const url = this._router.serializeUrl(this._router.createUrlTree([encodeURI('#') + this.REDIRECT_PAGE], { queryParams: { month: month, year: year} })
        //   );
        //   window.open(url.replace('%23','#'));
    }
    //TS Function -----------------------------------------------------------------
    private initData(): void {
        this.year = this.getCurrentYear();
        console.log("year:", this.year);
        this.dataSource = new MatTableDataSource(this.DATA_DEFAULT);
        this.dataSource.paginator = this.paginator;
        this.paginator._intl.itemsPerPageLabel = 'Số hàng';
        this.paginator._intl.firstPageLabel = "Trang Đầu";
        this.paginator._intl.lastPageLabel = "Trang Cuối";
        this.paginator._intl.previousPageLabel = "Trang Trước";
        this.paginator._intl.nextPageLabel = "Trang Tiếp";
    }

    private sendLinkToNext(type: boolean): void {
        this._linkOutput.link = this.LINK_DEFAULT;
        this._linkOutput.title = this.TITLE_DEFAULT;
        this._linkOutput.text = this.TEXT_DEFAULT;
        this._linkOutput.type = type;
        this._breadCrumService.sendLink(this._linkOutput);
    }
    private getCurrentYear(): number {
        var currentDate = new Date();
        return currentDate.getFullYear();
    }
}