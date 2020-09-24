// @flow
import defaultBounds from './defaultBounds';
import L from 'leaflet';
import type {Point} from 'types/point';

const boundsOneMarker = markers => {
	const bounds = [Object.assign({}, markers[0].geoposition), Object.assign({}, markers[0].geoposition)];
	const zoom = 0.006;
	bounds[0].latitude -= zoom;
	bounds[0].longitude -= zoom;
	bounds[1].latitude += zoom;
	bounds[1].longitude += zoom;
	const latLngs = bounds.map(geoposition => {
		return L.latLng(geoposition.latitude, geoposition.longitude);
	});
	return L.latLngBounds(latLngs);
};

export const getLatLngBounds = (dataMarkers: Array<Point>) => {
	if (dataMarkers.length === 1) {
		return boundsOneMarker(dataMarkers);
	}

	const markers = dataMarkers.length >= 2 ? dataMarkers : defaultBounds;
	const latLngs = markers.map(marker => {
		if(marker.geoposition)
			return L.latLng(marker.geoposition.latitude, marker.geoposition.longitude);
	});

	return L.latLngBounds(latLngs);
};

export default getLatLngBounds;
