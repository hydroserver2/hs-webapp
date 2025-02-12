import { apiMethods } from '@/services/apiMethods'
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
  PostWorkspace,
} from '@/types'
import { getCSRFToken } from './getCSRFToken'

export const BASE_URL = `${import.meta.env.VITE_APP_PROXY_BASE_URL}/api`

export const AUTH_BASE = `${BASE_URL}/auth`
export const ACCOUNT_BASE = `${AUTH_BASE}/browser/account`
export const SESSION_BASE = `${AUTH_BASE}/browser/session`
export const PROVIDER_BASE = `${AUTH_BASE}/browser/provider`
const WORKSPACES_BASE = `${AUTH_BASE}/workspaces`

export const TAG_BASE = `${BASE_URL}/data/tags`
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

export const getObservationsEndpoint = (
  id: string,
  pageSize: number,
  startTime: string,
  endTime?: string,
  skipCount?: number
) => {
  let url = `${SENSORTHINGS_BASE}/Datastreams('${id}')/Observations?$resultFormat=dataArray`
  url += `&$top=${pageSize}`
  url += `&$filter=phenomenonTime%20gt%20${startTime}`
  if (endTime) url += `%20and%20phenomenonTime%20le%20${endTime}`
  if (skipCount) url += `&$skip=${skipCount}`
  return url
}

/**
 * Initiates a synchronous form submission to redirect the user for OAuth login in a Django AllAuth
 * environment. This allows the server to return a 302 redirect that the browser will follow,
 * preserving session cookies and enabling AllAuth to handle the full OAuth handshake.
 *
 * @param {string} provider - The ID of the OAuth provider (e.g. "google", "hydroshare").
 * @param {string} callbackUrl - The URL to which the user is redirected after the OAuth flow completes.
 * @param {string} process - Enum: "login" or "connect" The process to be executed when the user successfully authenticates.
 *                           When set to login, the user will be logged into the account to which the provider account is connected,
 *                           or if no such account exists, a signup will occur. If set to connect, the provider account will
 *                           be connected to the list of provider accounts for the currently authenticated user.
 */
const providerRedirect = (
  provider: string,
  callbackUrl: string,
  process: string
) => {
  const data: Record<string, string> = {
    provider: provider,
    callback_url: callbackUrl,
    process: process,
  }
  const csrfToken = getCSRFToken()
  const form = document.createElement('form')
  form.method = 'POST'
  form.action = `${PROVIDER_BASE}/redirect`
  if (csrfToken) {
    const csrfInput = document.createElement('input')
    csrfInput.type = 'hidden'
    csrfInput.name = 'csrfmiddlewaretoken'
    csrfInput.value = csrfToken
    form.appendChild(csrfInput)
  }
  for (const key in data) {
    const input = document.createElement('input')
    input.type = 'hidden'
    input.name = key
    input.value = data[key]
    form.appendChild(input)
  }
  document.body.appendChild(form)
  form.submit()
}

export const api = {
  fetchAuthMethods: async () => apiMethods.fetch(`${AUTH_BASE}/methods`),
  fetchSession: async () => apiMethods.fetch(`${SESSION_BASE}`),
  login: async (email: string, password: string) =>
    apiMethods.post(`${SESSION_BASE}`, { email, password }),
  logout: async () => apiMethods.delete(`${SESSION_BASE}`),

  fetchUser: async () => apiMethods.fetch(`${ACCOUNT_BASE}`),
  signup: async (user: User) => apiMethods.post(`${ACCOUNT_BASE}`, user),
  updateUser: async (user: User, oldUser: User) =>
    apiMethods.patch(`${ACCOUNT_BASE}`, user, oldUser),
  deleteUser: async () => apiMethods.delete(`${ACCOUNT_BASE}`),

  sendVerificationEmail: async (email: string) =>
    apiMethods.put(`${ACCOUNT_BASE}/email/verify`, {
      email: email,
    }),
  verifyEmailWithCode: async (key: string) =>
    apiMethods.post(`${ACCOUNT_BASE}/email/verify`, { key }),

  requestPasswordReset: async (email: string) =>
    apiMethods.post(`${ACCOUNT_BASE}/password/request`, {
      email: email,
    }),
  resetPassword: async (key: string, password: string) =>
    apiMethods.post(`${ACCOUNT_BASE}/password/reset`, {
      key: key,
      password: password,
    }),

  fetchWorkspaces: async () =>
    apiMethods.fetch(`${WORKSPACES_BASE}?associated_only=true`),
  fetchAssociatedWorkspaces: async () =>
    apiMethods.fetch(`${WORKSPACES_BASE}?associated_only=true`),
  fetchWorkspace: async (id: string) =>
    apiMethods.post(`${WORKSPACES_BASE}/${id}`),
  createWorkspace: async (postWorkspace: PostWorkspace) =>
    apiMethods.post(WORKSPACES_BASE, postWorkspace),
  updateWorkspace: async (
    newWorkspace: PostWorkspace,
    oldWorkspace: PostWorkspace | null = null
  ) =>
    apiMethods.patch(
      `${WORKSPACES_BASE}/${newWorkspace.id}`,
      newWorkspace,
      oldWorkspace
    ),
  deleteWorkspace: async (id: string) =>
    apiMethods.delete(`${WORKSPACES_BASE}/${id}`),
  transferWorkspace: async (id: string, newOwner: string) =>
    apiMethods.post(`${WORKSPACES_BASE}/${id}/transfer`, { newOwner }),
  acceptWorkspaceTransfer: async (id: string) =>
    apiMethods.put(`${WORKSPACES_BASE}/${id}/transfer`),
  rejectWorkspaceTransfer: async (id: string) =>
    apiMethods.delete(`${WORKSPACES_BASE}/${id}/transfer`),

  getCollaboratorRoles: async (id: string) =>
    apiMethods.fetch(`${WORKSPACES_BASE}/${id}/roles`),
  getCollaboratorRole: async (workspaceId: string, roleId: string) =>
    apiMethods.fetch(`${WORKSPACES_BASE}/${workspaceId}/roles/${roleId}`),

  getCollaborators: async (id: string) =>
    apiMethods.fetch(`${WORKSPACES_BASE}/${id}/collaborators`),
  addCollaborator: async (id: string, email: string, roleId: string) =>
    apiMethods.post(`${WORKSPACES_BASE}/${id}/collaborators`, {
      email,
      roleId,
    }),
  updateCollaboratorRole: async (id: string, email: string, roleId: string) =>
    apiMethods.put(`${WORKSPACES_BASE}/${id}/collaborators`, {
      email,
      roleId,
    }),
  removeCollaborator: async (id: string, email: string) =>
    apiMethods.put(`${WORKSPACES_BASE}/${id}/collaborators`, { email }),

  fetchConnectedProviders: async () =>
    apiMethods.fetch(`${PROVIDER_BASE}/connections`),
  providerRedirect,
  providerSignup: async (user: User) =>
    apiMethods.post(`${PROVIDER_BASE}/signup`, user),
  deleteProvider: async (provider: string, account: string) =>
    apiMethods.delete(`${PROVIDER_BASE}/connections`, {
      provider: provider,
      account: account,
    }),

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
  fetchThingsForWorkspace: async (id: string) =>
    apiMethods.fetch(`${THINGS_BASE}?workspace_id=${id}`),
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
