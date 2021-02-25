import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs'
import { catchError, tap } from 'rxjs/operators'
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { LoginService } from './login.service';
import { DeleteModel, PetrolPost, PetrolValuePost, Businessman } from 'src/app/_models/APIModel/conditional-business-line.model';

@Injectable({
  providedIn: 'root'
})
export class ConditionBusinessService {
  token: any;
  username: any;
  data: any;
  apiHome = environment.apiEndpoint;

  public urlProductSelect = "api/danh-sach/san-pham"
  public urlAllCareer = "api/danh-sach/nganh-nghe";
  public urlDistrict = "api/danh-sach/quan-huyen";
  public urlSubDistrict = "api/danh-sach/phuong-xa";
  public urlLHHD = "api/danh-sach/loai-hinh-hoat-dong";
  public urlCer = "api/doanh-nghiep/giay-phep";

  urlgetPetrolValue = "api/qltm/xang-dau/san-luong";
  urlgetAllPetrolValue = "api/qltm/xang-dau/tat-ca-san-luong";
  urlgetAllPetrolStore = "api/qltm/xang-dau/cua-hang";
  urlgetBusinessman = "api/qltm/thuong-nhan";
  urlpostPetrol = "api/qltm/xang-dau/cua-hang";
  urlpostPetrolValue = "api/qltm/xang-dau/san-luong";
  urlpostBusinessman = "api/qltm/thuong-nhan";
  urlDeleteBusinessman = "api/qltm/thuong-nhan/xoa";
  urlDeletePetrol = "api/qltm/xang-dau/xoa-cua-hang";
  urlDeletePetrolValue = "api/qltm/xang-dau/xoa-san-luong";

  constructor(public http: HttpClient, public logOutService: LoginService) {
    // this.data = JSON.parse(localStorage.getItem('currentUser'));
    // this.token = this.data.token;
  }

  //Petrol
  petrol: PetrolPost
  public PostPetrol(petrol: Array<PetrolPost>) {
    var apiUrl = this.apiHome + this.urlpostPetrol;
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    headers = headers.append('Authorization', 'Bearer ' + `${this.token}`);
    return this.http.post<any>(apiUrl, petrol, { headers: headers }).pipe(tap(data => data),
      catchError(this.handleError)
    );
  }
  public PostPetrolValue(petrolvalue: Array<PetrolValuePost>) {
    var apiUrl = this.apiHome + this.urlpostPetrolValue;
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    headers = headers.append('Authorization', 'Bearer ' + `${this.token}`);
    return this.http.post<any>(apiUrl, petrolvalue, { headers: headers }).pipe(tap(data => data),
      catchError(this.handleError)
    );
  }
  businessman: Businessman
  public PostBusinessman(businessman: Array<Businessman>) {
    var apiUrl = this.apiHome + this.urlpostBusinessman;
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    headers = headers.append('Authorization', 'Bearer ' + `${this.token}`).append("Access-Control-Allow-Origin", "*");
    return this.http.post<any>(apiUrl, businessman, { headers: headers }).pipe(tap(data => data),
      catchError(this.handleError)
    );
  }
  public GetBusinessman() {
    var apiUrl = this.apiHome + this.urlgetBusinessman;
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get<any>(apiUrl, { headers: headers }).pipe(tap(data => data),
      catchError(this.handleError)
    );
  }
  public GetAllPetrolStore() {
    var apiUrl = this.apiHome + this.urlgetAllPetrolStore;
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get<any>(apiUrl, { headers: headers }).pipe(tap(data => data),
      catchError(this.handleError)
    );
  }
  public GetAllPetrolValue() {
    var apiUrl = this.apiHome + this.urlgetAllPetrolValue;
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get<any>(apiUrl, { headers: headers }).pipe(tap(data => data),
      catchError(this.handleError)
    );
  }
  public GetPetrolValue(time: string) {
    var apiUrl = this.apiHome + this.urlgetPetrolValue;
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let params = new HttpParams().set('time_id', time);
    return this.http.get<any>(apiUrl, { headers: headers, params: params }).pipe(tap(data => data),
      catchError(this.handleError)
    );
  }
  public DeleteBusinessman(deletemodel: Array<DeleteModel>) {
    var apiUrl = this.apiHome + this.urlDeleteBusinessman
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    headers = headers.append('Authorization', 'Bearer ' + `${this.token}`);
    return this.http.post<any>(apiUrl, deletemodel, { headers: headers }).pipe(tap(data => data), catchError(this.handleError))
  }
  public DeletePetrol(deletemodel: Array<DeleteModel>) {
    var apiUrl = this.apiHome + this.urlDeletePetrol
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    headers = headers.append('Authorization', 'Bearer ' + `${this.token}`);
    return this.http.post<any>(apiUrl, deletemodel, { headers: headers }).pipe(tap(data => data), catchError(this.handleError))
  }
  public DeletePetrolValue(deletemodel: Array<DeleteModel>) {
    var apiUrl = this.apiHome + this.urlDeletePetrolValue
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    headers = headers.append('Authorization', 'Bearer ' + `${this.token}`);
    return this.http.post<any>(apiUrl, deletemodel, { headers: headers }).pipe(tap(data => data), catchError(this.handleError))
  }
  //Petrol

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
  public GetCertificate(mst: string) {
    var apiUrl = this.apiHome + this.urlCer;
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let params = new HttpParams().set('mst', mst);
    return this.http.get<any>(apiUrl, { headers: headers, params: params }).pipe(tap(data => data),
      catchError(this.handleError)
    );
  }
  //mat-select api

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
