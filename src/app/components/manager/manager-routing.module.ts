import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchBusinessComponent } from './business/search/search-business.component';
import { EditBusinessComponent } from './business/edit/edit-business.component';
import { registerLocaleData } from '@angular/common';
import localevi from '@angular/common/locales/vi';
registerLocaleData(localevi, 'vi');
import { Industry } from '../../_authGuard/Industry';
import { Energy } from '../../_authGuard/Energy';
import { Commercial } from '../../_authGuard/Commercial';
import { Manager } from '../../_authGuard/Manager';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { PageNotFoundComponent, LoaderInterceptor } from '../../shared';
import { DomesticManagerComponent } from './domestic-manager/domestic-manager.component';
import { ForeignManagerComponent } from './foreign-manager/foreign-manager.component';
import { ProductManagerComponent } from './product-manager/product-manager.component';
import { CertificateListComponent } from './business/certificate-list/certificate-list.component';
import { AddCertificateComponent } from './business/add-certificate/add-certificate.component';
import { UpdateUserComponent } from './update-user/update-user.component';

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
            path: 'certificate',
            component: CertificateListComponent,
            data: {
              title: 'Quản lý giấy phép'
            },
          },
          {
            path: 'add-certificate/:id',
            component: AddCertificateComponent,
            data: {
              title: 'Thêm giấy phép'
            },
          },
          {
            path: 'edit/:mst',
            component: EditBusinessComponent,
            data: {
              title: 'Chỉnh sửa doanh nghiệp'
            },
          },
        ],
      },

      {
        path: 'user',
        component: UpdateUserComponent,
        data: {
          title: 'Cập nhật thông tin tài khoản'
        },
      },

      {
        path: 'market',
        data: {
          title: ''
        },
        children: [
          {
            path: 'domestic',
            data: {
              title: 'Thị trường'
            },
            children: [
              {
                path: 'price',
                component: DomesticManagerComponent,
                data: {
                  title: 'Quản lý doanh nghiệp'
                },
              },
              {
                path: 'production',
                component: ProductManagerComponent,
                data: {
                  title: 'Thêm doanh nghiệp'
                },
              },
            ],
          },

          {
            path: 'foreign',
            data: {
              title: 'Thị trường'
            },
            children: [
              {
                path: 'price',
                component: ForeignManagerComponent,
                data: {
                  title: 'Quản lý doanh nghiệp'
                },
              },
            ],
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
