// src/stores/global.ts
import {defineStore} from "pinia";


const useGlobalStore = defineStore("global", {
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




export {useGlobalStore}
