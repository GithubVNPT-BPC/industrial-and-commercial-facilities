import { Injectable } from "@angular/core";
import { Observable, throwError } from 'rxjs'
import { catchError, tap } from 'rxjs/operators'
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { LoginService } from './login.service';
import { data_detail_model, new_import_export_model, tong_quan_bg_model } from 'src/app/_models/APIModel/export-import.model';

@Injectable({
    providedIn: 'root'
})

export class SCTService {
    // declare variable
    private data: any;
    private apiSCT = environment.apiEndpoint + "api/sct";
    private urlDanhSachBuonBanThuocLa = "/danh-sach-buon-ban-thuoc-la";
    private urlDanhSachBanLeXangDau = "/danh-sach-buon-le-xang-dau";
    private urlDanhSachBuonBanRuou = "/danh-sach-buon-ban-ruou";
    private urlDanhSachBuonBanLPG = "/danh-sach-buon-ban-lpg";
    private urlDanhSachQuanLyHoaChat = "/danh-sach-quan-ly-hoa-chat";
    private urlDanhSachQuanLyChietNapLPG = "/danh-sach-quan-ly-chiet-nap-lpg";
    private urlDanhSachQuanLyCongNghiepThucPham = "/danh-sach-quan-ly-cong-nghiep-thuc-pham";
    private urlDanhSachQuanLyVatLieuNoCongNghiep = "/vlncn";
    
    private urlDanhSachDaCap = "/danh-sach-ban-hang-da-cap";

    private apiSpecialized = environment.apiEndpoint + "api/qltm";
    private urlDanhSachNhapKhau = "/xnk/nhap-khau";
    private urlDanhSachNhapKhauTC = "/xnk/nhap-khau-tc";
    private urlDanhSachXuatKhau = "/xnk/xuat-khau";
    private urlDanhSachXuatKhauTC = "/xnk/xuat-khau-tc";

    private urlChiTietNhapKhau = "/xnk/chi-tiet-nhap-khau";
    private urlChiTietNhapKhauTC = "/xnk/chi-tiet-nhap-khau-tc";
    private urlChiTietXuatKhau = "/xnk/chi-tiet-xuat-khau";
    private urlChiTietXuatKhauTC = "/xnk/chi-tiet-xuat-khau-tc";

    private urlDNNhapKhau = "/xnk/doanh-nghiep-nhap-khau";
    private urlDNNhapKhauTC = "/xnk/doanh-nghiep-nhap-khau-tc";
    private urlDNXuatKhau = "/xnk/doanh-nghiep-xuat-khau";
    private urlDNXuatKhauTC = "/xnk/doanh-nghiep-xuat-khau-tc";

    private urlDuLieuBienGioiNK = "/tmbg/nhap-khau";
    private urlDuLieuBienGioiXK = "/tmbg/xuat-khau";
    private urlThuongMaiBienGioiNK = "/tmbg/nhap-khau";
    private urlThuongMaiBienGioiXK = "/tmbg/xuat-khau";


    // start api cong nghiep
    private apiIndustry = environment.apiEndpoint + "api/qlcn";
    private url_congbohopquy = "/cbhq";

    // end api cong nghiep

    // start api quan huyen
    private apiDanhSach = environment.apiEndpoint + "api/danh-sach";

    private urlQuanHuyen = "/quan-huyen"; 
    private urlPhuongXa = "/phuong-xa"; 
    private urlPhuongXaQuanHuyen = "/phuong-xa-kem-quan-huyen"
    // end api quan huyen

    token: any;
    username: any;

    constructor(public http: HttpClient, public logOutService: LoginService) {
        this.data = JSON.parse(localStorage.getItem('currentUser'));
        this.token = this.data.token;
    }

    public GetDanhSachBuonBanThuocLa(time_id: number) {
        var apiUrl = this.apiSCT + this.urlDanhSachBuonBanThuocLa;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let params = new HttpParams().set('time_id', time_id.toString());
        return this.http.get<any>(apiUrl, { headers: headers, params: params }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public GetDanhSachBanLeXangDau(time_id: number) {
        var apiUrl = this.apiSCT + this.urlDanhSachBanLeXangDau;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let params = new HttpParams().set('time_id', time_id.toString());
        return this.http.get<any>(apiUrl, { headers: headers, params: params }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public GetDanhSachBuonBanRuou(time_id: number) {
        var apiUrl = this.apiSCT + this.urlDanhSachBuonBanRuou;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let params = new HttpParams().set('time_id', time_id.toString());
        return this.http.get<any>(apiUrl, { headers: headers, params: params }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public GetDanhSachBuonBanLPG(time_id: number) {
        var apiUrl = this.apiSCT + this.urlDanhSachBuonBanLPG;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let params = new HttpParams().set('time_id', time_id.toString());
        return this.http.get<any>(apiUrl, { headers: headers, params: params }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public GetDanhSachQuanLyHoaChat(time_id: number) {
        var apiUrl = this.apiSCT + this.urlDanhSachQuanLyHoaChat;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let params = new HttpParams().set('time_id', time_id.toString());
        return this.http.get<any>(apiUrl, { headers: headers, params: params }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public GetDanhSachQuanLyChietNapLPG(time_id: number) {
        var apiUrl = this.apiSCT + this.urlDanhSachQuanLyChietNapLPG;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let params = new HttpParams().set('time_id', time_id.toString());
        return this.http.get<any>(apiUrl, { headers: headers, params: params }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public GetDanhSachQuanLyCongNghiepThucPham(time_id: number) {
        var apiUrl = this.apiSCT + this.urlDanhSachQuanLyCongNghiepThucPham;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let params = new HttpParams().set('time_id', time_id.toString());
        return this.http.get<any>(apiUrl, { headers: headers, params: params }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public GetDanhSachQuanLyVatLieuNoCongNghiep(time_id: number) {
        var apiUrl = this.apiIndustry + this.urlDanhSachQuanLyVatLieuNoCongNghiep;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let params = new HttpParams().set('time_id', time_id.toString());
        return this.http.get<any>(apiUrl, { headers: headers, params: params }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    // public GetDanhSachQuanLyCumCongNghiep() {
    //     var apiUrl = this.apiIndustry + this.urlDanhSachQuanLyCumCongNghiep;
    //     let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    //     // let params = new HttpParams().set('time_id', time_id.toString());
    //     return this.http.get<any>(apiUrl, { headers: headers}).pipe(tap(data => data),
    //         catchError(this.handleError)
    //     );
    // }

    // Start Import and Export
    public GetDanhSachNhapKhau(time_id: number) {
        var apiUrl = this.apiSpecialized + this.urlDanhSachNhapKhau;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let params = new HttpParams().set('time_id', time_id.toString());

        return this.http.get<any>(apiUrl, { headers: headers, params: params }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public GetDanhSachNhapKhauTC(time_id: number) {
        var apiUrl = this.apiSpecialized + this.urlDanhSachNhapKhauTC;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let params = new HttpParams().set('time_id', time_id.toString());

        return this.http.get<any>(apiUrl, { headers: headers, params: params }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public GetDanhSachXuatKhau(time_id: number) {
        var apiUrl = this.apiSpecialized + this.urlDanhSachXuatKhau;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let params = new HttpParams().set('time_id', time_id.toString());

        return this.http.get<any>(apiUrl, { headers: headers, params: params }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }
    public GetDanhSachXuatKhauTC(time_id: number) {
        var apiUrl = this.apiSpecialized + this.urlDanhSachXuatKhauTC;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let params = new HttpParams().set('time_id', time_id.toString());

        return this.http.get<any>(apiUrl, { headers: headers, params: params }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    // Post
    public CapNhatDuLieuNKThang(time_id: number, data: new_import_export_model[]) {
        var apiUrl = this.apiSpecialized + this.urlDanhSachNhapKhau;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let params = new HttpParams().set('time_id', time_id.toString());

        return this.http.post<any>(apiUrl, data, { headers: headers, params: params }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public CapNhatDuLieuNKThangTC(time_id: number, data: new_import_export_model[]) {
        var apiUrl = this.apiSpecialized + this.urlDanhSachNhapKhauTC;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let params = new HttpParams().set('time_id', time_id.toString());

        return this.http.post<any>(apiUrl, data, { headers: headers, params: params }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public CapNhatDuLieuXKThang(time_id: number, data: new_import_export_model[]) {
        var apiUrl = this.apiSpecialized + this.urlDanhSachXuatKhau;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let params = new HttpParams().set('time_id', time_id.toString());

        return this.http.post<any>(apiUrl, data, { headers: headers, params: params }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }
    public CapNhatDuLieuXKThangTC(time_id: number, data: new_import_export_model[]) {
        var apiUrl = this.apiSpecialized + this.urlDanhSachXuatKhauTC;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let params = new HttpParams().set('time_id', time_id.toString());

        return this.http.post<any>(apiUrl, data, { headers: headers, params: params }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public CapNhatChiTietXKThang(time_id: number, data: data_detail_model[]) {
        var apiUrl = this.apiSpecialized + this.urlChiTietXuatKhau;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let params = new HttpParams().set('time_id', time_id.toString());
        
        return this.http.post<any>(apiUrl, data, { headers: headers, params: params }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }
    public CapNhatChiTietXKThangTC(time_id: number, data: data_detail_model[]) {
        var apiUrl = this.apiSpecialized + this.urlChiTietXuatKhauTC;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let params = new HttpParams().set('time_id', time_id.toString());
        
        return this.http.post<any>(apiUrl, data, { headers: headers, params: params }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }
    public CapNhatChiTietNKThang(time_id: number, data: data_detail_model[]) {
        var apiUrl = this.apiSpecialized + this.urlChiTietNhapKhau;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let params = new HttpParams().set('time_id', time_id.toString());
        
        return this.http.post<any>(apiUrl, data, { headers: headers, params: params }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }
    public CapNhatChiTietNKThangTC(time_id: number, data: data_detail_model[]) {
        var apiUrl = this.apiSpecialized + this.urlChiTietNhapKhauTC;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let params = new HttpParams().set('time_id', time_id.toString());
        
        return this.http.post<any>(apiUrl, data, { headers: headers, params: params }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }
    public CapNhatDNNKThang(data: any[]) {
        var apiUrl = this.apiSpecialized + this.urlDNNhapKhau;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        // let params = new HttpParams().set('time_id', time_id.toString());
        return this.http.post<any>(apiUrl, data, { headers: headers}).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }
    public CapNhatDNNKThangTC(data: any[]) {
        var apiUrl = this.apiSpecialized + this.urlDNNhapKhauTC;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        // let params = new HttpParams().set('time_id', time_id.toString());
        
        return this.http.post<any>(apiUrl, data, { headers: headers}).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }
    public CapNhatDNXKThang(data: any[]) {
        var apiUrl = this.apiSpecialized + this.urlDNXuatKhau;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        // let params = new HttpParams().set('time_id', time_id.toString());
        return this.http.post<any>(apiUrl, data, { headers: headers}).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }
    public CapNhatDNXKThangTC(data: any[]) {
        var apiUrl = this.apiSpecialized + this.urlDNXuatKhauTC;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        // let params = new HttpParams().set('time_id', time_id.toString());
        
        return this.http.post<any>(apiUrl, data, { headers: headers}).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }
    

    public GetDuLieuXuatKhauBG(time_id: number) {
        var apiUrl = this.apiSpecialized + this.urlDuLieuBienGioiXK;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let params = new HttpParams().set('time_id', time_id.toString());
        return this.http.get<any>(apiUrl, { headers: headers, params: params }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public GetDuLieuNhapKhauBG(time_id: number) {
        var apiUrl = this.apiSpecialized + this.urlDuLieuBienGioiNK;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let params = new HttpParams().set('time_id', time_id.toString());
        return this.http.get<any>(apiUrl, { headers: headers, params: params }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public CapNhatDuLieuNKBG(time_id: number, data: tong_quan_bg_model[]) {
        var apiUrl = this.apiSpecialized + this.urlThuongMaiBienGioiNK;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let params = new HttpParams().set('time_id', time_id.toString());

        return this.http.post<any>(apiUrl, data, { headers: headers, params: params }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }
    public CapNhatDuLieuXKBG(time_id: number, data: tong_quan_bg_model[]) {
        var apiUrl = this.apiSpecialized + this.urlThuongMaiBienGioiXK;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let params = new HttpParams().set('time_id', time_id.toString());

        return this.http.post<any>(apiUrl, data, { headers: headers, params: params }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public GetDanhSachBHDaCap() {
        var apiUrl = this.apiSpecialized + this.urlDanhSachDaCap;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.get<any>(apiUrl, { headers: headers }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    LaydulieuCongBoHopQuy(){
        var apiUrl = this.apiIndustry + this.url_congbohopquy;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.get<any>(apiUrl, { headers: headers }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public LayDanhSachQuanHuyen(){
        var apiUrl = this.apiDanhSach + this.urlQuanHuyen;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.get<any>(apiUrl, { headers: headers }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public LayDanhSachPhuongXa(){
        var apiUrl = this.apiDanhSach + this.urlPhuongXa;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.get<any>(apiUrl, { headers: headers }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    LayDanhSachPhuongXaQuanHuyen(){
        var apiUrl = this.apiDanhSach + this.urlPhuongXaQuanHuyen;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.get<any>(apiUrl, { headers: headers }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public handleError(error: HttpErrorResponse) {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
            // client-side error
            errorMessage = `Lỗi: ${error.error.message}`;
        } else {
            // server-side error
            errorMessage = `Mã lỗi: ${error.status}\nMessage: ${error.error.message}`;
        }
        return throwError(errorMessage);
    }
}
