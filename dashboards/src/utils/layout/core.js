// @flow
import type {WidgetMap} from 'store/widgets/data/types';

/**
 * Получаем последнюю позицию виджета по оси Y на дашборде
 * @param {WidgetMap} widgets - виджеты дашборда
 * @returns {number} - следующая позиция по вертикали для нового виджета
 */
export const getNextRow = (widgets: WidgetMap): number => {
	let nextRow = 0;
	Object.keys(widgets).forEach(key => {
		const {h, y} = widgets[key].layout;

		if (y >= nextRow) {
			nextRow = y + h;
		}
	});

	return nextRow;
};
