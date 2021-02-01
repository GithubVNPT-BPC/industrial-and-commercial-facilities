import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {FillReportComponent} from '../report/fill-report/fill-detail/fill-detail.component';
import {FillSelectReportComponent} from '../report/fill-report/fill-select-report/fill-select-report.component';
import {ViewReportComponent} from '../report/view-report/view-detail/view-detail.component';
import {ViewSelectReportComponent} from '../report/view-report/select-report/select-report.component';
const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Báo cáo'
    },
    children: [
      {
        path: '',
        redirectTo: 'all',
      },
      {
        path: 'all',
        component: FillSelectReportComponent,
        data: {
          title: 'Nhập báo cáo'
        }
      },
      {
        path: 'edit',
        component: FillReportComponent,
        data: {
          title: 'Nhập liệu báo cáo'
        }
      },
      {
        path: 'view-all',
        component: ViewSelectReportComponent,
        data: {
          title: 'Xem báo cáo'
        }
      },
      {
        path: 'view',
        component: ViewReportComponent,
        data: {
          title: 'Xem báo cáo'
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingModule { }
