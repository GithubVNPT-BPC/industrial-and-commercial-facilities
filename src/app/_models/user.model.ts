export class user_model{
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

    constructor(data){
        Object.assign(this, data);
    }
}