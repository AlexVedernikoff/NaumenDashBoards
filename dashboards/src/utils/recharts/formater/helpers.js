// @flow
import type {AxisFormat, LabelFormat, NumberAxisFormat} from 'store/widgets/data/types';
import {AXIS_FORMAT_TYPE, LABEL_FORMATS, NOTATION_FORMATS} from 'store/widgets/data/constants';
import type {CTXValue, NumberFormatter, StringFormatter, ValueFormatter} from './types';
import {compose} from 'redux';
import moment from 'utils/moment.config';
import {SEPARATOR, TITLE_SEPARATOR} from 'store/widgets/buildData/constants';
import t from 'localization';

/**
 * logger
 * @param {Function} func - основной форматер
 * @returns {Function} - функция-форматер c логгированием в dev режиме
 */
export function loggerFormatter<U, T> (func: (value: U) => T): (value: U) => T {
	if (process.env.NODE_ENV === 'development') {
		return value => {
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
export const defaultNumberFormatter = (symbolCount: number = 0): NumberFormatter => (value: number): string => value.toFixed(symbolCount);

/**
 * Служебный, не изменяющий форматер.
 * @param {string} value - значение
 * @returns {string} - то же самое значение
 */
export const defaultStringFormatter: StringFormatter = (value: string) => value;

/**
 * Форматтер для NumberAxisFormat
 * @param {NumberFormatter} format - формат представления значения
 * @returns {StringFormatter} - функция-форматер
 */
export const getLabelFormatter = (format: LabelFormat = LABEL_FORMATS.TITLE): StringFormatter => {
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
				let title = value.slice(0, lastIndex);
				let code = value.slice(lastIndex + 1);

				if (title.includes(TITLE_SEPARATOR)) {
					[title, code] = title.split(TITLE_SEPARATOR, 2);
				}

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
 * @returns {NumberFormatter} - функция-форматер, возвращающая пустую строку, если значение равно Infinity, или результат вызова successFormatter
 * в другом случае
 */
export const checkInfinity = (successFormatter: NumberFormatter): NumberFormatter => (value: number | typeof Infinity) => value === Infinity ? '' : successFormatter(value);

/**
 * Форматтер-оболочка для проверки на 0
 * @param {NumberFormatter}  successFormatter - функция-форматер для числа не равного 0
 * @returns {NumberFormatter} - функция-форматер, возвращающая пустую строку, если значение равно 0, или результат вызова successFormatter
 * в другом случае
 */
export const checkZero = (successFormatter: NumberFormatter): NumberFormatter => (value: number) => value === 0 ? '' : successFormatter(value);

/**
 * Форматтер-оболочка для проверки на строку
 * @param {StringFormatter}  successFormatter - функция-форматер для строк
 * @returns {Function} - функция-форматер, возвращающая переданное значение, если значение не строка, иначе результат вызова successFormatter
 * в другом случае
 */
export const checkString = (successFormatter: StringFormatter) => (value?: string | number): string => {
	const stringValue = typeof value === 'string' ? value : value?.toString() ?? '';
	return successFormatter(stringValue);
};

/**
 * Форматтер-оболочка для проверки на число
 * @param {NumberFormatter}  successFormatter - функция-форматер для числа
 * @returns {Function} - функция-форматер, возвращающая переданное значение, если значение не число, иначе результат вызова successFormatter
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
 * @returns {StringFormatter} - функция-форматер
 */
export const additionalFormat = (additional: string): StringFormatter => value => value ? `${value}${additional}` : value;

/**
 * Форматтер для добавления процента в конец значения
 * @returns {StringFormatter} - функция-форматер
 */
export const percentFormat: StringFormatter = additionalFormat('%');

/**
 * Форматтер разбивающий (или нет) строку на несколько строк
 * @param {boolean} split - разбивать или нет строку
 * @param {boolean} splitter - строка разбивки, по умолчанию пробел
 * @returns {Function} - функция-форматер
 */
export const splitFormatter = (split: boolean, splitter: string = ' ') => {
	if (split) {
		return (value: string) => value.split(splitter);
	}

	return defaultStringFormatter;
};

/**
 * Форматтер для группировки SEVEN_DAYS
 * @param {string | number} value - значение
 * @returns {string} - преобразованное значение для требуемого формата
 */
export const sevenDaysFormatter: ValueFormatter = (value?: string | number): string => {
	const dates = String(value).split('-');
	const startDate = moment(dates[0], 'DD.MM.YY');
	const endDate = moment(dates[1], 'DD.MM.YY');
	let period = '';

	if (startDate.isValid() && endDate.isValid()) {
		period = `${startDate.format('DD MMMM')} - ${endDate.format('DD MMMM')}`;
	}

	return period;
};

/**
 * Форматтер-оболочка для описания нотацией
 * @param {string} notation - описание нотацией
 * @param {NumberFormatter} addConverter - внутренний форматер
 * @returns {NumberFormatter} - функция-форматер
 */
export const notationConverter = (notation: $Values<typeof NOTATION_FORMATS>, addConverter: NumberFormatter): NumberFormatter => {
	const {BILLION, MILLION, THOUSAND, TRILLION} = NOTATION_FORMATS;
	let [divider, additional] = [1, ''];

	switch (notation) {
		case THOUSAND:
			[divider, additional] = [1e3, t('Formatter::Thousand')];
			break;
		case MILLION:
			[divider, additional] = [1e6, t('Formatter::Million')];
			break;
		case BILLION:
			[divider, additional] = [1e9, t('Formatter::Billion')];
			break;
		case TRILLION:
			[divider, additional] = [1e12, t('Formatter::Trillion')];
			break;
	}

	return compose(additionalFormat(additional), addConverter, value => value / divider);
};

/**
 * Преобразует NumberAxisFormat (описание форматирования для числа) в форматер
 * @param {NumberAxisFormat} format - требуемый формат
 * @param {boolean} hideZero - сообщает нужно ли убирать нулевые (пустые) значения
 * @returns {NumberFormatter} - функция-форматер
 */
export const makeFormatterByNumberFormat = (format: NumberAxisFormat, hideZero: boolean = true): NumberFormatter => {
	let formatter = (value: number): string => {
		let result = '';
		let {splitDigits, symbolCount} = format;

		if (value || (!hideZero && value === 0)) {
			if (symbolCount === null) {
				symbolCount = Number.isInteger(value) || Math.abs(value - Math.trunc(value)) < 0.01 ? 0 : 2;
			}

			result = value.toLocaleString(undefined, {
				maximumFractionDigits: symbolCount ?? 0,
				minimumFractionDigits: symbolCount ?? 0,
				useGrouping: splitDigits ?? false
			});
		}

		return result;
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
 * @param {boolean} hideZero - сообщает нужно ли убирать нулевые (пустые) значения
 * @returns {ValueFormatter} - функция форматер
 */
export const makeFormatterByFormat = (format: AxisFormat, hideZero: boolean = true): ValueFormatter => {
	let result = checkString(getLabelFormatter());

	if (format !== null) {
		if (format.type === AXIS_FORMAT_TYPE.LABEL_FORMAT) {
			result = checkString(getLabelFormatter(format.labelFormat ?? LABEL_FORMATS.TITLE));
		}

		if (format.type === AXIS_FORMAT_TYPE.INTEGER_FORMAT || format.type === AXIS_FORMAT_TYPE.NUMBER_FORMAT) {
			result = checkNumber(makeFormatterByNumberFormat(format, hideZero));
		}
	}

	return result;
};

/**
 * Форматтер, который применяет базовый форматер, и добавляет запись
 * [значение, отформатированное значение, облегчённый контекст] в массив stored.
 * Накапливает информацию о форматировании для генерации тест-кейсов.
 * @param {Array<[string | number, string]>} stored - массив для сохранения пар [значение, отформатировавшие значение]
 * @param {ValueFormatter} formatter - базовый форматер
 * @param {Function} ctxFormatter - функция экстрактор для облегчения ctx объекта. зависит от реализации базового форматера
 * @returns {ValueFormatter} - функция форматер
 */
export const storedFormatter = (
	stored: Array<[string | number, string, CTXValue | null]>,
	formatter: ValueFormatter | NumberFormatter | StringFormatter,
	ctxFormatter: ?(ctx: CTXValue) => CTXValue = null
): ValueFormatter =>
	(value: string | number, ctx: ?CTXValue): string => {
		// $FlowFixMe - value зависит от того какой будет formatter
		const result = formatter(value, ctx);
		const storeCtx = ctxFormatter && ctx ? ctxFormatter(ctx) : null;

		stored.push([value, result, storeCtx]);
		return result;
	};

/**
 * Создание форматера для CNT(%) типа агрегации
 * @param {NumberFormatter} StringFormatter - функция-форматер для значения
 * @param {number} total - общее количество элементов в ряду
 * @returns {Function} - функция-форматер
 */
export const totalPercentFormatter = (StringFormatter: NumberFormatter, total: number): NumberFormatter => {
	if (total !== 0) {
		const percentFormatter = makeFormatterByNumberFormat({
			additional: '%',
			symbolCount: null,
			type: AXIS_FORMAT_TYPE.NUMBER_FORMAT
		});

		return (value: number) => {
			const valueStr = StringFormatter(value);

			if (valueStr !== '') {
				const percentStr = percentFormatter(value / total * 100);
				return `${valueStr} (${percentStr})`;
			}

			return '';
		};
	}

	return StringFormatter;
};
