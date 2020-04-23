// @flow
import {FIELDS} from 'WidgetFormPanel/constants';
import type {LayoutItem} from 'utils/layout/types';
import {WIDGET_TYPES} from 'store/widgets/data/constants';

class NewWidget {
	static id: string = 'new';
	diagramName: string = '';
	data: Array<Object> = [{
		[FIELDS.sourceForCompute]: false
	}];
	id: string = NewWidget.id;
	layout: LayoutItem = {
		h: 4,
		i: NewWidget.id,
		w: 4,
		x: 0,
		y: 0
	};
	name: string = '';
	type: string = WIDGET_TYPES.COLUMN;

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
