<template>
  <h6 class="text-h6 my-5">
    Add Additional Metadata
    <v-tooltip>
      <template v-slot:activator="{ props }">
        <v-icon small class="ml-2" color="grey lighten-1" v-bind="props">
          mdi-help-circle-outline
        </v-icon>
      </template>
      <template v-slot:default>
        <p>
          Use site metadata tags to add additional metadata to a site. Specify a
          key and value for each metadata property.
        </p>
        <p>
          On the 'My Sites' page, you'll be able to filter and color your sites
          by these metadata tags. For example, you can filter by only the sites
          that have a specific key and color code the markers on the map by the
          values of that key.
        </p>
        <p>
          Additionally, if a URL is added as a value, it will be clickable from
          the Site Details page, allowing direct access to relevant links.
        </p>
      </template>
    </v-tooltip>
  </h6>

  <v-row class="mt-8" align="center">
    <v-col cols="5">
      <v-combobox
        density="comfortable"
        v-model="formKey"
        :items="keyList"
        label="Key"
        :hide-details="!isKeyUsed"
        :error-messages="
          isKeyUsed ? 'A key may only be used once per site.' : ''
        "
      />
    </v-col>
    <v-col cols="5">
      <v-combobox
        density="comfortable"
        v-model="formValue"
        :items="valueList"
        :disabled="!formKey || isKeyUsed"
        label="Value"
        hide-details
      >
      </v-combobox>
    </v-col>
    <v-col>
      <v-btn :disabled="!formKey || !formValue || isKeyUsed" @click="addTag"
        >Add</v-btn
      >
    </v-col>
  </v-row>

  <v-row>
    <v-col>
      <v-chip
        v-for="(tag, index) in previewTags"
        rounded="true"
        :color="materialColors[index % materialColors.length]"
        :key="tag.id"
        closable
        class="mr-1 mb-1"
        @click:close="removeTag(index)"
      >
        {{ tag.key }}: {{ tag.value }}
      </v-chip>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { materialColors } from '@shared/utils/materialColors'
import { storeToRefs } from 'pinia'
import { useTagStore } from '@/store/tags'
import { useUserTags } from '@/composables/useUserTags'

const props = defineProps({ thingId: String })
const { tags, previewTags } = storeToRefs(useTagStore())
const { formKey, formValue, keyList, valueList } = useUserTags()

const isKeyUsed = computed(() =>
  previewTags.value.some((tag) => tag.key === formKey.value)
)

const addTag = () => {
  if (formKey.value === '' || formValue.value === '') {
    return
  }
  previewTags.value.push({ key: formKey.value, value: formValue.value, id: '' })
  formKey.value = ''
  formValue.value = ''
}

const removeTag = (index: number) => previewTags.value.splice(index, 1)

onMounted(async () => {
  previewTags.value = props.thingId ? [...tags.value] : []
})
</script>
