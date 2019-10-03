// @flow
import L from 'leaflet';

const staticMarker = (color) => (`<svg width="20" height="31" viewBox="0 0 20 31" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M10 0C4.47143 0 0 4.8515 0 10.85C0 18.9875 10 31 10 31C10 31 20 18.9875 20 10.85C20 4.8515 15.5286 0 10 0Z" fill="${color}"/><circle cx="10" cy="9.25" r="2.5" fill="white"/></svg>`);
const dynamicMarker = (color) => (`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="12" fill="${color}"/><circle cx="12" cy="12" r="2" fill="white"/></svg>`);

var urlIcon = (icon) => encodeURI('data:image/svg+xml,' + icon).replace('#', '%23');

export const iconMarker = (iconName: string, color: string) => {
	const icon = iconName === 'static' ? staticMarker(color) : dynamicMarker(color);
	const url = urlIcon(icon);

	const iconData = {
		iconUrl: url,
		iconRetinaUrl: url,
		className: iconName
	};

	return new L.Icon(iconData);
};
