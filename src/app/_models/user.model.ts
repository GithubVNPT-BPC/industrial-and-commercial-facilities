export class DeleteModel {
    id: string;
}

export class user_model {
    user_id: number;
    full_name: String;
    user_name: String;
    user_pwd_hash: String;
    user_pwd_salt: String;
    email: String;
    mst: String;
    token: String;
    password: String;
    new_password: String;
    org_id: String;

    constructor(data) {
        Object.assign(this, data);
    }
}

export class ChangePassword {
    username: string;
    full_name: string;
    password: string;
    nPassword: string;
}

export class ChangeInfoUser {
    user_id: number;
    user_name: string;
    full_name: string;
    user_email: string;
    user_phone: string;
    position: string;
    role_id: number;
    org_id: number;
    status: boolean;
    avatar_link: string;
}

export class PostInfoUser {
    user_name: string;
    full_name: string;
    user_email: string;
    user_phone: string;
    position: string;
    user_role_id: number;
    org_id: number;
    status: boolean;
    avatar_link: string;
    password: string;
}

export class InfoUser {
    user_id: number;
    user_name: string;
    full_name: string;
    avatar_link: string;
    user_email: string;
    user_phone: string;
    user_position: string;
    role_id: number;
    org_id: number;
    status: boolean;
}

export class UserRole {
    id: number;
    name: string;
}

export class UserOrg {
    org_id: number;
    org_name: string;
}

export class InfoUserList {
    user_id: number;
    user_name: string;
    full_name: string;
    avatar_link: string;
    user_email: string;
    user_position: string;
    role_id: number;
    role_name: string;
    org_id: number;
    org_code: string;
    org_name: string;
    status: boolean;
}