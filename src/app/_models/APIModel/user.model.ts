export class UserModel {
    full_name: string = "";
    username: string = "";
    password: string = "";
    user_id: number = 0;
    token?: string = "";
    refresh_token?: string = "";
    user_role_id: number = 0;
    imageUrl: string = "";
    org_id: number;
}