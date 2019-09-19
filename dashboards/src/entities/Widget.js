// @flow
import {breakpoints, cols} from 'constants/layout';
import type {LastPosition, LayoutItem} from 'types/layout';
import uuid from 'tiny-uuid';

class Widget {
	description: string;
	id: string;
	isEditable: boolean;
	isNameShown: boolean;
	name: string = 'Название виджета';
	layout: LayoutItem = {
		i: '',
		x: 0,
		y: 0,
		w: 1,
		h: 1
	};

	/**
	 * Устанавливаем id нового виджета, для дальнейшего использования
	 * в виде ключа в сетке виджетов. Также устанавливаем начальную позицию.
	 * @param {LastPosition} lastPosition - позиция последнего виджета на сетке дашборда
	 */
	constructor (lastPosition: LastPosition) {
		const id = uuid();
		this.id = id;
		this.layout.i = id;

		this.setStartPosition(lastPosition)
	}

	/**
	 * В случае если переданы данные позиции предыдущего виджета,
	 * расчитываем, отталкиваясь от текущего размера экрана, координаты для текущего.
	 * Если элемент не помещается, переносим его на начало следующей строки.
	 * @param {LastPosition} lastPosition - позиция последнего виджета на сетке дашборда
	 * @returns {undefined}
	 */
	setStartPosition (lastPosition: LastPosition) {
		if (lastPosition) {
			const width = window.innerWidth;
			let {x, y} = lastPosition;
			let currentBreackpoint;

			Object.keys(breakpoints).forEach(key => {
				if (!currentBreackpoint || (width > breakpoints[key] &&
					breakpoints[key] > breakpoints[currentBreackpoint])) {
					currentBreackpoint = key;
				}
			});

			if (currentBreackpoint && cols[currentBreackpoint] < (x + this.layout.w)) {
				x = 0;
				y += 1;
			}

			this.layout = {...this.layout, x, y};
		}
	}
}

export default Widget;
