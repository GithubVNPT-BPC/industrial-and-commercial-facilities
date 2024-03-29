import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PipeModule } from 'src/app/pipe.module';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { registerLocaleData } from '@angular/common';
import localevi from '@angular/common/locales/vi';
registerLocaleData(localevi, 'vi');

import { EneryManagementRoutingModule } from './enery-management.routing';
import { HydroelectricComponent } from './hydroelectric/hydroelectric.component';
import { CountrysideElectricComponent } from './countryside-electric/countryside-electric.component';
import { UseFocusedEnergyComponent } from './use-focused-energy/use-focused-energy.component';
import { CommonEnergyComponent } from './common-energy/common-energy.component'
import { ElectricManagementComponent } from './electric-management/electric-management.component';
import { SolarEneryManagementComponent } from './solar-enery-management/solor-enery-management.component'
import { ElectricDevelopmentManagementComponent } from './electricity-development/electricity-development.component';
import { PowerProductionManagementComponent } from './power-production/power-production.component';
import { RuralElectricManagementComponent } from './rural-electric/rural-electric-management.component';
import { ElectricalPlanComponent } from './electrical-plan/electrical-plan.component';
import { CurrentElectricalPlanComponent } from './current-electrical-plan/current-electrical-plan.component';
import { CurrentPowerStationComponent } from './current-electrical-plan/current-power-station.component';
import { FutureElectricalPlanComponent } from './future-electrical-plan/future-electrical-plan.component';
import { BlockElectricComponent } from './block-electric/block-electric.component'
import { ManageApproveHddlComponent } from "./manage-approve-hddl/manage-approve-hddl.component";
import { ConsultantElectricComponent } from "./manage-approve-hddl/consultant-electric/consultant-electric.component";
import { ManufacturingElectronicComponent } from "./manage-approve-hddl/manufacturing-electronic/manufacturing-electronic.component";
import { KeyEnegyComponent } from './key-enegy/key-enegy.component';
import { MonthDetailComponent } from './power-production/month-detail/month-detail.component';
import { DifferenceElectricComponent } from './difference-electric/difference-electric.component';
import { PrimaryElectricityComponent } from './primary-electricity/primary-electricity.component';
import { TranslateIdPeriodToNamePipe } from 'src/app/shared/pipes/translateIdPeriodToName.pipe';
import { FutureManagementComponent } from './future-electrical-plan/future-electrical-management.component';
import { FuturePowerStationComponent } from './future-electrical-plan/future-power-station.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    PipeModule,
    ReactiveFormsModule,
    EneryManagementRoutingModule,
  ],
  exports: [
    TranslateIdPeriodToNamePipe
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
    CurrentPowerStationComponent,
    FutureElectricalPlanComponent,
    FuturePowerStationComponent,
    FutureManagementComponent,
    BlockElectricComponent,
    ManageApproveHddlComponent,
    ConsultantElectricComponent,
    ManufacturingElectronicComponent,
    KeyEnegyComponent,
    MonthDetailComponent,
    DifferenceElectricComponent,
    PrimaryElectricityComponent,
    TranslateIdPeriodToNamePipe
  ],
  entryComponents: [],
})
export class EneryManagementModule { }
