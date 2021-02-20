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

    private urlChemicalManagement = '/hoa-chat';
    private urlGetFoodIndustry = '/cntp';
    private urlGetLPGManagement = '/lpg';
    
    constructor(public http: HttpClient, public logOutService: LoginService) {
        this.data = JSON.parse(localStorage.getItem('currentUser'));
        this.token = this.data.token;
    }

    public GetChemicalManagement(time_id) {
        var apiUrl = this.endpoint + this.urlChemicalManagement;
        let params = new HttpParams().set('time_id', time_id.toString());
        return this.http.get<any>(apiUrl, { headers: HEADERS, params: params }).pipe(tap(data => data),
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