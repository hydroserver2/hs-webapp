import { describe, it, expect, vi } from 'vitest'
import { useFormLogic } from '@/composables/useFormLogic'
import { Unit } from '@shared/types'
import { flushPromises, mount } from '@vue/test-utils'
import { defineComponent, nextTick } from 'vue'
import unitFixtures from '@/utils/test/fixtures/unitFixtures'

const [unit1, unit2] = unitFixtures

// Default mock functions that can be overridden
const defaultMockFetchItems: () => Promise<Unit[]> = vi.fn(() =>
  Promise.resolve([])
)
const defaultCreateItem = vi.fn()
const defaultUpdateItem = vi.fn()
let defaultInitialUnit: Unit | undefined = undefined

describe('useFormLogic', () => {
  // onMounted won't work outside of the context of script setup, therefore
  // wrap composable with dummy component
  const createDummyComponent = ({
    mockFetchItems = defaultMockFetchItems,
    createItem = defaultCreateItem,
    updateItem = defaultUpdateItem,
    initialUnit = defaultInitialUnit as Unit | undefined,
  } = {}) =>
    defineComponent({
      setup() {
        return useFormLogic(
          mockFetchItems,
          createItem,
          updateItem,
          Unit,
          initialUnit
        )
      },
      template: '<div>{{item}}</div>',
    })

  it('initializes correctly without initialItem', async () => {
    const wrapper = mount(createDummyComponent())
    expect(wrapper.vm.item).toBeInstanceOf(Unit)
    expect(wrapper.vm.items).toEqual([])
    expect(wrapper.vm.isEdit).toBe(false)
    expect(wrapper.vm.valid).toBe(false)
    expect(wrapper.vm.selectedId).toBeUndefined()
  })

  it('initializes correctly with initialItem', async () => {
    let initialUnit: Unit = new Unit()
    Object.assign(initialUnit, unit1)

    const wrapper = mount(
      createDummyComponent({
        mockFetchItems: vi.fn(() => Promise.resolve(unitFixtures)),
        initialUnit: initialUnit,
      })
    )

    await flushPromises()
    expect(wrapper.vm.selectedId).toEqual(initialUnit.id)
    expect(wrapper.vm.items).toEqual(unitFixtures)
    expect(wrapper.vm.item).toEqual(initialUnit)
    expect(wrapper.vm.isEdit).toBe(true)
  })

  it('updates item when selectedId changes', async () => {
    const wrapper = mount(
      createDummyComponent({
        mockFetchItems: vi.fn(() => Promise.resolve(unitFixtures)),
      })
    )

    await flushPromises()
    wrapper.vm.selectedId = 'unit2'
    await nextTick()

    expect(wrapper.vm.item).toEqual(unit2)
  })

  it('Calls update() when in edit mode', async () => {
    const wrapper = mount(
      createDummyComponent({
        mockFetchItems: vi.fn(() => Promise.resolve(unitFixtures)),
        updateItem: vi.fn(() => Promise.resolve(unit2)),
        initialUnit: unit2,
      })
    )

    await flushPromises()
    wrapper.vm.valid = true
    const newItem = await wrapper.vm.uploadItem()
    await nextTick()
    expect(newItem).toEqual(unit2)
  })

  it('Calls create() when in create mode', async () => {
    const wrapper = mount(
      createDummyComponent({
        mockFetchItems: vi.fn(() => Promise.resolve(unitFixtures)),
        createItem: vi.fn(() => Promise.resolve(unit1)),
      })
    )

    await flushPromises()
    wrapper.vm.valid = true
    const newItem = await wrapper.vm.uploadItem()
    await nextTick()
    expect(newItem).toEqual(unit1)
  })

  it('Handles errors properly', async () => {
    const mockError = new Error('Failed to fetch items')
    const wrapper = mount(
      createDummyComponent({
        mockFetchItems: vi.fn(() => Promise.reject(mockError)),
      })
    )

    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {})

    await flushPromises()
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error fetching items from DB.',
      mockError
    )

    consoleErrorSpy.mockRestore()
  })
})
