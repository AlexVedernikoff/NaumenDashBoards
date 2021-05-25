// @flow
type LatLng ={
	lat: number,
	lng: number
};

export type LatLngBounds = {
	_northEast: LatLng,
	_southWest: LatLng
};
