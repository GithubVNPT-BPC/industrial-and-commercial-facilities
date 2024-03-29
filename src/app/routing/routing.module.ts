import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { MessagesModule } from 'primeng/messages';
import { MessageService } from 'primeng/api';
import { RoutingComponent } from './routing.component';
import { PublicLayoutComponent } from './public-layout/public-layout.component';
import { ManagerLayoutComponent } from './manager-layout/manager-layout.component';
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material.module';
import { SidebarService } from '../_services/sidebar.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { P404Component } from '../components/error/404.component';
import { P500Component } from '../components/error/500.component';
import { LoginComponent } from '../components/login/login.component';
import { RegisterComponent } from '../components/register/register.component';
import { FormsModule } from '@angular/forms';
import { LogoutComponent } from '../components/logout/logout.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SpecializedLayoutComponent } from './specialized-layout/specialized-layout.component';
import { ReportLayoutComponent } from './report-layout/report-layout.component';
import { HomeSpecializedComponent } from '../components/specialized/home-specialized/home-specialized.component';

import { Admin } from '../_authGuard/Admin';
import { Specialize } from '../_authGuard/Specialize';
import { Manager } from '../_authGuard/Manager';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { PageNotFoundComponent, LoaderInterceptor } from '../shared';

const routes: Routes = [
  {//Default first page
    path: '',
    redirectTo: 'public/market/domestic/price',
    pathMatch: 'full',
  },
  {//404
    path: '404',
    component: PageNotFoundComponent,
    data: {
      title: 'Page 404'
    }
  },
  {//500
    path: '500',
    component: P500Component,
    data: {
      title: 'Page 500'
    }
  },
  {//Login
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Đăng nhập'
    }
  },
  {
    path: 'specialized/home',
    component: HomeSpecializedComponent,
    data: {
      title: 'Quản lý chuyên ngành'
    }
  },

  {//Default first page
    path: 'logout',
    component: LogoutComponent,
    data: {
      title: 'Đăng xuất'
    }
  },
  {//Register
    path: 'register',
    component: RegisterComponent,
    data: {
      title: 'Đăng ký doanh nghiệp'
    }
  },
  {//LayoutPage Public
    path: 'public',
    component: PublicLayoutComponent,
    data: {
      title: 'Sở công thương'
    },
    children: [
      {//Market
        path: 'market',
        loadChildren: () => import('../components/public/market/market.module').then(m => m.MarketModule)
      },
      {//Partner
        path: 'partner',
        loadChildren: () => import('../components/public/partner/partner.module').then(m => m.PartnerModule)
      }
    ]
  },
  {//LayoutPage Specilized
    path: 'specialized',
    component: SpecializedLayoutComponent,
    children: [
      {
        canActivate: [Specialize],
        path: 'commecial-management',
        loadChildren: () => import('../components/specialized/commecial-managemant/commecial-management.module').then(m => m.CommecialManagementModule),
      },
      {
        canActivate: [Specialize],
        path: 'enery-management',
        loadChildren: () => import('../components/specialized/enery-management/enery-management.module').then(m => m.EneryManagementModule),
      },
      {
        canActivate: [Specialize],
        path: 'industry-management',
        loadChildren: () => import('../components/specialized/industry-management/industry-management.module').then(m => m.IndustryManagement),
      },
    ]
  },
  {
    path: 'report',
    component: SpecializedLayoutComponent,
    loadChildren: () => import('../components/report/report.module').then(m => m.ReportModule)
  },
  {
    path: 'manager',
    component: ManagerLayoutComponent,
    loadChildren: () => import('../components/manager/manager.module').then(m => m.ManagerModule),
  },
  {//404
    path: '**',
    component: PageNotFoundComponent,
  }
];

@NgModule({
  declarations: [
    RoutingComponent,
    PublicLayoutComponent,
    ManagerLayoutComponent,
    SpecializedLayoutComponent,
    ReportLayoutComponent,
    P404Component,
    P500Component,
    LoginComponent,
    HomeSpecializedComponent,
    LogoutComponent,
    RegisterComponent,
  ],
  imports: [
    RouterModule.forRoot(routes),
    SharedModule,
    HttpClientModule,
    ToastModule,
    MessagesModule,
    MaterialModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule
    // FlexLayoutModule
  ],
  exports: [RoutingComponent],
  providers: [
    Admin,
    Manager,
    Specialize,
    MessageService,
    SidebarService,
    //InformationService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptor,
      multi: true
    }
  ]
})
export class RoutingModule { }
