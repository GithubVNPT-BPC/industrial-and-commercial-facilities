"use strict";
exports.__esModule = true;
exports.navItemsReport = exports.navItemsSpecialized = exports.navItemsManager = exports.navItemsPublic = void 0;
// Tìm icon tại: https://material.io/resources/icons/
exports.navItemsPublic = [
    {
        name: 'Bảng điều hành',
        url: '/public/dashboard',
        icon: 'border_all'
    },
    {
        title: true,
        name: 'THÔNG TIN THỊ TRƯỜNG'
    },
    {
        name: 'Thị trường trong nước',
        icon: 'border_all',
        children: [
            {
                name: 'Giá nông sản',
                url: '/public/market/domestic/price',
                icon: 'monetization_on',
                id: 'GCNSTN'
            },
            {
                name: 'Thông tin xuất khẩu',
                url: '/public/market/domestic/export',
                icon: 'hourglass_top',
                id: 'TTXKTN'
            },
            {
                name: 'Thông tin nhập khẩu',
                url: '/public/market/domestic/import',
                icon: 'hourglass_bottom',
                id: 'TTNKTN'
            },
            {
                name: 'Thông tin sản xuất',
                url: '/public/market/domestic/product',
                icon: 'filter_9_plus',
                id: 'TTSXTN'
            },
        ]
    },
    {
        name: 'Thị trường thế giới',
        icon: 'language',
        children: [
            {
                name: 'Giá cả nông sản',
                url: '/public/market/foreign',
                icon: 'timeline',
                id: 'GCNSTG'
            }
        ]
    },
    {
        title: true,
        name: 'TÌM KIẾM ĐỐI TÁC KINH DOANH'
    },
    {
        name: 'TÌM KIẾM ĐỐI TÁC KINH DOANH',
        icon: 'dvr',
        children: [
            {
                name: 'Tìm kiếm',
                url: '/public/partner/search',
                icon: 'search',
                id: 'TKDT'
            },
        ]
    },
];
exports.navItemsManager = [
    {
        title: true,
        name: 'Quản lý',
        manager: true,
        isSCT: true,
        id: 'QLSCT'
    },
    {
        name: 'Thị trường trong nước',
        icon: 'border_all',
        manager: true,
        isSCT: true,
        id: 'QLSCT',
        children: [
            {
                name: 'Giá cả trong nước',
                url: '/manager/market/domestic/price',
                icon: 'monetization_on',
                id: 'GCTN'
            },
            {
                name: 'Tình hình xuất khẩu',
                url: '/manager/market/domestic/export',
                icon: 'hourglass_top',
                id: 'THXK'
            },
            {
                name: 'Tình hình nhập khẩu',
                url: '/manager/market/domestic/import',
                icon: 'hourglass_bottom',
                id: 'THNK'
            },
            {
                name: 'Sản xuất nông sản',
                url: '/manager/market/domestic/production',
                icon: 'filter_9_plus',
                id: 'SXNS'
            },
        ]
    },
    {
        name: 'Thị trường thế giới',
        icon: 'language',
        manager: true,
        isSCT: true,
        id: 'QLSCT',
        children: [
            {
                name: 'Giá cả nông sản',
                url: '/manager/market/foreign/price',
                icon: 'timeline',
                id: 'GCNSTTTG'
            },
        ]
    },
    {
        name: 'Doanh nghiệp',
        icon: 'business',
        manager: true,
        isSCT: true,
        id: 'QLSCT',
        children: [
            {
                name: 'Điều chỉnh doanh nghiệp',
                url: '/manager/business/search',
                icon: 'create',
                id: 'DCDN'
            },
            {
                name: 'Xuất Nhập khẩu',
                url: '/manager/business/top-export',
                icon: 'swap_vert',
                id: 'TEXIM'
            },
        ]
    },
    //muc nay danh cho user la doanh nghiep 
    {
        title: true,
        name: 'Doanh nghiệp',
        manager: true,
        isSCT: false,
        id: 'QLDN'
    },
    // {
    //   name: 'Chi tiết doanh nghiệp',
    //   url: '/manager/business/detail-business',
    //   icon: 'business',
    //   id: 'QLDN',
    //   manager:true,
    //   isSCT: false
    // },
    {
        name: 'Đăng xuất',
        url: '/logout',
        manager: true,
        isSCT: true,
        icon: 'login',
        badge: {
            variant: 'primary',
            text: 'Sắp ra mắt'
        },
        attributes: { disabled: true }
    },
];
exports.navItemsSpecialized = [
    // dữ liệu ngàng công thương
    {
        title: true,
        name: 'Dữ liệu ngành',
        manager: true,
        isSCT: true
    },
    {
        name: 'QUẢN LÝ THƯƠNG MẠI',
        manager: true,
        isSCT: true,
        icon: 'integration_instructions',
        expand: false,
        children: [
            {
                name: 'Thương mại nội địa',
                icon: 'roofing',
                id: 'TMND',
                manager: true,
                expand: false,
                children: [
                    {
                        name: 'Hạ tầng thương mại',
                        url: '/specialized/commecial-management/domestic',
                        icon: 'room_preferences',
                        id: 'HTTM'
                    },
                    {
                        name: 'Kinh doanh có điều kiện, hạn chế kinh doanh',
                        url: '/specialized/commecial-management/domestic/cbl',
                        icon: 'smoking_rooms',
                        id: 'KDCDK'
                    },
                    {
                        name: 'Tổng mức bán lẻ hàng hóa và dịch vụ',
                        url: '/specialized/commecial-management/retail',
                        icon: 'tty',
                        id: 'HHDV'
                    },
                ]
            },
            {
                name: 'Xuất nhập khẩu',
                url: '/specialized/commecial-management/ecommerce',
                icon: 'share',
                id: 'XNK',
                manager: true,
                expand: false,
                children: [
                    {
                        name: 'Xuất khẩu',
                        url: '/specialized/commecial-management/export_import/exported_products',
                        icon: 'public',
                        id: 'HTTM'
                    },
                    {
                        name: 'Nhập khẩu',
                        url: '/specialized/commecial-management/export_import/imported_products',
                        icon: 'public_off',
                        id: 'KDCDK'
                    },
                ]
            },
            {
                name: 'Thương mại biên giới',
                url: '/specialized/commecial-management/border_trade',
                icon: 'luggage',
                id: 'TMBG',
                manager: true,
                expand: false,
                children: [
                    {
                        name: 'Xuất khẩu',
                        url: '/specialized/commecial-management/border_trade/export',
                        icon: 'ondemand_video',
                        id: 'TMBG_XK'
                    },
                    {
                        name: 'Nhập khẩu',
                        url: '/specialized/commecial-management/border_trade/import',
                        icon: 'ondemand_video',
                        id: 'TMBG_NK'
                    },
                ]
            },
            {
                name: 'Thương mại điện tử',
                url: '/specialized/commecial-management/multi-level',
                icon: 'vibration',
                id: 'TMDT',
                manager: true,
                expand: false,
                children: [
                    {
                        name: 'Quản lý thông báo website bán hàng',
                        url: '/specialized/commecial-management/e-commerce/sale-website',
                        icon: 'ondemand_video',
                        id: 'QLTB'
                    },
                    {
                        name: 'Quản lý đăng kí website cung cấp dịch vụ TMĐT',
                        url: '/specialized/commecial-management/e-commerce/ecommerce-website',
                        icon: 'personal_video',
                        id: 'QLDK'
                    },
                ]
            },
            {
                name: 'Xúc tiến thương mại',
                icon: 'support_agent',
                id: 'TD',
                manager: true,
                expand: false,
                children: [
                    {
                        name: 'Hội chợ triển lãm',
                        url: '/specialized/commecial-management/trade-development/TFE',
                        icon: 'food_bank',
                        id: 'TFE'
                    },
                    {
                        name: 'Khuyến mại',
                        url: '/specialized/commecial-management/trade-development/SD',
                        icon: 'movie_filter',
                        id: 'SD'
                    },
                ]
            },
            {
                name: 'Hoạt động bán hàng đa cấp',
                url: '/specialized/commecial-management/multilevel_trade',
                icon: 'device_hub',
                id: 'TMBG',
                manager: false,
                expand: false,
                children: []
            },
        ]
    },
    {
        name: 'QUẢN LÝ NĂNG LƯỢNG',
        manager: true,
        isSCT: true,
        icon: 'speed',
        expand: false,
        children: [
            {
                name: 'Năng lượng',
                icon: 'trending_up',
                manager: true,
                children: [
                    {
                        name: 'Điện mặt trời',
                        url: '/specialized/enery-management/solarelectric',
                        icon: 'wb_sunny'
                    },
                    {
                        name: 'Thủy điện',
                        url: '/specialized/enery-management/hydroelectric',
                        icon: 'water_damage'
                    },
                    {
                        name: 'Điện sinh khối',
                        url: '/specialized/enery-management/block_electric',
                        icon: 'home'
                    },
                ]
            },
            {
                name: 'Quy hoạch phát triển lưới điện',
                icon: 'home',
                manager: true,
                children: [
                    {
                        name: 'Quy hoạch điện 110KV trở lên',
                        url: '/specialized/enery-management/electrical_plan',
                        icon: 'schedule'
                    },
                    {
                        name: 'Công tác phát triển lưới điện 35KV trở xuống',
                        url: '/specialized/enery-management/35kv_electricity_development',
                        icon: 'settings_input_component'
                    },
                    {
                        name: 'Điện sản xuất và điện thương phẩm',
                        url: '/specialized/enery-management/power_production',
                        icon: 'grade'
                    },
                    {
                        name: 'Điện nông thôn (Nông thôn mới)',
                        url: '/specialized/enery-management/rural_electricity',
                        icon: 'electrical_services'
                    },
                    {
                        name: 'Quản lý Cấp phép Hoạt động Điện lực',
                        url: '/specialized/enery-management/manage_aprove_hddl',
                        icon: 'moving'
                    }
                ]
            },
            {
                name: 'Tiết kiệm năng lượng',
                url: '/specialized/enery-management/focused_energy',
                icon: 'group_work'
            },
        ]
    },
    {
        name: 'QUẢN LÝ CÔNG NGHIỆP',
        url: '/specialized/industrial-management/',
        manager: true,
        isSCT: true,
        icon: 'business',
        expand: false,
        children: [
            {
                name: 'Hóa chất',
                url: '/specialized/industry-management/chemical',
                icon: 'warning'
            },
            {
                name: 'Chiết nạp khí hóa lỏng',
                url: '/specialized/industry-management/lpg',
                icon: 'auto_delete'
            },
            {
                name: 'Công nghiệp thực phẩm',
                url: '/specialized/industry-management/food',
                icon: 'biotech'
            },
            {
                name: 'Chỉ số SX công nghiệp',
                url: '/specialized/industry-management/iip',
                icon: 'filter_9_plus'
            },
            {
                name: 'Cụm Công nghiệp',
                url: '/specialized/industry-management/cluster',
                icon: 'location_city',
                manager: true,
                expand: false,
                children: [
                    {
                        name: 'Tổng quan',
                        url: '/specialized/industry-management/cluster',
                        icon: 'perm_media'
                    },
                    {
                        name: 'Báo cáo',
                        url: '/specialized/industry-management/report',
                        icon: 'feedback'
                    },
                ]
            },
            {
                name: 'Công bố hợp quy',
                url: '/specialized/industry-management/cr',
                icon: 'filter_9_plus'
            },
            // {
            //   name: 'Công bố hợp quy',
            //   url: '/specialized/industry-management/other',
            //   icon: 'hourglass_bottom',
            //   attributes :{disabled: true},
            // },
            {
                name: 'Vật liệu nổ CN',
                url: '/specialized/industry-management/explosives',
                icon: 'sick'
            },
        ]
    },
    {
        name: 'Đăng xuất',
        url: '/logout',
        manager: true,
        isSCT: true,
        icon: 'login',
        badge: {
            variant: 'primary',
            text: 'Sắp ra mắt'
        },
        attributes: { disabled: true }
    },
];
exports.navItemsReport = [
    {
        name: 'Nhập báo cáo',
        url: '/report/all',
        icon: 'edit'
    },
    // {
    //   name: 'Nhập báo cáo',
    //   url: '/report/edit',
    //   icon: 'border_all',
    // },
    {
        name: 'Xem báo cáo',
        url: '/report/view-all',
        icon: 'pageview'
    },
    // {
    //   name: 'Xem',
    //   url: '/report/view',
    //   icon: 'border_all',
    // },
    {
        name: 'Đăng xuất',
        url: '/logout',
        manager: true,
        isSCT: true,
        icon: 'login',
        badge: {
            variant: 'primary',
            text: 'Sắp ra mắt'
        },
        attributes: { disabled: true }
    },
];
