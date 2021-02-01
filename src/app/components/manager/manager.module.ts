import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../../material.module';
import { ReactiveFormsModule } from '@angular/forms';

import { CreateBussinessComponent } from './business/create/create-business.component';
import { ManagerRoutingModule } from './manager-routing.module';
import { DomesticManagerComponent } from './domestic-manager/domestic-manager.component';
import { ForeignManagerComponent } from './foreign-manager/foreign-manager.component';
import { CurrencyMaskInputMode, NgxCurrencyModule } from "ngx-currency";
import { ImportManagerComponent } from './import-manager/import-manager.component';
import { ExportManagerComponent } from './export-manager/export-manager.component';
import { ProductManagerComponent } from './product-manager/product-manager.component';
import { ManagerDirective } from './../../shared/manager.directive';
import { ExportTopCompanyManager } from './export-top-company-manager/export-top-company-manager.component';
import { SearchBusinessComponent } from './business/search/search-business.component';
import { EditBusinessComponent } from './business/edit/edit-business.component';
import { DialogBusinessComponent } from './business/Dialog/Dialog-business.component';
import { TestDirectives } from '../../_directive/addHtml.directive';
import { DetailBussinessComponent } from './business/detail-business/detail-business.component';
import { ConfirmDialogComponent } from './business/confirm-dialog/confirm-dialog.component';
import { BusinessExportImportComponent } from './business/business-export-import/business-export-import.component';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

export const customCurrencyMaskConfig = {
  align: "right",
  allowNegative: true,
  allowZero: true,
  decimal: ",",
  precision: 2,
  prefix: "",
  suffix: "",
  thousands: ".",
  nullable: true,
  min: null,
  max: 1000000000000,
  inputMode: CurrencyMaskInputMode.NATURAL
};

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ManagerRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    NgxCurrencyModule.forRoot(customCurrencyMaskConfig),
  ],
  exports: [
    ConfirmDialogComponent,
    ExportTopCompanyManager
    
  ],
  declarations: [
    CreateBussinessComponent,
    DomesticManagerComponent,
    ForeignManagerComponent,
    ImportManagerComponent,
    ExportManagerComponent,
    ProductManagerComponent,
    ManagerDirective,
    ExportTopCompanyManager,
    SearchBusinessComponent,
    EditBusinessComponent,
    DialogBusinessComponent,
    TestDirectives,
    DetailBussinessComponent,
    ConfirmDialogComponent,
    BusinessExportImportComponent
  ],
  entryComponents: [ExportTopCompanyManager, DialogBusinessComponent, ConfirmDialogComponent]
})
export class ManagerModule { }
