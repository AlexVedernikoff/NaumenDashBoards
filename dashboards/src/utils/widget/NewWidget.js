// @flow
import {DEFAULT_HEADER_SETTINGS} from 'components/molecules/Diagram/constants';
import {FIELDS} from 'WidgetFormPanel';
import type {LayoutItem} from 'utils/layout/types';
import {LAYOUT_MODE} from 'store/dashboard/constants';
import uuid from 'tiny-uuid';
import {WIDGET_TYPES} from 'store/widgets/data/constants';

class NewWidget {
	static id: string = 'new';
	computedAttrs = [];
	data: Array<Object> = [];
	displayMode: string = LAYOUT_MODE.WEB;
	header = DEFAULT_HEADER_SETTINGS;
	id: string = NewWidget.id;
	layout: LayoutItem = {
		h: 4,
		i: NewWidget.id,
		w: 4,
		x: 0,
		y: 0
	};
	mkLayout: LayoutItem = {
		h: 4,
		i: NewWidget.id,
		w: 12,
		x: 0,
		y: 0
	};
	name: string = '';
	type: string = WIDGET_TYPES.COLUMN;

	/**
	 * Устанавливаем начальную позицию по вертикали.
	 * @param {number} nextRow - следующая строка на которой должен быть размещен виджет
	 * @param {string} layoutMode - режим отображения виджета
	 */
	constructor (nextRow: number, layoutMode: string = LAYOUT_MODE.WEB) {
			this.data.push({
				[FIELDS.dataKey]: uuid(),
				[FIELDS.descriptor]: '',
				[FIELDS.sourceForCompute]: false
			});
			this.displayMode = layoutMode;
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
