// @flow
import defaultBounds from './defaultBounds';
import L from 'leaflet';
import {NAME_POINT_TYPE} from 'types/equipment';
import {NAME_SECTION_TYPE} from 'types/part';

const boundsOneMarker = marker => {
	const bounds = [{...marker.geoposition}, {...marker.geoposition}];
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

export const getLatLngBounds = (dataMarkers: Array<Trail>) => {
	let bounds = dataMarkers.reduce((acc, curr) => {
		curr.equipments && acc.push(...curr.equipments);
		return acc;
	}, []).map(equipment => ({
			geoposition: equipment.geopositions[0]
		}));

	if (bounds.length < 1) {
		bounds = dataMarkers.reduce((acc, curr) => {
			curr.parts && acc.push(...curr.parts);
			return acc;
		}, []).map(part => ({
			geoposition: part.geopositions[0]
		}));
	}

	if (bounds.length < 1) {
		bounds = dataMarkers.filter(marker => marker.type === NAME_POINT_TYPE || marker.type === NAME_SECTION_TYPE)
			.map(marker => ({
				geoposition: marker.geopositions[0]
			}));
	}

	if (bounds.length === 1) {
		return boundsOneMarker(bounds[0]);
	}

	const markers = bounds.length >= 2 ? bounds : defaultBounds;
	const latLngs = markers.map(marker => {
		if (marker.geoposition) {
			return L.latLng(marker.geoposition.latitude, marker.geoposition.longitude);
		}
	});

	return L.latLngBounds(latLngs);
};

export default getLatLngBounds;
