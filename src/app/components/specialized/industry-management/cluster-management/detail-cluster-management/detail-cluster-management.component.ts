import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material';
import { SCTService } from 'src/app/_services/APIService/sct.service';
import { District } from 'src/app/_models/district.model';
import { ClusterFilterModel, ClusterModel } from 'src/app/_models/APIModel/cluster.model';
import { ClusterDetailModel, ClusterDetailShortModel } from 'src/app/_models/industry.model';
import { ActivatedRoute } from '@angular/router';
import { LinkModel } from 'src/app/_models/link.model';
import { BreadCrumService } from 'src/app/_services/injectable-service/breadcrums.service';


@Component({
    selector: 'detail-cluster-management',
    templateUrl: './detail-cluster-management.component.html',
    styleUrls: ['../../../special_layout.scss'],
})

export class DetailClusterManagementComponent implements OnInit {
    topColumns: string[] = ['index', 'chi_tieu', 'dien_giai'];
    dataSource: MatTableDataSource<ClusterDetailShortModel> = new MatTableDataSource<ClusterDetailShortModel>();
    public data: ClusterDetailModel[] = [
        {
            chu_dau_tu: "Công ty CP ĐT BĐS Thành Phương",
            co_so_phap_lys: [
                "Quyết định thành lập số 1687/QĐ-UBND ngày 23/7/2020 của UBND tỉnh",
            ],
            dia_chi: "Thị trấn ấp Dên Dên, Tân Phú, huyện Đồng Phú, tỉnh Bình Phước",
            dien_giai: "<strong>Tiến độ thành lập</strong><br>+ Tiến độ thực hiện dự án đầu tư xây dựng hạ tầng kỹ thuật: 2020-2021, thời gian hoạt động của dự án 50 năm<br><strong>Ngành nghề thu hút đầu tư</strong><br>Các ngành nghề được khuyến khích đầu tư trong lĩnh vực sản xuất hàng tiêu dùng; sản xuất đồ uống, giải khát; sản xuất chế biến sản phẩm từ thịt, đóng gói thịt, sản xuất hàng may mặc, giày da, túi ví, hoàn thiện các sản phầm dệt; Các ngành nghề được khuyến khích đầu tư trong lĩnh vực sản xuất hàng thủ công mỹ nghệ cao như: Sản xuất tranh đá; chế tác đá mỹ nghệ; điêu khắc, tạc tượng; trang trí nội thất; sản xuất sản phẩm mây tre đan; sản xuất hàng thủ công mỹ nghệ khác... gắn với khu xứ lý nước thải tập trung ",
            dien_tich: 59.3,
            hinh_anhs: [
                "./assets/img/cluster/TANPHU/CNN-TANPHU-001.png",
                "./assets/img/cluster/TANPHU/CNN-TANPHU-002.png",
                "./assets/img/cluster/TANPHU/CNN-TANPHU-003.png",
                "./assets/img/cluster/TANPHU/CNN-TANPHU-004.png",
                "./assets/img/cluster/TANPHU/CNN-TANPHU-005.png",
                "./assets/img/cluster/TANPHU/CNN-TANPHU-006.png"
            ],
            id: 20,
            ten_cum_cong_nghiep: "Cụm công nghiệp Tân Phú",
            downloadPDF: "./assets/img/cluster/TANPHU/QH05A-KS KTCQ TAN PHU.pdf",
            tong_muc_dau_tu : "410 tỷ đồng",
            vi_tri_quy_mo: [
                "Khu đất quy hoạch tọa lạc tại ấp Dên Dên, thị trấn Tân Phú huyện Đồng Phú, tỉnh Bình Phước có tứ cận tiếp giáp như sau:",
                "Phía Đông: giáp đất dân Thị trấn Tân Phú, cách hồ Bàu Cọp khoảng  250m.",
                "Phía Tây giáp đường huyện Tân Phú - Tiến Hưng và ranh Thành Phố Đồng Xoài",
                "Phía Nam giáp đất trồng cây cao su của Nông Trường cao su Tân Lợi và đất quy hoạch khu dân cư huyện lỵ Đồng Phú.",
                "Phía Bắc giáp đất trồng cây cao su của Nông Trường cao su Tân Lợi, Cụm công nghiệp Tiến Hưng"
            ],
            quy_mo_dien_tich : "59.3 ha",
            dang_ki_kinh_doanh : [
                "Giấy chứng nhận đăng ký kinh doanh số: 3702457025",
                "Đăng ký lần đầu ngày 25/4/2016, thay đổi lần thứ nhất ngày 22/5/2018,Cơ quan cấp: Sở Kế hoạch và Đầu tư tỉnh Bình Dương"
            ]
        },
        {
            chu_dau_tu: "Tổng công ty thương mại xuất nhập khẩu Thanh Lễ - CTCP",
            co_so_phap_lys: [
                "Quyết định thành lập số 1687/QĐ-UBND ngày 23/7/2020 của UBND tỉnh"
            ],
            dia_chi: "Ấp 6, xã Nha Bích, huyện Chơn Thành, tỉnh Bình Phước ",
            dien_giai: "<strong>Tiến độ thành lập</strong><br>+ Hoàn thiện thủ tục xin thành lập cụm công nghiệp, Quyết định thành lập: Từ tháng 6/2020 đến tháng 7/2020;<br>+ Hoàn thành thủ tục chuyển mục đích sử dụng đất, cấp giấy chứng nhận quyền sử dụng đất: Từ tháng 8/2020 đến tháng 10/2020;<br>+ Hoàn thiện hồ sơ đồ án quy hoạch tỷ lệ 1/500, trình cấp có thẩm quyền phê duyệt: Từ tháng 8/2020 đến tháng 10/2020;<br>+ Hoàn thiện hồ sơ dự án đầu tư, thiết kế cơ sở trình cấp có thẩm quyền phê duyệt: Từ tháng 11/2020 đến tháng 12/2020;<br>+ Khởi công xây dựng hạ tầng kỹ thuật cụm công nghiệp: Từ tháng 01/2021 đến tháng 06/2021;<br><strong>Ngành nghề thu hút đầu tư</strong><br>+ Chế biến nông, lâm sản; <br>+ Chế biến gỗ;<br>+ Chế biến thức ăn gia súc, gia cầm, thuỷ sản;<br>+ Chế biến thực phẩm, nước giải khát; <br>+ Sản xuất vật liệu xây dựng; <br>+ Cơ khí chế tạo máy; <br>+ Linh kiện điện tử; <br>+ Sản xuất giấy, bao bì <br>+ Các ngành công nghiệp hỗ trợ.",
            dien_tich: 74.59,
            hinh_anhs: [
                "./assets/img/cluster/TANPHU/CNN-TANPHU-001.png",
                "./assets/img/cluster/TANPHU/CNN-TANPHU-002.png",
                "./assets/img/cluster/TANPHU/CNN-TANPHU-003.png",
                "./assets/img/cluster/TANPHU/CNN-TANPHU-004.png",
                "./assets/img/cluster/TANPHU/CNN-TANPHU-005.png",
                "./assets/img/cluster/TANPHU/CNN-TANPHU-006.png"
            ],
            id: 40,
            ten_cum_cong_nghiep: "Cụm công nghiệp Nha Bích",
            downloadPDF: "./assets/img/cluster/NHABICH/QH CANH QUAN CCN NHA BICH.pdf",
            tong_muc_dau_tu : "449 tỷ đồng",
            vi_tri_quy_mo: [
                "Phía Đông tiếp giáp đất của dân trồng cao su",
                "Phía Tây tiếp giáp vùng ngập Hồ Phước Hòa",
                "Phía Nam tiếp giáp đất trồng cao su của dân",
                "Phía Bắc tiếp giáp với đường nhựa rộng 8m"
            ],
            quy_mo_dien_tich : "74.59",
            dang_ki_kinh_doanh : [
                "Giấy chứng nhận đăng ký kinh doanh số:3700146458",
                "Đăng ký lần đầu ngày 01/7/2010, thay đổi lần thứ 8 ngày 02/01/2018,Cơ quan cấp: Sở Kế hoạch và Đầu tư tỉnh Bình Dương"
            ]
        },
        {
            chu_dau_tu: "Công ty TNHH MTV cao su Phú Riềng",
            co_so_phap_lys: [
                "QĐ số 1759/QĐ-UBND ngày 21/7/2020 của UBND tỉnh thành lập CCN Minh Hưng 1"
            ],
            dia_chi: "Thôn 1, xã M inh Hưng, huyện Bù Đăng",
            dien_giai: "<strong>Tiến độ thành lập</strong><br>+ Tiến độ thực hiện dự án đầu tư xây dựng hạ tầng kỹ thuật: 2020-2022, thời gian hoạt động của dự án 50 năm<br><strong>Ngành nghề thu hút đầu tư</strong><br>Tiếp nhận một số cơ sở sản xuất phải di dời vào cụm công nghiệp; sản xuất sản phẩm, phụ tùng, lắp ráp và sửa chữa máy móc, thiết bị phục vụ sản xuất nông nghiệp, nông thôn; chế biên nông sản, sản xuất thực phẩm và sản xuất hàng tiêu dùng, gắn với khu xử lý nước thải tập trung",
            dien_tich: 43.4,
            hinh_anhs: [
                "./assets/img/cluster/TANPHU/CNN-TANPHU-001.png",
                "./assets/img/cluster/TANPHU/CNN-TANPHU-002.png",
                "./assets/img/cluster/TANPHU/CNN-TANPHU-003.png",
                "./assets/img/cluster/TANPHU/CNN-TANPHU-004.png",
                "./assets/img/cluster/TANPHU/CNN-TANPHU-005.png",
                "./assets/img/cluster/TANPHU/CNN-TANPHU-006.png"
            ],
            id: 21,
            ten_cum_cong_nghiep: "Cụm công nghiệp Minh Hưng I",
            downloadPDF: "./assets/img/cluster/TANPHU/QH05A-KS KTCQ TAN PHU.pdf",
            tong_muc_dau_tu : "",
            vi_tri_quy_mo: [
                "- Phía Đông tiếp giáp đường liên thôn láng nhựa có giao cắt với QL 14 và KDC tập trung",
                "- Phía Tây tiếp giáp đường liên thôn láng nhựa hiện hữu có giao cắt với QL14 và KDC tập trung",
                "- Phía Nam tiếp giáp đất dân và khu dân cư sinh sống rải rác;",
                "- Phía Bắc tiếp giáp đất dân và khu dân cư sinh sống rải rác;"
            ],
            quy_mo_dien_tich : "43.4 ha",
            dang_ki_kinh_doanh : [
                "Giấy chứng nhận đăng ký kinh doanh số: 3800100062",
                "Đăng ký lần đầu ngày 01/7/2010, thay đổi lần thứ 2 ngày 29/8/2019,Cơ quan cấp: Sở Kế hoạch và Đầu tư tỉnh Bình Phước"
            ]
        }
        ,
        {
            chu_dau_tu: "Công ty TNHH MTV cao su Phú Riềng",
            co_so_phap_lys: [
                "QĐ số 1173/QĐ-UBND ngày 26/5/2020 của UBND tỉnh thành lập CCN Minh Hưng 2",
                "Quyết định số 2232/QĐ-UBND ngày 09/9/2020 tỉnh điều chỉnh Quyết định số 1173/QĐ-UBND"
            ],
            dia_chi: "Quốc lộ 14, thôn 4, xã Minh Hưng, huyện Bù Đăng",
            dien_giai: "<strong>Tiến độ thành lập</strong><br>+ Tiến độ thực hiện dự án đầu tư xây dựng hạ tầng kỹ thuật: 2020-2022, thời gian hoạt động của dự án 50 năm<br><strong>Ngành nghề thu hút đầu tư</strong><br>Tiếp nhận một số cơ sở sản xuất phải di dời vào cụm công nghiệp; sản xuất sản phẩm, phụ tùng, lắp ráp và sửa chữa máy móc, thiết bị phục vụ sản xuất nông nghiệp, nông thôn; chế biên nông sản, sản xuất thực phẩm và sản xuất hàng tiêu dùng, gắn với khu xử lý nước thải tập trung"
            ,dien_tich: 32.7,
            hinh_anhs: [
                "./assets/img/cluster/TANPHU/CNN-TANPHU-001.png",
                "./assets/img/cluster/TANPHU/CNN-TANPHU-002.png",
                "./assets/img/cluster/TANPHU/CNN-TANPHU-003.png",
                "./assets/img/cluster/TANPHU/CNN-TANPHU-004.png",
                "./assets/img/cluster/TANPHU/CNN-TANPHU-005.png",
                "./assets/img/cluster/TANPHU/CNN-TANPHU-006.png"
            ],
            id: 22,
            ten_cum_cong_nghiep: "Cụm công nghiệp Minh Hưng II",
            downloadPDF: "./assets/img/cluster/TANPHU/QH05A-KS KTCQ TAN PHU.pdf",
            tong_muc_dau_tu : "",
            vi_tri_quy_mo: [
                "Khu đất tiếp giáp đường Quốc lộ 14, thuộc ấp 4, xã Minh Hưng, huyện Bù Đăng"
            ],
            quy_mo_dien_tich : "32.7 ha",
            dang_ki_kinh_doanh : [
                "Giấy chứng nhận đăng ký kinh doanh số: 3800100062",
                "Đăng ký lần đầu ngày 01/7/2010, thay đổi lần thứ 2 ngày 29/8/2019,Cơ quan cấp: Sở Kế hoạch và Đầu tư tỉnh Bình Phước"
            ]
        },
        {
            chu_dau_tu: "Công ty CP ĐT BĐS Thành Phương",
            co_so_phap_lys: [
                "Quyết định thành lập số 1685/QĐ-UBND ngày 23/7/2020 của UBND tỉnh"
            ],
            dia_chi: "Ấp Thái Dũng, xã Tân Tiến, huyện Đồng Phú",
            dien_giai: "<strong>Tiến độ thành lập</strong><br>+ Tiến độ thực hiện dự án đầu tư xây dựng hạ tầng kỹ thuật: 2020-2021, thời gian hoạt động của dự án 50 năm<br><strong>Ngành nghề thu hút đầu tư</strong><br>Đầu tư sản xuất sản phẩm, phụ tùng, lắp áp và sửa chữa máy móc, thiết bị phục vụ sản xuất nông nghiệp, nông thôn như: Chế tạo, lắp ráp thiết bị điện; linh kiện điện tử; thiết bị năng lượng mặt trời; cơ khí; sản phẩm phụ trợ may mặc; sản xuất đồ gia dụng; sắt thép; kho bãi; Các ngành nghề được khuyến khích đầu tư trong lĩnh vực khác là sản xuất thuốc chữa bệnh cho con người đạt tiêu chuẩn GMP quốc tế; sản xuất nguyên liệu thuốc kháng sinh; sản xuất thuốc; chế biến dược liệu, sản xuất thuốc từ dược liệu; sản xuất thuốc đông y; sản xuất nhân và lai tạo giống cây trồng, vật nuôi; sản xuất bao bì đóng gói các sản phẩm nông lâm; Thu hút đầu tư các sản phẩm tiêu dùng, sử dụng nguyên liệu tại chỗ, lao động ở địa phương như: Sản xuất vật liệu xây dựng và trang trí nội thất; chế biến nông sản, sản xuất thức ăn gia súc, gia cầm, sản phẩm sử dụng nguyên liệu tại chỗ; sản xuất dụng cụ thể dục thể thao; sản xuất giầy, hàng may mặc; sản xuất gốm sứ; sản xuất các sản phẩm kim loại; sản xuất sữa và các sản phẩm chức năng, dược phẩm, mỹ phẩm ...gắn với khu xứ lý nước thải tập trung trong CCN",
            dien_tich: 55.9,
            hinh_anhs: [
                "./assets/img/cluster/TANPHU/CNN-TANPHU-001.png",
                "./assets/img/cluster/TANPHU/CNN-TANPHU-002.png",
                "./assets/img/cluster/TANPHU/CNN-TANPHU-003.png",
                "./assets/img/cluster/TANPHU/CNN-TANPHU-004.png",
                "./assets/img/cluster/TANPHU/CNN-TANPHU-005.png",
                "./assets/img/cluster/TANPHU/CNN-TANPHU-006.png"
            ],
            id: 18,
            ten_cum_cong_nghiep: "Cụm công nghiệp Tân Tiến 1",
            downloadPDF: "./assets/img/cluster/TANTIENI/QH05A-KS KTCQ TAN TIEN1.pdf",
            tong_muc_dau_tu : "369 tỷ đồng",
            vi_tri_quy_mo: [
                "- Phía Đông: Giáp đất dân.",
                "- Phía Tây: Giáp đường xã TT5 và đất dân.",
                "- Phía Nam: Giáp đất tuyến đường nội bộ của Công ty Cổ phần Cao su Đồng Phú (vị trí dự kiến bổ sung cụm công nghiệp Tân Tiến 2).",
                "- Phía Bắc: Giáp đất quy hoạch khu dân cư tập trung, kết hợp bố trí một số cơ quan nhà nước, trường học tại xã Tân Tiến."
            ],
            quy_mo_dien_tich : "55.9 ha",
            dang_ki_kinh_doanh : [
                "Giấy chứng nhận đăng ký kinh doanh số: 3702457025",
                "Đăng ký lần đầu ngày 25/4/2016, thay đổi lần thứ nhất ngày 22/5/2018,Cơ quan cấp: Sở Kế hoạch và Đầu tư tỉnh Bình Dương"
            ]
        },
        {
            chu_dau_tu: "Công ty CP ĐT BĐS Thành Phương",
            co_so_phap_lys: [
                "Quyết định thành lập số 1686/QĐ-UBND ngày 23/7/2020 của UBND tỉnh"
            ],
            dia_chi: "Ấp Thái Dũng, xã Tân Tiến, huyện Đồng Phú",
            dien_giai: "<strong>Tiến độ thành lập</strong><br>+ Tiến độ thực hiện dự án đầu tư xây dựng hạ tầng kỹ thuật: 2020-2021, thời gian hoạt động của dự án 50 năm<br><strong>Ngành nghề thu hút đầu tư</strong><br>Thu hút đầu tư các ngành nghề được khuyến khích đầu tư trong lĩnh vực sản xuất vật liệu xây dựng. Các ngành nghề được khuyến khích đầu tư trong lĩnh vực sản xuất điện, nước. Các ngành nghề được khuyến khích đầu tư trong lĩnh vực sản xuất hóa chất. Các ngành nghề được khuyến khích đầu tư trong lĩnh vực sản xuất hàng tiêu dùng; sản xuất đồ uống, giải khát; sản xuất hàng may mặc, giầy da, túi ví, dệt vải, hoàn thiện các sản phẩm dệt; sản xuất tơ sợi các loại, thuộc da, sơ chế da; sản xuất các sản phẩm tiêu dùng, sử dụng nguyên liệu tại chỗ. Các ngành nghề được khuyến khích đầu tư trong lĩnh vực sản xuất hàng thủ công mỹ nghệ. Các ngành nghề được khuyến khích đầu tư trong lĩnh vực ứng dụng công nghệ cao, kỹ thuật hiện đại, bảo vệ môi trường sinh thái gắn với khu xứ lý nước thải tập trung trong CCN.",
            dien_tich: 56.3,
            hinh_anhs: [
                "./assets/img/cluster/TANPHU/CNN-TANPHU-001.png",
                "./assets/img/cluster/TANPHU/CNN-TANPHU-002.png",
                "./assets/img/cluster/TANPHU/CNN-TANPHU-003.png",
                "./assets/img/cluster/TANPHU/CNN-TANPHU-004.png",
                "./assets/img/cluster/TANPHU/CNN-TANPHU-005.png",
                "./assets/img/cluster/TANPHU/CNN-TANPHU-006.png"
            ],
            id: 19,
            ten_cum_cong_nghiep: "Cụm công nghiệp Tân Tiến 2",
            downloadPDF: "./assets/img/cluster/TANTIENII/QH05A-KS KTCQ TAN TIEN 2.pdf",
            tong_muc_dau_tu : "371 tỷ đồng",
            vi_tri_quy_mo: [
                "- Phía Đông:Giáp đất dân và đường huyện Tân Tiến – Tân Hòa, cách suối khoảng 390m.",
                "- Phía Tây: Giáp đất dân, cách suối khoảng 350m.",
                "- Phía Nam: Giáp đất dân và đất nông nghiệp CNC của HTX Nông nghiệp-Sản xuất - Thương Mại - Dịch vụ Thành Phương.",
                "- Phía Bắc: Tiếp giáp đường nội bộ của Công ty Cổ phần Cao su Đồng Phú."
            ],
            quy_mo_dien_tich : "56.3 ha",
            dang_ki_kinh_doanh : [
                "Giấy chứng nhận đăng ký kinh doanh số: 3702457025",
                "Đăng ký lần đầu ngày 25/4/2016, thay đổi lần thứ nhất ngày 22/5/2018,Cơ quan cấp: Sở Kế hoạch và Đầu tư tỉnh Bình Dương"
            ]
        }
        ,
        {
            chu_dau_tu: "Công ty CP ĐT BĐS Thành Phương",
            co_so_phap_lys: [
                "Quyết định thành lập số 1688/QĐ-UBND ngày 23/7/2020 của UBND tỉnh"
            ],
            dia_chi: "Ấp 7, xã Tiến Hưng, thành phố Đồng Xoài, tỉnh Bình Phước",
            dien_giai: "<strong>Tiến độ thành lập</strong><br>+ Tiến độ thực hiện dự án đầu tư xây dựng hạ tầng kỹ thuật: 2020-2021, thời gian hoạt động của dự án 50 năm<br><strong>Ngành nghề thu hút đầu tư</strong><br>Chế tạo, lắp ráp thiết bị điện, linh kiện điện tử, thiết bị năng lượng mặt trời; cơ khí chính xác, sản phẩm phụ trợ may mặc, sản xuất đồ gia dụng; Sản xuất bao bì; Sản xuất vật liệu xây dựng và trang trí nội thất; Sản xuất khoáng sản (bentonite); Chế biến nông sản, sản xuất thức ăn gia súc, gia cầm; Sản xuất, gia công sản phẩm cơ khí; Sản xuất hóa chất, đồ nhựa; Sản xuất dụng cụ thể dục thể thao; Sản xuất giày; Sản xuất thiết bị điện; Sản xuất hàng may mặc; sắt thép; kho bãi; sản xuất các sản phẩm từ gỗ; sản xuất phụ tùng, linh kiện cho xe đạp, xe ô tô; Sản xuất gốm, sứ; sản xuất các sản phẩm kim loại; Sản xuất sữa và sản phẩm chức năng, sản phẩm sử dụng nguồn nguyên liệu tại chỗ; Sản xuất dược phẩm, mỹ phẩm; Sản xuất hóa dầu, hóa dược, hóa chất cơ bản, linh kiện nhựa - cao su kỹ thuật; Chế biến phục vụ phát triển nông nghiệp, chế tạo cơ khí, máy móc nông cụ, phân bón, chế phẩm về cao su....gắn với khu xứ lý nước thải tập trung trong CCN",
            dien_tich: 57.5,
            hinh_anhs: [
                "./assets/img/cluster/TANPHU/CNN-TANPHU-001.png",
                "./assets/img/cluster/TANPHU/CNN-TANPHU-002.png",
                "./assets/img/cluster/TANPHU/CNN-TANPHU-003.png",
                "./assets/img/cluster/TANPHU/CNN-TANPHU-004.png",
                "./assets/img/cluster/TANPHU/CNN-TANPHU-005.png",
                "./assets/img/cluster/TANPHU/CNN-TANPHU-006.png"
            ],
            id: 30,
            ten_cum_cong_nghiep: "Cụm công nghiệp Tiến Hưng I",
            downloadPDF: "./assets/img/cluster/TIENHUNGI/QH05A-KS KTCQ TIEN HUNG-1.pdf",
            tong_muc_dau_tu : "380 tỷ đồng",
            vi_tri_quy_mo: [
                "- Phía đông giáp khu công nghiệp Bắc Đồng Phú cách hồ Bà Mụ khoảng 1 km;",
                "- Phía tây giáp đất của hộ Dân cách bàu Ba mẫu 650m;",
                "- Phía nam giáp đất của Công ty Cổ phần Cao su Đồng Phú và Lò mổ 127;",
                "- Phía bắc giáp đường huyện ĐH507;"
            ],
            quy_mo_dien_tich : "57.5 ha",
            dang_ki_kinh_doanh : [
                "Giấy chứng nhận đăng ký kinh doanh số: 3702457025",
                "Đăng ký lần đầu ngày 25/4/2016, thay đổi lần thứ nhất ngày 22/5/2018,Cơ quan cấp: Sở Kế hoạch và Đầu tư tỉnh Bình Dương"
            ]
        },
        {
            chu_dau_tu: "Công ty CP ĐT BĐS Thành Phương",
            co_so_phap_lys: [
                "Văn bản giới thiệu địa điểm số 41/UBND-ĐT ngày 04/01/2017",
                "Quyết định phê duyệt Quy hoạch chi tiết số 1759/QĐ.CT.UBT ngày 17/6/2003",
                "Quyết định thành lập cụm số 1957/QĐ-UBND ngày 11/6/2018"
            ],
            dia_chi: "huyện Đồng Phú, tỉnh Bình Phước",
            dien_giai: "Tiến độ đăng ký đầu tư (theo Quyết định thành lập CCN)<br> + Giai đoạn 2018 - 2019: Thực hiện đầu tư xây dựng dự án. <br>+ Từ tháng 01/2020: Khai thác kinh doanh.<br><br>- Lĩnh vực đầu tư CCN: Làm cụm công nghiệp đa ngành nghề, phân làm 02 loại công nghiệp sạch và công nghiệp ít ô nhiễm không han chế thể loại, ưu tiên một số ngành phù hợp ngành nghề truyền thống và vùng nguyên liệu tại địa phương. Các ngành nghề chính ưu tiên thu hút đầu tư vào cụm <br><strong>Công nghiệp:</strong> <br>- Gia công cơ khí (ngành nghề không gây ô nhiễm)<br>- xây dựng nhà kho<br>- nhà xưởng cho thuê<br>- công nghiệp gốm sứ<br>- chế biến gỗ hàng mộc<br>- vật liệu xây dựng<br>-  may mặc<br>- gia công hàng thủ công mỹ nghệ<br>- chế biến nông sản thực phẩm.",
            dien_tich: 10,
            hinh_anhs: [
                "./assets/img/cluster/TANPHU/CNN-TANPHU-001.png",
                "./assets/img/cluster/TANPHU/CNN-TANPHU-002.png",
                "./assets/img/cluster/TANPHU/CNN-TANPHU-003.png",
                "./assets/img/cluster/TANPHU/CNN-TANPHU-004.png",
                "./assets/img/cluster/TANPHU/CNN-TANPHU-005.png",
                "./assets/img/cluster/TANPHU/CNN-TANPHU-006.png"
            ],
            id: 14,
            ten_cum_cong_nghiep: "Cụm công nghiệp Hà Mị",
            downloadPDF: "./assets/img/cluster/HAMI/CCN HÀ MỴ N.PNG",
            tong_muc_dau_tu : "",
            vi_tri_quy_mo: [
                
            ],
            quy_mo_dien_tich : "43.4 ha",
            dang_ki_kinh_doanh : [
            ]
        }
        //40: Nha Bích, 21: Minh hưng 1, 22: Minh hưng 2, 18: Tân Tiến 1, 19:Tân Tiến 2, 20: Tân Phú, 30: Tiến hưng 1,
        //14: Hà Mị
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
        public sctService: SCTService,
        private _breadCrumService: BreadCrumService,
        public route: ActivatedRoute,) {
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
    private _getClusterDetail(id_cluster: number) {
        let dataClusterDetails: ClusterDetailModel[] = new MatTableDataSource<ClusterDetailModel>(this.data).data;
        dataClusterDetails.forEach(element => {
            if (element.id == id_cluster) {
                this._clusterDetail = element;
                return;
            }
        });
        if (dataClusterDetails) {
            //Add short description
            let dataTableTemp: ClusterDetailShortModel[] = [];
            dataTableTemp.push(new ClusterDetailShortModel("Tên cụm công nghiệp", this._clusterDetail.ten_cum_cong_nghiep));
            dataTableTemp.push(new ClusterDetailShortModel("Chủ đầu tư", this._clusterDetail.chu_dau_tu));
            dataTableTemp.push(new ClusterDetailShortModel("Địa chỉ", this._clusterDetail.dia_chi));
            let coSoPhapLy: string = "";
            this._clusterDetail.co_so_phap_lys.forEach(element => coSoPhapLy += element + "<br>");
            dataTableTemp.push(new ClusterDetailShortModel("Cơ sở pháp lý", coSoPhapLy));
            let dieuKienKinhDoanh: string = "";
            this._clusterDetail.dang_ki_kinh_doanh.forEach(element => dieuKienKinhDoanh += element + "<br>");
            dataTableTemp.push(new ClusterDetailShortModel("Điều kiện Kinh doanh", dieuKienKinhDoanh));
            let viTriQuyMo: string = "";
            this._clusterDetail.vi_tri_quy_mo.forEach(element => viTriQuyMo += element + "<br>");
            dataTableTemp.push(new ClusterDetailShortModel("Vị trí, quy mô", viTriQuyMo));
            dataTableTemp.push(new ClusterDetailShortModel("Tổng mức đầu tư", this._clusterDetail.tong_muc_dau_tu));
            dataTableTemp.push(new ClusterDetailShortModel("Quy mô, diện tích", this._clusterDetail.quy_mo_dien_tich));
            dataTableTemp.push(new ClusterDetailShortModel("Diễn giải", this._clusterDetail.dien_giai));
            this.dataSource = new MatTableDataSource(dataTableTemp);
        }
        else {

        }

    }
}