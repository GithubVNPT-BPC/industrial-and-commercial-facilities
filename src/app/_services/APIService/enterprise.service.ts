import { Injectable } from "@angular/core";
import { throwError } from 'rxjs'
import { catchError, tap } from 'rxjs/operators'
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { LoginService } from './login.service';

export const HEADERS = new HttpHeaders({ 'Content-Type': 'application/json' });

@Injectable({
    providedIn: 'root'
})

export class EnterpriseService {
    private data: any;
    private token: any;
    private username: any;

    private endpoint = environment.apiEndpoint + "api/doanh-nghiep";

    private urlGetAllEnterprise = '/danh-sach-doanh-nghiep';
    private urlGetEnterpriseByMst = '/danh-sach-doanh-nghiep-sct-theo-mst';
    private urlGetLicense = '/giay-phep';

    constructor(public http: HttpClient, public logOutService: LoginService) {
        this.data = JSON.parse(localStorage.getItem('currentUser'));
        this.token = this.data.token;
    }

    // GET methods
    public GetAllEnterpriseData() {
        var apiUrl = this.endpoint + this.urlGetAllEnterprise;
        return this.http.get<any>(apiUrl, { headers: HEADERS }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public GetLikeEnterpriseByMst(mst) {
        var apiUrl = this.endpoint + this.urlGetEnterpriseByMst;
        let params = new HttpParams().set('mst', mst.toString());
        return this.http.get<any>(apiUrl, { headers: HEADERS, params: params }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public GetEnterpriseByMst(mst) {
        var apiUrl = this.endpoint;
        let params = new HttpParams().set('mst', mst.toString());
        return this.http.get<any>(apiUrl, { headers: HEADERS, params: params }).pipe(tap(data => data),
            catchError(this.handleError)
        );
    }

    public GetLicenseByMst(mst) {
        var apiUrl = this.endpoint + this.urlGetLicense;
        let params = new HttpParams().set('mst', mst.toString());
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