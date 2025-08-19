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

const data = sessionStorage.getItem('user')

let user: User
if (data) {
  user = JSON.parse(data) as User
} else {
  user = {
    id: 0,
    name: '',
    email: '',
    token: '',
    avatar: '',
    isAdmin: 0,
    password: '',
    is_login: false,
  }
}

export default { user }
