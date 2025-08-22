import axios from 'axios'
import {useGlobalStore} from "@/config/global.ts";

class Server {
  constructor() {
    const url = 'http://localhost:5000/api';
    axios.defaults.baseURL = url;
  }

  public login = (email: string, password: string, ip: string) => {
    return axios.post('/login', {
      email,
      password,
      ip_address: ip
    });
  }

  public logout = () => {
    const globalStore = useGlobalStore();
    axios.post('/logout', {}, {
      headers: {
        'Authorization': `${globalStore.user.token}`
      }
    });
  }
  public register = (data: {
    username: string
    email: string,
    password: string
  }) => {
    return axios.post('/register', data);
  }

  public getAllUsers = () => {
    const globalStore = useGlobalStore();
    return axios.post('/get_all', {}, {
      headers: {
        'Authorization': `${globalStore.user.token}`
      }
    });
  }
  public updateUser = (data: {
    id?: number
    username: string
    email: string
    password?: string
    Admin?: number
  }) => {
    const globalStore = useGlobalStore();
    return axios.post('/updateUser', data, {
      headers: {
        'Authorization': `${globalStore.user.token}`
      }
    });
  }

}

const Serverd = new Server()
// export default {Serverd}

export {Serverd}
