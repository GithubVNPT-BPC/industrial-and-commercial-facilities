import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { TopbarComponent } from './topbar/topbar.component';
import { FooterComponent } from './footer/footer.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { LoaderComponent } from './loader/loader.component';
import { MaterialModule } from '../material.module';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar.component';
import { SidebarService } from '../_services/sidebar.service';
import { SimplebarAngularModule } from 'simplebar-angular';
import { FilterByTextPipe } from './pipes/filterByText.pipe';
import { HeaderComponent } from './header/header.component';
import { ExcelServicesService } from './services/excel-services.service';
import { MatTabComponent } from './mat-tab/mat-tab.component';
// import { FlexLayoutModule } from '@angular/flex-layout';


@NgModule({
  declarations: [
    TopbarComponent,
    HeaderComponent,
    FooterComponent,
    PageNotFoundComponent,
    LoaderComponent,
    SidebarComponent,
    FilterByTextPipe,
    MatTabComponent
  ],
  imports: [
    CommonModule,
    ProgressSpinnerModule,
    MaterialModule,
    RouterModule,
    SimplebarAngularModule
    // FlexLayoutModule
  ],
  exports: [
    TopbarComponent,
    HeaderComponent,
    FooterComponent,
    PageNotFoundComponent,
    LoaderComponent,
    SidebarComponent
  ],
  bootstrap: [TopbarComponent],
  providers: [
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } },
    SidebarService,
    ExcelServicesService
  ]
})
export class SharedModule { }
