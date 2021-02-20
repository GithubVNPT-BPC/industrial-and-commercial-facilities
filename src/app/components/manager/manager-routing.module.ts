import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchBusinessComponent } from './business/search/search-business.component';
import { EditBusinessComponent } from './business/edit/edit-business.component';
import { BusinessExportImportComponent } from './business/business-export-import/business-export-import.component';
import { registerLocaleData } from '@angular/common';
import localevi from '@angular/common/locales/vi';
registerLocaleData(localevi, 'vi');

import { Industry } from '../../_authGuard/Industry';
import { Energy } from '../../_authGuard/Energy';
import { Commercial } from '../../_authGuard/Commercial';
import { Manager } from '../../_authGuard/Manager';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { PageNotFoundComponent, LoaderInterceptor } from '../../shared';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Quản lý'
    },
    children: [
      {
        path: 'business',
        data: {
          title: 'Doanh nghiệp'
        },
        children: [
          {
            path: 'search',
            component: SearchBusinessComponent,
            data: {
              title: 'Quản lý doanh nghiệp'
            },
          },
          {
            path: 'edit',
            component: EditBusinessComponent,
            data: {
              title: 'Thêm doanh nghiệp'
            },
          },
          {
            path: 'edit/:mst',
            component: EditBusinessComponent,
            data: {
              title: 'Chỉnh sửa doanh nghiệp'
            },
          },
          {
            path: 'top-export',
            component: BusinessExportImportComponent,
            data: {
              title: 'Doanh nghiệp Xuất Nhập khẩu'
            },
          },
        ],
      },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptor,
      multi: true
    }
  ],
})
export class ManagerRoutingModule { }
