// @flow
import defaultBounds from './defaultBounds';

export const getLatLngBounds = (trail: Array<Trail>) => {
	const bounds = trail.reduce((acc, curr) => {
		const equipments = (curr.equipments || []).reduce((acc, equipments) => [...acc, ...equipments.geopositions], []);
		const parts = (curr.parts || []).reduce((acc, parts) => [...acc, ...parts.geopositions], []);

		return [
			...acc,
			...equipments,
			...parts,
			...curr.geopositions
		];
	}, []);

	const markers = (bounds.length >= 2 ? bounds : defaultBounds);

	return [
		[
			Math.min(...markers.map(item => item.latitude)),
			Math.max(...markers.map(item => item.latitude))
		],
		[
			Math.min(...markers.map(item => item.longitude)),
			Math.max(...markers.map(item => item.longitude))
		]
	];
};

export default getLatLngBounds;
