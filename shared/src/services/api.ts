import { apiMethods } from './apiMethods'
import {
  Unit,
  Thing,
  DataLoader,
  Sensor,
  ResultQualifier,
  ProcessingLevel,
  ObservedProperty,
  Datastream,
  DataSource,
  Tag,
  PostHydroShareArchive,
  HydroShareArchive,
  User,
} from '../types'

export const BASE_URL = `${import.meta.env.VITE_APP_PROXY_BASE_URL}/api`

export const ACCOUNT_BASE = `${BASE_URL}/account`
export const TAG_BASE = `${BASE_URL}/data/tags`
export const USER_BASE = `${BASE_URL}/account/user`
const DS_BASE = `${BASE_URL}/data/datastreams`
const SENSOR_BASE = `${BASE_URL}/data/sensors`
export const THINGS_BASE = `${BASE_URL}/data/things`
const DATA_LOADERS_BASE = `${BASE_URL}/data/data-loaders`
const DATA_SOURCES_BASE = `${BASE_URL}/data/data-sources`
const OP_BASE = `${BASE_URL}/data/observed-properties`
const PL_BASE = `${BASE_URL}/data/processing-levels`
const RQ_BASE = `${BASE_URL}/data/result-qualifiers`
const UNIT_BASE = `${BASE_URL}/data/units`
export const SENSORTHINGS_BASE = `${BASE_URL}/sensorthings/v1.1`

export const JWT_REFRESH = `${ACCOUNT_BASE}/jwt/refresh`

export const getObservationsEndpoint = (
  id: string,
  pageSize: number,
  startTime: string,
  endTime?: string,
  skipCount?: number
) => {
  let url = `${SENSORTHINGS_BASE}/Datastreams('${id}')/Observations?$resultFormat=dataArray`
  url += `&$top=${pageSize}`
  url += `&$filter=phenomenonTime%20ge%20${startTime}`
  if (endTime) url += `%20and%20phenomenonTime%20lt%20${endTime}`
  if (skipCount) url += `&$skip=${skipCount}`
  return url
}

export const OAUTH_ENDPOINT = (
  provider: string,
  uid?: string,
  token?: string
) => {
  let url = `${ACCOUNT_BASE}/${provider}/login`
  if (uid && token) {
    url += `?uid=${uid}&token=${token}`
  }
  return url
}

export const api = {
  createUser: async (user: User) => apiMethods.post(USER_BASE, user),
  fetchUser: async () => apiMethods.fetch(USER_BASE),
  updateUser: async (user: User, oldUser: User) =>
    apiMethods.patch(USER_BASE, user, oldUser),
  deleteUser: async () => apiMethods.delete(USER_BASE),

  resetPassword: async (uid: string, token: string, password: string) =>
    apiMethods.post(`${ACCOUNT_BASE}/reset-password`, {
      uid: uid,
      token: token,
      password: password,
    }),
  sendPasswordRestEmail: async (email: string) =>
    apiMethods.post(`${ACCOUNT_BASE}/send-password-reset-email`, {
      email: email,
    }),
  login: async (email: string, password: string) =>
    apiMethods.post(`${ACCOUNT_BASE}/jwt/pair`, {
      email: email,
      password: password,
    }),
  activateAccount: async (uid: string, token: string) =>
    apiMethods.post(`${ACCOUNT_BASE}/activate`, {
      uid: uid,
      token: token,
    }),
  sendVerificationEmail: async () =>
    apiMethods.post(`${ACCOUNT_BASE}/send-verification-email`),

  createUnit: async (unit: Unit) => apiMethods.post(UNIT_BASE, unit),
  fetchUnits: async () => apiMethods.fetch(UNIT_BASE),
  fetchUnownedUnits: async () => apiMethods.fetch(`${UNIT_BASE}?owner=noUser`),
  fetchOwnedUnits: async () => apiMethods.fetch(`${UNIT_BASE}?owner=anyUser`),
  fetchCurrentUserUnits: async () =>
    apiMethods.fetch(`${UNIT_BASE}?owner=currentUser`),
  updateUnit: async (newUnit: Unit, oldUnit: Unit | null = null) =>
    apiMethods.patch(`${UNIT_BASE}/${newUnit.id}`, newUnit, oldUnit),
  deleteUnit: async (id: string) => apiMethods.delete(`${UNIT_BASE}/${id}`),
  getUnit: async (id: string) => apiMethods.fetch(`${UNIT_BASE}/${id}`),

  removeThingOwner: async (id: string, email: string) =>
    apiMethods.patch(`${THINGS_BASE}/${id}/ownership`, {
      email: email,
      removeOwner: true,
    }),
  addSecondaryOwner: async (id: string, email: string) =>
    apiMethods.patch(`${THINGS_BASE}/${id}/ownership`, {
      email: email,
      makeOwner: true,
    }),
  transferPrimaryOwnership: async (id: string, email: string) =>
    apiMethods.patch(`${THINGS_BASE}/${id}/ownership`, {
      email: email,
      transferPrimary: true,
    }),
  updateThingPrivacy: async (id: string, thingPrivacy: boolean) =>
    apiMethods.patch(`${THINGS_BASE}/${id}/privacy`, {
      isPrivate: thingPrivacy,
    }),
  createThing: async (thing: Thing) => apiMethods.post(THINGS_BASE, thing),
  fetchThings: async () => apiMethods.fetch(THINGS_BASE),
  fetchPrimaryOwnedThings: async () =>
    apiMethods.fetch(`${THINGS_BASE}?primary_owned_only=true`),
  fetchOwnedThings: async () =>
    apiMethods.fetch(`${THINGS_BASE}?owned_only=true`),
  fetchThing: async (id: string) => apiMethods.fetch(`${THINGS_BASE}/${id}`),
  updateThing: async (thing: Thing) =>
    apiMethods.patch(`${THINGS_BASE}/${thing.id}`, thing),
  deleteThing: async (id: string) => apiMethods.delete(`${THINGS_BASE}/${id}`),
  fetchMetadataForThingOwner: async (thingId: string) =>
    apiMethods.fetch(
      `${THINGS_BASE}/${thingId}/metadata?include_assignable_metadata=true`
    ),
  fetchMetadataForThing: async (thingId: string) =>
    apiMethods.fetch(`${THINGS_BASE}/${thingId}/metadata`),
  uploadSitePhotos: async (thingId: string, data: FormData) =>
    apiMethods.post(`${THINGS_BASE}/${thingId}/photos`, data),
  fetchSitePhotos: async (thingId: string) =>
    apiMethods.fetch(`${THINGS_BASE}/${thingId}/photos`),
  deleteSitePhoto: async (thingId: string, photoId: string) =>
    apiMethods.delete(`${THINGS_BASE}/${thingId}/photos/${photoId}`),

  createSiteTag: async (thingId: string, tag: Tag) =>
    apiMethods.post(`${THINGS_BASE}/${thingId}/tags`, tag),
  fetchSiteTags: async (thingId: string) =>
    apiMethods.fetch(`${THINGS_BASE}/${thingId}/tags`),
  fetchUsersSiteTags: async () => apiMethods.fetch(`${TAG_BASE}`),
  deleteSiteTag: async (thingId: string, tagId: string) =>
    apiMethods.delete(`${THINGS_BASE}/${thingId}/tags/${tagId}`),

  fetchDatastreamsForThing: async (thingId: string) =>
    apiMethods.fetch(`${THINGS_BASE}/${thingId}/datastreams`),

  connectToHydroShare: async () =>
    apiMethods.fetch(`${ACCOUNT_BASE}/hydroshare/connect`),
  disconnectFromHydroShare: async () =>
    apiMethods.fetch(`${ACCOUNT_BASE}/hydroshare/disconnect`),
  createHydroShareArchive: async (archive: PostHydroShareArchive) =>
    apiMethods.post(`${THINGS_BASE}/${archive.thingId}/archive`, archive),
  updateHydroShareArchive: async (
    newArchive: HydroShareArchive,
    oldArchive?: HydroShareArchive
  ) =>
    apiMethods.patch(
      `${THINGS_BASE}/${newArchive.thingId}/archive`,
      newArchive,
      oldArchive
    ),
  fetchHydroShareArchive: async (thingId: string) =>
    apiMethods.fetch(`${THINGS_BASE}/${thingId}/archive`),
  deleteHydroShareArchive: async (thingId: string) =>
    apiMethods.delete(`${THINGS_BASE}/${thingId}/archive`),
  archiveToHydroShare: async (thingId: string) =>
    apiMethods.post(`${THINGS_BASE}/${thingId}/archive/trigger`),

  createDatastream: async (datastream: Datastream) =>
    apiMethods.post(DS_BASE, datastream),
  fetchDatastreams: async () => apiMethods.fetch(DS_BASE),
  fetchDatastream: async (id: string) => apiMethods.fetch(`${DS_BASE}/${id}`),
  fetchUsersDatastreams: async () =>
    apiMethods.fetch(`${DS_BASE}?exclude_unowned=true`),
  fetchPrimaryOwnedDatastreams: async () =>
    apiMethods.fetch(`${DS_BASE}?primary_owned_only=true`),
  updateDatastream: async (
    newDS: Datastream,
    oldDS: Datastream | null = null
  ) => apiMethods.patch(`${DS_BASE}/${newDS.id}`, newDS, oldDS),
  deleteDatastream: async (id: string) => apiMethods.delete(`${DS_BASE}/${id}`),
  downloadDatastreamCSV: async (id: string) =>
    apiMethods.fetch(`${DS_BASE}/${id}/csv`),

  createObservedProperty: async (op: ObservedProperty) =>
    apiMethods.post(OP_BASE, op),
  fetchObservedProperty: async (id: string) =>
    apiMethods.fetch(`${OP_BASE}/${id}`),
  fetchObservedProperties: async () => apiMethods.fetch(OP_BASE),
  fetchUnownedObservedProperties: async () =>
    apiMethods.fetch(`${OP_BASE}?owner=noUser`),
  fetchOwnedObservedProperties: async () =>
    apiMethods.fetch(`${OP_BASE}?owner=anyUser`),
  fetchCurrentUserObservedProperties: async () =>
    apiMethods.fetch(`${OP_BASE}?owner=currentUser`),
  fetchCurrentUserOrNoUserObservedProperties: async () =>
    apiMethods.fetch(`${OP_BASE}?owner=currentUserOrNoUser`),
  updateObservedProperty: async (
    newOP: ObservedProperty,
    oldOP: ObservedProperty | null = null
  ) => apiMethods.patch(`${OP_BASE}/${newOP.id}`, newOP, oldOP),
  deleteObservedProperty: async (id: string) =>
    apiMethods.delete(`${OP_BASE}/${id}`),

  createProcessingLevel: async (pl: ProcessingLevel) =>
    apiMethods.post(PL_BASE, pl),
  fetchProcessingLevels: async () => apiMethods.fetch(PL_BASE),
  fetchUnownedProcessingLevels: async () =>
    apiMethods.fetch(`${PL_BASE}?owner=noUser`),
  fetchOwnedProcessingLevels: async () =>
    apiMethods.fetch(`${PL_BASE}?owner=anyUser`),
  fetchCurrentUserProcessingLevels: async () =>
    apiMethods.fetch(`${PL_BASE}?owner=currentUser`),
  fetchCurrentUserOrUnownedProcessingLevels: async () =>
    apiMethods.fetch(`${PL_BASE}?owner=currentUserOrNoUser`),
  updateProcessingLevel: async (
    newPL: ProcessingLevel,
    oldPL: ProcessingLevel | null = null
  ) => apiMethods.patch(`${PL_BASE}/${newPL.id}`, newPL, oldPL),
  deleteProcessingLevel: async (id: string) =>
    apiMethods.delete(`${PL_BASE}/${id}`),

  createSensor: async (sensor: Sensor) => apiMethods.post(SENSOR_BASE, sensor),
  fetchSensors: async () => apiMethods.fetch(SENSOR_BASE),
  fetchOwnedSensors: async () =>
    apiMethods.fetch(`${SENSOR_BASE}?owner=anyUser`),
  fetchCurrentUserSensors: async () =>
    apiMethods.fetch(`${SENSOR_BASE}?owner=currentUser`),
  updateSensor: async (newSensor: Sensor, oldSensor: Sensor | null = null) =>
    apiMethods.patch(`${SENSOR_BASE}/${newSensor.id}`, newSensor, oldSensor),
  deleteSensor: async (id: string) => apiMethods.delete(`${SENSOR_BASE}/${id}`),

  createResultQualifier: async (resultQualifier: ResultQualifier) =>
    apiMethods.post(RQ_BASE, resultQualifier),
  fetchResultQualifiers: async () => apiMethods.fetch(RQ_BASE),
  fetchCurrentUserResultQualifiers: async () =>
    apiMethods.fetch(`${RQ_BASE}?owner=currentUser`),
  updateResultQualifier: async (
    newResultQualifier: ResultQualifier,
    oldResultQualifier: ResultQualifier | null = null
  ) =>
    apiMethods.patch(
      `${RQ_BASE}/${newResultQualifier.id}`,
      newResultQualifier,
      oldResultQualifier
    ),
  deleteResultQualifier: async (id: string) =>
    apiMethods.delete(`${RQ_BASE}/${id}`),

  createDataLoader: async (dataLoader: DataLoader) =>
    apiMethods.post(DATA_LOADERS_BASE, dataLoader),
  fetchDataLoaders: async () => apiMethods.fetch(DATA_LOADERS_BASE),
  fetchDataLoader: async (id: string) =>
    apiMethods.fetch(`${DATA_LOADERS_BASE}/${id}`),
  updateDataLoader: async (id: string, dataLoader: DataLoader) =>
    apiMethods.patch(`${DATA_LOADERS_BASE}/${id}`, dataLoader),
  deleteDataLoader: async (id: string) =>
    apiMethods.delete(`${DATA_LOADERS_BASE}/${id}`),

  createDataSource: async (dataSource: DataSource) =>
    apiMethods.post(DATA_SOURCES_BASE, dataSource),
  fetchDataSources: async () => apiMethods.fetch(DATA_SOURCES_BASE),
  fetchDataSource: async (id: string) =>
    apiMethods.fetch(`${DATA_SOURCES_BASE}/${id}`),
  updateDataSource: async (newS: DataSource, oldS: DataSource | null = null) =>
    apiMethods.patch(`${DATA_SOURCES_BASE}/${newS.id}`, newS, oldS),
  deleteDataSource: async (id: string) =>
    apiMethods.delete(`${DATA_SOURCES_BASE}/${id}`),

  fetchObservations: async (endpoint: string) => apiMethods.fetch(endpoint),
}
