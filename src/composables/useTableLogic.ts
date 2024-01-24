import { Ref, onMounted, ref } from 'vue'

interface WithId {
  id: string
}

export function useTableLogic<T extends WithId>(
  apiFetchFunction: () => Promise<T[]>,
  apiDeleteFunction: (id: string) => Promise<any>,
  ItemClass: new () => T
) {
  const openEdit = ref(false)
  const openDelete = ref(false)
  const item = ref(new ItemClass()) as Ref<T>
  const items: Ref<T[]> = ref([])

  function openDialog(selectedItem: T, dialog: string) {
    item.value = selectedItem
    if (dialog === 'edit') openEdit.value = true
    else if (dialog === 'delete') openDelete.value = true
  }

  const onUpdate = (updatedItem: T) => {
    const index = items.value.findIndex((u: any) => u.id === updatedItem.id)
    if (index !== -1) items.value[index] = updatedItem
  }

  const onDelete = async () => {
    if (!item.value) return
    try {
      await apiDeleteFunction(item.value.id)
      items.value = items.value.filter((u: any) => u.id !== item.value.id)
      openDelete.value = false
    } catch (error) {
      console.error(`Error deleting table item`, error)
    }
  }

  onMounted(async () => {
    try {
      items.value = await apiFetchFunction()
    } catch (error) {
      console.error(`Error fetching table items`, error)
    }
  })

  return {
    openEdit,
    openDelete,
    item,
    items,
    openDialog,
    onUpdate,
    onDelete,
  }
}
