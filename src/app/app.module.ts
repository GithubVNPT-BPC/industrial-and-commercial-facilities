import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { RoutingModule } from './routing/routing.module';
import { RoutingComponent } from './routing/routing.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from './material.module';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { InformationService } from './shared/information/information.service';
import { InformationComponent } from './shared/information/information.component';
import { ReactiveFormsModule } from '@angular/forms';
import { JwtInterceptor } from './_helpers/jwt.interceptor';
import { ErrorInterceptor } from './_helpers/error.interceptor';
import { ConfirmationDialogComponent } from './shared/confirmation-dialog/confirmation-dialog.component';
import { ConfirmationDialogService } from './shared/confirmation-dialog/confirmation-dialog.service';
import { MatPaginatorModule } from '@angular/material/paginator';
import { PipeModule } from './pipe.module';
import { DateAdapter, MatFormFieldModule, MatSelectModule, MAT_DATE_LOCALE } from '@angular/material';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MAT_DATE_FORMATS } from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DialogContainerComponent } from './shared/dialog/dialog-container/dialog-container.component';
import { DialogContainerYearComponent } from './shared/dialog/dialog-container/dialog-container-year.component';
import { ActivatedRouteSnapshot, RouteReuseStrategy } from '@angular/router';
import { DialogContainerNoConditionComponent } from './shared/dialog/dialog-container/dialog-container-noCondition.component';

export class AARouteReuseStrategy extends RouteReuseStrategy {
  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    return false;
  }
  store(route: ActivatedRouteSnapshot, handle: {}): void {

  }
  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    return false;
  }
  retrieve(route: ActivatedRouteSnapshot): {} {
     return null;
 }
 shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
   return false; // default is true if configuration of current and future route are the same
 }
}

const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD-MM-YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    RoutingModule,
    NgbModule,
    MaterialModule,
    PipeModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    MatSelectModule,
    MatFormFieldModule,
    NgxMatSelectSearchModule
  ],
  declarations: [
    InformationComponent,
    ConfirmationDialogComponent,
  ],
  exports: [
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy,
    },
    InformationService,
    ConfirmationDialogService,
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    {
      provide: RouteReuseStrategy,
      useClass: AARouteReuseStrategy
    }
  ],
  entryComponents: [
    InformationComponent,
    ConfirmationDialogComponent,
    DialogContainerComponent,
    DialogContainerYearComponent,
    DialogContainerNoConditionComponent
  ],
  bootstrap: [RoutingComponent]
})
export class AppModule { }