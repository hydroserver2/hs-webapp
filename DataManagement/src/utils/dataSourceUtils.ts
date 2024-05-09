import { DataSource } from '@shared/types'

export function getStatus(ds: DataSource) {
  if (!ds.lastSynced) return 'pending'

  let now = new Date()
  let nextSync = ds.nextSync ? new Date(Date.parse(ds.nextSync)) : null

  if (!ds.lastSyncSuccessful && nextSync && nextSync >= now) {
    return 'ok'
  } else if (ds.dataSourceThru == null || !ds.lastSyncSuccessful) {
    return 'bad'
  } else if (nextSync && nextSync < now) {
    return 'stale'
  }
  return 'bad'
}
