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
}
