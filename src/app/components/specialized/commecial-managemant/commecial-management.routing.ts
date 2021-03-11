import { Component, NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConditionalBusinessLineComponent } from './conditional-business-line/conditional-business-line.component';
import { LiquorBusinessComponent } from './conditional-business-line/liquor-business/liquor-business.component';
import { LPGBusinessComponent } from './conditional-business-line/lpg-business/lpg-business.component';
import { TobaccoBusinessComponent } from './conditional-business-line/tobacco-business/tobacco-business.component';
import { CommonCommecialComponent } from './infrastructure/common/common-commecial.component';
import { MarketCommecialManagementComponent } from './infrastructure/market/market-commecial.component';
import { SuperMarketCommecialManagementComponent } from './infrastructure/supermarket/supermarket-commecial.component';
import { InformedEcommerceWebsiteComponent } from './e-commerce-managemant/informed-ecommerce-website/informed-ecommerce-website.component'; import { TRSManagementComponent } from './infrastructure/total-retail-sales/total-retail-sales.component';
import { ImportManagementComponent } from "./export-import-management/import-management/import-management.component";
import { ExportManagementComponent } from "./export-import-management/export-management/export-management.component";
import { BorderTradeComponent } from './border-trade/border-trade.component';
import { RegisteredSaleWebsiteComponent } from './e-commerce-managemant/registered-sale-website/registered-sale-website.component';
import { MultilevelTradeComponent } from "./multilevel-trade/multilevel-trade.component";
import { RetailComponent } from './retail/retail.component';
import { RetailMonthComponent } from './retail/retail-month/retail-month.component';
import { TradeFairsExhibitionsComponent } from './trade-development/trade-fairs-exhibitions/trade-fairs-exhibitions.component';
import { SubscribeDiscountComponent } from './trade-development/subscribe-discount/subscribe-discount.component';
import { BorderTradeImportComponent } from './border-trade/border-trade-import/border-trade-import.component';
import { BorderTradeExportComponent } from './border-trade/border-trade-export/border-trade-export.component';

import { PetrolBusinessComponent } from './conditional-business-line/petro-business/petrol-business.component';
import { ManagePetrolValueComponent } from './conditional-business-line/petro-business/manage-petrol-value/manage-petrol-value.component';
import { UpdatePetrolComponent } from './conditional-business-line/petro-business/update-petrol/update-petrol.component';
import { AddStoreComponent } from './conditional-business-line/petro-business/add-store/add-store.component';
import { UpdateBusinessmanComponent } from './conditional-business-line/petro-business/update-businessman/update-businessman.component';
import { AddSupplyBusinessComponent } from './conditional-business-line/petro-business/add-supply-business/add-supply-business.component';
import { AddTobaccoBusinessComponent } from './conditional-business-line/tobacco-business/add-tobacco-business/add-tobacco-business.component';
import { AddTobaccoSupplyBusinessComponent } from './conditional-business-line/tobacco-business/add-tobacco-supply-business/add-tobacco-supply-business.component';
import { AddLiquorBusinessComponent } from './conditional-business-line/liquor-business/add-liquor-business/add-liquor-business.component';
import { AddLiquorSupplyBusinessComponent } from './conditional-business-line/liquor-business/add-liquor-supply-business/add-liquor-supply-business.component';
import { ManageBusinessmanComponent } from './conditional-business-line/petro-business/manage-businessman/manage-businessman.component';
import { SearchBusinessComponent } from './business/search/search-business.component';
import { EditBusinessComponent } from './business/edit/edit-business.component';
import { AddLpgComponent } from './conditional-business-line/lpg-business/add-lpg/add-lpg.component';

const routes: Routes = [
  {
    path: 'domestic',
    data: {
      title: 'Thương mại nội địa',
    },

    children: [
      {
        path: '',
        component: CommonCommecialComponent,
        data: {
          title: 'Quản lý thương mại chung',
        }
      },
      {
        path: 'market',
        component: MarketCommecialManagementComponent,
        data: {
          title: 'Quản lý chợ',
        }
      },
      {
        path: 'supermarket',
        component: SuperMarketCommecialManagementComponent,
        data: {
          title: 'Quản lý siêu thị',
        }
      },
      // {
      //   path: 'shoppingcentre',
      //   component:,
      //   data: {
      //     title: 'Quản lý TTTM',
      //   }
      // },
      {
        path: 'search',
        component: SearchBusinessComponent,
        data: {
          title: 'Quản lý doanh nghiệp',
        }
      },
      {
        path: 'edit',
        component: EditBusinessComponent,
        data: {
          title: 'Thêm doanh nghiệp',
        }
      },
      {
        path: 'edit/:mst',
        component: EditBusinessComponent,
        data: {
          title: 'Chỉnh sửa doanh nghiệp',
        }
      },
      {
        path: 'cbl',
        component: ConditionalBusinessLineComponent,
        data: {
          title: 'Quản lý các mặt hàng KD có ĐK',
        }
      },
      {
        path: 'petrolstore',
        component: PetrolBusinessComponent,
        data: {
          title: 'Quản lý cửa hàng xăng dầu',
        }
      },
      {
        path: 'addstore/:id/:mst',
        component: AddStoreComponent,
        data: {
          title: 'Thêm cửa hàng xăng dầu',
        }
      },
      {
        path: 'update-petrol/:id/:mst/:time/:id_san_luong',
        component: UpdatePetrolComponent,
        data: {
          title: 'Cập nhật thông tin cửa hàng xăng dầu',
        }
      },
      {
        path: 'petrol',
        component: ManagePetrolValueComponent,
        data: {
          title: 'Quản lý sản lượng xăng dầu',
        }
      },
      {
        path: 'managebusiness/:type',
        component: ManageBusinessmanComponent,
        data: {
          title: 'Quản lý thương nhân',
        }
      },
      {
        path: 'supplybusiness/:id/:time',
        component: AddSupplyBusinessComponent,
        data: {
          title: 'Quản lý thương nhân cung cấp',
        }
      },
      {
        path: 'updatebusiness/:id/:type',
        component: UpdateBusinessmanComponent,
        data: {
          title: 'Cập nhật thương nhân',
        }
      },
      {
        path: 'tobacco',
        component: TobaccoBusinessComponent,
        data: {
          title: 'Quản lý bán buôn sản phẩm thuốc lá',
        }
      },
      {
        path: 'add-tobacco/:id/:time',
        component: AddTobaccoBusinessComponent,
        data: {
          title: 'Thêm doanh nghiệp buôn bán thuốc lá',
        }
      },
      {
        path: 'add-tobacco-supply/:id/:time',
        component: AddTobaccoSupplyBusinessComponent,
        data: {
          title: 'Thêm thương nhân cung cấp thuốc lá',
        }
      },
      {
        path: 'liquor',
        component: LiquorBusinessComponent,
        data: {
          title: 'Quản lý buôn bán rượu',
        }
      },
      {
        path: 'add-liquor/:id/:time',
        component: AddLiquorBusinessComponent,
        data: {
          title: 'Thêm doanh nghiệp buôn bán rượu',
        }
      },
      {
        path: 'add-liquor-supply/:id/:time',
        component: AddLiquorSupplyBusinessComponent,
        data: {
          title: 'Thêm thương nhân cung cấp rượu',
        }
      },
      {
        path: 'lpg',
        component: LPGBusinessComponent,
        data: {
          title: 'Quản lý mua bán LPG',
        }
      },
      {
        path: 'add-lpg/:id/:time',
        component: AddLpgComponent,
        data: {
          title: 'Thêm doanh nghiệp mua bán LPG',
        }
      },
      {
        path: 'trs',
        component: TRSManagementComponent,
        data: {
          title: 'Tổng mức bán lẻ HH&DV',
        }
      },
      // {
      //   path: 'trs',
      //   component: TRSManagementComponent,
      //   data: {
      //     title: 'Đăng ký khuyến mãi',
      //   }
      // },
    ]
  },
  {
    path: 'trade-development',
    children: [
      {
        path: 'TFE',
        component: TradeFairsExhibitionsComponent,
        data: {
          title: 'Hội trợ triển lãm',
        }
      },
      {
        path: 'SD',
        component: SubscribeDiscountComponent,
        data: {
          title: 'Đăng ký khuyến mãi',
        }
      },
    ]
  },
  {
    path: 'e-commerce',
    children: [
      {
        // Quản lý đăng ký website cung cấp dịch vụ TMĐT
        path: 'inform-website',
        component: InformedEcommerceWebsiteComponent
      },
      {
        // Quản lý thông báo website bán hàng
        path: 'register-website',
        component: RegisteredSaleWebsiteComponent
      }
    ]
  },
  {
    path: 'retail',
    component: RetailComponent,
  },
  {
    path: 'retail/retail-detail',
    component: RetailMonthComponent
  },
  {
    path: 'export_import',
    children: [
      {
        path: 'imported_products',
        component: ImportManagementComponent
      },
      {
        path: 'exported_products',
        component: ExportManagementComponent
      }
    ]
  },
  {
    path: 'border_trade',
    // component: BorderTradeComponent
    children: [
      {
        path: 'import',
        component: BorderTradeImportComponent
      },
      {
        path: 'export',
        component: BorderTradeExportComponent
      }
    ]
  },
  {
    path: 'multilevel_trade',
    component: MultilevelTradeComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommecialManagementRoutingModule { }
