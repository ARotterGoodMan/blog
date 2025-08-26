import axios from 'axios'
import {useGlobalStore} from "@/config/global.ts";

class Server {
  constructor() {
    const url = 'http://localhost:5000/api';
    axios.defaults.baseURL = url;
  }

  public getKey = () => {
    return axios.post('generate_keys');
  }

  public login = (email: string, password: string, ip: string, key_id: string) => {
    return axios.post('/login', {
      email,
      password,
      ip_address: ip,
      key_id
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
    Admin?: number
    max_logins?: number
    key_id: string
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
    max_logins?: number
    key_id?: string
  }) => {
    const globalStore = useGlobalStore();
    return axios.post('/updateUser', data, {
      headers: {
        'Authorization': `${globalStore.user.token}`
      }
    });
  }
  public deleteUser = (id: number) => {
    const globalStore = useGlobalStore();
    return axios.post('/delete_user', {id}, {
      headers: {
        'Authorization': `${globalStore.user.token}`
      }
    });
  }

  public get_profile = () => {
    const globalStore = useGlobalStore();
    return axios.post('/get_profile', {}, {
      headers: {
        'Authorization': `${globalStore.user.token}`
      }
    });
  }
  public update_profile = (data: {
    name: string
    sex: '男' | '女' | '保密'
    birth_date?: string | null
    phone?: string
    address?: string
    city?: string
    province?: string
    postal_code?: string
  }) => {
    return axios.post("/update_profile", data, {
      headers: {
        'Authorization': `${useGlobalStore().user.token}`
      }
    })
  }

  public get_notes() {
    return axios.get('/notes', {
      headers: {
        'Authorization': `${useGlobalStore().user.token}`
      }
    });
  }

  public save_note(data: { id?: string, title: string, content: string }) {
    return axios.post('/notes', data, {
      headers: {
        'Authorization': `${useGlobalStore().user.token}`
      }
    });
  }

  public delete_note(id: string) {
    return axios.post('/delete_note', {id}, {
      headers: {
        'Authorization': `${useGlobalStore().user.token}`
      }
    });
  }
}

const Serverd = new Server()
// export default {Serverd}

export {Serverd}
