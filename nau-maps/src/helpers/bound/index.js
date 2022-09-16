// @flow
import defaultBounds from './defaultBounds';

export const getLatLngBounds = (trail: Array<Trail>) => {
	const bounds = trail.reduce((acc, curr) => {
		const equipments = (curr.equipments || []).map(item => item.geopositions).flat();
		const parts = (curr.parts || []).map(item => item.geopositions).flat();

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
			Math.min(...markers.map(item => item.longitude))
		],
		[
			Math.max(...markers.map(item => item.latitude)),
			Math.max(...markers.map(item => item.longitude))
		]
	];
};

export default getLatLngBounds;
