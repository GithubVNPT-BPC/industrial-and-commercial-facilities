import { CommonModule, PercentPipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { PipeModule } from 'src/app/pipe.module';
import { ChemicalManagementComponent } from './chemical-management/chemical-management.component';
import { ClusterManagementComponent } from './cluster-management/cluster-management.component';
import { DetailClusterManagementComponent } from './cluster-management/detail-cluster-management/detail-cluster-management.component';
import { FoodIndustryManagementComponent } from './food-industry/food-industry-management.component';
import { IIPIndustrialComponent } from './iip-industrial/iip-industrial.component';
import { IIPMonthComponent } from './iip-industrial/iip-month/iip-month-component';
import { IndustrialExplosivesComponent } from './industrial-explosives/industrial-explosives.component';
import { IndustryManagementRoutingModule } from './industry-management.routing';
import { LPGManagementComponent } from './lpg-management/lpg-management.component';
import { CertificateRegulationComponent } from './certificate-regulation/certificate-regulation.component';
import { ReportExplosivesComponent } from './report-explosives/report-explosives.component';
import { registerLocaleData } from '@angular/common';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { DecimalPipe } from '@angular/common';
import { MatCarouselModule } from '@ngmodule/material-carousel';

import localevi from '@angular/common/locales/vi';
registerLocaleData(localevi, 'vi');

import { CrudButtonsComponent } from "../../../shared/crud-buttons/crud-buttons.component";
import { IipMonthNewComponent } from './iip-industrial/iip-month-new/iip-month-new.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    PipeModule,
    PdfViewerModule,
    IndustryManagementRoutingModule,
    MatCarouselModule.forRoot(),
  ],
  exports: [
  ],
  declarations: [
    ChemicalManagementComponent,
    LPGManagementComponent,
    FoodIndustryManagementComponent,
    IndustrialExplosivesComponent,
    ClusterManagementComponent,
    DetailClusterManagementComponent,
    IIPIndustrialComponent,
    IIPMonthComponent,
    CertificateRegulationComponent,
    ReportExplosivesComponent,
    CrudButtonsComponent,
    IipMonthNewComponent
  ],
  entryComponents: [],
  providers: [DecimalPipe, PercentPipe]
})

export class IndustryManagement {

}