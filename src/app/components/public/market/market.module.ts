import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { NgModule } from '@angular/core';
import { MatDialogModule } from "@angular/material/dialog";

import { MarketRoutingModule } from './market-routing.module';

import { DomesticPriceComponent, DDMMYY_FORMAT } from './domesticPrice/domestic-price.component';
import { MaterialModule } from '../../../material.module';
import { DomesticExportComponent } from './domesticExport/domestic-export.component';
import { DomesticImportComponent } from './domesticImport/domestic-import.component';
import { DomesticProductComponent } from './domesticProduct/domestic-product.component';
import { ForeignMarketPriceComponent } from './foreignPrice/foreign-price.component';
import { CompanyTopPopup } from './company-top-popup/company-top-popup.component';
import { CurrencyMaskInputMode, NgxCurrencyModule } from "ngx-currency";
import { PipeModule } from 'src/app/pipe.module';
import { registerLocaleData } from '@angular/common';
import localevi from '@angular/common/locales/vi';
registerLocaleData(localevi, 'vi');

export const customCurrencyMaskConfig = {
  align: "right",
  allowNegative: true,
  allowZero: true,
  decimal: ".",
  precision: 0,
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
    MarketRoutingModule,
    MatNativeDateModule,
    MatDialogModule,
    MaterialModule,
    ReactiveFormsModule,
    PipeModule,
    NgxCurrencyModule.forRoot(customCurrencyMaskConfig),
  ],
  exports: [
  ],
  declarations: [
    DomesticPriceComponent,
    DomesticExportComponent,
    DomesticImportComponent,
    DomesticProductComponent,
    ForeignMarketPriceComponent,
    CompanyTopPopup,
  ],
  providers: [
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } },
  
  ],
  entryComponents: [CompanyTopPopup]
})
export class MarketModule { }
