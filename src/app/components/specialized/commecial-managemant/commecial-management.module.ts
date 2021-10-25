import { CommonModule, formatNumber } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material';
import { PipeModule } from 'src/app/pipe.module';
import { registerLocaleData } from '@angular/common';
import localevi from '@angular/common/locales/vi';
registerLocaleData(localevi, 'vi');
import { MatTabsModule } from '@angular/material/tabs';
import { CurrencyMaskInputMode, NgxCurrencyModule } from "ngx-currency";
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

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
import { CountrysideComponent } from './infrastructure/countryside/countryside.component';
import { TRSManagementComponent } from './infrastructure/total-retail-sales/total-retail-sales.component';
import { ImportManagementComponent } from './export-import-management/import-management/import-management.component';
import { ExportManagementComponent } from './export-import-management/export-management/export-management.component';
import { ModalComponent } from './export-import-management/dialog-import-export/modal.component';
import { BorderTradeComponent } from './border-trade/border-trade.component';
import { RegisteredSaleWebsiteComponent } from './e-commerce-managemant/registered-sale-website/registered-sale-website.component';
import { MultilevelTradeComponent } from './multilevel-trade/multilevel-trade.component';
import { RetailMonthComponent } from './retail/retail-month/retail-month.component';
import { RetailComponent } from './retail/retail.component';
import { TradeFairsExhibitionsComponent } from './trade-development/trade-fairs-exhibitions/trade-fairs-exhibitions.component';
import { SubscribeDiscountComponent } from './trade-development/subscribe-discount/subscribe-discount.component';
import { CommonFuntions } from './conditional-business-line/common-functions.service';
import { BorderTradeExportComponent } from "./border-trade/border-trade-export/border-trade-export.component";
import { BorderTradeImportComponent } from "./border-trade/border-trade-import/border-trade-import.component";
import { ImportDataComponent } from './export-import-management/import-data/import-data.component';
import { ExcelServicesService } from 'src/app/shared/services/excel-services.service';
import { MatTabComponent } from './export-import-management/mat-tab/mat-tab.component';
import { DetailNationalComponent } from './export-import-management/detail-national/detail-national.component';
import { DetailDataComponent } from './export-import-management/detail-data/detail-data.component';
import { CommonDataComponent } from './export-import-management/common-data/common-data.component';
import { DialogImportDataComponent } from './border-trade/dialog-import-data/dialog-import-data.component';
import { DownloadService } from 'src/app/_services/injectable-service/dowloadFile.service';
import { TranslateIdToNamePipe } from 'src/app/shared/pipes/translateIdToName.pipe';
import { DialogECommerceComponent } from './e-commerce-managemant/dialog-e-commerce/dialog-e-commerce.component';
import { CommonDataBorderComponent } from './border-trade/common-data-border/common-data-border.component';
import { DetailDataBorderComponent } from './border-trade/detail-data-border/detail-data-border.component';
import { MatTabBorderComponent } from './border-trade/mat-tab-border/mat-tab-border.component';
import { ImportDataBorderComponent } from './border-trade/import-data-border/import-data-border.component';
import { SpecialDirective } from 'src/app/shared/special.directive';
import { ManagePetrolValueComponent } from './conditional-business-line/petro-business/manage-petrol-value/manage-petrol-value.component';
import { AddStoreComponent } from './conditional-business-line/petro-business/add-store/add-store.component';
import { UpdatePetrolComponent } from './conditional-business-line/petro-business/update-petrol/update-petrol.component';
import { UpdateBusinessmanComponent } from './conditional-business-line/petro-business/update-businessman/update-businessman.component';
import { AddTobaccoBusinessComponent } from './conditional-business-line/tobacco-business/add-tobacco-business/add-tobacco-business.component';
import { AddLiquorBusinessComponent } from './conditional-business-line/liquor-business/add-liquor-business/add-liquor-business.component';
import { AddLiquorSupplyBusinessComponent } from './conditional-business-line/liquor-business/add-liquor-supply-business/add-liquor-supply-business.component';
import { ManageBusinessmanComponent } from './conditional-business-line/petro-business/manage-businessman/manage-businessman.component';
import { SearchBusinessComponent } from './business/search/search-business.component';
import { EditBusinessComponent } from './business/edit/edit-business.component';
import { AddLpgComponent } from './conditional-business-line/lpg-business/add-lpg/add-lpg.component';
import { CertificateListComponent } from './business/certificate-list/certificate-list.component';
import { AddCertificateComponent } from './business/add-certificate/add-certificate.component';
import { DetailBorderTradeComponent } from './border-trade/detail-border-trade/detail-border-trade.component';
import { BorderTradeOverviewComponent } from './border-trade/border-trade-overview/border-trade-overview.component';
import { BorderTradeNewComponent } from './border-trade-new/border-trade-new.component';
import { BorderTradeNewOverviewComponent } from './border-trade-new-overview/border-trade-new-overview.component';
import { RetailMonthNewComponent } from './retail/retail-month-new/retail-month-new.component';
import { GeneralAddComponent } from './general-add/general-add.component';
import { LrisIntegrationComponent } from './export-import-management/lris-integration/lris-integration.component';

export const customCurrencyMaskConfig = {
  align: "right",
  allowNegative: true,
  allowZero: true,
  decimal: ",",
  precision: 0,
  prefix: "",
  suffix: "",
  thousands: ".",
  nullable: true,
  min: null,
  max: 1000000000000,
  inputMode: CurrencyMaskInputMode.NATURAL
};
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
    MatTabsModule,
    NgxCurrencyModule.forRoot(customCurrencyMaskConfig),
    NgxMatSelectSearchModule
  ],
  exports: [
    MatPaginatorModule,
    MatSortModule,
    TranslateIdToNamePipe
  ],
  declarations: [
    MarketCommecialManagementComponent,
    CommonCommecialComponent,
    TobaccoBusinessComponent,
    ConditionalBusinessLineComponent,
    SuperMarketCommecialManagementComponent,
    CountrysideComponent,
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
    RetailMonthNewComponent,
    RetailComponent,
    MultilevelTradeComponent,
    TradeFairsExhibitionsComponent,
    SubscribeDiscountComponent,
    BorderTradeExportComponent,
    BorderTradeImportComponent,
    ImportDataComponent,
    MatTabComponent,
    DetailNationalComponent,
    DetailDataComponent,
    CommonDataComponent,
    DialogImportDataComponent,
    TranslateIdToNamePipe,
    DialogECommerceComponent,
    CommonDataBorderComponent,
    DetailDataBorderComponent,
    MatTabBorderComponent,
    ImportDataBorderComponent,
    SpecialDirective,
    ManagePetrolValueComponent,
    AddStoreComponent,
    UpdatePetrolComponent,
    ManageBusinessmanComponent,
    UpdateBusinessmanComponent,
    AddTobaccoBusinessComponent,
    AddLiquorBusinessComponent,
    AddLiquorSupplyBusinessComponent,
    SearchBusinessComponent,
    EditBusinessComponent,
    AddLpgComponent,
    CertificateListComponent,
    AddCertificateComponent,
    DetailBorderTradeComponent,
    BorderTradeOverviewComponent,
    BorderTradeNewComponent,
    BorderTradeNewOverviewComponent,
    RetailMonthNewComponent,
    GeneralAddComponent,
    LrisIntegrationComponent,
  ],
  entryComponents: [
    ModalComponent,
    ImportDataComponent,
    DialogImportDataComponent,
    DialogECommerceComponent,
    ImportDataBorderComponent
  ],
  providers: [
    CommonFuntions,
    ExcelServicesService,
    DownloadService
  ]
})
export class CommecialManagementModule { }
