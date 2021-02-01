import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SearchPartnerComponent } from './search/search-partner.component';
import { CompanyDetailComponent } from './detail/detail-partner.component';
const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Đối tác kinh doanh'
    },
    children: [
      {
        path: '',
        redirectTo: 'partner',
      },
      {
        path: 'search',
        component: SearchPartnerComponent,
        data: {
          title: 'Tìm kiếm đối tác kinh doanh'
        }
      },
      {
        path: 'search/:mst',
        component: CompanyDetailComponent,
        data: {
          title: 'Chi tiết về doanh nghiệp'
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PartnerRoutingModule { }
