// @flow
import type {LayoutItem} from 'utils/layout/types';

class NewWidget {
	static id: string = 'new';

	aggregate: null = null;
	breakdown: null = null;
	chart: null = null;
	color: Array<string> = [
		'#EA3223',
		'#999999',
		'#2C6FBA',
		'#4EAD5B',
		'#DE5D30',
		'#67369A',
		'#F6C142',
		'#4CAEEA',
		'#A1BA66',
		'#B02318',
		'#536130',
		'#DCA5A2',
		'#928A5B',
		'#9BB3D4',
		'#8C4A1C',
		'#FFFE55'
	]
	desc: string = '';
	group: null = null;
	id: string = NewWidget.id;
	isLegendShown: boolean = false;
	isNameShown: boolean = true;
	areAxisesNamesShown: boolean = false;
	areAxisesLabelsShown: boolean = false;
	areAxisesMeaningsShown: boolean = false;
	layout: LayoutItem = {
		h: 3,
		i: NewWidget.id,
		w: 4,
		x: 0,
		y: 0
	};
	legendPosition: null = null;
	name: string = 'Новый виджет';
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
