interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  token: string;
  isAdmin: number;
  is_login: boolean;
}
const user = <User>{
  id: 0,
  name: '',
  email: '',
  token: '',
  password: '',
  is_login: false,
  isAdmin: 0,
};

export default user;
