// src/stores/global.ts
import {defineStore} from "pinia";


export const useGlobalStore = defineStore("global", {
  state: () => ({
    user: {
      username: "",
      email: "",
      phone: "",
      token: "",
      avatar: "",
      isAdmin: 0,
      is_login: false
    },
  }),
  getters: {},
  actions: {
    setUser(data:
            {
              username: string
              email: string
              phone: string
              token: string
              avatar: string
              isAdmin: number
              is_login: boolean
            }
    ) {
      this.user.username = data.username
      this.user.email = data.email
      this.user.phone = data.phone
      this.user.token = data.token
      this.user.avatar = data.avatar
      this.user.isAdmin = data.isAdmin
      this.user.is_login = data.is_login
    },
  },
});

if (JSON.parse(<string>sessionStorage.getItem("user"))) {
  const data = JSON.parse(<string>sessionStorage.getItem("user"));
  useGlobalStore().setUser({
    username: data.username,
    email: data.email,
    phone: data.phone,
    token: data.token,
    avatar: data.avatar,
    isAdmin: data.isAdmin,
    is_login: data.is_login
  });
}

