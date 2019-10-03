// @flow
import defaultBounds from './defaultBounds';
import L from 'leaflet';

export const getLatLngBounds = (dataMarkers: Object) => {
	const markers = Object.keys(dataMarkers).length !== 0 ? dataMarkers : defaultBounds;
	const latLngs = Object.keys(markers).map(key => {
		return L.latLng(markers[key].geoposition.latitude, markers[key].geoposition.longitude);
	});
	return L.latLngBounds(latLngs);
};

export default getLatLngBounds;
