interface User {
  id: number;
  name: string;
  email: string;
  token: string;
  isAdmin: number;
  is_login: boolean;
}
const user = <User>{
  id: 0,
  name: '',
  email: '',
  token: '',
  is_login: false,
  isAdmin: 1,
};

export default user;
