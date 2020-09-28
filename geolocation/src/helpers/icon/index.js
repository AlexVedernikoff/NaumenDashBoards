// @flow
import type {IconName} from 'types/helper';
import L from 'leaflet';

const staticMarker = (color) => (`<svg width="16" height="24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M8 0C3.58 0 0 3.76 0 8.4 0 14.7 8 24 8 24s8-9.3 8-15.6C16 3.76 12.42 0 8 0z" fill="${color}"/><circle cx="8" cy="8" r="2" fill="#fff"/></svg>`);
const staticMarkerHover = (color) => (`<svg width="20" height="31" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M10 0C4.47 0 0 4.85 0 10.85 0 18.99 10 31 10 31s10-12.01 10-20.15C20 4.85 15.53 0 10 0z" fill="${color}"/><circle cx="10" cy="9.25" r="2.5" fill="#fff"/></svg>`);
const multipleMarker = (color) => (`<svg width="26" height="32" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M8 8c-4.42 0-8 3.76-8 8.4C0 22.7 8 32 8 32s8-9.3 8-15.6C16 11.76 12.42 8 8 8z" fill="${color}"/><circle cx="8" cy="16" r="2" fill="#fff"/></svg>`);
const multipleMarkerHover = (color) => (`<svg width="29" height="37" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M10 6C4.47 6 0 10.85 0 16.85 0 24.99 10 37 10 37s10-12.01 10-20.15C20 10.85 15.53 6 10 6z" fill="${color}"/><circle cx="10" cy="15.25" r="2.5" fill="#fff"/></svg>`);
const dynamicMarker = (color) => (`<svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="12" fill="${color}"/><circle cx="12" cy="12" r="2" fill="#fff"/></svg>`);
const dynamicMarkerHover = () => (`<svg width="32" height="41" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17.92 35.92c.46-2.49 2.47-4.32 4.77-5.38a16 16 0 10-13.38 0c2.3 1.06 4.31 2.9 4.77 5.38l.74 4.1a1.2 1.2 0 002.36 0l.74-4.1z" fill="#EB5757"/><path d="M16 26c-2.57 0-4.95-.74-6.93-2.02a2.27 2.27 0 01-.91-2.74c.87-2.22 2.26-2.99 5.11-4.42.58-.18.88-.76.7-1.3-.06-.1-.12-.2-.2-.28l-1.16-1.78a3.62 3.62 0 01-.5-2.8l.25-.8c.2-.84.7-1.58 1.4-2.1 1.36-.99 3.2-1.01 4.59-.06a3.69 3.69 0 011.54 2.38l.14.74c.16.9-.03 1.82-.55 2.6l-1.25 1.84a.68.68 0 00-.19.3.99.99 0 00.7 1.29c2.84 1.4 4.22 2.17 5.1 4.39.4 1 .02 2.14-.91 2.74A12.74 12.74 0 0116 26z" fill="#fff"/></svg>`);
const groupMarker = () => (`<svg width="26" height="32" viewBox="0 0 26 32" fill="none" xmlns="http://www.w3.org/2000/svg"><mask id="mask0" mask-type="alpha" maskUnits="userSpaceOnUse" x="0" y="8" width="16" height="24"><path fill-rule="evenodd" clip-rule="evenodd" d="M8 8C3.57714 8 0 11.756 0 16.4C0 22.7 8 32 8 32C8 32 16 22.7 16 16.4C16 11.756 12.4229 8 8 8Z" fill="#EB5757"/></mask><g mask="url(#mask0)"><path d="M-2 7C-2 5.89543 -1.10457 5 -1.78814e-08 5H8V16H-2V7Z" fill="#87DED1"/><path d="M8 4H19C20.1046 4 21 4.89543 21 6V16H8V4Z" fill="#7DC1E8"/><path d="M0 16H8V36H0V16Z" fill="#BDDE87"/><path d="M8 16H20V34C20 35.1046 19.1046 36 18 36H8V16Z" fill="#DE87C0"/><path d="M8 18C9.10457 18 10 17.1046 10 16C10 14.8954 9.10457 14 8 14C6.89543 14 6 14.8954 6 16C6 17.1046 6.89543 18 8 18Z" fill="white"/></g></svg>`);
const groupMarkerHover = () => (`<svg width="29" height="37" viewBox="0 0 29 37" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0)"><mask id="mask0" mask-type="alpha" maskUnits="userSpaceOnUse" x="0" y="6" width="20" height="31"><path fill-rule="evenodd" clip-rule="evenodd" d="M10 6C4.47143 6 0 10.8515 0 16.85C0 24.9875 10 37 10 37C10 37 20 24.9875 20 16.85C20 10.8515 15.5286 6 10 6Z" fill="#EB5757"/></mask><g mask="url(#mask0)"><path d="M-2 5C-2 3.89543 -1.10457 3 5.96046e-08 3H10V18H-2V5Z" fill="#87DED1"/><path d="M10 2H23C24.1046 2 25 2.89543 25 4V18H10V2Z" fill="#7DC1E8"/><path d="M0 15H10V39H0V15Z" fill="#BDDE87"/><path d="M10 15H24V37C24 38.1046 23.1046 39 22 39H10V15Z" fill="#DE87C0"/><rect x="7.5" y="12.66" width="5" height="5" rx="2.5" fill="white"/></g></g><defs><clipPath id="clip0"><rect width="29" height="37" fill="white"/></clipPath></defs></svg>`);

export const iconMarker = (iconName: IconName, color: string) => {
	let icon = '';

	switch (iconName) {
		case 'static':
			icon = staticMarker(color);
			break;
		case 'staticHover':
			icon = staticMarkerHover(color);
			break;
		case 'dynamic':
			icon = dynamicMarker(color);
			break;
		case 'dynamicHover':
			icon = dynamicMarkerHover();
			break;
		default:
			icon = dynamicMarker(color);
	}

	const blob = new Blob([icon], {type: 'image/svg+xml'});
	const url = URL.createObjectURL(blob);

	const iconData = {
		iconUrl: url,
		iconRetinaUrl: url,
		className: iconName
	};

	return new L.Icon(iconData);
};

export const divIconMarker = (iconName: IconName, color: string, count: number) => {
	let icon = '';
	let borderColor = color ? '#EB5757' : '#70ADD0';

	switch (iconName) {
		case 'multiple':
			if (color) {
				icon = multipleMarker(color);
				borderColor = color;
			} else {
				icon = groupMarker();
			}
			break;
		case 'multipleHover':
			if (color) {
				icon = multipleMarkerHover(color);
				borderColor = color;
			} else {
				icon = groupMarkerHover();
			}
			break;
		default:
			icon = multipleMarker(color);
	}

	const blob = new Blob([icon], {type: 'image/svg+xml'});
	const url = URL.createObjectURL(blob);

	const countHtml = `<div class="boxCount" style='border: 1px solid ${borderColor}'>${count.toString()}</div>`;

	const divIconData = {
		html: `<div class="${iconName}"><img src=${url} /><div class='countMarker'>${countHtml}</div></div>`
	};

	// eslint-disable-next-line new-cap
	return new L.divIcon(divIconData);
};
