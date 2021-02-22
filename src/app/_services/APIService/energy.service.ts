import { Component } from '@angular/Core';
import { Injectable } from "@angular/core";
import { Observable, throwError } from 'rxjs'
import { catchError, tap } from 'rxjs/operators'
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse, HttpParams } from '@angular/common/http';
// import { environment } from "src/app/Shared/environment";
import { environment } from '../../../environments/environment';
import { LoginService } from './login.service';
import { data_detail_model, new_import_export_model } from 'src/app/_models/APIModel/export-import.model';
import { time } from 'highcharts';

@Injectable({
    providedIn: 'root'
})
export class EnergyService {
    // declare variable
    private data: any;
    // start api quan ly nang luong
    private apiNangLuong = environment.apiEndpoint + "api/qlnl";
    private urlDienMattroi = "/dmt";
    private urlThuyDien = "/thuy-dien";
    private urlDienSinhKhoi = "/dsk";
    private urlDien110KV = "/110kv/hien-trang";
    private urlDien110KVDuKien = "/110kv/du-kien";
    private urlDien35KV = "/35KV";
    private urlDienNongThon = "/dnt";
    private urlTuVanDien = "/cphd";

    // POST api
    private urlPostSolarEnergyData = '/dmt';
    private urlPostHydroEnergyData = '/thuy-dien';
    private urlPostBlockElectricData = '/dsk';
    private urlTietKiemnangLuong = "/tknl";
    private urlCapNhatDien110KV = "/110kv/hien-trang";
    private urlCapNhatDien110KVDuKien = "/110kv/du-kien";
    private urlCapNhatDien35KV = "/35KV";
    private urlCapNhatDienNongThon = "/dnt";
    private urlCapNhatCapPhepDien = "/cphd";
    private urlCapNhatTietKiemNL = "/tknl";

    token: any;
    username: any;
    constructor(public http: HttpClient, public logOutService: LoginService) {
        this.data = JSON.parse(localStorage.getItem('currentUser'));
        this.token = this.data.token;
    }

    LayDuLieuDienMatTroi(time_id){
        var apiUrl = this.apiNangLuong + this.urlDienMattroi;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let params = new HttpParams().set('time_id', time_id.toString())
        return this.http.get<any>(apiUrl, { headers: headers, params: params }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    LayDuLieuThuyDien(){
        var apiUrl = this.apiNangLuong + this.urlThuyDien;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.get<any>(apiUrl, { headers: headers }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    LayDuLieuDienSinhKhoi(time_id: number){
        var apiUrl = this.apiNangLuong + this.urlDienSinhKhoi;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let params = new HttpParams().set('time_id', time_id.toString())
        return this.http.get<any>(apiUrl, { headers: headers, params: params }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    LayDuLieuQuyHoachDien110KV(time_id: number){
        var apiUrl = this.apiNangLuong + this.urlDien110KV;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let params = new HttpParams().set('time_id', time_id.toString())
        return this.http.get<any>(apiUrl, { headers: headers, params: params }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    LayDuLieuQuyHoachDien110KVDuKien(time_id: number){
        var apiUrl = this.apiNangLuong + this.urlDien110KVDuKien;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let params = new HttpParams().set('time_id', time_id.toString())
        return this.http.get<any>(apiUrl, { headers: headers, params: params }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    LayDuLieuQuyHoachDien35KV(time_id: number){
        var apiUrl = this.apiNangLuong + this.urlDien35KV;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let params = new HttpParams().set('time_id', time_id.toString())
        return this.http.get<any>(apiUrl, { headers: headers, params: params }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    LayDuLieuQuyHoachDienNongThon(){
        var apiUrl = this.apiNangLuong + this.urlDienNongThon;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.get<any>(apiUrl, { headers: headers }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    LayDuLieuTuVanDien(){
        var apiUrl = this.apiNangLuong + this.urlTuVanDien;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.get<any>(apiUrl, { headers: headers }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    // POST method
    PostSolarEnergyData(datas, time_id) {
        let apiUrl = this.apiNangLuong + this.urlPostSolarEnergyData;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        //headers = headers.append('Authorization', 'Bearer ' + `${this.token}`);
        // let params = new HttpParams().set('time_id', time_id.toString());
        return this.http.post<any>(apiUrl, datas, { headers: headers }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    PostHydroEnergyData(datas, time_id) {
        let apiUrl = this.apiNangLuong + this.urlPostHydroEnergyData;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        //headers = headers.append('Authorization', 'Bearer ' + `${this.token}`);
        // let params = new HttpParams().set('time_id', time_id.toString());
        return this.http.post<any>(apiUrl, datas, { headers: headers }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    PostBlockElectricData(datas, time_id) {
        let apiUrl = this.apiNangLuong + this.urlPostBlockElectricData;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        //headers = headers.append('Authorization', 'Bearer ' + `${this.token}`);
        // let params = new HttpParams().set('time_id', time_id.toString());
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
            errorMessage = `Mã lỗi: ${error.status}\nMessage: ${error.error.message}`;
        }
        return throwError(errorMessage);
    }

    LayDuLieuTietKiemNangLuong(time_id: number){
        var apiUrl = this.apiNangLuong + this.urlTietKiemnangLuong;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let params = new HttpParams().set('time_id', time_id.toString());
        return this.http.get<any>(apiUrl, { headers: headers, params: params }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    CapNhatDuLieuQuyHoachDien110KV(body: any[]){
        var apiUrl = this.apiNangLuong + this.urlCapNhatDien110KV;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.post<any>(apiUrl, body, { headers: headers}).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    CapNhatDuLieuQuyHoachDien110KVDuKien(body: any[]){
        var apiUrl = this.apiNangLuong + this.urlCapNhatDien110KVDuKien;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.post<any>(apiUrl, body, { headers: headers}).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    CapNhatDuLieuQuyHoachDien35KV(body: any[]){
        var apiUrl = this.apiNangLuong + this.urlCapNhatDien35KV;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.post<any>(apiUrl, body, { headers: headers}).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    CapNhatDuLieuQuyHoachDienNongThon(body: any[]){
        var apiUrl = this.apiNangLuong + this.urlCapNhatDienNongThon;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.post<any>(apiUrl, body, { headers: headers}).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    CapNhatDuLieuCapPhepHoatDong(body: any[]){
        var apiUrl = this.apiNangLuong + this.urlCapNhatCapPhepDien;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.post<any>(apiUrl, body, { headers: headers}).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    CapNhatDuLieutietKiemNL(body: any[]){
        var apiUrl = this.apiNangLuong + this.urlCapNhatTietKiemNL;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.post<any>(apiUrl, body, { headers: headers}).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }
}
