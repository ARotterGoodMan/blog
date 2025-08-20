import axios from 'axios'

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
    axios.post('/logout', {}, {
      headers: {
        'Authorization': ``
      }
    });
  }

}

const Serverd = new Server()
// export default {Serverd}

export {Serverd}
