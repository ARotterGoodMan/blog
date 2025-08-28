import {defineStore} from "pinia";
import type {User} from "@/config/config.ts";


const useGlobalStore = defineStore("global", {
  state: () => ({
    user: <User>{
      username: "",
      email: "",
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
              token: string
              avatar: string
              isAdmin: 0 | 1 | 2
              is_login: boolean
            }
    ) {
      this.user.username = data.username
      this.user.email = data.email
      this.user.token = data.token
      this.user.avatar = data.avatar
      this.user.isAdmin = data.isAdmin
      this.user.is_login = data.is_login
    },
  },
});


export {useGlobalStore}
