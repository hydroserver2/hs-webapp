type Map = google.maps.Map
type Marker = google.maps.marker.AdvancedMarkerElement
type LatLng = google.maps.LatLngLiteral

export const clearMarkers = (markers: Marker[]) => {
  if (!markers) return
  markers.forEach((marker) => (marker.map = null))
  markers.splice(0, markers.length)
}

export async function getElevation(position: LatLng) {
  const elevator = new google.maps.ElevationService()
  const { results } = await elevator.getElevationForLocations({
    locations: [position],
  })
  if (!results[0]) throw new Error('No elevation found')
  return results[0]
}

export async function getGeoData(position: LatLng) {
  try {
    const geocoder = new google.maps.Geocoder()
    const { results } = await geocoder.geocode({ location: position })

    const { state, county, country } = results[0].address_components.reduce(
      (acc: any, component: any) => {
        if (component.types.includes('administrative_area_level_1'))
          acc.state = component.short_name
        if (component.types.includes('administrative_area_level_2'))
          acc.county = component.short_name
        if (component.types.includes('country'))
          acc.country = component.short_name //  2-letter country code
        return acc
      },
      { state: '', county: '', country: '' }
    )

    return { state, county, country }
  } catch (error) {
    console.error(`Failed to get geolocation data: ${error}`)
  }
}

export function addMarker(map: Map, markers: Marker[], position: LatLng) {
  const marker = new google.maps.marker.AdvancedMarkerElement({ position, map })
  markers.push(marker)
}

export async function fetchLocationData(position: LatLng) {
  const { elevation }: any = await getElevation(position)
  const { state, county, country }: any = await getGeoData(position)

  return {
    latitude: position.lat.toFixed(6),
    longitude: position.lng.toFixed(6),
    elevation_m: Math.round(elevation),
    state: state,
    county: county,
    country: country,
  }
}

export function useSingleMarkerMode(
  map: Map,
  markers: Marker[],
  onLocationFetched: (locationData: any) => void
) {
  map.addListener('click', async (mapsMouseEvent: any) => {
    const position = {
      lat: mapsMouseEvent.latLng.lat(),
      lng: mapsMouseEvent.latLng.lng(),
    }
    clearMarkers(markers)
    addMarker(map, markers, position)
    const locationData = await fetchLocationData(position)
    onLocationFetched(locationData)
  })
}
