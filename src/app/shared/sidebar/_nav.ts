// import { INavItem } from '../../_models/_nav.model';
// // Tìm icon tại: https://material.io/resources/icons/
// export const navItemsPublic: INavItem[] = [
//   {
//     name: 'Bảng điều hành',
//     url: '/public/dashboard',
//     icon: 'border_all',
//     id: '1'
//   },
//   // {
//   //   title: true,
//   //   name: 'THÔNG TIN THỊ TRƯỜNG'
//   // },
//   {
//     name: 'Thị trường trong nước',
//     icon: 'border_all',
//     id: '2',
//     children: [
//       {
//         name: 'Giá nông sản',
//         url: '/public/market/domestic/price',
//         icon: 'monetization_on',
//         id: '3'
//       },
//       {
//         name: 'Thông tin xuất khẩu',
//         url: '/public/market/domestic/export',
//         icon: 'hourglass_top',
//         id: '4'
//       },
//       {
//         name: 'Thông tin nhập khẩu',
//         url: '/public/market/domestic/import',
//         icon: 'hourglass_bottom',
//         id: '5'
//       },
//       {
//         name: 'Thông tin sản xuất',
//         url: '/public/market/domestic/product',
//         icon: 'filter_9_plus',
//         id: '6'
//       },
//     ]
//   },
//   {
//     name: 'Thị trường thế giới',
//     icon: 'language',
//     id: '7',
//     children: [
//       {
//         name: 'Giá cả nông sản',
//         url: '/public/market/foreign',
//         icon: 'timeline',
//         id: '8'
//       }
//     ]
//   },
//   // {
//   //   title: true,
//   //   name: 'TÌM KIẾM ĐỐI TÁC'
//   // },
//   {
//     name: 'TÌM KIẾM ĐỐI TÁC',
//     icon: 'dvr',
//     id: '9',
//     children: [
//       {
//         name: 'Tìm kiếm',
//         url: '/public/partner/search',
//         icon: 'search',
//         id: '10'
//       },
//     ]
//   },
// ];
// export const navItemsManager: INavItem[] = [
//   // {
//   //   title: true,
//   //   name: 'Quản lý',
//   //   manager: true,
//   //   isSCT: true,
//   //   id: 'QLSCT'
//   // },
//   {
//     name: 'Thị trường trong nước',
//     icon: 'border_all',
//     manager: true,
//     isSCT: true,
//     id: '11',
//     children: [
//       {
//         name: 'Giá cả trong nước',
//         url: '/manager/market/domestic/price',
//         icon: 'monetization_on',
//         id: '12'
//       },
//       {
//         name: 'Tình hình xuất khẩu',
//         url: '/manager/market/domestic/export',
//         icon: 'hourglass_top',
//         id: '13'
//       },
//       {
//         name: 'Tình hình nhập khẩu',
//         url: '/manager/market/domestic/import',
//         icon: 'hourglass_bottom',
//         id: '14'
//       },
//       {
//         name: 'Sản xuất nông sản',
//         url: '/manager/market/domestic/production',
//         icon: 'filter_9_plus',
//         id: '15'
//       },

//     ]
//   },
//   {
//     name: 'Thị trường thế giới',
//     icon: 'language',
//     manager: true,
//     isSCT: true,
//     id: '16',
//     children: [
//       {
//         name: 'Giá cả nông sản',
//         url: '/manager/market/foreign/price',
//         icon: 'timeline',
//         id: '17'
//       },
//     ]
//   },
//   {
//     name: 'Doanh nghiệp',
//     icon: 'business',
//     manager: true,
//     isSCT: true,
//     id: '18',
//     children: [
//       {
//         name: 'Điều chỉnh doanh nghiệp',
//         url: '/manager/business/search',
//         icon: 'create',
//         id: '19'
//       },
//       {
//         name: 'Xuất Nhập khẩu',
//         url: '/manager/business/top-export',
//         icon: 'swap_vert',
//         id: '20'
//       },
//     ]
//   },

//   // {
//   //   title: true,
//   //   name: 'Doanh nghiệp',
//   //   manager: true,
//   //   isSCT: false,
//   //   id: 'QLDN'
//   // },

//   // {
//   //   name: 'Chi tiết doanh nghiệp',
//   //   url: '/manager/business/detail-business',
//   //   icon: 'business',
//   //   id: 'QLDN',
//   //   manager:true,
//   //   isSCT: false
//   // },
//   // {
//   //   name: 'Đăng xuất',
//   //   url: '/logout',
//   //   manager: true,
//   //   isSCT: true,
//   //   icon: 'login',
//   //   // badge: {
//   //   //   variant: 'primary',
//   //   //   text: 'Sắp ra mắt'
//   //   // },
//   //   // attributes: { disabled: true },
//   // },

// ];
// export const navItemsSpecialized: INavItem[] = [
//   // dữ liệu ngàng công thương
//   // {
//   //   title: true,
//   //   name: 'Dữ liệu ngành',
//   //   manager: true,
//   //   isSCT: true,
//   // },
//   {
//     name: 'QUẢN LÝ THƯƠNG MẠI',
//     manager: true,
//     isSCT: true,
//     icon: 'integration_instructions',
//     id: '21',
//     children: [
//       {
//         name: 'Thương mại nội địa',
//         icon: 'roofing',
//         id: '22',
//         manager: true,
//         children: [
//           {
//             name: 'Hạ tầng thương mại',
//             url: '/specialized/commecial-management/domestic',
//             icon: 'room_preferences',
//             id: '23',
//           },
//           {
//             name: 'Kinh doanh có điều kiện, hạn chế kinh doanh',
//             url: '/specialized/commecial-management/domestic/cbl',
//             icon: 'smoking_rooms',
//             id: '24',
//           },
//           {
//             name: 'Tổng mức bán lẻ hàng hóa và dịch vụ',
//             url: '/specialized/commecial-management/retail',
//             icon: 'tty',
//             id: '25',
//           },
//         ]
//       },
//       {
//         name: 'Xuất nhập khẩu',
//         icon: 'share',
//         id: '26',
//         manager: true,
//         children: [
//           {
//             name: 'Xuất khẩu',
//             url: '/specialized/commecial-management/export_import/exported_products',
//             icon: 'public',
//             id: '27',
//           },
//           {
//             name: 'Nhập khẩu',
//             url: '/specialized/commecial-management/export_import/imported_products',
//             icon: 'public_off',
//             id: '28',
//           },
//         ]
//       },
//       {
//         name: 'Thương mại biên giới',
//         url: '/specialized/commecial-management/border_trade',
//         icon: 'luggage',
//         id: '29',
//         manager: false,
//       },
//       {
//         name: 'Thương mại điện tử',
//         icon: 'vibration',
//         id: '30',
//         manager: true,
//         children: [
//           {
//             name: 'Quản lý thông báo website bán hàng',
//             url: '/specialized/commecial-management/e-commerce/sale-website',
//             icon: 'ondemand_video',
//             id: '31',
//           },
//           {
//             name: 'Quản lý đăng kí website cung cấp dịch vụ TMĐT',
//             url: '/specialized/commecial-management/e-commerce/ecommerce-website',
//             icon: 'personal_video',
//             id: '32',
//           },
//         ]
//       },
//       {
//         name: 'Xúc tiến thương mại',
//         icon: 'support_agent',
//         id: '33',
//         manager: true,
//         children: [
//           {
//             name: 'Hội chợ triển lãm',
//             url: '/specialized/commecial-management/trade-development/TFE',
//             icon: 'food_bank',
//             id: '34',
//           },
//           {
//             name: 'Khuyến mại',
//             url: '/specialized/commecial-management/trade-development/SD',
//             icon: 'movie_filter',
//             id: '35',
//           },
//         ]
//       },
//       {
//         name: 'Hoạt động bán hàng đa cấp',
//         url: '/specialized/commecial-management/multilevel_trade',
//         icon: 'device_hub',
//         id: '36',
//         manager: false,
//       },
//     ]
//   },
//   {
//     name: 'QUẢN LÝ NĂNG LƯỢNG',
//     manager: true,
//     isSCT: true,
//     icon: 'speed',
//     id: '37',
//     children: [
//       {
//         name: 'Năng lượng',
//         icon: 'trending_up',
//         manager: true,
//         id: '38',
//         children: [
//           {
//             name: 'Điện mặt trời',
//             url: '/specialized/enery-management/solarelectric',
//             icon: 'wb_sunny',
//             id: '39'
//           },
//           {
//             name: 'Thủy điện',
//             url: '/specialized/enery-management/hydroelectric',
//             icon: 'water_damage',
//             id: '40'
//           },
//           {
//             name: 'Điện sinh khối',
//             url: '/specialized/enery-management/block_electric',
//             icon: 'home',
//             id: '41'
//           },
//         ]
//       },
//       {
//         name: 'Quy hoạch phát triển lưới điện',
//         icon: 'home',
//         manager: true,
//         id: '42',
//         children: [
//           {
//             name: 'Quy hoạch điện 110KV trở lên',
//             url: '/specialized/enery-management/electrical_plan',
//             icon: 'schedule',
//             id: '43'
//           },
//           {
//             name: 'Công tác phát triển lưới điện 35KV trở xuống',
//             url: '/specialized/enery-management/35kv_electricity_development',
//             icon: 'settings_input_component',
//             id: '44'
//           },
//           {
//             name: 'Điện sản xuất và điện thương phẩm',
//             url: '/specialized/enery-management/power_production',
//             icon: 'grade',
//             id: '45'
//           },
//           {
//             name: 'Điện nông thôn (Nông thôn mới)',
//             url: '/specialized/enery-management/rural_electricity',
//             icon: 'electrical_services',
//             id: '46'
//           },
//           {
//             name: 'Quản lý Cấp phép Hoạt động Điện lực',
//             url: '/specialized/enery-management/manage_aprove_hddl',
//             icon: 'moving',
//             id: '47'
//           }
//         ]
//       },
//       {
//         name: 'Tiết kiệm năng lượng',
//         url: '/specialized/enery-management/focused_energy',
//         icon: 'group_work',
//         manager: false,
//         id: '48'
//       },
//       // {
//       //   name: 'Điện sinh khối',
//       //   url: '/specialized/enery-management/block_electric',
//       //   icon: 'group_work',
//       // },
//       // {
//       //   name: 'Quản lý cấp phép HĐĐL',
//       //   url: '/specialized/enery-management/manage_aprove_hddl',
//       //   icon: 'group_work',
//       // },
//       // {
//       //   name: 'QH điện 110 trở lên',
//       //   url: '/specialized/enery-management/electrical_plan',
//       //   icon: 'group_work',
//       // },
//     ]
//   },
//   {
//     name: 'QUẢN LÝ CÔNG NGHIỆP',
//     manager: true,
//     isSCT: true,
//     icon: 'business',
//     id: '49',
//     children: [
//       {
//         name: 'Hóa chất',
//         url: '/specialized/industry-management/chemical',
//         icon: 'warning',
//         id: '50',
//         manager: false
//       },
//       {
//         name: 'Chiết nạp khí hóa lỏng',
//         url: '/specialized/industry-management/lpg',
//         icon: 'auto_delete',
//         id: '51',
//         manager: false
//       },
//       {
//         name: 'Công nghiệp thực phẩm',
//         url: '/specialized/industry-management/food',
//         icon: 'biotech',
//         id: '52',
//         manager: false
//       },
//       {
//         name: 'Chỉ số SX công nghiệp',
//         url: '/specialized/industry-management/iip',
//         icon: 'filter_9_plus',
//         id: '53',
//         manager: false
//       },
//       {
//         name: 'Cụm Công nghiệp',
//         icon: 'location_city',
//         manager: true,
//         id: '54',
//         children: [
//           {
//             name: 'Tổng quan',
//             url: '/specialized/industry-management/cluster',
//             icon: 'perm_media',
//             id: '55'
//           },
//           {
//             name: 'Báo cáo',
//             url: '/specialized/industry-management/report',
//             icon: 'feedback',
//             id: '56'
//           },
//         ]
//       },
//       {
//         name: 'Công bố hợp quy',
//         url: '/specialized/industry-management/cr',
//         icon: 'filter_9_plus',
//         id: '57',
//         manager: false
//       },
//       // {
//       //   name: 'Công bố hợp quy',
//       //   url: '/specialized/industry-management/other',
//       //   icon: 'hourglass_bottom',
//       //   attributes :{disabled: true},
//       // },
//       {
//         name: 'Vật liệu nổ CN',
//         url: '/specialized/industry-management/explosives',
//         icon: 'sick',
//         id: '58',
//         manager: false
//       },
//     ]
//   },
//   // {
//   //   name: 'Đăng xuất',
//   //   manager: true,
//   //   isSCT: true,
//   //   icon: 'login',
//   //   // badge: {
//   //   //   variant: 'primary',
//   //   //   text: 'Sắp ra mắt'
//   //   // },
//   //   // attributes: { disabled: true },
//   // },
// ];

// export const navItemsReport: INavItem[] = [
//   {
//     name: 'Nhập báo cáo',
//     url: '/report/all',
//     icon: 'edit',
//   },
//   // {
//   //   name: 'Nhập báo cáo',
//   //   url: '/report/edit',
//   //   icon: 'border_all',
//   // },
//   {
//     name: 'Xem báo cáo',
//     url: '/report/view-all',
//     icon: 'pageview',
//   },
//   // {
//   //   name: 'Xem',
//   //   url: '/report/view',
//   //   icon: 'border_all',
//   // },
//   // {
//   //   name: 'Đăng xuất',
//   //   manager: true,
//   //   isSCT: true,
//   //   icon: 'login',
//   //   // badge: {
//   //   //   variant: 'primary',
//   //   //   text: 'Sắp ra mắt'
//   //   // },
//   //   // attributes: { disabled: true },
//   // },
// ];