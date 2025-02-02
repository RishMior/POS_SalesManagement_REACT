import axios from "axios";

const ACCOUNT_BASE_URL = "http://localhost:8080/user/getAllUser";
const USERNAME_BASE_URL = "http://localhost:8080/user/getByUser?username=";

class AccountService{
    getAccount() {
        return axios.get(ACCOUNT_BASE_URL);
    }

    insertAccount(userid: any){
        return axios.post(ACCOUNT_BASE_URL, userid);
    }

    findByUsername(productname: any){
        return axios.get(USERNAME_BASE_URL + productname);
    }

    putAccount(account: any, userid: any){
        return axios.put(ACCOUNT_BASE_URL + '/' + userid, account);
    }

    deleteAccount(userid: any){
        return axios.delete(ACCOUNT_BASE_URL + '/' + userid);
    }
}

export default new AccountService()