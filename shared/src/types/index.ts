export type DataPoint = {
  date: Date
  value: number
}

export type DataArray = [string, number][]

export class ObservationRecord {
  dataArray: DataArray
  beginTime: string
  endTime: string
  loading: boolean

  constructor() {
    this.dataArray = []
    this.beginTime = ''
    this.endTime = ''
    this.loading = false
  }
}

export interface GraphSeries {
  id: string
  name: string
  data: DataPoint[]
  yAxisLabel: string
  lineColor: string
}

export type TimeSpacingUnit = 'seconds' | 'minutes' | 'hours' | 'days'

export interface Owner {
  firstName: string
  lastName: string
  organizationName: string
  isPrimaryOwner: boolean
  email: string
}

export interface Tag {
  id: string
  key: string
  value: string
}

export type Frequency = 'daily' | 'weekly' | 'monthly' | null

export class HydroShareArchive {
  id: string
  thingId: string
  link: string
  frequency: Frequency
  path: string
  datastreamIds: string[]
  publicResource: boolean

  constructor() {
    this.id = ''
    this.thingId = ''
    this.link = ''
    this.frequency = null
    this.path = 'HydroShare'
    this.datastreamIds = []
    this.publicResource = false
  }
}

export class PostHydroShareArchive extends HydroShareArchive {
  resourceTitle?: string
  resourceAbstract?: string
  resourceKeywords?: string[]

  constructor() {
    super()
    this.resourceTitle = undefined
    this.resourceAbstract = undefined
    this.resourceKeywords = undefined
  }
}

export class Thing {
  id: string
  name: string
  owners: Owner[]
  tags: Tag[]
  hydroShareArchive?: HydroShareArchive | null
  siteType: string
  samplingFeatureCode: string
  isPrivate: boolean
  latitude?: number | ''
  longitude?: number | ''
  elevation_m?: number | ''
  elevationDatum: string
  ownsThing: boolean
  followsThing: boolean
  description: string
  samplingFeatureType: string
  state: string
  county: string
  country: string
  isPrimaryOwner: boolean
  dataDisclaimer: string

  constructor() {
    this.id = ''
    this.name = ''
    this.owners = []
    this.tags = []
    this.siteType = ''
    this.samplingFeatureCode = ''
    this.isPrivate = false
    this.elevationDatum = 'WGS84'
    this.ownsThing = false
    this.followsThing = false
    this.description = ''
    this.samplingFeatureType = 'Site'
    this.state = ''
    this.county = ''
    this.country = ''
    this.isPrimaryOwner = false
    this.dataDisclaimer = ''
  }
}

export interface ThingWithColor extends Thing {
  color?: {
    borderColor: string
    background: string
    glyphColor: string
  }
  tagValue?: string
}

export class Datastream {
  id: string
  name: string
  description: string
  thingId: string
  observationType: string
  resultType?: string
  status?: string
  sampledMedium: string
  noDataValue: number
  aggregationStatistic: string
  unitId: string
  observedPropertyId: string
  sensorId: string
  processingLevelId: string
  isVisible: boolean
  isDataVisible: boolean
  phenomenonBeginTime?: string | null
  phenomenonEndTime?: string | null
  intendedTimeSpacing?: number
  intendedTimeSpacingUnits?: string | null
  timeAggregationInterval: number | null
  timeAggregationIntervalUnitsId: string
  dataSourceId?: string | null
  dataSourceColumn?: string | number | null
  valueCount: number

  constructor(thingId?: string) {
    this.id = ''
    this.name = ''
    this.description = ''
    this.thingId = thingId || ''
    this.observationType = 'OM_Measurement'
    this.resultType = 'Time Series Coverage'
    this.sampledMedium = ''
    this.noDataValue = -9999
    this.aggregationStatistic = ''
    this.unitId = ''
    this.observedPropertyId = ''
    this.sensorId = ''
    this.processingLevelId = ''
    this.timeAggregationInterval = null
    this.timeAggregationIntervalUnitsId = ''
    this.isVisible = true
    this.valueCount = 0
    this.isDataVisible = true
  }
}

export class Unit {
  id: string
  owner: string | null
  name: string
  symbol: string
  definition: string
  type: string

  constructor() {
    this.id = ''
    this.owner = null
    this.name = ''
    this.symbol = ''
    this.definition = ''
    this.type = ''
  }
}

export class Sensor {
  id: string
  owner: string | null
  name: string
  description: string
  manufacturer: string
  model: string
  methodType: string
  methodCode: string
  methodLink: string
  encodingType: string
  modelLink: string

  constructor() {
    this.id = ''
    this.owner = null
    this.name = ''
    this.description = ''
    this.manufacturer = ''
    this.model = ''
    this.methodType = 'Instrument Deployment'
    this.methodCode = ''
    this.methodLink = ''
    this.encodingType = 'application/json'
    this.modelLink = ''
  }
}

export class ObservedProperty {
  id: string
  name: string
  owner: string | null
  definition: string
  description: string
  type: string
  code: string

  constructor() {
    this.id = ''
    this.name = ''
    this.owner = null
    this.definition = ''
    this.description = ''
    this.type = 'Hydrology'
    this.code = ''
  }
}

export class ProcessingLevel {
  id: string
  owner: string | null
  code: string
  definition: string
  explanation: string

  constructor() {
    this.id = ''
    this.owner = null
    this.code = ''
    this.definition = ''
    this.explanation = ''
  }
}

export class ResultQualifier {
  id: string
  owner: string | null
  code: string
  description: string

  constructor() {
    this.id = ''
    this.owner = null
    this.code = ''
    this.description = ''
  }
}

export class DataSource {
  id: string
  name: string
  path: string
  url: string | null
  headerRow?: number
  dataStartRow: number
  delimiter: string
  interval: number | null
  intervalUnits: string | null
  crontab: string
  startTime: string | null
  endTime: string | null
  paused: boolean
  timestampColumn: string | number
  timestampFormat: string
  timestampOffset: string
  dataLoaderId: string
  dataSourceThru: string | null
  lastSyncSuccessful: boolean
  lastSyncMessage: string
  lastSynced: string | null
  nextSync: string | null

  constructor() {
    this.id = ''
    this.name = ''
    this.path = ''
    this.url = null
    this.dataStartRow = 1
    this.delimiter = ','
    this.interval = null
    this.intervalUnits = null
    this.crontab = ''
    this.startTime = null
    this.endTime = null
    this.paused = false
    this.timestampColumn = ''
    this.timestampFormat = ''
    this.timestampOffset = ''
    this.dataLoaderId = ''
    this.dataSourceThru = null
    this.lastSyncSuccessful = false
    this.lastSyncMessage = ''
    this.lastSynced = null
    this.nextSync = null
  }
}

export class DataLoader {
  id: string
  name: string

  constructor() {
    this.id = ''
    this.name = ''
  }
}

export class Organization {
  name?: string
  code?: string
  type?: string
  description?: string
  link?: string

  constructor() {}
}

export class User {
  id: string
  email: string
  password: string
  firstName: string
  middleName: string
  lastName: string
  phone: string
  address: string
  organization?: Organization | null
  type: string
  isVerified: boolean
  link: string
  hydroShareConnected: boolean

  constructor() {
    this.id = ''
    this.email = ''
    this.password = ''
    this.firstName = ''
    this.middleName = ''
    this.lastName = ''
    this.phone = ''
    this.address = ''
    this.type = ''
    this.isVerified = false
    this.link = ''
    this.hydroShareConnected = false
  }
}

export interface DatastreamMetadata {
  units: Unit[]
  sensors: Sensor[]
  processingLevels: ProcessingLevel[]
  observedProperties: ObservedProperty[]
}

export interface Photo {
  id: string
  thingId: string
  filePath: string
  link: string
}

export enum OAuthProvider {
  google = 'google',
  orcid = 'orcid',
  hydroshare = 'hydroshare',
}
