import { defineStore } from 'pinia'
import { ref } from 'vue'
import { Photo } from '@shared/types'
import { api } from '@shared/services/api'

export const usePhotosStore = defineStore('photos', () => {
  const photos = ref<Photo[]>([])
  const newPhotos = ref<File[]>([])
  const photosToDelete = ref<string[]>([])
  const loading = ref(false)

  const uploadNewPhotos = async (thingId: string) => {
    if (newPhotos.value.length > 0) {
      const data = new FormData()
      newPhotos.value.forEach((photo) => data.append('files', photo))
      photos.value = await api.uploadSitePhotos(thingId, data)
    }
  }

  const deleteSelectedPhotos = async (thingId: string) => {
    for (const photoId of photosToDelete.value) {
      await api.deleteSitePhoto(thingId, photoId)
    }
    photos.value = photos.value.filter(
      (p) => !photosToDelete.value.includes(p.id)
    )
  }

  const updatePhotos = async (thingId: string) => {
    try {
      loading.value = true
      await uploadNewPhotos(thingId)
      await deleteSelectedPhotos(thingId)
    } catch (error) {
      console.error('Error updating photos', error)
    } finally {
      loading.value = false
      newPhotos.value = []
      photosToDelete.value = []
    }
  }

  return {
    photos,
    newPhotos,
    photosToDelete,
    loading,
    updatePhotos,
  }
})
