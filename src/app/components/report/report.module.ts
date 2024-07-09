import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localevi from '@angular/common/locales/vi';
registerLocaleData(localevi, 'vi');

import {FillReportComponent} from '../report/fill-report/fill-detail/fill-detail.component';
import {FillSelectReportComponent} from '../report/fill-report/fill-select-report/fill-select-report.component';
import {ViewReportComponent} from '../report/view-report/view-detail/view-detail.component';
import {ViewSelectReportComponent} from '../report/view-report/select-report/select-report.component';
import { ReportRoutingModule } from './report.routing';

import { MaterialModule } from '../../material.module';
import { ReportDirective } from './../../shared/report.directive';
import { CurrencyMaskInputMode, NgxCurrencyModule } from "ngx-currency";
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { ConfirmationDialogService } from 'src/app/shared/confirmation-dialog/confirmation-dialog.service';
import { SummaryReportComponent } from './summary-report/summary-report.component';
import { LrisIntegrationComponent } from './lris-integration/lris-integration.component';
import { StandardReportComponent } from './standard-report/standard-report.component';
import { AnnualEcommerceReportComponent } from './annual-ecommerce-report/annual-ecommer-report.component';
import { LrisIntegrationSkhdtComponent } from './lris-integration-skhdt/lris-integration-skhdt.component';

export const customCurrencyMaskConfig = {
  align: "right",
  allowNegative: true,
  allowZero: true,
  decimal: ".",
  precision: 2,
  prefix: "",
  suffix: "",
  thousands: ",",
  nullable: true,
  min: null,
  max: 1000000000000,
  inputMode: CurrencyMaskInputMode.NATURAL
};

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ReportRoutingModule,
    MaterialModule,
    NgxCurrencyModule.forRoot(customCurrencyMaskConfig),
  ],
  declarations: [
    FillReportComponent,
    FillSelectReportComponent,
    ViewReportComponent,
    ViewSelectReportComponent,
    ReportDirective,
    SummaryReportComponent,
    LrisIntegrationComponent,
    StandardReportComponent,
    AnnualEcommerceReportComponent,
    LrisIntegrationSkhdtComponent
  ],
  providers: [  ],
  entryComponents: [  ],
  exports: [
  ],
})
export class ReportModule { }
