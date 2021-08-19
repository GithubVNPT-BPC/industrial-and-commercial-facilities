import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../../material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ManagerRoutingModule } from './manager-routing.module';
import { DomesticManagerComponent } from './domestic-manager/domestic-manager.component';
import { ForeignManagerComponent } from './foreign-manager/foreign-manager.component';
import { CurrencyMaskInputMode, NgxCurrencyModule } from "ngx-currency";
import { ProductManagerComponent } from './product-manager/product-manager.component';
import { ManagerDirective } from './../../shared/manager.directive';
import { ExportTopCompanyManager } from './export-top-company-manager/export-top-company-manager.component';
import { SearchBusinessComponent } from './business/search/search-business.component';
import { EditBusinessComponent } from './business/edit/edit-business.component';
import { AddCertificateComponent } from './business/add-certificate/add-certificate.component';
import { CertificateListComponent } from './business/certificate-list/certificate-list.component';
import { UpdateUserComponent } from './update-user/update-user.component';
import { SystemLogComponent } from './system-log/system-log.component';
import { ManagerUserComponent } from './manager-user/manager-user.component';
import { AddUserComponent } from './add-user/add-user.component';

import { MatSelectModule, MatFormFieldModule } from '@angular/material';
import { MatSelectFilterModule } from 'mat-select-filter';

export const customCurrencyMaskConfig = {
  align: "right",
  allowNegative: true,
  allowZero: true,
  decimal: ",",
  precision: 0,
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

    MatSelectModule,
    MatFormFieldModule,
    MatSelectFilterModule
  ],
  exports: [
  ],
  declarations: [
    DomesticManagerComponent,
    ForeignManagerComponent,
    ProductManagerComponent,
    ManagerDirective,
    ExportTopCompanyManager,
    SearchBusinessComponent,
    EditBusinessComponent,
    AddCertificateComponent,
    CertificateListComponent,
    UpdateUserComponent,
    SystemLogComponent,
    ManagerUserComponent,
    AddUserComponent,
  ],
  entryComponents: [ExportTopCompanyManager]
})
export class ManagerModule { }
