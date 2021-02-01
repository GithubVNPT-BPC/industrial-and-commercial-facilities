export class INavItem {
    name?: string;
    children?: INavItem[];
    url?: string;
    title?: boolean;
    icon?: string;
    variant?: string;
    badge?: any;
    manager?:boolean;
    attributes?: Attribute;
    id?: string;
    isSCT?: boolean;
    expand?: boolean;
}
export class Attribute {
    disabled?: boolean;
    color?: boolean;
}