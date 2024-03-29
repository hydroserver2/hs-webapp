import { ApiKey } from '@/types'

export function formatFieldValue(v: string) {
  return v.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase());
}

export function getStatus(k: ApiKey) {
  let now = new Date()
  if (k.expires >= now) {
    return 'expired'
  } else if (!k.enabled) {
    return 'disabled'
  } else {
    return 'active'
  }
}