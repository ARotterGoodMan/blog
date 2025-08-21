import axios from 'axios'
import {useGlobalStore} from "@/config/global.ts";

class Server {
  constructor() {
    const url = 'http://localhost:5000/api';
    axios.defaults.baseURL = url;
  }

  public login = (email: string, password: string) => {
    return axios.post('/login', {
      email,
      password
    });
  }

  public logout = () => {
    const globalStore= useGlobalStore();
    axios.post('/logout', {}, {
      headers: {
        'Authorization': `${globalStore.user.token}`
      }
    });
  }
  public register= (data:{
    username: string
    email: string,
    password: string
    phone: string
  }) => {
    return axios.post('/register', data);
  }

}

const Serverd = new Server()
// export default {Serverd}

export {Serverd}
