import { Component } from '@angular/Core';
import { Injectable } from "@angular/core";
import { Observable, throwError } from 'rxjs'
import { catchError, tap } from 'rxjs/operators'
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse, HttpParams } from '@angular/common/http';
// import { environment } from "src/app/Shared/environment";
import { environment } from '../../../environments/environment';
import { LoginService } from './login.service';
import { data_detail_model, new_import_export_model } from 'src/app/_models/APIModel/export-import.model';

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



    token: any;
    username: any;
    constructor(public http: HttpClient, public logOutService: LoginService) {
        this.data = JSON.parse(localStorage.getItem('currentUser'));
        this.token = this.data.token;
    }

    LayDuLieuDienMatTroi(time_id: number){
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