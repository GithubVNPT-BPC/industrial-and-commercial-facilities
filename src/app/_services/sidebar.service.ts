import { Injectable } from '@angular/core';
import { Observable, throwError, Subject } from 'rxjs'
import { catchError, tap } from 'rxjs/operators'
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { LoginService } from 'src/app/_services/APIService/login.service';

@Injectable({
  providedIn: 'root'
})

export class SidebarService {
  public data: any;
  token: any;
  username: any;
  public apisidebar = environment.apiEndpoint + "api/dang-nhap/tai-giao-dien/"


  // With this subject you can save the sidenav state and consumed later into other pages.
  public sideBarState$: Subject<boolean> = new Subject();

  constructor(public http: HttpClient,
    public _loginService: LoginService) {
    // this.data = JSON.parse(localStorage.getItem('NormalUser'));
    // this.token = this.data.token;
  }

  public GetMenu() {
    const user = this._loginService.userValue;
    if (user.user_role_id) {
      var apiUrl = this.apisidebar + user.user_role_id;
    }
    else {
      var apiUrl = this.apisidebar + 1;
    }
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
      errorMessage = `Mã lỗi: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }

}