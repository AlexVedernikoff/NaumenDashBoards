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
		if (widgets[key].layout.y > nextRow) {
			nextRow = widgets[key].layout.y;
		}
	});

	return nextRow ? nextRow.y + 1 : nextRow;
};
