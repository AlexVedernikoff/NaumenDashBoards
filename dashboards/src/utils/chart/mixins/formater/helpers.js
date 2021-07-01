// @flow
import type {AxisFormat, LabelFormat, NumberAxisFormat} from 'store/widgets/data/types';
import {AXIS_FORMAT_TYPE, LABEL_FORMATS, NOTATION_FORMATS} from 'store/widgets/data/constants';
import {compose} from 'redux';
import moment from 'moment';
import type {NumberFormatter, ValueFormatter} from './types';
import {SEPARATOR} from 'store/widgets/buildData/constants';

/**
 * logger
 * @param {Function} func - основной форматер
 * @returns {Function} - функция-форматер c логгированием в dev режиме
 */
export function loggerFormatter<U, T> (func: (value: U) => T): (value: U) => T {
	if (process.env.NODE_ENV === 'development') {
		return (value) => {
			const result = func(value);

			console.log('LOG: ', value, '->', result);
			return result;
		};
	} else {
		return func;
	}
}

/**
 * Служебный, не преобразующий число в строку
 * @param {number} symbolCount - количество знаков после запятой, по умолчанию - 0
 * @returns {NumberFormatter} - функция-форматер
 */
export const defaultNumberFormatter = (symbolCount: number = 0): NumberFormatter => (value: number): string => {
	return value.toFixed(symbolCount);
};

/**
 * Служебный, не изменяющий форматер.
 * @param {string} value - значение
 * @returns {string} - то же самое значение
 */
export const defaultValueFormatter: ValueFormatter = (value: string) => value;

/**
 * Форматтер для NumberAxisFormat
 * @param {NumberFormatter} format - формат предствления значения
 * @returns {ValueFormatter} - функция-форматер
 */
export const getLabelFormatter = (format: LabelFormat = LABEL_FORMATS.TITLE): ValueFormatter => {
	let internalFormatter = (title: string, code: string) => title;

	if (format === LABEL_FORMATS.CODE) {
		internalFormatter = (title: string, code: string) => code;
	}

	if (format === LABEL_FORMATS.TITLE_CODE) {
		internalFormatter = (title: string, code: string) => `${title} (${code})`;
	}

	return (value: ?string) => {
		if (value) {
			const lastIndex = value.lastIndexOf(SEPARATOR);

			if (lastIndex !== -1) {
				const title = value.slice(0, lastIndex);
				const code = value.slice(lastIndex + 1);
				return internalFormatter(title, code);
			}

			return value;
		}

		return '';
	};
};

/**
 * Форматтер-оболочка для проверки на бесконечность
 * @param {NumberFormatter}  successFormatter - функция-форматер для числа не равного 0
 * @returns {NumberFormatter} - функция-форматер, возвращаюшая пустую строку, если значение равно Infinity, или результат вызова successFormatter
 * в другом случае
 */
export const checkInfinity = (successFormatter: NumberFormatter): NumberFormatter => (value: number | typeof Infinity) => {
	return value === Infinity ? '' : successFormatter(value);
};

/**
 * Форматтер-оболочка для проверки на 0
 * @param {NumberFormatter}  successFormatter - функция-форматер для числа не равного 0
 * @returns {NumberFormatter} - функция-форматер, возвращаюшая пустую строку, если значение равно 0, или результат вызова successFormatter
 * в другом случае
 */
export const checkZero = (successFormatter: NumberFormatter): NumberFormatter => (value: number) => {
	return value === 0 ? '' : successFormatter(value);
};

/**
 * Форматтер-оболочка для проверки на cтроку
 * @param {ValueFormatter}  successFormatter - функция-форматер для cтрок
 * @returns {Function} - функция-форматер, возвращаюшая переданное значение, если значение не строка, иначе результат вызова successFormatter
 * в другом случае
 */
export const checkString = (successFormatter: ValueFormatter) => (value: string | number): string => {
	const stringValue = typeof value === 'string' ? value : value.toString();
	return successFormatter(stringValue);
};

/**
 * Форматтер-оболочка для проверки на число
 * @param {NumberFormatter}  successFormatter - функция-форматер для числа
 * @returns {Function} - функция-форматер, возвращаюшая переданное значение, если значение не число, иначе результат вызова successFormatter
 * в другом случае
 */
export const checkNumber = (successFormatter: NumberFormatter) => (value: string | number): string => {
	const numValue = typeof value === 'string' ? parseFloat(value) : value;
	// $FlowFixMe - parseFloat(string) - isNaN => typeof value === 'string'
	return isNaN(numValue) ? value : successFormatter(numValue);
};

/**
 * Форматтер для добавления строки в конец значения
 * @param {string} additional - строка добавления
 * @returns {ValueFormatter} - функция-форматер
 */
export const additionalFormat = (additional: string): ValueFormatter => (value) => {
	return value ? `${value}${additional}` : value;
};

/**
 * Форматтер для добавления процента в конец значения
 * @returns {ValueFormatter} - функция-форматер
 */
export const percentFormat: ValueFormatter = additionalFormat('%');

/**
 * Форматтер для обрезания строки
 * @param {number} length - максимальная длина строки
 * @returns {ValueFormatter} - функция-форматер
 */
export const cropFormatter = (length: number): ValueFormatter => (value: string) => {
	if (value.length > length) {
		return `${value.substr(0, length)}...`;
	}

	return value;
};

/**
 * Форматтер разбивающий (или нет) строку на несколько строк
 * @param {boolean} split - разбивать или нет строку
 * @param {boolean} splitter - строка разивки, по умолчанию пробел
 * @returns {Function} - функция-форматер
 */
export const splitFormatter = (split: boolean, splitter: string = ' ') => {
	if (split) {
		return (value: string) => value.split(splitter);
	}

	return defaultValueFormatter;
};

/**
 * Форматтер для группировки SEVEN_DAYS
 * @param {string} value - значение
 * @returns {string} - преобразованое значение для требуемого формата
 */
export const sevenDaysFormatter: ValueFormatter = (value: string): string => {
	const dates = value.split('-');
	const startDate = moment(dates[0], 'DD.MM.YY');
	const endDate = moment(dates[1], 'DD.MM.YY');

	if (startDate.isValid() && endDate.isValid()) {
		return `${startDate.format('DD MMMM')} - ${endDate.format('DD MMMM')}`;
	}

	return value;
};

/**
 * Форматтер-оболочка для описания нотацией
 * @param {string} notation - описание нотацией
 * @param {NumberFormatter} addConverter - внутренний форматер
 * @param {boolean} spacing - добавлять разбивку после нотаций
 * @returns {NumberFormatter} - функция-форматер
 */
export const notationConverter = (notation: $Values<typeof NOTATION_FORMATS>, addConverter: NumberFormatter): NumberFormatter => {
	const {BILLION, MILLION, THOUSAND, TRILLION} = NOTATION_FORMATS;
	let [divider, additional] = [1, ''];

	switch (notation) {
		case THOUSAND:
			[divider, additional] = [1e3, 'тыс.'];
			break;
		case MILLION:
			[divider, additional] = [1e6, 'млн'];
			break;
		case BILLION:
			[divider, additional] = [1e9, 'млрд'];
			break;
		case TRILLION:
			[divider, additional] = [1e12, 'трлн'];
			break;
	}

	return compose(additionalFormat(additional), addConverter, (value) => value / divider);
};

/**
 * Преобразует NumberAxisFormat (описание форматирования для числа) в форматер
 * @param {NumberAxisFormat} format - требуемый формат
 * @returns {NumberFormatter} - функция-форматер
 */
export const makeFormatterByNumberFormat = (format: NumberAxisFormat): NumberFormatter => {
	let formatter = (value: number): string => {
		if (value) {
			return value.toLocaleString(undefined, {
				maximumFractionDigits: format.symbolCount ?? 0,
				minimumFractionDigits: format.symbolCount ?? 0,
				useGrouping: format.splitDigits ?? false
			});
		}

		return '';
	};

	if (format.notation) {
		formatter = notationConverter(format.notation, formatter);
	}

	if (format.additional) {
		const additional = format.notation ? ` ${format.additional}` : format.additional;

		formatter = compose(additionalFormat(additional), formatter);
	}

	return formatter;
};

/**
 * Преобразует AxisFormat в форматер
 * @param {AxisFormat} format - требуемый формат
 * @returns {NumberFormatter | ValueFormatter} - функция форматер
 */
export const makeFormatterByFormat = (format: AxisFormat): (NumberFormatter | ValueFormatter) => {
	let result = checkString(getLabelFormatter());

	if (format !== null) {
		if (format.type === AXIS_FORMAT_TYPE.LABEL_FORMAT) {
			result = checkString(getLabelFormatter(format.labelFormat ?? LABEL_FORMATS.TITLE));
		}

		if (format.type === AXIS_FORMAT_TYPE.INTEGER_FORMAT || format.type === AXIS_FORMAT_TYPE.NUMBER_FORMAT) {
			result = checkNumber(makeFormatterByNumberFormat(format));
		}
	}

	return result;
};
