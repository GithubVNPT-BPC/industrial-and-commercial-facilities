import { Injectable } from "@angular/core";
import { Observable, throwError } from 'rxjs'
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse, HttpParams } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators'
import { environment } from '../../../environments/environment';
import { LoginService } from './login.service';

export const HEADERS = new HttpHeaders({ 'Content-Type': 'application/json' });

@Injectable({
    providedIn: 'root'
})
export class IndustryManagementService {
    // declare variables
    private data: any;
    private token: any;
    private username: any;

    private endpoint = environment.apiEndpoint + "api/qlcn";

    private urlGetChemicalManagement = '/hoa-chat';
    private urlGetChemicalNames = '/danh-sach-hoa-chat';
    private urlGetFoodIndustry = '/cntp';
    private urlGetLPGManagement = '/lpg';
    private urlGetComformityAnnounce = '/cbhq';
    private urlGetExplosiveMat = '/vlncn';

    private urlPostChemicalManagement = '/hoa-chat';
    private urlPostChemicalManagementQty = '/san-luong-hoa-chat';
    private urlPostLPGManagement = '/lpg';
    private urlPostFoodIndustry = '/cntp';
    private urlPostComformityAnnounce = '/cbhq';
    private urlPostExplosiveMat = '/vlncn';
    
    constructor(public http: HttpClient, public logOutService: LoginService) {
        this.data = JSON.parse(localStorage.getItem('currentUser'));
        this.token = this.data.token;
    }

    // GET methods
    public GetChemicalManagement(time_id) {
        var apiUrl = this.endpoint + this.urlGetChemicalManagement;
        let params = new HttpParams().set('time_id', time_id.toString());
        return this.http.get<any>(apiUrl, { headers: HEADERS, params: params }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public GetChemicalNameList() {
        var apiUrl = this.endpoint + this.urlGetChemicalNames;
        return this.http.get<any>(apiUrl, { headers: HEADERS}).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public GetFoodIndustry(time_id) {
        var apiUrl = this.endpoint + this.urlGetFoodIndustry;
        let params = new HttpParams().set('time_id', time_id.toString());
        return this.http.get<any>(apiUrl, { headers: HEADERS, params: params }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public GetLPGManagement(time_id) {
        var apiUrl = this.endpoint + this.urlGetLPGManagement;
        let params = new HttpParams().set('time_id', time_id.toString());
        return this.http.get<any>(apiUrl, { headers: HEADERS, params: params }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public GetComformityAnnounce() {
        var apiUrl = this.endpoint + this.urlGetComformityAnnounce;
        // let params = new HttpParams().set('time_id', time_id.toString());
        return this.http.get<any>(apiUrl, { headers: HEADERS}).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public GetExplosiveMat(time_id) {
        var apiUrl = this.endpoint + this.urlGetExplosiveMat;
        let params = new HttpParams().set('time_id', time_id.toString());
        return this.http.get<any>(apiUrl, { headers: HEADERS, params: params }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    // POST methods
    public PostChemicalManagement(datas, time_id) {
        let apiUrl = this.endpoint + this.urlPostChemicalManagement;
        //headers = headers.append('Authorization', 'Bearer ' + `${this.token}`);
        let params = new HttpParams().set('time_id', time_id.toString());
        return this.http.post<any>(apiUrl, datas, { headers: HEADERS, params }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public PostChemicalManagementQty(datas, time_id) {
        let apiUrl = this.endpoint + this.urlPostChemicalManagementQty;
        //headers = headers.append('Authorization', 'Bearer ' + `${this.token}`);
        let params = new HttpParams().set('time_id', time_id.toString());
        return this.http.post<any>(apiUrl, datas, { headers: HEADERS, params }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public PostLPGManagement(datas, time_id) {
        let apiUrl = this.endpoint + this.urlPostLPGManagement;
        //headers = headers.append('Authorization', 'Bearer ' + `${this.token}`);
        let params = new HttpParams().set('time_id', time_id.toString());
        return this.http.post<any>(apiUrl, datas, { headers: HEADERS, params }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public PostFoodIndustry(datas, time_id) {
        let apiUrl = this.endpoint + this.urlPostFoodIndustry;
        //headers = headers.append('Authorization', 'Bearer ' + `${this.token}`);
        let params = new HttpParams().set('time_id', time_id.toString());
        return this.http.post<any>(apiUrl, datas, { headers: HEADERS, params }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public PostComformityAnnounce(datas) {
        let apiUrl = this.endpoint + this.urlPostComformityAnnounce;
        //headers = headers.append('Authorization', 'Bearer ' + `${this.token}`);
        return this.http.post<any>(apiUrl, datas, { headers: HEADERS }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public PostExplosiveMat(datas, time_id) {
        let apiUrl = this.endpoint + this.urlPostExplosiveMat;
        //headers = headers.append('Authorization', 'Bearer ' + `${this.token}`);
        let params = new HttpParams().set('time_id', time_id.toString());
        return this.http.post<any>(apiUrl, datas, { headers: HEADERS, params }).pipe(tap(data => data),
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