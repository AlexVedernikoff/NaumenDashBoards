// @flow
import type {LayoutItem} from 'types/layout';

class NewWidget {
	static id: string = 'new';

	aggregate: null = null;
	chart: null = null;
	desc: string = '';
	group: null = null;
	id: string = NewWidget.id;
	isNameShown: boolean = true;
	layout: LayoutItem = {
		h: 3,
		i: NewWidget.id,
		w: 4,
		x: 0,
		y: 0
	};
	name: string = '';
	source: null = null;
	xAxis: null = null;
	yAxis: null = null;

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
