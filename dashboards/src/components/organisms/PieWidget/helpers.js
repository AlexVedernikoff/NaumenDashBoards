// @flow

/**
 * Генерирует из цвета color новый цвет с яркостью lightness
 * @param {string} color - изначальный цвет
 * @param {number} lightness - процент яркости
 * @returns {string} - цвет с оттенком из color и яркостью lightness
 */
export const darkenColor = (color: string, lightness: number = 0.1): string => {
	const normalColorItem = val => Math.min(Math.max(val, 0), 255);
	const numberColor = parseInt(color[0] === '#' ? color.slice(1) : color, 16);
	let r = normalColorItem((numberColor >> 16));
	let g = normalColorItem(((numberColor >> 8) & 0x00FF));
	let b = normalColorItem((numberColor & 0x0000FF));
	const ext = Math.min(r, g, b) * (1 - lightness);

	r -= ext;
	g -= ext;
	b -= ext;

	let result = (b | (g << 8) | (r << 16)).toString(16);

	if (r < 128) {
		result = '0' + result;
	}

	return '#' + result;
};
