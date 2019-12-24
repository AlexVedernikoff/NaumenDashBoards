// @flow
import type {LayoutItem} from 'utils/layout/types';

class NewWidget {
	static id: string = 'new';
	diagramName: string = '';
	id: string = NewWidget.id;
	layout: LayoutItem = {
		h: 4,
		i: NewWidget.id,
		w: 4,
		x: 0,
		y: 0
	};
	name: string = 'Новый виджет';

	/**
	 * Устанавливаем начальную позицию по вертикали.
	 * @param {number} nextRow - следующая строка на которой должен быть размещен виджет
	 */
	constructor (nextRow: number) {
		this.setRow(nextRow);
	}

	/**
	 * Устанавливаем начальную позицию по вертикали
	 * @param {number} nextRow - следующая строка на которой должен быть размещен виджет
	 * @returns {undefined}
	 */
	setRow (nextRow: number) {
		this.layout = {...this.layout, y: nextRow};
	}
}

export default NewWidget;
