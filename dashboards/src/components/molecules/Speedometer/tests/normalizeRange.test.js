import {normalizingRanges} from '../helpers';
import {RANGES_TYPES} from 'store/widgets/data/constants';

const emptyFormatter = (val: number) => val.toString();

describe('normalizingRanges test', () => {
	it('empty range', () => {
		const emptyRange = normalizingRanges([], RANGES_TYPES.ABSOLUTE, 0, 100, '#000', emptyFormatter);

		expect(emptyRange).toEqual([{color: '#000', from: 0, legendText: '0 - 100', text: '100', to: 100}]);

		const emptyRange2 = normalizingRanges([], RANGES_TYPES.ABSOLUTE, 0, 1000, '#001', emptyFormatter);

		expect(emptyRange2).toEqual([{color: '#001', from: 0, legendText: '0 - 1000', text: '1000', to: 100}]);

		const emptyRange3 = normalizingRanges([], RANGES_TYPES.ABSOLUTE, 0, 321, '#021', emptyFormatter);

		expect(emptyRange3).toEqual([{color: '#021', from: 0, legendText: '0 - 321', text: '321', to: 100}]);
	});

	it('first - stop range', () => {
		const firstRange = normalizingRanges([{color: '#100', from: 0, to: 50}], RANGES_TYPES.ABSOLUTE, 0, 100, '#000', emptyFormatter);

		expect(firstRange).toEqual([
			{color: '#100', from: 0, legendText: '0 - 50', text: '50', to: 50},
			{color: '#000', from: 50, legendText: '50 - 100', text: '100', to: 100}
		]);

		const stopRange = normalizingRanges([{color: '#100', from: 50, to: 100}], RANGES_TYPES.ABSOLUTE, 0, 100, '#000', emptyFormatter);

		expect(stopRange).toEqual([
			{color: '#000', from: 0, legendText: '0 - 50', text: '50', to: 50},
			{color: '#100', from: 50, legendText: '50 - 100', text: '100', to: 100}
		]);
	});

	it('2 full ranges', () => {
		const twoRange = normalizingRanges([
			{color: '#100', from: 0, to: 50},
			{color: '#200', from: 50, to: 100}
		], RANGES_TYPES.ABSOLUTE, 0, 100, '#000', emptyFormatter);

		expect(twoRange).toEqual([
			{color: '#100', from: 0, legendText: '0 - 50', text: '50', to: 50},
			{color: '#200', from: 50, legendText: '50 - 100', text: '100', to: 100}
		]);
	});

	it('brake range', () => {
		const brakeRange = normalizingRanges([{color: '#100', from: 20, to: 70}], RANGES_TYPES.ABSOLUTE, 0, 100, '#000', emptyFormatter);

		expect(brakeRange).toEqual([
			{color: '#000', from: 0, legendText: '0 - 20', text: '20', to: 20},
			{color: '#100', from: 20, legendText: '20 - 70', text: '70', to: 70},
			{color: '#000', from: 70, legendText: '70 - 100', text: '100', to: 100}
		]);
	});

	it('2 brake range', () => {
		const twoRange = normalizingRanges([
			{color: '#100', from: 10, to: 40},
			{color: '#200', from: 70, to: 80}
		], RANGES_TYPES.ABSOLUTE, 0, 100, '#000', emptyFormatter);

		expect(twoRange).toEqual([
			{color: '#000', from: 0, legendText: '0 - 10', text: '10', to: 10},
			{color: '#100', from: 10, legendText: '10 - 40', text: '40', to: 40},
			{color: '#000', from: 40, legendText: '40 - 70', text: '70', to: 70},
			{color: '#200', from: 70, legendText: '70 - 80', text: '80', to: 80},
			{color: '#000', from: 80, legendText: '80 - 100', text: '100', to: 100}
		]);
	});

	it('not sort ranges', () => {
		const twoRange = normalizingRanges([
			{color: '#200', from: 40, to: 50},
			{color: '#100', from: 10, to: 40}
		], RANGES_TYPES.ABSOLUTE, 0, 100, '#000', emptyFormatter);

		expect(twoRange).toEqual([
			{color: '#000', from: 0, legendText: '0 - 10', text: '10', to: 10},
			{color: '#100', from: 10, legendText: '10 - 40', text: '40', to: 40},
			{color: '#200', from: 40, legendText: '40 - 50', text: '50', to: 50},
			{color: '#000', from: 50, legendText: '50 - 100', text: '100', to: 100}
		]);
	});

	it('2 brake range inside', () => {
		const twoRange = normalizingRanges([
			{color: '#100', from: 100, to: 600},
			{color: '#200', from: 500, to: 800}
		], RANGES_TYPES.ABSOLUTE, 0, 1000, '#000', emptyFormatter);

		expect(twoRange).toEqual([
			{color: '#000', from: 0, legendText: '0 - 100', text: '100', to: 10},
			{color: '#100', from: 10, legendText: '100 - 600', text: '600', to: 60},
			{color: '#200', from: 60, legendText: '600 - 800', text: '800', to: 80},
			{color: '#000', from: 80, legendText: '800 - 1000', text: '1000', to: 100}
		]);
	});

	it('no zero min', () => {
		const noZeroMin = normalizingRanges([
			{color: '#100', from: 100, to: 600},
			{color: '#200', from: 500, to: 800}
		], RANGES_TYPES.ABSOLUTE, 100, 1100, '#000', emptyFormatter);

		expect(noZeroMin).toEqual([
			{color: '#100', from: 0, legendText: '100 - 600', text: '600', to: 50},
			{color: '#200', from: 50, legendText: '600 - 800', text: '800', to: 70},
			{color: '#000', from: 70, legendText: '800 - 1100', text: '1100', to: 100}
		]);
	});

	it('precent', () => {
		const percentRange = normalizingRanges([
			{color: '#100', from: 10, to: 40}
		], RANGES_TYPES.PERCENT, 0, 1000, '#000', emptyFormatter);

		expect(percentRange).toEqual([
			{color: '#000', from: 0, legendText: '0 - 100', text: '100', to: 10},
			{color: '#100', from: 10, legendText: '100 - 400', text: '400', to: 40},
			{color: '#000', from: 40, legendText: '400 - 1000', text: '1000', to: 100}
		]);

		const percentRangeNoMin = normalizingRanges([
			{color: '#100', from: 20, to: 40}
		], RANGES_TYPES.PERCENT, 250, 750, '#000', emptyFormatter);

		expect(percentRangeNoMin).toEqual([
			{color: '#000', from: 0, legendText: '250 - 350', text: '350', to: 20}, // 250+(750-250)*0.2=350
			{color: '#100', from: 20, legendText: '350 - 450', text: '450', to: 40}, // 250+(750-250)*0.4=450
			{color: '#000', from: 40, legendText: '450 - 750', text: '750', to: 100}
		]);
	});

	it('empty precent', () => {
		const percentRange = normalizingRanges([], RANGES_TYPES.PERCENT, 0, 325, '#000', emptyFormatter);

		expect(percentRange).toEqual([{color: '#000', from: 0, legendText: '0 - 325', text: '325', to: 100}]);

		const percentRange2 = normalizingRanges([], RANGES_TYPES.PERCENT, 175, 325, '#000', emptyFormatter);

		expect(percentRange2).toEqual([{color: '#000', from: 0, legendText: '175 - 325', text: '325', to: 100}]);
	});

	it('end break', () => {
		const percentRange = normalizingRanges([
			{color: '#001', from: 0, to: 25},
			{color: '#002', from: 25, to: 50},
			{color: '#003', from: 50, to: 75},
			{color: '#004', from: 75, to: 100}
		], RANGES_TYPES.PERCENT, 0, 100000, '#000', emptyFormatter);

		expect(percentRange).toEqual([
			{color: '#001', from: 0, legendText: '0 - 25000', text: '25000', to: 25},
			{color: '#002', from: 25, legendText: '25000 - 50000', text: '50000', to: 50},
			{color: '#003', from: 50, legendText: '50000 - 75000', text: '75000', to: 75},
			{color: '#004', from: 75, legendText: '75000 - 100000', text: '100000', to: 100}
		]);
	});
});
