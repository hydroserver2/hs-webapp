import { api } from '@shared/services/api'
import { Tag } from '@shared/types'
import { ref, computed, onMounted } from 'vue'

export function useUserTags() {
  const formKey = ref('')
  const formValue = ref('')
  const userTags = ref<Tag[]>([])

  const keyList = computed(() => {
    const keys = userTags.value.map((tag) => tag.key)
    return Array.from(new Set(keys))
  })

  const valueList = computed(() => {
    const filteredTags = formKey.value
      ? userTags.value.filter((tag) => tag.key === formKey.value)
      : userTags.value

    const values = filteredTags.map((tag) => tag.value)
    return Array.from(new Set(values))
  })

  onMounted(async () => {
    userTags.value = await api.fetchUsersSiteTags()
  })

  return { formKey, formValue, keyList, valueList }
}
