// @flow
import {
	additionalFormat,
	checkInfinity,
	checkNumber,
	checkString,
	checkZero,
	defaultNumberFormatter,
	defaultStringFormatter,
	formatMSInterval,
	getLabelFormatter,
	loggerFormatter,
	makeFormatterByFormat,
	makeFormatterByNumberFormat,
	notationConverter,
	percentFormat,
	sevenDaysFormatter
} from 'utils/recharts/formater/helpers'
import {AXIS_FORMAT_TYPE, LABEL_FORMATS, NOTATION_FORMATS} from 'store/widgets/data/constants';


const numberFormat = {
	additional: '$',
	notation: NOTATION_FORMATS.THOUSAND,
	splitDigits: true,
	symbolCount: 2,
	type: AXIS_FORMAT_TYPE.NUMBER_FORMAT
}

const labelFormat = {
	labelFormat: LABEL_FORMATS.TITLE_CODE,
	type: AXIS_FORMAT_TYPE.LABEL_FORMAT
}


describe('Formatters test', () => {

	it('loggerFormatter', () => {
		const formatter = loggerFormatter((x) => x);
		expect(formatter(1)).toBe(1);
		expect(formatter('test')).toBe('test');
	})

	it('checkInfinity', () => {
		const formatter = checkInfinity((n: number) => 'success');

		expect(formatter(Infinity)).toBe('');
		expect(formatter(1)).toBe('success');
		expect(formatter(0)).toBe('success');
		expect(formatter(-1)).toBe('success');
		expect(formatter(Number.EPSILON)).toBe('success');
		expect(formatter(Number.MAX_VALUE)).toBe('success');
	});

	it('checkZero', () => {
		const formatter = checkZero((n: number) => 'success');

		expect(formatter(0)).toBe('');
		expect(formatter(1)).toBe('success');
		expect(formatter(-1)).toBe('success');
		expect(formatter(Number.EPSILON)).toBe('success');
		expect(formatter(Number.MAX_VALUE)).toBe('success');
		expect(formatter(Infinity)).toBe('success');
	});

	it('checkString', () => {
		const formatter = checkString((str: string) => `#${str}#`);

		expect(formatter(0)).toBe('#0#');
		expect(formatter(1)).toBe('#1#');
		expect(formatter(-1)).toBe('#-1#');
		expect(formatter('')).toBe('##');
		expect(formatter('test')).toBe('#test#');
	});

	it('checkNumber', () => {
		const formatter = checkNumber((n: number) => n);

		expect(formatter(0)).toBe(0);
		expect(formatter(1)).toBe(1);
		expect(formatter(-1)).toBe(-1);
		expect(formatter('')).toBe('');
		expect(formatter('1')).toBe(1);
		expect(formatter('-1')).toBe(-1);
		expect(formatter(NaN)).toBe(NaN);
	});


	it('defaultStringFormatter', () => {
		const formatter = defaultStringFormatter;

		expect(formatter('')).toBe('');
		expect(formatter('1')).toBe('1');
		expect(formatter('test')).toBe('test');
	});

	it('defaultNumberFormatter', () => {
		const formatter0 = defaultNumberFormatter(0);
		const formatter2 = defaultNumberFormatter(2);

		expect(formatter0(1)).toBe('1');
		expect(formatter0(-1)).toBe('-1');
		expect(formatter0(1.1)).toBe('1');
		expect(formatter0(1.6)).toBe('2');

		expect(formatter2(1)).toBe('1.00');
		expect(formatter2(Math.PI)).toBe('3.14');
	});

	it('additionalFormat', () => {
		expect(additionalFormat('')('')).toBe('');
		expect(additionalFormat('')('1')).toBe('1');
		expect(additionalFormat('%')('')).toBe('');
		expect(additionalFormat('%')('1')).toBe('1%');
	});

	it('percentFormat', () => {
		expect(percentFormat('')).toBe('');
		expect(percentFormat('1')).toBe('1%');
	});

	it('sevenDaysFormatter', () => {
		expect(sevenDaysFormatter('')).toBe('');
		expect(sevenDaysFormatter('12345')).toBe('');
		expect(sevenDaysFormatter('1.1.2000-1.2.2000')).toBe('01 января - 01 февраля');
		expect(sevenDaysFormatter('13.13.2000-1.1.2000')).toBe('');
		expect(sevenDaysFormatter('1.1.2000-13.13.2000')).toBe('');
	});

	it('notationConverter', () => {
		const thousandFormatter = notationConverter(NOTATION_FORMATS.THOUSAND, defaultNumberFormatter(0));
		const millionFormatter = notationConverter(NOTATION_FORMATS.MILLION, defaultNumberFormatter(0));
		const billionFormatter = notationConverter(NOTATION_FORMATS.BILLION, defaultNumberFormatter(0));
		const trillionFormatter = notationConverter(NOTATION_FORMATS.TRILLION, defaultNumberFormatter(0));

		expect(thousandFormatter(1)).toBe('0тыс.');
		expect(thousandFormatter(1240)).toBe('1тыс.');
		expect(thousandFormatter(-1240)).toBe('-1тыс.');

		expect(millionFormatter(1)).toBe('0млн.');
		expect(millionFormatter(1240e3)).toBe('1млн.');
		expect(millionFormatter(-1240e3)).toBe('-1млн.');

		expect(billionFormatter(1)).toBe('0млрд.');
		expect(billionFormatter(1.240e9)).toBe('1млрд.');
		expect(billionFormatter(-1.240e9)).toBe('-1млрд.');

		expect(trillionFormatter(1)).toBe('0трлн.');
		expect(trillionFormatter(1.24e12)).toBe('1трлн.');
		expect(trillionFormatter(-1.24e12)).toBe('-1трлн.');
	});

	it('getLabelFormatter', () => {
		const titleFormatter = getLabelFormatter(LABEL_FORMATS.TITLE)
		const codeFormatter = getLabelFormatter(LABEL_FORMATS.CODE)
		const titleCodeFormatter = getLabelFormatter(LABEL_FORMATS.TITLE_CODE)

		expect(titleFormatter('title#code')).toBe('title');
		expect(titleFormatter('#code')).toBe('');
		expect(titleFormatter('title#')).toBe('title');
		expect(titleFormatter('title#title#code')).toBe('title#title');

		expect(codeFormatter('title#code')).toBe('code');
		expect(codeFormatter('#code')).toBe('code');
		expect(codeFormatter('title#')).toBe('');
		expect(codeFormatter('title#title#code')).toBe('code');

		expect(titleCodeFormatter('title#code')).toBe('title (code)');
		expect(titleCodeFormatter('#code')).toBe(' (code)');
		expect(titleCodeFormatter('title#')).toBe('title ()');
		expect(titleCodeFormatter('title#title#code')).toBe('title#title (code)');
	});

	it('makeFormatterByNumberFormat', () => {
		const formatter = makeFormatterByNumberFormat(numberFormat);

		expect(formatter(0)).toBe('');
		expect(formatter(1)).toBe('0.00тыс. $');
		expect(formatter(13245456)).toBe('13,245.46тыс. $');

		const formatter2 = makeFormatterByNumberFormat({...numberFormat, additional: null});
		expect(formatter2(1)).toBe('0.00тыс.');
	});

	it('makeFormatterByFormat', () => {
		const numberFormatter = makeFormatterByFormat(numberFormat);
		const labelFormatter = makeFormatterByFormat(labelFormat);
		const defaultFormatter = makeFormatterByFormat(null);

		expect(numberFormatter(0)).toBe('');
		expect(numberFormatter(13245456)).toBe('13,245.46тыс. $');
		expect(numberFormatter('test')).toBe('test');

		expect(labelFormatter(0)).toBe('0');
		expect(labelFormatter(13245456)).toBe('13245456');
		expect(labelFormatter('test#code')).toBe('test (code)');

		expect(defaultFormatter(0)).toBe('0');
		expect(defaultFormatter('test')).toBe('test');
		expect(defaultFormatter('test#code')).toBe('test');
	});

	it('makeFormatterByNumberFormatNullSymbolCount', () => {
		const formatter = makeFormatterByNumberFormat({...numberFormat, symbolCount: null, additional: null});

		expect(formatter(0)).toBe('');
		expect(formatter(1)).toBe('0тыс.');
		expect(formatter(9)).toBe('0тыс.');
		expect(formatter(10)).toBe('0.01тыс.');
		expect(formatter(1009)).toBe('1тыс.');
		expect(formatter(1019)).toBe('1.02тыс.');
	});

	it('formatMSInterval', () => {
		expect(formatMSInterval(0)).toBe('0')
		expect(formatMSInterval(100)).toBe('100')

		const sec = 1000;
		expect(formatMSInterval(1 * sec)).toBe(' 1 c')
		expect(formatMSInterval(15 * sec)).toBe(' 15 c')
		expect(formatMSInterval(15 * sec + 421)).toBe(' 15 с')

		const min = sec * 60;
		expect(formatMSInterval(1 * min)).toBe(' 1 мин')
		expect(formatMSInterval(6 * min)).toBe(' 6 мин')
		expect(formatMSInterval(4 * min + 25 * sec + 15)).toBe(' 4 мин 25 с')

		const hours = min * 60;
		expect(formatMSInterval(1 * hours)).toBe(' 1 ч')
		expect(formatMSInterval(2 * hours)).toBe(' 2 ч')
		expect(formatMSInterval(2 * hours + 20 * sec)).toBe(' 2 ч 20 с')
		expect(formatMSInterval(2 * hours + 1 * min + 25)).toBe(' 2 ч 60 с')
		expect(formatMSInterval(5 * hours + 14 * min + 25)).toBe(' 5 ч 840 с')

		const days = hours * 24;
		expect(formatMSInterval(1 * days)).toBe(' 1 д')
		expect(formatMSInterval(2 * days)).toBe(' 2 д')
		expect(formatMSInterval(5 * days + 14 * min + 25)).toBe(' 120 ч 840 с')
		expect(formatMSInterval(5 * days + 14 * min + 15 * sec)).toBe(' 120 ч 855 с')
		expect(formatMSInterval(5 * days + 2 * hours + 14 * min + 15 * sec)).toBe(' 122 ч 855 с')

		const week = days * 7;
		expect(formatMSInterval(1 * week)).toBe(' 1 нед')
		expect(formatMSInterval(2 * week)).toBe(' 2 нед')
		expect(formatMSInterval(2 * week + 14 * min + 25)).toBe(' 336 ч 840 с')
		expect(formatMSInterval(2 * week + 14 * min + 15 * sec)).toBe(' 336 ч 855 с')
		expect(formatMSInterval(2 * week + 2 * hours + 14 * min + 15 * sec)).toBe(' 338 ч 855 с')
		expect(formatMSInterval(2 * week + 3 * days + 2 * hours + 14 * min + 15 * sec)).toBe(' 410 ч 855 с')
	});
});