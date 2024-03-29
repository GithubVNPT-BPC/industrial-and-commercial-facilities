import { CommonModule, PercentPipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { PipeModule } from 'src/app/pipe.module';
import { registerLocaleData } from '@angular/common';
import localevi from '@angular/common/locales/vi';
registerLocaleData(localevi, 'vi');
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { DecimalPipe } from '@angular/common';
import { MatCarouselModule } from '@ngmodule/material-carousel';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

import { ChemicalManagementComponent } from './chemical-management/chemical-management.component';
import { ClusterManagementComponent } from './cluster-management/cluster-management.component';
import { DetailClusterManagementComponent } from './cluster-management/detail-cluster-management/detail-cluster-management.component';
import { FoodIndustryManagementComponent } from './food-industry/food-industry-management.component';
import { IIPIndustrialComponent } from './iip-industrial/iip-industrial.component';
import { IndustrialExplosivesComponent } from './industrial-explosives/industrial-explosives.component';
import { IndustryManagementRoutingModule } from './industry-management.routing';
import { LPGManagementComponent } from './lpg-management/lpg-management.component';
import { CertificateRegulationComponent } from './certificate-regulation/certificate-regulation.component';
import { ReportExplosivesComponent } from './report-explosives/report-explosives.component';
import { CrudButtonsComponent } from "../../../shared/crud-buttons/crud-buttons.component";
import { IipMonthNewComponent } from './iip-industrial/iip-month-new/iip-month-new.component';
import { ClusterBusinessComponent } from './cluster-management/cluster-business/cluster-business.component';
import { IndustryBusinessComponent } from './industry-business/industry-business.component';
import { SupportBusinessComponent } from './support-business/support-business.component';

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
    NgxMatSelectSearchModule
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
    CertificateRegulationComponent,
    ReportExplosivesComponent,
    CrudButtonsComponent,
    IipMonthNewComponent,
    ClusterBusinessComponent,
    IndustryBusinessComponent,
    SupportBusinessComponent,
    
  ],
  entryComponents: [ClusterBusinessComponent],
  providers: [DecimalPipe, PercentPipe]
})

export class IndustryManagement {

}