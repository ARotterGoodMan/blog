interface User {
  id: number
  name: string
  email: string
  avatar: string
  password: string
  token: string
  isAdmin: number
  is_login: boolean
}
const user = <User>{
  id: 0,
  name: '',
  email: '',
  token: '',
  avatar: '',
  isAdmin: 0,
  password: '',
  is_login: false,
}

export default user
