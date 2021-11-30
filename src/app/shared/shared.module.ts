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
import { DialogContainerComponent } from './dialog/dialog-container/dialog-container.component';
import { DialogContainerYearComponent } from './dialog/dialog-container/dialog-container-year.component';
import { DialogContainerNoConditionComponent } from './dialog/dialog-container/dialog-container-noCondition.component';

@NgModule({
  declarations: [
    TopbarComponent,
    HeaderComponent,
    FooterComponent,
    PageNotFoundComponent,
    LoaderComponent,
    SidebarComponent,
    FilterByTextPipe,
    DialogContainerComponent,
    DialogContainerYearComponent,
    DialogContainerNoConditionComponent
  ],
  imports: [
    CommonModule,
    ProgressSpinnerModule,
    MaterialModule,
    RouterModule,
    SimplebarAngularModule
  ],
  exports: [
    TopbarComponent,
    HeaderComponent,
    FooterComponent,
    PageNotFoundComponent,
    LoaderComponent,
    SidebarComponent,
    MaterialModule
  ],
  bootstrap: [TopbarComponent],
  providers: [
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } },
    SidebarService,
  ]
})
export class SharedModule { }
