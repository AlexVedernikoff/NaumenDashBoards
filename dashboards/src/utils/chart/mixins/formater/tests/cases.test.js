// @flow
import commonCase from './__cases__/common.json'
import {getAxisFormatter} from 'utils/chart/mixins/formater';
import percentCase from './__cases__/percent.json'
import notationAdditionCase from './__cases__/notation_addition.json'
import line12451Case from './__cases__/line12451.json'
import type {NumberFormatter, ValueFormatter} from 'utils/chart/mixins/formater/types';


const compareFormatter = (data: ?[(string|number), string], formatter: (string|number) => string) => {
	if (data) {
		data.forEach(([item, value]) => {
			expect(formatter(item)).toEqual(value);
		})
	}
}

const makeCase = (data: Object) => {
	const {widget, labels, container} = data;
	const formatter = getAxisFormatter(widget, labels, container);
	if (formatter.options && data.options) {
		expect(formatter.options).toEqual(data.options);
	}
	compareFormatter(data.dataLabel, formatter.dataLabel);
	compareFormatter(data.indicator, formatter.indicator);
	compareFormatter(data.legend, formatter.legend);
	compareFormatter(data.parameterDefault, formatter.parameter.default);
	compareFormatter(data.parameterOverlapped, formatter.parameter.overlapped);
}

describe('Cases test', () => {

	it(`общий кейс`, () => makeCase(commonCase));
	it(`проценты`, () => makeCase(percentCase));
	it(`нотации с дополнительным обозначением`, () => makeCase(notationAdditionCase));
	it('SMRMEXT-12451', () => makeCase(line12451Case));

});
