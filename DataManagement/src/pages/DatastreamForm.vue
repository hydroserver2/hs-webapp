<template>
  <v-container class="mb-16">
    <h5 class="text-h5 py-5">
      {{ datastreamId ? 'Edit' : 'Create' }} Datastream
    </h5>

    <v-card
      class="outlined-container mb-10"
      v-if="!datastreamId && isPrimaryOwner"
    >
      <v-card-actions class="text-subtitle-2 text-medium-emphasis">
        Use an existing datastream as a template
        <v-spacer />
        <v-btn-primary @click="showTemplateModal = true"
          >Load template</v-btn-primary
        >
      </v-card-actions>
    </v-card>

    <v-dialog v-model="showTemplateModal" width="60rem">
      <DatastreamTemplateModal
        @selected-datastream-id="selectedDatastreamID = $event"
        @close="showTemplateModal = false"
      />
    </v-dialog>

    <v-form
      v-if="datastream"
      @submit.prevent="uploadDatastream"
      ref="myForm"
      v-model="valid"
      validate-on="blur"
    >
      <v-card class="outlined-container mb-10">
        <v-card-text class="text-subtitle-2 text-medium-emphasis">
          Select the appropriate metadata to describe the the datastream you are
          adding to the monitoring site. If you want to modify the values
          available in the drop down menus below, click the “Add New” button or
          visit the
          <router-link to="/Metadata"> Manage Metadata page. </router-link>
        </v-card-text>

        <v-card-text>
          <v-autocomplete
            :key="datastream.sensorId"
            v-model="datastream.sensorId"
            label="Select sensor *"
            :items="sensors"
            item-title="name"
            item-value="id"
            :rules="rules.required"
            no-data-text="No available sensors"
          >
            <template v-slot:append v-if="isPrimaryOwner">
              <v-btn-add @click="showSensorModal = true">Add New</v-btn-add>
              <v-dialog v-model="showSensorModal" width="60rem">
                <SensorFormCard
                  @created="handleMetadataUploaded('sensorId', $event)"
                  @close="showSensorModal = false"
                />
              </v-dialog>
            </template>
          </v-autocomplete>
        </v-card-text>

        <v-card-text>
          <v-autocomplete
            v-model="datastream.observedPropertyId"
            label="Select observed property *"
            :items="observedProperties"
            item-title="name"
            item-value="id"
            :rules="rules.required"
            no-data-text="No available properties"
          >
            <template v-slot:append v-if="isPrimaryOwner">
              <v-btn-add @click="showOPModal = true">Add New</v-btn-add>
              <v-dialog v-model="showOPModal" width="60rem">
                <ObservedPropertyFormCard
                  @created="
                    handleMetadataUploaded('observedPropertyId', $event)
                  "
                  @close="showOPModal = false"
                />
              </v-dialog>
            </template>
          </v-autocomplete>
        </v-card-text>

        <v-card-text>
          <v-autocomplete
            v-model="datastream.unitId"
            label="Select unit *"
            :items="units"
            item-title="name"
            item-value="id"
            :rules="rules.required"
            no-data-text="No available units"
          >
            <template v-slot:append v-if="isPrimaryOwner">
              <v-btn-add @click="openUnitForm = true">Add New</v-btn-add>
              <v-dialog v-model="openUnitForm" width="60rem">
                <UnitFormCard
                  @created="handleMetadataUploaded('unitId', $event)"
                  @close="openUnitForm = false"
                  >Add New</UnitFormCard
                >
              </v-dialog>
            </template>
          </v-autocomplete>
        </v-card-text>

        <v-card-text>
          <v-autocomplete
            v-model="datastream.processingLevelId"
            label="Select processing level *"
            :items="formattedProcessingLevels"
            item-title="title"
            item-value="id"
            :rules="rules.required"
            no-data-text="No available processing level"
          >
            <template v-slot:append v-if="isPrimaryOwner">
              <v-btn-add @click="showPLModal = true">Add New</v-btn-add>
              <v-dialog v-model="showPLModal" width="60rem">
                <ProcessingLevelFormCard
                  @created="handleMetadataUploaded('processingLevelId', $event)"
                  @close="showPLModal = false"
                  >Add New</ProcessingLevelFormCard
                >
              </v-dialog>
            </template>
          </v-autocomplete>
        </v-card-text>
      </v-card>

      <v-card class="outlined-container mb-10">
        <v-card-text class="text-subtitle-2 text-medium-emphasis">
          For the following items, select an option or type your own. Note: the
          default selections won't be available if there is custom text in the
          field.
        </v-card-text>
        <v-card-text class="d-flex">
          <v-row>
            <v-col md="4" cols="12">
              <v-combobox
                :items="mediumTypes"
                v-model="datastream.sampledMedium"
                label="Medium *"
                :rules="rules.required"
              />
            </v-col>
            <v-col md="4" cols="12">
              <v-combobox
                :items="statusTypes"
                v-model="datastream.status"
                label="Status"
              />
            </v-col>
            <v-col md="4" cols="12">
              <v-combobox
                :items="aggregationTypes"
                v-model="datastream.aggregationStatistic"
                label="Aggregation Statistic *"
                :rules="rules.required"
              />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <v-card class="outlined-container mb-10">
        <v-card-text class="text-subtitle-2 text-medium-emphasis">
          When observation data is missing a value, what should the default be?
        </v-card-text>
        <v-card-text>
          <v-text-field
            v-model="datastream.noDataValue"
            label="No data value *"
            :rules="rules.required"
            type="number"
          />
        </v-card-text>
      </v-card>

      <v-card class="outlined-container mb-10">
        <v-card-text class="text-subtitle-2 text-medium-emphasis">
          Add time aggregation interval and intended time spacing. Note: in
          order to create a new unit which appears in the dropdowns below, the
          unit type must be 'Time'.
        </v-card-text>
        <v-card-text>
          <v-row>
            <v-col md="6" cols="12">
              <v-text-field
                v-model="datastream.timeAggregationInterval"
                label="Time Aggregation Interval *"
                :rules="rules.requiredNumber"
                type="number"
                class="mb-4"
              />

              <v-autocomplete
                v-model="datastream.timeAggregationIntervalUnitsId"
                label="Time aggregation unit *"
                :items="timeUnits"
                item-title="name"
                item-value="id"
                :rules="rules.required"
                no-data-text="No available units"
                class="pb-1"
              />
              <div v-if="isPrimaryOwner">
                <v-btn-add @click="openAggUnitForm = true">Add New</v-btn-add>
                <v-dialog v-model="openAggUnitForm" width="60rem">
                  <UnitFormCard
                    @created="
                      datastream.timeAggregationIntervalUnitsId = $event
                    "
                    @close="openAggUnitForm = false"
                    >Add New</UnitFormCard
                  >
                </v-dialog>
              </div>
            </v-col>

            <v-col md="6" cols="12">
              <v-text-field
                v-model="datastream.intendedTimeSpacing"
                label="Intended Time Spacing"
                type="number"
                class="mb-4"
              ></v-text-field>

              <v-autocomplete
                v-model="datastream.intendedTimeSpacingUnits"
                label="Intended time spacing unit"
                :items="intendedTimeUnits"
                no-data-text="No available units"
                class="pb-1"
                clearable
              />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <v-card class="outlined-container mb-10">
        <v-card-text class="text-subtitle-2 text-medium-emphasis">
          Enter a name and description for this datastream, or opt to auto-fill
          with default text. If you choose the defaults, make sure you've first
          filled out the rest of the form correctly as the website will generate
          text based on the current form fields.
        </v-card-text>

        <v-card-text>
          <v-text-field
            v-model="datastream.name"
            label="Datastream name *"
            :rules="rules.required"
          />

          <v-btn-cancel
            :disabled="datastream.name === originalName"
            @click="datastream.name = originalName"
          >
            Revert
          </v-btn-cancel>
          <v-btn class="ml-2" @click="datastream.name = generateDefaultName()"
            >Auto-Fill from Form</v-btn
          >
        </v-card-text>

        <v-card-text>
          <v-textarea
            v-model="datastream.description"
            label="Datastream description *"
            :rules="rules.required"
          />

          <v-btn-cancel
            :disabled="datastream.description === originalDescription"
            @click="datastream.description = originalDescription"
          >
            Revert
          </v-btn-cancel>
          <v-btn
            class="ml-2"
            @click="datastream.description = generateDefaultDescription()"
            >Auto-Fill from Form</v-btn
          >
        </v-card-text>
      </v-card>

      <v-row>
        <v-col cols="auto">
          <v-btn-cancel @click="$router.go(-1)">
            <v-icon>mdi-arrow-left</v-icon>
            Return to previous page
          </v-btn-cancel>
        </v-col>
        <v-spacer />
        <v-col cols="auto">
          <v-btn-primary type="submit">{{
            datastreamId ? 'Update' : 'Save'
          }}</v-btn-primary>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import DatastreamTemplateModal from '@/components/Datastream/DatastreamTemplateModal.vue'
import SensorFormCard from '@/components/Metadata/SensorFormCard.vue'
import ObservedPropertyFormCard from '@/components/Metadata/ObservedPropertyFormCard.vue'
import UnitFormCard from '@/components/Metadata/UnitFormCard.vue'
import ProcessingLevelFormCard from '@/components/Metadata/ProcessingLevelFormCard.vue'
import { rules } from '@shared/utils/rules'
import { mediumTypes, aggregationTypes, statusTypes } from '@/vocabularies'
import { useMetadata } from '@/composables/useMetadata'
import { Thing, Unit } from '@shared/types'
import { api } from '@shared/services/api'
import { Datastream } from '@shared/types'
import { VForm } from 'vuetify/components'
import router from '@/router/router'

const route = useRoute()
const thingId = route.params.id.toString()
const thing = ref<Thing>()
const datastreamId = route.params.datastreamId?.toString() || ''

const timeUnits = ref<Unit[]>([])
const intendedTimeUnits = ['seconds', 'minutes', 'hours', 'days']
const openUnitForm = ref(false)
const openAggUnitForm = ref(false)

const isPrimaryOwner = computed(() => thing.value?.isPrimaryOwner)
const showTemplateModal = ref(false)
const showSensorModal = ref(false)
const showPLModal = ref(false)
const showOPModal = ref(false)

const valid = ref(false)
const myForm = ref<VForm>()
const selectedDatastreamID = ref('')
const datastream = ref<Datastream>(new Datastream(thingId))

const {
  sensors,
  units,
  observedProperties,
  processingLevels,
  formattedProcessingLevels,
  fetchMetadata,
} = useMetadata(thingId)

const handleMetadataUploaded = async (dsKey: string, newId: string) => {
  await fetchMetadata(thingId)
  ;(datastream as any)[dsKey] = newId
}

const originalName = ref('')
const originalDescription = ref('')

const generateDefaultName = () => {
  const OP = observedProperties.value.find(
    (pl) => pl.id === datastream.value.observedPropertyId
  )?.name
  const PL = processingLevels.value.find(
    (pl) => pl.id === datastream.value.processingLevelId
  )?.code
  return `${OP} at ${thing.value?.samplingFeatureCode} with processing level ${PL}`
}

const generateDefaultDescription = () => {
  const OP = observedProperties.value.find(
    (pl) => pl.id === datastream.value.observedPropertyId
  )?.name
  console.log('computing description', OP)
  const PL = processingLevels.value.find(
    (pl) => pl.id === datastream.value.processingLevelId
  )?.code
  const sensorName = sensors.value.find(
    (pl) => pl.id === datastream.value.sensorId
  )?.name
  const unitName = units.value.find(
    (pl) => pl.id === datastream.value.unitId
  )?.name
  return `A datastream of ${OP} at ${thing.value?.name} with processing level ${PL} and sampled medium ${datastream.value.sampledMedium} created using a method with name ${sensorName} having units of ${unitName}`
}

watch(selectedDatastreamID, async () => {
  try {
    const fetchedDS = await api.fetchDatastream(selectedDatastreamID.value)
    if (!fetchedDS) return
    Object.assign(datastream.value, {
      ...datastream,
      sensorId: fetchedDS.sensorId,
      observedPropertyId: fetchedDS.observedPropertyId,
      processingLevelId: fetchedDS.processingLevelId,
      unitId: fetchedDS.unitId,
      timeAggregationIntervalUnitsId: fetchedDS.timeAggregationIntervalUnitsId,
      intendedTimeSpacingUnits: fetchedDS.intendedTimeSpacingUnits,
      name: fetchedDS.name,
      description: fetchedDS.description,
      sampledMedium: fetchedDS.sampledMedium,
      noDataValue: fetchedDS.noDataValue,
      aggregationStatistic: fetchedDS.aggregationStatistic,
      status: fetchedDS.status,
      timeAggregationInterval: fetchedDS.timeAggregationInterval,
      intendedTimeSpacing: fetchedDS.intendedTimeSpacing,
    })
  } catch (error) {
    console.error('Error loading datastream template', error)
  }
  await myForm.value?.validate()
})

async function uploadDatastream() {
  await myForm.value?.validate()
  if (!valid.value) return
  datastream.value.thingId = thingId
  if (datastreamId) {
    try {
      await api.updateDatastream(datastream.value)
    } catch (error) {
      console.error('Error updating datastream', error)
    }
  } else {
    try {
      await api.createDatastream(datastream.value)
    } catch (error) {
      console.error('Error creating datastream', error)
    }
  }
  router.push({ name: 'SiteDetails', params: { id: thingId } })
}

onMounted(async () => {
  window.scrollTo(0, 0)

  let promises = [api.fetchThing(thingId), api.fetchUnits()]
  if (datastreamId) promises.push(api.fetchDatastream(datastreamId))

  try {
    const results = await Promise.all(promises)

    let fetchedDatastream, fetchedThing, fetchedUnits
    if (datastreamId) [fetchedThing, fetchedUnits, fetchedDatastream] = results
    else [fetchedThing, fetchedUnits] = results

    if (fetchedDatastream) {
      datastream.value = fetchedDatastream
      originalName.value = datastream.value.name
      originalDescription.value = datastream.value.description
    }
    thing.value = fetchedThing
    timeUnits.value = fetchedUnits.filter((u: Unit) => u.type === 'Time')
  } catch (error) {
    console.error('Error fetching datastream data from DB.', error)
  }
})
</script>

<style scoped>
.outlined-container {
  border: 1px solid rgba(33, 150, 243, 0.3);
  padding: 16px;
}
</style>
