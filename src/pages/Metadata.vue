<template>
  <v-container>
    <h5 class="text-h5 mb-4">Manage metadata</h5>
    <v-card>
      <v-toolbar color="brown">
        <v-text-field
          class="mx-4"
          clearable
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          label="Search"
          hide-details
          density="compact"
          rounded="xl"
          maxWidth="300"
        />

        <template v-slot:extension>
          <v-tabs
            v-model="tab"
            color="secondary-lighten-5"
            scrollable
            class="my-2"
          >
            <v-tab v-for="item in metaMap">{{ item.name }}</v-tab>
          </v-tabs>
        </template>

        <v-spacer />

        <v-btn-add
          prependIcon="mdi-plus"
          color="white"
          class="mr-2"
          @click="metaMap[tab]?.openDialog()"
          >Add new {{ metaMap[tab]?.singularName }}</v-btn-add
        >
      </v-toolbar>

      <v-toolbar color="brown" height="5"></v-toolbar>

      <v-window v-model="tab" class="elevation-3">
        <v-window-item value="0">
          <SensorTable :key="sensorKey" :search="search" />
        </v-window-item>

        <v-window-item value="1">
          <ObservedPropertyTable :key="OPKey" :search="search" />
        </v-window-item>

        <v-window-item value="2">
          <ProcessingLevelTable :key="PLKey" :search="search" />
        </v-window-item>

        <v-window-item value="3">
          <UnitTable :key="unitKey" :search="search" />
        </v-window-item>

        <v-window-item value="4">
          <ResultQualifierTable :key="qualifierKey" :search="search" />
        </v-window-item>
      </v-window>

      <v-dialog v-model="openUnitCreate" width="60rem">
        <UnitFormCard
          @close="openUnitCreate = false"
          @created="refreshUnitTable"
        />
      </v-dialog>

      <v-dialog v-model="openSensorCreate" width="60rem">
        <SensorFormCard
          @close="openSensorCreate = false"
          @created="refreshSensorTable"
        />
      </v-dialog>

      <v-dialog v-model="openRQCreate" width="60rem">
        <ResultQualifierFormCard
          @close="openRQCreate = false"
          @created="refreshRQTable"
        />
      </v-dialog>

      <v-dialog v-model="openOPCreate" width="60rem">
        <ObservedPropertyFormCard
          @close="openOPCreate = false"
          @created="refreshOPTable"
        />
      </v-dialog>

      <v-dialog v-model="openPLCreate" width="60rem">
        <ProcessingLevelFormCard
          @close="openPLCreate = false"
          @created="refreshPLTable"
        />
      </v-dialog>
    </v-card>
  </v-container>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import UnitTable from '@/components/Metadata/UnitTable.vue'
import SensorTable from '@/components/Metadata/SensorTable.vue'
import ResultQualifierTable from '@/components/Metadata/ResultQualifierTable.vue'
import ProcessingLevelTable from '@/components/Metadata/ProcessingLevelTable.vue'
import ObservedPropertyTable from '@/components/Metadata/ObservedPropertyTable.vue'

import UnitFormCard from '@/components/Metadata/UnitFormCard.vue'
import SensorFormCard from '@/components/Metadata/SensorFormCard.vue'
import ResultQualifierFormCard from '@/components/Metadata/ResultQualifierFormCard.vue'
import ProcessingLevelFormCard from '@/components/Metadata/ProcessingLevelFormCard.vue'
import ObservedPropertyFormCard from '@/components/Metadata/ObservedPropertyFormCard.vue'

const tab = ref(0)

const openUnitCreate = ref(false)
const unitKey = ref(0)
const refreshUnitTable = () => (unitKey.value += 1)

const openRQCreate = ref(false)
const qualifierKey = ref(0)
const refreshRQTable = () => (qualifierKey.value += 1)

const openPLCreate = ref(false)
const PLKey = ref(0)
const refreshPLTable = () => (PLKey.value += 1)

const openOPCreate = ref(false)
const OPKey = ref(0)
const refreshOPTable = () => (OPKey.value += 1)

const openSensorCreate = ref(false)
const sensorKey = ref(0)
const refreshSensorTable = () => (sensorKey.value += 1)

const search = ref()

const metaMap: Record<string, any> = {
  0: {
    name: 'Sensors',
    openDialog: () => (openSensorCreate.value = true),
    singularName: 'sensor',
  },
  1: {
    name: 'Observed properties',
    openDialog: () => (openOPCreate.value = true),
    singularName: 'observed property',
  },
  2: {
    name: 'Processing levels',
    openDialog: () => (openPLCreate.value = true),
    singularName: 'processing level',
  },
  3: {
    name: 'Units',
    openDialog: () => (openUnitCreate.value = true),
    singularName: 'unit',
  },
  4: {
    name: 'Result qualifiers',
    openDialog: () => (openRQCreate.value = true),
    singularName: 'result qualifier',
  },
}
</script>
