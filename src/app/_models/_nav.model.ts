export class INavItem {
    id?: number;
    parent_id?: number;
    navitems?: string;
    name?: string;
    url?: string;
    icon?: string;
    manager?: boolean;
    is_SCT?: boolean;
    id_linh_vuc: number;
    children?: INavItem[];
    // expand?: boolean;
    // title?: boolean;
    // variant?: string;
    // badge?: any;
    // attributes?: Attribute;
}
