import { defineStore } from 'pinia'
import { ref } from 'vue'
import { Tag } from '@shared/types'
import { api } from '@shared/services/api'

export const useTagStore = defineStore('tags', () => {
  const tags = ref<Tag[]>([])
  const previewTags = ref<Tag[]>([])

  const uploadNewTags = async (thingId: string) => {
    const newTags = previewTags.value.filter(
      (pt) =>
        !tags.value.some((st) => st.key === pt.key && st.value === pt.value)
    )
    if (newTags.length <= 0) return
    try {
      const requests = newTags.map((tag) => api.createSiteTag(thingId, tag))
      await Promise.all(requests)
    } catch (error) {
      console.error('Failed to upload tags:', error)
    }
  }

  const deleteSelectedTags = async (thingId: string) => {
    const deletedTags = tags.value.filter(
      (storedTag) => !previewTags.value.some((t) => t.id === storedTag.id)
    )
    if (deletedTags.length <= 0) return
    try {
      const requests = deletedTags.map((tag) =>
        api.deleteSiteTag(thingId, tag.id)
      )
      await Promise.all(requests)
    } catch (error) {
      console.error('Failed to upload tags:', error)
    }
  }

  const updateTags = async (thingId: string) => {
    try {
      await uploadNewTags(thingId)
      await deleteSelectedTags(thingId)
      tags.value = await api.fetchSiteTags(thingId)
      previewTags.value = []
    } catch (error) {
      console.error('Error updating tags', error)
    }
  }

  return {
    tags,
    previewTags,
    updateTags,
  }
})
