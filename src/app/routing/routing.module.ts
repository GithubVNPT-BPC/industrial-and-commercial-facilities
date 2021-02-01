import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { MessagesModule } from 'primeng/messages';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MessageService } from 'primeng/api';

import { RoutingComponent } from './routing.component';
import { PublicLayoutComponent } from './public-layout/public-layout.component';
import { ManagerLayoutComponent } from './manager-layout/manager-layout.component';
import { SharedModule } from '../shared/shared.module';
import { PageNotFoundComponent, LoaderInterceptor } from '../shared';
import { MaterialModule } from '../material.module';
import { SidebarService } from '../_services/sidebar.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { P404Component } from '../components/error/404.component';
import { P500Component } from '../components/error/500.component';
import { LoginComponent } from '../components/login/login.component';
import { RegisterComponent } from '../components/register/register.component';
import { SCTBossAuthGuardService } from '../_authGuard/SCTBossAuthGuardService';
import { BusinessAuthGuardService } from '../_authGuard/BusinessAuthGuardService';
import { LoginAuthGuardService } from '../_authGuard/LoginAuthGuardService';
import { FormsModule } from '@angular/forms';
import { InformationService } from '../shared/information/information.service';
import { LogoutComponent } from '../components/logout/logout.component';
import { UpdateuserComponent } from '../components/updateuser/updateuser.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DataSCTComponent } from '../components/data-sct/data-sct.component';
import { CommecialManagementModule } from '../components/specialized/commecial-managemant/commecial-management.module';
import { CommecialManagementRoutingModule } from '../components/specialized/commecial-managemant/commecial-management.routing';
import { SpecializedLayoutComponent } from './specialized-layout/specialized-layout.component';
import { EnergyLayoutComponent } from './energy-layout/energy-layout.component';
import { ReportLayoutComponent } from './report-layout/report-layout.component';
import { HomeSpecializedComponent } from '../components/specialized/home-specialized/home-specialized.component';

// import {FlexLayoutModule} from '@angular/flex-layout';


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
    canActivate: [LoginAuthGuardService],
    data: {
      title: 'Đăng nhập'
    }
  },
  {
    path: 'specialized/home',
    component: HomeSpecializedComponent,
    canActivate: [LoginAuthGuardService],
    data: {
      title: 'Quản lý chuyên ngành'
    }
    
  },
  {//Update user
    path: 'update_user',
    component: UpdateuserComponent,
    canActivate: [LoginAuthGuardService],
    data: {
      title: 'Đăng nhập'
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
    canActivate: [LoginAuthGuardService],
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
      {//Dashboard
        path: 'dashboard',
        loadChildren: () => import('../components/public/dashboard/dashboard.module').then(m => m.DashboardModule)
      },
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
    canActivate: [SCTBossAuthGuardService],
    component: SpecializedLayoutComponent,
    children: [
      {
        path: 'commecial-management',
        loadChildren: () => import('../components/specialized/commecial-managemant/commecial-management.module').then(m => m.CommecialManagementModule),
      },
      {
        path: 'enery-management',
        loadChildren: () => import('../components/specialized/enery-management/enery-management.module').then(m => m.EneryManagementModule),
      },
      {
        path: 'industry-management',
        loadChildren: () => import('../components/specialized/industry-management/industry-management.module').then(m => m.IndustryManagement),
      },
    ]
  },
  {//LayoutPge Report
    path: 'report',
    component: ReportLayoutComponent,
    canActivate: [SCTBossAuthGuardService],
    loadChildren: () => import('../components/report/report.module').then(m => m.ReportModule)
    // children: [
    //   {//Report
    //     path: 'report',

    //   },
    //   {
    //     path: 'du_lieu_nganh/:id',
    //     canActivate: [SCTBossAuthGuardService],
    //     component: DataSCTComponent,
    //   },

    //   {//Notification
    //     path: 'notifications',
    //     canActivate: [SCTBossAuthGuardService],
    //     loadChildren: () => import('../components/notifications/notifications.module').then(m => m.NotificationsModule)
    //   },
    //   {//Manager
    //     path: 'manager',
    //     canActivate: [SCTBossAuthGuardService],
    //     loadChildren: () => import('../components/manager/manager.module').then(m => m.ManagerModule)
    //   },
    //   // {//NotFound
    //   //   path: '**',
    //   //   component: P404Component
    //   // }
    // ],
  },
  {//Layout Manager
    path: 'manager',
    component: ManagerLayoutComponent,
    canActivate: [SCTBossAuthGuardService],
    loadChildren: () => import('../components/manager/manager.module').then(m => m.ManagerModule),
    // children: [
    //   {//Fulpath
    //     path: '',

    //   }
    // ],
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
    UpdateuserComponent,
    DataSCTComponent,
    EnergyLayoutComponent,
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
    SCTBossAuthGuardService,
    BusinessAuthGuardService,
    LoginAuthGuardService,
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
