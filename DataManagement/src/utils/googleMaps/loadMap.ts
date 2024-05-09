import { Thing } from '@shared/types'
import { Loader } from '@googlemaps/js-api-loader'

type Map = google.maps.Map

export const loadMap = async (
  container: HTMLElement,
  mapOptions: google.maps.MapOptions = {}
) => {
  const loader = new Loader({
    apiKey: import.meta.env.VITE_APP_GOOGLE_MAPS_API_KEY,
    version: 'beta',
    libraries: ['marker'],
  })
  const google = await loader.load()

  return new google.maps.Map(container, {
    ...mapOptions,
    mapId: import.meta.env.VITE_APP_GOOGLE_MAPS_MAP_ID,
  })
}

export const zoomAndCenterMap = (
  map: Map | null,
  mapContainer: HTMLElement,
  markers: Thing[],
  defaultMapOptions: {}
) => {
  const mapOptions = getBoundedMapOptions(
    mapContainer,
    markers,
    defaultMapOptions
  )
  map?.setCenter(mapOptions.center)
  map?.setZoom(mapOptions.zoom)
}

export function getBoundedMapOptions(
  mapContainer: HTMLElement,
  markers: Thing[],
  defaultMapOptions: any
) {
  if (markers.length > 0) {
    const bounds = new google.maps.LatLngBounds()
    markers.forEach((t) => {
      if (!t.latitude || !t.longitude) return
      bounds.extend(new google.maps.LatLng(t.latitude, t.longitude))
    })

    const center = bounds.getCenter()
    const zoom = calculateZoomForBounds(bounds, mapContainer)

    return {
      ...defaultMapOptions,
      center: { lat: center.lat(), lng: center.lng() },
      zoom: zoom,
    }
  }

  return defaultMapOptions
}

function calculateZoomForBounds(
  bounds: google.maps.LatLngBounds,
  mapContainer: HTMLElement
) {
  const WORLD_DIM = { height: 256, width: 256 }
  const ZOOM_MAX = 14

  function latRad(lat: number) {
    return Math.sin((lat * Math.PI) / 180)
  }

  function zoom(mapPx: number, worldPx: number, fraction: number): number {
    return Math.floor(Math.log(mapPx / worldPx / fraction) / Math.LN2)
  }

  const ne = bounds.getNorthEast()
  const sw = bounds.getSouthWest()

  const latFraction = (latRad(ne.lat()) - latRad(sw.lat())) / Math.PI
  const lngDiff = ne.lng() - sw.lng()
  const lngFraction = (lngDiff < 0 ? lngDiff + 360 : lngDiff) / 360

  const latZoom = zoom(mapContainer.offsetHeight, WORLD_DIM.height, latFraction)
  const lngZoom = zoom(mapContainer.offsetWidth, WORLD_DIM.width, lngFraction)

  return Math.min(latZoom, lngZoom, ZOOM_MAX)
}
