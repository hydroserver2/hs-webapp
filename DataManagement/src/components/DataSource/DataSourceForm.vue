v-col
<template>
  <v-card v-if="loaded">
    <v-card-title class="text-h5"
      >{{ isEdit ? 'Edit' : 'Add' }} Data Source</v-card-title
    >
    <v-divider />

    <v-form
      @submit.prevent="onSubmit"
      ref="myForm"
      v-model="valid"
      validate-on="blur"
    >
      <v-card-item class="mt-4">
        <h6 class="text-h6 mb-6">Data Source File Configuration</h6>
        <v-row>
          <v-col>
            <v-text-field
              v-model="item.name"
              label="Data Source Name *"
              :rules="rules.requiredName"
            />
          </v-col>
          <v-col>
            <v-autocomplete
              v-model="item.dataLoaderId"
              label="Data Loader *"
              hint="Select the data loader which will load this data source."
              :items="dataLoaders"
              item-title="name"
              item-value="id"
              :rules="rules.required"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field
              v-model="item.path"
              label="Local File Path *"
              hint="Enter the absolute path to the data source file."
              :rules="rules.required"
            />
          </v-col>
          <v-col>
            <v-select
              v-model="item.delimiter"
              label="File Delimiter *"
              hint="Select the type of delimiter used for this data file."
              :items="intervalDelimiterValues"
              variant="outlined"
              density="comfortable"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field
              v-model.number="item.headerRow"
              label="File Header Row"
              hint="Enter the row that contains file headers, if any."
              type="number"
              clearable
              :rules="[
                ...rules.greaterThan(0),
                ...rules.lessThan(item.dataStartRow, 'the data start row'),
              ]"
            />
          </v-col>
          <v-col>
            <v-text-field
              v-model.number="item.dataStartRow"
              label="Data Start Row *"
              hint="Enter the row that data starts on."
              type="number"
              :rules="[
                ...rules.greaterThan(0),
                ...rules.greaterThan(
                  item.headerRow || 0,
                  'the file header row'
                ),
              ]"
            />
          </v-col>
        </v-row>
      </v-card-item>

      <v-card-item class="mt-4">
        <h6 class="text-h6 mb-6">Data Source Schedule</h6>

        <v-row>
          <v-col class="v-col-xs-12 v-col-sm-6">
            <v-text-field
              v-model="item.startTime"
              label="Start Time"
              hint="Enter an optional start time for loading data. Otherwise, data loading will begin immediately."
              type="datetime-local"
              clearable
            />
          </v-col>
          <v-col class="v-col-xs-12 v-col-sm-6">
            <v-text-field
              v-model="item.endTime"
              label="End Time"
              hint="Enter an optional end time for loading data. Otherwise, data will be loaded indefinitely."
              type="datetime-local"
              clearable
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col class="v-col-xs-12 v-col-sm-6">
            <v-radio-group v-model="scheduleType" inline>
              <v-radio label="Interval" value="interval" />
              <v-radio label="Crontab" value="crontab" />
            </v-radio-group>
          </v-col>
          <template v-if="scheduleType === 'interval'">
            <v-col class="v-col-xs-6 v-col-sm-3">
              <v-text-field
                v-model="item.interval"
                label="Interval *"
                hint="Enter the interval data should be loaded on."
                type="number"
                :rules="[
              (val: string) => val != null && val !== '' || 'Interval value is required.',
              (val: string) => +val === parseInt(val, 10) || 'Interval must be an integer.',
              (val: string) => +val > 0 || 'Interval must be greater than zero.'
            ]"
              />
            </v-col>
            <v-col class="v-col-xs-6 v-col-sm-3">
              <v-select
                v-model="item.intervalUnits"
                label="Interval Units"
                :items="intervalUnitValues"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
          </template>
          <template v-if="scheduleType === 'crontab'">
            <v-col class="v-col-xs-12 v-col-sm-6">
              <v-text-field
                v-model="item.crontab"
                label="Crontab"
                hint="Enter a crontab schedule for the data to be loaded on."
              />
            </v-col>
          </template>
        </v-row>
      </v-card-item>

      <v-card-item class="mt-4">
        <h6 class="text-h6 mb-6">Data Source Timestamp</h6>

        <v-row>
          <v-col class="v-col-xs-12 v-col-sm-6">
            <v-radio-group v-model="timestampType" inline>
              <v-radio label="Column Index" value="index"></v-radio>
              <v-radio label="Column Name" value="name"></v-radio>
            </v-radio-group>
          </v-col>

          <v-col
            v-if="timestampType === 'index'"
            class="v-col-xs-12 v-col-sm-6"
          >
            <v-text-field
              v-model.number="item.timestampColumn"
              label="Timestamp Column *"
              hint="Enter the column index that contains timestamps for the datastreams."
              type="number"
              :rules="[...rules.required,
             ...rules.greaterThan(0),
             (val: string) => +val === parseInt(val, 10) || 'Interval must be an integer.',
          ]"
            />
          </v-col>
          <v-col v-if="timestampType === 'name'" class="v-col-xs-12 v-col-sm-6">
            <v-text-field
              v-model="item.timestampColumn"
              label="Timestamp Column *"
              hint="Enter the column name that contains timestamps for the datastreams."
              :rules="[
            (val: string) => val !== '' && val != null || 'Must enter timestamp column name.'
          ]"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col class="v-col-xs-12 v-col-sm-6">
            <v-radio-group v-model="timestampFormatType" inline>
              <v-radio
                label="ISO 8601 Format"
                value="iso"
                @click="item.timestampFormat = 'iso'"
              />
              <v-radio label="Custom Format" value="custom" />
            </v-radio-group>
          </v-col>
          <v-col class="v-col-xs-12 v-col-sm-6">
            <v-text-field
              v-model="item.timestampFormat"
              :label="`Custom Timestamp Format *`"
              hint="Enter the timestamp format."
              :rules="timestampFormatType === 'custom' ? rules.required : []"
              :disabled="timestampFormatType !== 'custom'"
            >
              <template v-slot:append-inner>
                <v-btn
                  size="lg"
                  color="gray"
                  icon="mdi-help-circle"
                  @click="openStrftimeHelp"
                />
              </template>
            </v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col class="v-col-xs-12 v-col-sm-6">
            <v-checkbox
              v-model="useOffset"
              label="Append Timezone Offset?"
            ></v-checkbox>
          </v-col>
          <v-col class="v-col-xs-12 v-col-sm-6">
            <v-autocomplete
              v-model="item.timestampOffset"
              :label="`Timezone Offset *`"
              hint="Enter an optional timezone offset to apply to the timestamp column."
              :items="timezoneOffsets"
              :disabled="!useOffset"
            ></v-autocomplete>
          </v-col>
        </v-row>
      </v-card-item>

      <v-divider />
      <v-card-actions>
        <v-spacer />
        <v-btn-cancel @click="emit('close')"> Cancel </v-btn-cancel>
        <v-btn-primary type="submit"> Save </v-btn-primary>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useFormLogic } from '@/composables/useFormLogic'
import { api } from '@shared/services/api'
import { DataLoader, DataSource } from '@shared/types'
import { rules } from '@shared/utils/rules'

const props = defineProps(['dataSource'])
const emit = defineEmits(['created', 'updated', 'close'])

const { item, isEdit, valid, myForm, uploadItem } = useFormLogic(
  api.fetchDataSources,
  api.createDataSource,
  api.updateDataSource,
  DataSource,
  props.dataSource || undefined,
  false
)

const dataLoaders = ref<DataLoader[]>([])
const scheduleType = ref('interval')
const timestampType = ref('index')
const timestampFormatType = ref('iso')
const useOffset = ref(false)
const loaded = ref(false)

const intervalDelimiterValues = [
  { value: ',', title: 'Comma' },
  { value: '|', title: 'Pipe' },
  { value: '\\t', title: 'Tab' },
  { value: ';', title: 'Semicolon' },
  { value: ' ', title: 'Space' },
]

const intervalUnitValues = [
  { value: 'minutes', title: 'Minutes' },
  { value: 'hours', title: 'Hours' },
  { value: 'days', title: 'Days' },
]

const timezoneOffsets = ref([
  '-1200',
  '-1100',
  '-1000',
  '-0900',
  '-0800',
  '-0700',
  '-0600',
  '-0500',
  '-0430',
  '-0400',
  '-0330',
  '-0300',
  '-0200',
  '-0100',
  '+0000',
  '+0100',
  '+0200',
  '+0300',
  '+0330',
  '+0400',
  '+0430',
  '+0500',
  '+0530',
  '+0545',
  '+0600',
  '+0630',
  '+0700',
  '+0800',
  '+0845',
  '+0900',
  '+0930',
  '+1000',
  '+1030',
  '+1100',
  '+1130',
  '+1200',
  '+1245',
  '+1300',
  '+1400',
])

async function onSubmit() {
  try {
    const newItem = await uploadItem()
    if (!newItem) return
    if (isEdit.value) emit('updated', newItem)
    else emit('created', newItem.id)
  } catch (error) {
    console.error('Error uploading DataSource', error)
  }
  emit('close')
}

const openStrftimeHelp = () =>
  window.open('https://devhints.io/strftime', '_blank', 'noreferrer')

const initializeForm = () => {
  if (!item.value) return
  let {
    crontab,
    timestampColumn,
    timestampFormat,
    timestampOffset,
    startTime,
    endTime,
  } = item.value

  if (crontab) scheduleType.value = 'crontab'
  if (timestampOffset) useOffset.value = true

  if (timestampColumn && typeof timestampColumn === 'string')
    timestampType.value = 'name'
  if (timestampFormat && timestampFormat !== 'iso')
    timestampFormatType.value = 'custom'

  if (startTime) item.value.startTime = startTime.replace('Z', '')
  if (endTime) item.value.endTime = endTime.replace('Z', '')
}

onMounted(async () => {
  console.log('datasource', props.dataSource)
  dataLoaders.value = await api.fetchDataLoaders()
  if (isEdit.value) initializeForm()
  loaded.value = true
})
</script>
