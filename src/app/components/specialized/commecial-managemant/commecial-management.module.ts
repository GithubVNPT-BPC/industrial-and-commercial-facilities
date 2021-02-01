import { CommonModule, formatNumber } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../../../material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CommecialManagementRoutingModule } from './commecial-management.routing';
import { MarketCommecialManagementComponent } from './infrastructure/market/market-commecial.component';
import { CommonCommecialComponent } from './infrastructure/common/common-commecial.component';
import { TobaccoBusinessComponent } from './conditional-business-line/tobacco-business/tobacco-business.component';
import { ConditionalBusinessLineComponent } from './conditional-business-line/conditional-business-line.component';
import { SuperMarketCommecialManagementComponent } from './infrastructure/supermarket/supermarket-commecial.component';
import { LiquorBusinessComponent } from './conditional-business-line/liquor-business/liquor-business.component';
import { StoreManagementComponent } from './infrastructure/stores/stores-commecial.component';
import { FoodManagementComponent } from './infrastructure/food/food-commecial.component';
import { PetrolBusinessComponent } from './conditional-business-line/petro-business/petrol-business.component';
import { LPGBusinessComponent } from './conditional-business-line/lpg-business/lpg-business.component';
import { InformedEcommerceWebsiteComponent } from './e-commerce-managemant/informed-ecommerce-website/informed-ecommerce-website.component';
import { ShoppingcentreComponent } from './infrastructure/shoppingcentre/shoppingcentre.component';
import { TRSManagementComponent } from './infrastructure/total-retail-sales/total-retail-sales.component';
import { ImportManagementComponent } from './export-import-management/import-management/import-management.component';
import { ExportManagementComponent } from './export-import-management/export-management/export-management.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ModalComponent } from './export-import-management/dialog-import-export/modal.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { BorderTradeComponent } from './border-trade/border-trade.component';
import { RegisteredSaleWebsiteComponent } from './e-commerce-managemant/registered-sale-website/registered-sale-website.component';
import { dich } from '../commecial-managemant/border-trade/dich.pipe';
import { MultilevelTradeComponent } from './multilevel-trade/multilevel-trade.component';
import { RetailMonthComponent } from './retail/retail-month/retail-month.component';
import { RetailComponent } from './retail/retail.component';
import { FormatNumberReportPipe } from "src/app/shared/pipes/formatNumber.pipe";
import { MatSortModule } from '@angular/material';
import { PipeModule } from 'src/app/pipe.module';
import { TradeFairsExhibitionsComponent } from './trade-development/trade-fairs-exhibitions/trade-fairs-exhibitions.component';
import { SubscribeDiscountComponent } from './trade-development/subscribe-discount/subscribe-discount.component';
import {CommonFuntions} from './conditional-business-line/common-functions.service';
import { registerLocaleData } from '@angular/common';
import localevi from '@angular/common/locales/vi';
registerLocaleData(localevi, 'vi');

import { BorderTradeExportComponent } from "./border-trade/border-trade-export/border-trade-export.component";
import { BorderTradeImportComponent } from "./border-trade/border-trade-import/border-trade-import.component";
import { ImportDataComponent } from './export-import-management/import-data/import-data.component';
import { ExcelServicesService } from 'src/app/shared/services/excel-services.service';

import {MatTabsModule} from '@angular/material/tabs';
import { MatTabComponent } from './export-import-management/mat-tab/mat-tab.component';
import { DetailNationalComponent } from './export-import-management/detail-national/detail-national.component';
import { DetailDataComponent } from './export-import-management/detail-data/detail-data.component';
import { CommonDataComponent } from './export-import-management/common-data/common-data.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    CommecialManagementRoutingModule,
    MatDialogModule,
    MatPaginatorModule,
    PipeModule,
    MatTabsModule
  ],
  exports: [
    MatPaginatorModule,
    MatSortModule,
    FormatNumberReportPipe
  ],
  declarations: [
    MarketCommecialManagementComponent,
    CommonCommecialComponent,
    TobaccoBusinessComponent,
    ConditionalBusinessLineComponent,
    SuperMarketCommecialManagementComponent,
    CommonCommecialComponent,
    LiquorBusinessComponent,
    StoreManagementComponent,
    FoodManagementComponent,
    ImportManagementComponent,
    PetrolBusinessComponent,
    InformedEcommerceWebsiteComponent,
    RegisteredSaleWebsiteComponent,
    ShoppingcentreComponent,
    LPGBusinessComponent,
    ExportManagementComponent,
    ModalComponent,
    TRSManagementComponent,
    BorderTradeComponent,
    RetailMonthComponent,
    RetailComponent,
    dich,
    MultilevelTradeComponent,
    FormatNumberReportPipe,
    TradeFairsExhibitionsComponent,
    SubscribeDiscountComponent,
    BorderTradeExportComponent,
    BorderTradeImportComponent,
    ImportDataComponent,
    MatTabComponent,
    DetailNationalComponent,
    DetailDataComponent,
    CommonDataComponent
  ],
  entryComponents: [
    ModalComponent,
    ImportDataComponent
  ],
  providers: [
    CommonFuntions,
    ExcelServicesService
  ]
})
export class CommecialManagementModule { }
