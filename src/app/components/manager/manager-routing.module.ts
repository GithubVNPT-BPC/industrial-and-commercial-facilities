import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateBussinessComponent } from './business/create/create-business.component';
import { DomesticManagerComponent } from './domestic-manager/domestic-manager.component';
import { ForeignManagerComponent } from './foreign-manager/foreign-manager.component';
import { ImportManagerComponent } from './import-manager/import-manager.component';
import { ExportManagerComponent } from './export-manager/export-manager.component';
import { ProductManagerComponent } from './product-manager/product-manager.component';
import { SearchBusinessComponent } from './business/search/search-business.component';
import { EditBusinessComponent } from './business/edit/edit-business.component';
import { DetailBussinessComponent } from './business/detail-business/detail-business.component';
import { BusinessExportImportComponent } from './business/business-export-import/business-export-import.component';
import { registerLocaleData } from '@angular/common';
import localevi from '@angular/common/locales/vi';
registerLocaleData(localevi, 'vi');

import { Industry } from '../../_authGuard/Industry';
import { Energy } from '../../_authGuard/Energy';
import { Commercial } from '../../_authGuard/Commercial';
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
        path: '',
        redirectTo: 'market',
      },
      {
        path: 'business',
        data: {
          title: 'Doanh nghiệp'
        },
        children: [
          {
            path: 'detail-business',
            component: DetailBussinessComponent,
            data: {
              title: 'Chi tiết doanh nghiệp'
            },
          },
          {
            path: 'create',
            component: EditBusinessComponent,
            data: {
              title: 'Tạo mới doanh nghiệp'
            },
          },
          {
            path: 'search',
            component: SearchBusinessComponent,
            data: {
              title: 'Tìm kiếm doanh nghiệp'
            },
          },
          {
            path: 'search/:mst',
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
          // {
          //   path: 'top-import',
          //   component: TopBusinessOfImportComponent,
          //   data: {
          //     title: 'Chỉnh sửa doanh nghiệp'
          //   },
          // },
        ],
      },
      {
        path: 'market',
        data: {
          title: 'Quản lý thị trường'
        },
        children: [
          {
            path: 'market',
            redirectTo: 'domestic'
          },
          {
            path: 'domestic',
            data: {
              title: 'Quản lý thị trường trong nước'
            },
            children: [
              {
                path: 'domestic',
                redirectTo: 'price',
              },
              {
                path: 'price',
                component: DomesticManagerComponent,
                data: {
                  title: 'Quản lý giá cả trong nước'
                }
              },
              {
                path: 'export',
                component: ExportManagerComponent,
                data: {
                  title: 'Quản lý xuất khẩu'
                }
              },
              {
                path: 'import',
                component: ImportManagerComponent,
                data: {
                  title: 'Quản lý nhập khẩu'
                }
              },
              {
                path: 'production',
                component: ProductManagerComponent,
                data: {
                  title: 'Quản lý sản xuất'
                }
              }
            ]
          },
          {
            path: 'foreign',
            data: {
              title: 'Quản lý thị trường quốc tế'
            },
            children: [
              {
                path: 'foreign',
                redirectTo: 'price',
              },
              {
                path: 'price',
                component: ForeignManagerComponent,
                data: {
                  title: 'Quản lý giá cả quốc tế'
                }
              }]
          }
        ]
      }
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    Energy,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptor,
      multi: true
    }
  ],
})
export class ManagerRoutingModule { }
