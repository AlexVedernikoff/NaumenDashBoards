// @flow
import commonCase from './__cases__/axis/common.json';
import {compareFormatter} from './helpers';
import computeDiv100 from './__cases__/axis/computeDiv100.json';
import defaultPercent from './__cases__/axis/defaultPercent.json';
import {getAxisFormatter} from 'utils/chart/mixins/formater';
import line12451Case from './__cases__/axis/line12451.json';
import notationAdditionCase from './__cases__/axis/notation_addition.json';
import percentCase from './__cases__/axis/percent.json';

const makeAxisCase = (data: Object) => {
	const {container, labels, widget} = data;
	const formatter = getAxisFormatter(widget, labels, container);

	if (formatter.options && data.options) {
		expect(formatter.options).toEqual(data.options);
	}

	compareFormatter(data.dataLabel, formatter.dataLabel);
	compareFormatter(data.indicator, formatter.indicator);
	compareFormatter(data.legend, formatter.legend);
	compareFormatter(data.parameterDefault, formatter.parameter.default);
	compareFormatter(data.parameterOverlapped, formatter.parameter.overlapped);
};

describe('Axis cases test', () => {
	it('общий кейс', () => makeAxisCase(commonCase));
	it('проценты', () => makeAxisCase(percentCase));
	it('проценты заданы атрибутом, форматирование не задано', () => makeAxisCase(defaultPercent));
	it('нотации с дополнительным обозначением', () => makeAxisCase(notationAdditionCase));
	it('SMRMEXT-12451', () => makeAxisCase(line12451Case));
	it('SMRMEXT-12501', () => makeAxisCase(computeDiv100));
});
