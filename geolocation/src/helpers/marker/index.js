// @flow
import {notify} from 'helpers/notify';
import type {Point} from 'types/point';

const showNotGeoNotifications = (notGeoMarkers: Array<Point>) => {
	const label = notGeoMarkers
		.sort((a, b) => a.type > b.type ? -1 : a.type < b.type ? 1 : 0)
		.map(marker => marker.header).join(', ') + '.';
	notify('geolocation', 'info', label);
};

export const getGeoMarkers = (markers: Array<Point>) => {
	const notGeoMarkers = [];
	const geoMarkers = {
		dynamic: [],
		multiple: [],
		static: []
	};

	markers.forEach((marker) => {
		const {geoposition, header} = marker;

		if (marker.hasOwnProperty('geoposition')) {
			const anotherOne = markers.find((markerTmp) =>
				marker.type !== 'dynamic'
				&& markerTmp.header !== marker.header
				&& JSON.stringify(markerTmp.geoposition) === JSON.stringify(geoposition)
			);

			if (anotherOne) {
				const multipleMarkerIndex = geoMarkers.multiple.findIndex(markerTmp => JSON.stringify(markerTmp.geoposition) === JSON.stringify(marker.geoposition));

				if (multipleMarkerIndex === -1) {
					geoMarkers.multiple.push({
						data: [marker],
						geoposition,
						header,
						type: 'multiple'
					});
				} else {
					geoMarkers.multiple[multipleMarkerIndex].data.push(marker);
				}
			} else {
				marker.type === 'dynamic' ? geoMarkers.dynamic.push(marker) : geoMarkers.static.push(marker);
			}
		} else {
			notGeoMarkers.push(marker);
		}
	});

	notGeoMarkers.length && showNotGeoNotifications(notGeoMarkers);

	return geoMarkers;
};
