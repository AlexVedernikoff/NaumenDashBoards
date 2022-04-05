// @flow
import L from 'leaflet';

const activeMarker = () => (`<svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 17 17" fill="none"><path d="M16.75 8.49C16.75 13.05 13.05 16.75 8.5 16.75C3.94 16.75 0.25 13.05 0.25 8.49C0.25 3.94 3.94 0.24 8.5 0.24C13.05 0.24 16.75 3.94 16.75 8.49Z" fill="#C4C4C4" stroke="#084782" stroke-width="0.5"/><path d="M1 5L8.5 16L16 5" stroke="#084782" stroke-width="0.5"/></svg>`);
const clutchMarker = () => (`<svg xmlns="http://www.w3.org/2000/svg" width="40" height="34" viewBox="0 0 15 13" fill="none"><path d="M1 6.5L7.5 1L14 6.5L7.5 12L1 6.5Z" fill="#084782"/><path d="M1 6.5L7.5 1L14 6.5M1 6.5L7.5 12L14 6.5M1 6.5H14" stroke="black"/></svg>`);
const crossMarker = () => (`<svg xmlns="http://www.w3.org/2000/svg" width="50" height="47" viewBox="0 0 14 13" fill="none"><path d="M1 5.97V8.23H7H13V5.97H7H1Z" fill="#3288D8"/><path d="M1 1V3.71H13V1H7H1Z" fill="#3288D8"/><path d="M13 3.71H1V5.97H7H13V3.71Z" fill="#3288D8"/><path d="M1 3.71V1H7H13V3.71M1 3.71H13M1 3.71V5.97M13 3.71V5.97M1 5.97V8.23M1 5.97H7H13M13 5.97V8.23M1 8.23V12H7H13V8.23M1 8.23H7H13" stroke="#1B1464"/></svg>`);
const staticMarker = color => (`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"><circle cx="12" cy="12" r="12" fill="${color}"/><circle cx="12" cy="12" r="2" fill="#fff"/></svg>`);

const environment = process.env.NODE_ENV;

const defaultIconMarker = (type: string, isActive: boolean) => {
	let icon = '';

	switch (type) {
		case 'active':
			icon = activeMarker();
			break;
		case 'cross':
			icon = crossMarker();
			break;
		case 'clutch':
			icon = clutchMarker();
			break;
		case 'passive':
			icon = staticMarker('#3c6d9c');
			break;
		default:
			icon = staticMarker('#393e47');
	}

	const blob = new Blob([icon], {type: 'image/svg+xml'});
	const url = URL.createObjectURL(blob);

	const iconData = {
		className: `${type}-type ${isActive && 'active'}`,
		iconRetinaUrl: url,
		iconUrl: url
	};

	return new L.Icon(iconData);
};

const customIconMarker = (iconName: string, isActive: boolean) => {
	const iconData = {
		className: `custom-type ${isActive && 'active'}`,
		iconRetinaUrl: iconName,
		iconUrl: iconName
	};

	return new L.Icon(iconData);
};

export const getCustomOrDefaultIconMarker = (type: string, isActive: boolean, iconName?: string) => {
	let iconMarker = defaultIconMarker(type, isActive);

	if (iconName && (environment !== 'development')) {
		iconMarker = customIconMarker(iconName, isActive);
	}

	return iconMarker;
};
