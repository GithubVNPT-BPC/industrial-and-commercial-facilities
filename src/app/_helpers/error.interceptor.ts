import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { LoginService } from '../_services/APIService/login.service';
import { Router } from '@angular/router';
import { InformationService } from '../shared/information/information.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(
        public authenticationService: LoginService, 
        public info: InformationService,
        public router: Router) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
        return next.handle(request).pipe(catchError(err => {
            let errorResponse: HttpErrorResponse = err as HttpErrorResponse;
            if ([403].includes(errorResponse.status)) {

            }
            if ([401].includes(errorResponse.status) && this.authenticationService.userValue) {
                if (['1'].includes(errorResponse.message)) {
                    this.info.msgError("User đang sử dụng đã bị xóa!")
                    this.authenticationService.LogoutUser();
                }else if(['2'].includes(errorResponse.message)){
                    this.info.msgError("Hết phiên đăng nhập! Vui lòng đăng nhập lại.");
                    this.authenticationService.LogoutUser();
                    this.router.navigate['/login'];
                }else if(['3'].includes(errorResponse.message)){
                    this.info.msgError("Hết phiên đăng nhập! Vui lòng đăng nhập lại.");
                    this.authenticationService.LogoutUser();
                    this.router.navigate['/login'];
                }else{
                    this.info.msgError("Hết phiên đăng nhập! Quay về trang chủ");
                    this.authenticationService.LogoutUser();
                }
            }
            else if ([404].includes(err.status)) {
                this.router.navigate['/404'];
            } else {
                if ([400].includes(err.status)) {
                    this.authenticationService.LogoutUser();
                }
            }
            const error = (err && err.error && err.error.message) || err.statusText;
            return throwError(err);
        }))
    }
}