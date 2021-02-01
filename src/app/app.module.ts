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
import { appInitializer } from './_helpers/app.initializer';
import { LoginService } from './_services/APIService/login.service';
import { ErrorInterceptor } from './_helpers/error.interceptor';
import { ConfirmationDialogComponent } from './shared/confirmation-dialog/confirmation-dialog.component';
import { ConfirmationDialogService } from './shared/confirmation-dialog/confirmation-dialog.service';
// import {ToastrModule} from 'ngx-toastr';
import {MatPaginatorModule} from '@angular/material/paginator';
// import { FormatNumberReportPipe } from './shared/pipes/formatNumber.pipe';
import { dich } from 'src/app/components/specialized/commecial-managemant/border-trade/dich.pipe';
import { PipeModule } from './pipe.module';
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
    // ToastrModule.forRoot()
  ],
  declarations:[
    InformationComponent,
    ConfirmationDialogComponent,
    // FormatNumberReportPipe
  ],
  exports : [
    // FormatNumberReportPipe
    
  ],
  providers: [
   // { provide: APP_INITIALIZER, useFactory: appInitializer, multi: true, deps: [LoginService] },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy,
    },
    InformationService,
    ConfirmationDialogService,
  ],
  entryComponents:[
    InformationComponent,
    ConfirmationDialogComponent
  ],
  bootstrap: [RoutingComponent]
})
export class AppModule { }
