import { Injectable } from "@angular/core";
import { Observable, throwError } from 'rxjs'
import { catchError, tap } from 'rxjs/operators'
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { DomesticPriceModel, ForeignMarketModel, ProductValueModel, CompanyPost, DeleteModel, DeleteModel1, PostTopProduct } from '../../_models/APIModel/domestic-market.model';

@Injectable({
    providedIn: 'root'
})

export class MarketService {
    public data: any;
    token: any;
    username: any;
    public apiHome = environment.apiEndpoint;

    public urlProductSelect = "api/danh-sach/san-pham"
    public urlAllCareer = "api/danh-sach/nganh-nghe";
    public urlDistrict = "api/danh-sach/quan-huyen";
    public urlSubDistrict = "api/danh-sach/phuong-xa";
    public urlLHHD = "api/danh-sach/loai-hinh-hoat-dong";
    public urlField = "api/danh-sach/linh-vuc-quan-ly";

    public urlDomesticMarket = "api/qltm/gia-ca";
    public urlDomesticMarketAll = "api/qltm/tat-ca-gia-ca";
    public urlDomesticMarketPost = "api/qltm/gia-ca";
    public urlDomesticMarketDelete = "api/qltm/xoa-gia-ca";

    public urlForeignMarket = "api/qltm/gia-ca-quoc-te";
    public urlForeignMarketAll = "api/qltm/tat-ca-gia-ca-quoc-te";
    public urlForeignMarketPost = "api/qltm/gia-ca-quoc-te";
    public urlForeignMarketDelete = "api/qltm/xoa-gia-ca-quoc-te";

    public urlProduct = "api/qltm/thong-tin-san-xuat";
    public urlProductAll = "api/qltm/tat-ca-thong-tin-san-xuat";
    public urlProductPost = "api/qltm/thong-tin-san-xuat";
    public urlProductPostTop = "api/qltm/doanh-nghiep-san-xuat";
    public urlProductDelete = "api/qltm/xoa-thong-tin-san-xuat";
    public urlTopProductValueDelete = "api/qltm/xoa-doanh-nghiep-san-xuat";

    public urlImport = "api/qltm/xnk/nhap-khau-tong-hop";
    public urlExport = "api/qltm/xnk/xuat-khau-tong-hop";

    public urlPostCompany = "api/doanh-nghiep/them-doanh-nghiep";
    public urlUpdateCompany = "api/doanh-nghiep";
    public urlAllCompany = "api/doanh-nghiep/danh-sach-doanh-nghiep";
    public urlCompanyInfo = "api/doanh-nghiep";
    public urlDeleteCompany = "api/doanh-nghiep/xoa-nhieu-doanh-nghiep";
    public urlDeleteCareer = "api/doanh-nghiep/xoa-nganh-nghe";

    constructor(public http: HttpClient) {
        this.data = JSON.parse(localStorage.getItem('currentUser'));
        this.token = this.data.token;
    }

    //company list
    companyinfo: CompanyPost;
    public PostCompany(companyinfo: Array<CompanyPost>) {
        var apiUrl = this.apiHome + this.urlPostCompany;
        // var apiUrl = "http://localhost:5000/api/doanh-nghiep/them-doanh-nghiep";
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        headers = headers.append('Authorization', 'Bearer ' + `${this.token}`);
        return this.http.post<any>(apiUrl, companyinfo, { headers: headers }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }
    public UpdateCompany(companyinfo: Array<CompanyPost>) {
        var apiUrl = this.apiHome + this.urlUpdateCompany;
        // var apiUrl = "http://localhost:5000/api/doanh-nghiep";
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        headers = headers.append('Authorization', 'Bearer ' + `${this.token}`);
        return this.http.post<any>(apiUrl, companyinfo, { headers: headers }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }
    public GetAllCompany() {
        var apiUrl = this.apiHome + this.urlAllCompany;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.get<any>(apiUrl, { headers: headers }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }
    public GetCompanyInfoById(mst: string) {
        var apiUrl = this.apiHome + this.urlCompanyInfo;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let params = new HttpParams().set('mst', mst);
        return this.http.get<any>(apiUrl, { headers: headers, params: params }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }
    public DeleteCompany(deletemodel: Array<DeleteModel>) {
        var apiUrl = this.apiHome + this.urlDeleteCompany;
        // var apiUrl = "http://localhost:5000/api/doanh-nghiep/xoa-nhieu-doanh-nghiep";
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        headers = headers.append('Authorization', 'Bearer ' + `${this.token}`);
        return this.http.post<any>(apiUrl, deletemodel, { headers: headers }).pipe(tap(data => data), catchError(this.handleError))
    }
    public DeleteCareer(deletemodel: Array<DeleteModel1>) {
        var apiUrl = this.apiHome + this.urlDeleteCareer
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        headers = headers.append('Authorization', 'Bearer ' + `${this.token}`);
        return this.http.post<any>(apiUrl, deletemodel, { headers: headers }).pipe(tap(data => data), catchError(this.handleError))
    }
    //company list

    //Domestic market
    public GetDomesticMarket(timeSelect: string) {
        var apiUrl = this.apiHome + this.urlDomesticMarket;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let params = new HttpParams().set('time_id', timeSelect);
        return this.http.get<any>(apiUrl, { headers: headers, params: params }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }
    public GetAllDomesticMarket() {
        var apiUrl = this.apiHome + this.urlDomesticMarketAll;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.get<any>(apiUrl, { headers: headers }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }
    public PostDomesticMarket(domesticArray: Array<DomesticPriceModel>) {
        var apiUrl = this.apiHome + this.urlDomesticMarketPost;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        headers = headers.append('Authorization', 'Bearer ' + `${this.token}`);
        return this.http.post<any>(apiUrl, domesticArray, { headers: headers }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }
    public DeleteDomesticMarket(deletemode1: Array<DeleteModel1>) {
        var apiUrl = this.apiHome + this.urlDomesticMarketDelete
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        headers = headers.append('Authorization', 'Bearer ' + `${this.token}`);
        return this.http.post<any>(apiUrl, deletemode1, { headers: headers }).pipe(tap(data => data), catchError(this.handleError))
    }
    //Domestic market

    //Foreign market
    public GetForeignMarket(timeSelect: string) {
        var apiUrl = this.apiHome + this.urlForeignMarket;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let params = new HttpParams().set('time_id', timeSelect);
        return this.http.get<any>(apiUrl, { headers: headers, params: params }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }
    public GetAllForeignMarket() {
        var apiUrl = this.apiHome + this.urlForeignMarketAll;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.get<any>(apiUrl, { headers: headers }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }
    public PostForeignMarket(ForeignArray: Array<ForeignMarketModel>) {
        var apiUrl = this.apiHome + this.urlForeignMarketPost;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        headers = headers.append('Authorization', 'Bearer ' + `${this.token}`);
        return this.http.post<any>(apiUrl, ForeignArray, { headers: headers }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }
    public DeleteForeignMarket(deletemodel: Array<DeleteModel1>) {
        var apiUrl = this.apiHome + this.urlForeignMarketDelete
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        headers = headers.append('Authorization', 'Bearer ' + `${this.token}`);
        return this.http.post<any>(apiUrl, deletemodel, { headers: headers }).pipe(tap(data => data), catchError(this.handleError))
    }
    //Foreign market

    //ProductValue
    public GetProductValue(timeselect: string) {
        var apiUrl = this.apiHome + this.urlProduct;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let params = new HttpParams().set('time_id', timeselect);
        return this.http.get<any>(apiUrl, { headers: headers, params: params }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }
    public GetAllProductValue() {
        var apiUrl = this.apiHome + this.urlProductAll;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.get<any>(apiUrl, { headers: headers }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }
    public PostProductValue(ProductArray: Array<ProductValueModel>) {
        var apiUrl = this.apiHome + this.urlProductPost;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        headers = headers.append('Authorization', 'Bearer ' + `${this.token}`);
        return this.http.post<any>(apiUrl, ProductArray, { headers: headers }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }
    public PostProductValueTop(toparray: Array<PostTopProduct>) {
        var apiUrl = this.apiHome + this.urlProductPostTop;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        headers = headers.append('Authorization', 'Bearer ' + `${this.token}`);
        return this.http.post<any>(apiUrl, toparray, { headers: headers }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }
    public DeleteProductValue(deletemodel1: Array<DeleteModel1>) {
        var apiUrl = this.apiHome + this.urlProductDelete
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        headers = headers.append('Authorization', 'Bearer ' + `${this.token}`);
        return this.http.post<any>(apiUrl, deletemodel1, { headers: headers }).pipe(tap(data => data), catchError(this.handleError))
    }
    public DeleteProductValueTop(deletemodel: Array<DeleteModel1>) {
        var apiUrl = this.apiHome + this.urlTopProductValueDelete
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        headers = headers.append('Authorization', 'Bearer ' + `${this.token}`);
        return this.http.post<any>(apiUrl, deletemodel, { headers: headers }).pipe(tap(data => data), catchError(this.handleError))
    }
    //ProductValue

    //Export&Import
    public GetImportValue(timeselect: string) {
        var apiUrl = this.apiHome + this.urlImport;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let params = new HttpParams().set('time_id', timeselect);
        return this.http.get<any>(apiUrl, { headers: headers, params: params }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }
    public GetExportValue(timeselect: string) {
        var apiUrl = this.apiHome + this.urlExport;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let params = new HttpParams().set('time_id', timeselect);
        return this.http.get<any>(apiUrl, { headers: headers, params: params }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }
    //

    //mat-select api
    public GetProductList() {
        var apiUrl = this.apiHome + this.urlProductSelect;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        headers = headers.append('Authorization', 'Bearer ' + `${this.token}`);
        return this.http.get<any>(apiUrl, { headers: headers }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }
    public GetAllCareer() {
        var apiUrl = this.apiHome + this.urlAllCareer;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.get<any>(apiUrl, { headers: headers }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }
    public GetAllDistrict() {
        var apiUrl = this.apiHome + this.urlDistrict;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.get<any>(apiUrl, { headers: headers }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }
    public GetAllSubDistrict() {
        var apiUrl = this.apiHome + this.urlSubDistrict;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.get<any>(apiUrl, { headers: headers }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }
    public GetAllBusinessType() {
        var apiUrl = this.apiHome + this.urlLHHD;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.get<any>(apiUrl, { headers: headers }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }
    public GetAllField() {
        var apiUrl = this.apiHome + this.urlField;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.get<any>(apiUrl, { headers: headers }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }
    //

    public handleError(error: HttpErrorResponse) {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
            // client-side error
            errorMessage = `Lỗi: ${error.error.message}`;
        } else {
            // server-side error
            errorMessage = `Mã lỗi: ${error.status}\nMessage: ${error.message}`;
        }
        // window.alert(errorMessage);
        return throwError(errorMessage);
    }

}
