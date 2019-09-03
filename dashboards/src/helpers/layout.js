// @flow
import type {LastPosition} from 'types/layout';
import type {Widget} from 'entities';

/**
 * Получаем последнюю позицию виджета на дашборде
 * @param {Widget[]} widgets - массив виджетов дашборда
 * @returns {LastPosition} - позиция последнего элемента в сетке дашборда
 */
export const getLastPosition = (widgets: Widget[]): LastPosition => {
	let lastLayout;
	widgets.forEach(({layout}) => {
		if (!lastLayout || (layout.y > lastLayout.y ||
			(layout.x > lastLayout.x && layout.y >= lastLayout.y))) {
			lastLayout = layout;
		}
	});

	if (lastLayout) {
		return {
			x: lastLayout.x + lastLayout.w,
			y: lastLayout.y
		}
	}
};
