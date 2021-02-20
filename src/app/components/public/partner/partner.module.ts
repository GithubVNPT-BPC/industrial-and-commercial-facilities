import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../../../material.module';
import { ReactiveFormsModule } from '@angular/forms';

import { PartnerRoutingModule } from './partner-routing.routing';
import { SearchPartnerComponent } from './search/search-partner.component';
import { CompanyDetailComponent } from './detail/detail-partner.component';

import { FilterByAddressPipe } from "../../../shared/pipes/filterByAddress.pipe";
import { FilterByNamePipe } from "../../../shared/pipes/filterByName.pipe";
import { FilterByCategoryPipe } from "../../../shared/pipes/filterbyCategory.pipe";
import { WebsiteFormatPipe } from '../../../shared/pipes/formatWebsite.pipe';
import { CurrencyMaskInputMode, NgxCurrencyModule } from "ngx-currency";
import { registerLocaleData } from '@angular/common';
import localevi from '@angular/common/locales/vi';
registerLocaleData(localevi, 'vi');

export const customCurrencyMaskConfig = {
  align: "left",
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
    PartnerRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    NgxCurrencyModule.forRoot(customCurrencyMaskConfig),
  ],
  providers: [
  ],
  declarations: [
    SearchPartnerComponent,
    FilterByAddressPipe,
    FilterByNamePipe,
    FilterByCategoryPipe,
    WebsiteFormatPipe,
    CompanyDetailComponent,
  ],
  exports: [
    FilterByAddressPipe,
    FilterByNamePipe,
    FilterByCategoryPipe,
    WebsiteFormatPipe,
  ],
  entryComponents: []
})
export class PartnerModule { }
