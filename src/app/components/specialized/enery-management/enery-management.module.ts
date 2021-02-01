import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from './../../../material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { EneryManagementRoutingModule } from './enery-management.routing';
import { HydroelectricComponent } from './hydroelectric/hydroelectric.component';
import { CountrysideElectricComponent } from './countryside-electric/countryside-electric.component';
import { UseFocusedEnergyComponent } from './use-focused-energy/use-focused-energy.component';
import { CommonEnergyComponent } from './common-energy/common-energy.component'
import { ElectricManagementComponent } from './electric-management/electric-management.component';
import {SolarEneryManagementComponent} from './solar-enery-management/solor-enery-management.component'
import { ElectricDevelopmentManagementComponent } from './electricity-development/electricity-development.component';
import { PowerProductionManagementComponent } from './power-production/power-production.component';
import { RuralElectricManagementComponent } from './rural-electric/rural-electric-management.component';
import { ElectricalPlanComponent } from './electrical-plan/electrical-plan.component';
import { CurrentElectricalPlanComponent } from './current-electrical-plan/current-electrical-plan.component';
import { FutureElectricalPlanComponent } from './future-electrical-plan/future-electrical-plan.component';
import {BlockElectricComponent} from './block-electric/block-electric.component'
import { ManageApproveHddlComponent } from "./manage-approve-hddl/manage-approve-hddl.component";
import { ConsultantElectricComponent } from "./manage-approve-hddl/consultant-electric/consultant-electric.component";
import { ManufacturingElectronicComponent } from "./manage-approve-hddl/manufacturing-electronic/manufacturing-electronic.component";
import { registerLocaleData } from '@angular/common';
import localevi from '@angular/common/locales/vi';
registerLocaleData(localevi, 'vi');

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,    
    EneryManagementRoutingModule,
  ],
  exports: [
  ],
  declarations: [
    HydroelectricComponent,
    CountrysideElectricComponent,
    ElectricManagementComponent,
    SolarEneryManagementComponent,
    UseFocusedEnergyComponent,
    CommonEnergyComponent,
    ElectricDevelopmentManagementComponent,
    PowerProductionManagementComponent,
    RuralElectricManagementComponent,
    ElectricalPlanComponent,
    CurrentElectricalPlanComponent,
    FutureElectricalPlanComponent,
    BlockElectricComponent,
    ManageApproveHddlComponent,
    ConsultantElectricComponent,
    ManufacturingElectronicComponent
],
  entryComponents: []
})
export class EneryManagementModule { }
