import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { useTableLogic } from '../useTableLogic'
import { Unit } from '@shared/types'
import unitFixtures from '@/utils/test/fixtures/unitFixtures'

const defaultFetchFunction: () => Promise<Unit[]> = () => {
  return Promise.resolve(JSON.parse(JSON.stringify(unitFixtures)))
}

const defaultDeleteFunction: () => Promise<void> = () => Promise.resolve()

const createDummyComponent = ({
  apiFetchFunction = defaultFetchFunction,
  apiDeleteFunction = defaultDeleteFunction,
} = {}) =>
  defineComponent({
    setup() {
      return useTableLogic(apiFetchFunction, apiDeleteFunction, Unit)
    },
    template: '<div>{{items}}</div>',
  })

describe('useTableLogic', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('fetches items on component mount', async () => {
    const wrapper = mount(createDummyComponent())
    await flushPromises()
    expect(wrapper.vm.items).toEqual(unitFixtures)
  })

  it('opens edit dialog and sets the item correctly', () => {
    const wrapper = mount(createDummyComponent())
    wrapper.vm.openDialog(unitFixtures[0], 'edit')

    expect(wrapper.vm.openEdit).toBe(true)
    expect(wrapper.vm.item).toEqual(unitFixtures[0])
  })

  it('opens delete dialog and sets the item correctly', () => {
    const wrapper = mount(createDummyComponent())
    wrapper.vm.openDialog(unitFixtures[1], 'delete')

    expect(wrapper.vm.openDelete).toBe(true)
    expect(wrapper.vm.item).toEqual(unitFixtures[1])
  })

  it('updates an item correctly', async () => {
    const wrapper = mount(createDummyComponent())
    await flushPromises()

    let updatedItem = JSON.parse(JSON.stringify(unitFixtures[0]))
    updatedItem.name = 'Updated'
    wrapper.vm.onUpdate(updatedItem)

    expect(wrapper.vm.items).toContainEqual(updatedItem)
  })

  it('Deletes an item correctly', async () => {
    const wrapper = mount(createDummyComponent())
    await flushPromises()

    wrapper.vm.openDialog(unitFixtures[0], 'delete')
    wrapper.vm.onDelete()
    await flushPromises()

    expect(wrapper.vm.items).not.toContainEqual(unitFixtures[0])
  })
})
