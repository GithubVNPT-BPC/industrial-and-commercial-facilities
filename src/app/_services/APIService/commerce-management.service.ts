import { Component } from '@angular/Core';
import { Injectable } from "@angular/core";
import { Observable, throwError } from 'rxjs'
import { catchError, tap } from 'rxjs/operators'
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export const HEADERS = { 'Content-Type': 'application/json' }

@Injectable({
    providedIn: 'root'
})
export class CommerceManagementService {
    public apiHome = environment.apiEndpoint;
    private prefix = 'api/qltm';
    // GET
    private urlGetExpo = "api/qltm/hoi-cho-trien-lam";
    private urlGetSubcribeDiscount = "api/qltm/khuyen-mai";
    private urlGetSubcribeDiscountType = "api/qltm/danh-sach-hinh-thuc-km";
    private urlGetMultiLevelTrade = "api/qltm/da-cap";
    private urlGetMarketPlace = "api/qltm/sttttm";
    private urlGetMarket = 'api/qltm/httm/cho';
    private urlGetFoodCommerce = 'api/qltm/httm/kdtp';
    private urlGetConvenienceStore = 'api/qltm/httm/chtl';

    // POST
    private urlPostExpo = "api/qltm/cap-nhat-hoi-cho-trien-lam";
    private urlPostSubcribeDiscount = "api/qltm/cap-nhat-khuyen-mai";
    private urlPostMultiLevelTrade = "api/qltm/cap-nhat-du-lieu-da-cap";
    private urlPostMarketPlace = "api/qlnl/addsttttm";
    private urlPostMarket = 'api/qltm/httm/cho';
    private urlPostFoodCommerce = 'api/qltm/httm/kdtp';
    private urlPostConvenienceStore = 'api/qltm/httm/chtl';
    private urlPostPromoAdress = "api/qltm/cap-nhat-dia-diem-khuyen-mai";

    // DELETE
    private urldeletePromo = "api/qltm/khuyen-mai/xoa";
    private urldeleteMultiLevel = "api/qltm/da-cap/xoa";
    private urldeleteTradeFairs = "api/qltm/hoi-cho/xoa";
    
    constructor(public http: HttpClient) { }

    // Expo
    public getExpoData(date: any) {
        let apiUrl = this.apiHome + this.urlGetExpo;
        let headers = new HttpHeaders(HEADERS);
        //headers = headers.append('Authorization', 'Bearer ' + `${this.token}`);
        let params = new HttpParams().set('time_id', date);
        return this.http.get<any>(apiUrl, { headers: headers, params: params }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public postExpoData(datas) {
        let apiUrl = this.apiHome + this.urlPostExpo;
        let headers = new HttpHeaders(HEADERS);
        //headers = headers.append('Authorization', 'Bearer ' + `${this.token}`);
        return this.http.post<any>(apiUrl, datas, { headers: headers }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    // Subcribe Discount
    public getSubcribeDiscountData() {
        let apiUrl = this.apiHome + this.urlGetSubcribeDiscount;
        let headers = new HttpHeaders(HEADERS);
        return this.http.get<any>(apiUrl, { headers: headers }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public getSubcribeDiscountTypeData() {
        let apiUrl = this.apiHome + this.urlGetSubcribeDiscountType;
        let headers = new HttpHeaders(HEADERS);
        return this.http.get<any>(apiUrl, { headers: headers }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    // Multi-level Trade
    public getMultiLevelTradeData() {
        let apiUrl = this.apiHome + this.urlGetMultiLevelTrade;
        let headers = new HttpHeaders(HEADERS);
        return this.http.get<any>(apiUrl, { headers: headers}).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public getMarketData(is_tttm=true) {
        let apiUrl = this.apiHome + this.urlGetMarket;
        let headers = new HttpHeaders(HEADERS);
        let params = new HttpParams().set('is_tttm', is_tttm.toString());
        return this.http.get<any>(apiUrl, { headers: headers, params: params}).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public getMarketPlaceData(is_tttm=true) {
        let apiUrl = this.apiHome + this.urlGetMarketPlace;
        let headers = new HttpHeaders(HEADERS);
        let params = new HttpParams().set('is_tttm', is_tttm.toString());
        return this.http.get<any>(apiUrl, { headers: headers, params: params}).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public getFoodCommerceData() {
        let apiUrl = this.apiHome + this.urlGetFoodCommerce;
        let headers = new HttpHeaders(HEADERS);
        return this.http.get<any>(apiUrl, { headers: headers}).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public getConvenienceStoreData() {
        let apiUrl = this.apiHome + this.urlGetConvenienceStore;
        let headers = new HttpHeaders(HEADERS);
        return this.http.get<any>(apiUrl, { headers: headers}).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    // POST Methods
    public postSubcribeDiscountData(datas) {
        let apiUrl = this.apiHome + this.urlPostSubcribeDiscount;
        let headers = new HttpHeaders(HEADERS);
        //headers = headers.append('Authorization', 'Bearer ' + `${this.token}`);
        return this.http.post<any>(apiUrl, datas, { headers: headers }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public postMultiLevelTradeData(datas) {
        let apiUrl = this.apiHome + this.urlPostMultiLevelTrade;
        let headers = new HttpHeaders(HEADERS);
        //headers = headers.append('Authorization', 'Bearer ' + `${this.token}`);
        return this.http.post<any>(apiUrl, datas, { headers: headers }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public postMarketPlace(datas) {
        let apiUrl = this.apiHome + this.urlPostMarketPlace;
        let headers = new HttpHeaders(HEADERS);
        //headers = headers.append('Authorization', 'Bearer ' + `${this.token}`);
        return this.http.post<any>(apiUrl, datas, { headers: headers }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public postMarket(datas) {
        let apiUrl = this.apiHome + this.urlPostMarket;
        let headers = new HttpHeaders(HEADERS);
        //headers = headers.append('Authorization', 'Bearer ' + `${this.token}`);
        return this.http.post<any>(apiUrl, datas, { headers: headers }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public postFoodCommerce(datas) {
        let apiUrl = this.apiHome + this.urlPostFoodCommerce;
        let headers = new HttpHeaders(HEADERS);
        //headers = headers.append('Authorization', 'Bearer ' + `${this.token}`);
        return this.http.post<any>(apiUrl, datas, { headers: headers }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public postConvenienceStore(datas) {
        let apiUrl = this.apiHome + this.urlPostConvenienceStore;
        let headers = new HttpHeaders(HEADERS);
        //headers = headers.append('Authorization', 'Bearer ' + `${this.token}`);
        return this.http.post<any>(apiUrl, datas, { headers: headers }).pipe(tap(data => data),
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
            errorMessage = `Mã lỗi: ${error.status}\nMessage: ${error.message}`;
        }
        window.alert(errorMessage);
        return throwError(errorMessage);
    }

    postAddressPromo(datas) {
        let apiUrl = this.apiHome + this.urlPostPromoAdress;
        let headers = new HttpHeaders(HEADERS);
        //headers = headers.append('Authorization', 'Bearer ' + `${this.token}`);
        return this.http.post<any>(apiUrl, datas, { headers: headers }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    deletePromo(datas) {
        let apiUrl = this.apiHome + this.urldeletePromo;
        let headers = new HttpHeaders(HEADERS);
        //headers = headers.append('Authorization', 'Bearer ' + `${this.token}`);
        return this.http.post<any>(apiUrl, datas, { headers: headers }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    deleteMultiLevel(datas) {
        let apiUrl = this.apiHome + this.urldeleteMultiLevel;
        let headers = new HttpHeaders(HEADERS);
        //headers = headers.append('Authorization', 'Bearer ' + `${this.token}`);
        return this.http.post<any>(apiUrl, datas, { headers: headers }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    deleteTradeFairs(datas) {
        let apiUrl = this.apiHome + this.urldeleteTradeFairs;
        let headers = new HttpHeaders(HEADERS);
        //headers = headers.append('Authorization', 'Bearer ' + `${this.token}`);
        return this.http.post<any>(apiUrl, datas, { headers: headers }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }
}