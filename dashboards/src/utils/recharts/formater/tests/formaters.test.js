// @flow
import {
	additionalFormat,
	checkInfinity,
	checkNumber,
	checkString,
	checkZero,
	defaultNumberFormatter,
	defaultStringFormatter,
	formatDate,
	oldFormatMSInterval,
	formatMSInterval,
	getLabelFormatter,
	loggerFormatter,
	makeFormatterByFormat,
	makeFormatterByNumberFormat,
	notationConverter,
	percentFormat,
	sevenDaysFormatter
} from 'utils/recharts/formater/helpers'
import {AXIS_FORMAT_TYPE, DT_INTERVAL_PERIOD, LABEL_FORMATS, NOTATION_FORMATS} from 'store/widgets/data/constants';


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

const dtIntervalFormat = {
	quotient: DT_INTERVAL_PERIOD.HOURS,
	remainder: DT_INTERVAL_PERIOD.SECONDS,
	symbolCount: 0,
	type: AXIS_FORMAT_TYPE.DT_INTERVAL_FORMAT
}

const sec = 1000;
const min = sec * 60;
const hours = min * 60;
const days = hours * 24;
const week = days * 7;


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

	it('oldFormatMSInterval', () => {
		expect(oldFormatMSInterval(0)).toBe('0')
		expect(oldFormatMSInterval(100)).toBe('100')

		expect(oldFormatMSInterval(1 * sec)).toBe('1c')
		expect(oldFormatMSInterval(15 * sec)).toBe('15c')
		expect(oldFormatMSInterval(15 * sec + 421)).toBe('15с')

		expect(oldFormatMSInterval(1 * min)).toBe('1мин')
		expect(oldFormatMSInterval(6 * min)).toBe('6мин')
		expect(oldFormatMSInterval(4 * min + 25 * sec + 15)).toBe('4мин 25с')

		expect(oldFormatMSInterval(1 * hours)).toBe('1ч')
		expect(oldFormatMSInterval(2 * hours)).toBe('2ч')
		expect(oldFormatMSInterval(2 * hours + 20 * sec)).toBe('2ч 20с')
		expect(oldFormatMSInterval(2 * hours + 1 * min + 25)).toBe('2ч 60с')
		expect(oldFormatMSInterval(5 * hours + 14 * min + 25)).toBe('5ч 840с')

		expect(oldFormatMSInterval(1 * days)).toBe('1д')
		expect(oldFormatMSInterval(2 * days)).toBe('2д')
		expect(oldFormatMSInterval(5 * days + 14 * min + 25)).toBe('120ч 840с')
		expect(oldFormatMSInterval(5 * days + 14 * min + 15 * sec)).toBe('120ч 855с')
		expect(oldFormatMSInterval(5 * days + 2 * hours + 14 * min + 15 * sec)).toBe('122ч 855с')

		expect(oldFormatMSInterval(1 * week)).toBe('1нед')
		expect(oldFormatMSInterval(2 * week)).toBe('2нед')
		expect(oldFormatMSInterval(2 * week + 14 * min + 25)).toBe('336ч 840с')
		expect(oldFormatMSInterval(2 * week + 14 * min + 15 * sec)).toBe('336ч 855с')
		expect(oldFormatMSInterval(2 * week + 2 * hours + 14 * min + 15 * sec)).toBe('338ч 855с')
		expect(oldFormatMSInterval(2 * week + 3 * days + 2 * hours + 14 * min + 15 * sec)).toBe('410ч 855с')
	});

	it('formatMSInterval', () => {
		const msFormat = {
			...dtIntervalFormat,
			quotient: DT_INTERVAL_PERIOD.MINUTES,
			remainder: DT_INTERVAL_PERIOD.SECONDS
		};
		const msFormatter = formatMSInterval(msFormat);
		expect(msFormatter(4 * min + 25 * sec)).toBe('4мин 25с');
		expect(msFormatter(5 * hours + 14 * min)).toBe('314мин');
		expect(msFormatter(5 * hours + 14 * min + 25 * sec)).toBe('314мин 25с');

		const hsFormat = {
			...dtIntervalFormat,
			quotient: DT_INTERVAL_PERIOD.HOURS,
			remainder: DT_INTERVAL_PERIOD.SECONDS
		};
		const hsFormatter = formatMSInterval(hsFormat);
		expect(hsFormatter(4 * min + 25 * sec)).toBe('265с');
		expect(hsFormatter(5 * hours + 14 * min)).toBe('5ч 840с');
		expect(hsFormatter(1 * days + 14 * min + 25 * sec)).toBe('24ч 865с');

		const dmzFormat = {
			...dtIntervalFormat,
			quotient: DT_INTERVAL_PERIOD.DAY,
			remainder: DT_INTERVAL_PERIOD.HOURS,
			symbolCount: 2
		};
		const dmzFormatter = formatMSInterval(dmzFormat);
		expect(dmzFormatter(2 * days + 4 * hours + 25 * min)).toBe('2д 4.42ч');
		expect(dmzFormatter(20 * hours)).toBe('20.00ч');
		expect(dmzFormatter(1 * days + 30 * min)).toBe('1д 0.50ч');

	});

	it('formatDate', () => {
		expect(formatDate('')).toBe('');
		expect(formatDate('-')).toBe('-');
		expect(formatDate('[not empty]')).toBe('[not empty]');
		expect(formatDate('20.02.2005')).toBe('20.02.2005');
		expect(formatDate('20.02.2005 00:00')).toBe('20.02.2005');
		expect(formatDate('1.1.2022 00:00')).toBe('1.1.2022');
		expect(formatDate('1.1.2022 00:00:00')).toBe('1.1.2022 00:00:00');
	});
});