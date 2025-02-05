import { defineStore } from 'pinia'
import { User } from '@/types'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const user = ref<User>(new User())

  return {
    user,
  }
})
