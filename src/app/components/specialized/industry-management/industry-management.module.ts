import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { PipeModule } from 'src/app/pipe.module';
import { ChemicalManagementComponent } from './chemical-management/chemical-management.component';
import { ClusterManagementComponent } from './cluster-management/cluster-management.component';
import { DetailClusterManagementComponent } from './cluster-management/detail-cluster-management/detail-cluster-management.component';
import { FoodIndustryManagementComponent } from './food-industry/food-industry-management.component';
import { IipIndustrialComponent } from './iip-industrial/iip-industrial.component';
import { IipMonthComponent } from './iip-industrial/iip-month/iip-month.component';
import { IndustrialExplosivesComponent } from './industrial-explosives/industrial-explosives.component';
import { IndustryManagementRoutingModule } from './industry-management.routing';
import { LPGManagementComponent } from './lpg-management/lpg-management.component';
import { CertificateRegulationComponent } from './certificate-regulation/certificate-regulation.component';
import { ReportExplosivesComponent } from './report-explosives/report-explosives.component';
import { registerLocaleData } from '@angular/common';
import localevi from '@angular/common/locales/vi';
registerLocaleData(localevi, 'vi');

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        MaterialModule,
        ReactiveFormsModule,
        PipeModule,
        IndustryManagementRoutingModule,
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
        IipIndustrialComponent,
        IipMonthComponent,
        CertificateRegulationComponent,
        ReportExplosivesComponent,
      ],
      entryComponents: []
})

export class IndustryManagement{

}