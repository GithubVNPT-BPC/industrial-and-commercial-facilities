import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { finalize, catchError, delay } from 'rxjs/operators';

import { MessageService } from 'primeng/api';
import { LoaderService } from './loader.service';

@Injectable({
  providedIn: 'root'
})
export class LoaderInterceptor implements HttpInterceptor {

  constructor(public loaderService: LoaderService, public messageService: MessageService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.messageService.clear();
    this.loaderService.show();
    return next.handle(req).pipe(
      delay(500),
      finalize(() => {
        this.loaderService.hide();
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status >= 500) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error inesperado',
            detail: 'Intentelo nuevamente mas tarde. (' + error.error.error_description + ')',
            life: 10000,
          });
        }
        else{
          if (error.status == 401){
            this.loaderService.hide();
            this.messageService.add({
              severity: 'error',
              summary: 'Hết phiên đăng nhập',
              detail: 'Lỗi. (' + error.error.error_description + ')',
              life: 10000,
            });
          }
        }
        return throwError(error);
      })
    );
  }
}
