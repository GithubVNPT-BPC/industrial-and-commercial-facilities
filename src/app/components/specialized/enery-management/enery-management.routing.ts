import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CountrysideElectricComponent } from './countryside-electric/countryside-electric.component';
import { UseFocusedEnergyComponent } from './use-focused-energy/use-focused-energy.component';
import { CommonEnergyComponent } from './common-energy/common-energy.component';
import { ElectricManagementComponent } from './electric-management/electric-management.component';
import { ElectricalPlanComponent } from './electrical-plan/electrical-plan.component';
import { BlockElectricComponent } from './block-electric/block-electric.component';
import { ManageApproveHddlComponent } from './manage-approve-hddl/manage-approve-hddl.component';
import { HydroelectricComponent } from './hydroelectric/hydroelectric.component';
import { SolarEneryManagementComponent } from './solar-enery-management/solor-enery-management.component';
import { ElectricDevelopmentManagementComponent } from './electricity-development/electricity-development.component';
import { PowerProductionManagementComponent } from './power-production/power-production.component';
import { RuralElectricManagementComponent } from './rural-electric/rural-electric-management.component';
import { KeyEnegyComponent } from './key-enegy/key-enegy.component';
import { MonthDetailComponent } from './power-production/month-detail/month-detail.component';
import { DifferenceElectricComponent } from './difference-electric/difference-electric.component';
import { FutureManagementComponent } from './future-electrical-plan/future-electrical-management.component';

const routes: Routes = [

  {
    path: '',
    data: {
      title: 'Quản lý năng lượng'
    },
    children: [
      {
        path: 'common',
        data: {
          title: 'Quản lý năng lượng'
        },
        component: CommonEnergyComponent,
      },
      {
        path: 'solarelectric',
        data: {
          title: 'Điện mặt trời',
        },
        component: SolarEneryManagementComponent
      },
      {
        path: 'hydroelectric',
        data: {
          title: 'Thủy điện',
        },
        component: HydroelectricComponent
      },
      {
        path: 'diffelectric',
        data: {
          title: 'Nguồn điện khác',
        },
        component: DifferenceElectricComponent
      },
      {
        path: 'countryside_electric',
        data: {
          title: 'Phát triển điện',
        },
        component: CountrysideElectricComponent
      },
      {
        path: 'focused_energy',
        data: {
          title: 'Tiết kiệm năng lượng',
        },
        component: UseFocusedEnergyComponent
      },
      {
        path: 'electrical_plan',
        data: {
          title: 'QH lưới điện 110KV trở lên',
        },
        component: ElectricalPlanComponent
      },
      {
        path: 'block_electric',
        data: {
          title: 'Điện sinh khối',
        },
        component: BlockElectricComponent
      },
      {
        path: 'manage_aprove_hddl',
        data: {
          title: 'Quản lý Cấp phép HĐ ĐL',
        },
        component: ManageApproveHddlComponent
      },
      {
        path: '35kv_electricity_development',
        data: {
          title: 'Công tác phát triển lưới điện 35KV trở xuống',
        },
        component: ElectricDevelopmentManagementComponent
      },
      // {
      //   path: 'power-production-month-detail',
      //   data: {
      //     title: 'Chi tiết điện sản xuất và điện thương phẩm',
      //   },
      //   component: MonthDetailComponent,
      // },
      {
        path: 'power_production',
        data: {
          title: 'Điện sản xuất và điện thương phẩm',
        },
        component: MonthDetailComponent,
      },
      {
        path: 'rural_electricity',
        data: {
          title: 'Điện nông thôn (Nông thôn mới)',
        },
        component: RuralElectricManagementComponent
      },
      {
        path: 'key_enegy',
        data: {
          title: 'Năng lượng trọng điểm'
        },
        component: KeyEnegyComponent
      },
      {
        path: 'future_electrical_plan',
        data: {
          title: 'Quy hoạch công trình điện từ 110kV trở lên'
        },
        component: FutureManagementComponent
      }
    ],
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EneryManagementRoutingModule { }
