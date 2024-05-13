import { Thing } from '@shared/types'
import { googlePinColors } from '@shared/utils/materialColors'
import { ThingWithColor } from '@shared/types'
import { MarkerClusterer } from '@googlemaps/markerclusterer'

let infoWindow: google.maps.InfoWindow | null = null

export const addColorToMarkers = (things: Thing[], key: string) => {
  let colorIndex = 0
  const colorMap = new Map()

  return things.map((thing) => {
    const tagValue = thing.tags.find((tag) => tag.key === key)?.value
    if (tagValue === undefined) return thing

    if (!colorMap.has(tagValue)) {
      colorMap.set(
        tagValue,
        googlePinColors[colorIndex % googlePinColors.length]
      )
      colorIndex++
    }
    return { ...thing, color: colorMap.get(tagValue), tagValue: tagValue }
  })
}

export const loadMarkers = (
  things: Thing[],
  map: google.maps.Map | null,
  markerClusterer: MarkerClusterer | null
) => {
  if (!things || !map) return []

  map.addListener('click', (e: any) => {
    if (infoWindow) infoWindow.close()
    e.stop() // Prevents map labels from opening infoWindows when clicked
  })

  return things
    .map((thing) => createMarker(thing, map, markerClusterer))
    .filter(
      (marker): marker is google.maps.marker.AdvancedMarkerElement =>
        marker !== null
    )
}

const createMarker = (
  markerData: ThingWithColor,
  map: google.maps.Map | null,
  markerClusterer: MarkerClusterer | null
) => {
  if (!markerData || !map || !markerData.latitude || !markerData.longitude)
    return null

  const pinColor = markerData.color || googlePinColors[0]
  const pin = new google.maps.marker.PinElement(pinColor)

  const marker = new google.maps.marker.AdvancedMarkerElement({
    position: new google.maps.LatLng(markerData.latitude, markerData.longitude),
    map: map,
    content: pin.element,
  })

  if (markerClusterer) markerClusterer.addMarker(marker)

  const content = generateMarkerContent(markerData)

  marker.addListener('click', (e: any) => {
    if (infoWindow) infoWindow.close()
    infoWindow = new google.maps.InfoWindow({ content })
    infoWindow.open({ anchor: marker, map: map })
  })
  return marker
}

function generateMarkerContent(markerData: Thing): string {
  const primaryOwner = markerData.owners.find(
    (owner: any) => owner.isPrimaryOwner
  )
  const primaryOrg =
    primaryOwner && primaryOwner.organizationName
      ? `<p class="pb-1" style='color:green;'>Related Organization: ${primaryOwner.organizationName}</p>`
      : ''

  return `
      <h6 class="text-h6 pb-1">${markerData.name}</h6>
      <p class="pb-1" style="font-size: 1.2em;"><b>
        ${markerData.county ? markerData.county : ''}
        ${markerData.county && markerData.state ? ',' : ''}
        ${markerData.state ? markerData.state : ''}
        </b></p>
        <p class="pb-1" style="max-width: 25rem;">${markerData.description}</p>
        ${primaryOrg}
      <p class="pt-1">
        <a href="/sites/${markerData.id}">View data for this site</a>
      </p>`
}
