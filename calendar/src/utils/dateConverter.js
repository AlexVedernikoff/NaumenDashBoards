// @flow
import endOfMonth from 'date-fns/endOfMonth';
import endOfWeek from 'date-fns/endOfWeek';
import startOfDay from 'date-fns/startOfDay';
import startOfMonth from 'date-fns/startOfMonth';
import startOfWeek from 'date-fns/startOfWeek';

/**
 * Функция для получения дат начала и конца месяца переданного дня
 * @param {Date} date - дата, находящаяся в нужном месяце
 * @returns {[Date, Date]} - кортеж из даты старта и даты конца месяца
 */
const getMonthDates = (date: Date) => [startOfMonth(date), endOfMonth(date)];

/**
 * Функция для получения дат начала и конца недели переданного дня
 * @param {Date} date - дата, находящаяся в нужной неделе
 * @returns {[Date, Date]} - кортеж из даты старта и даты конца недели
 */
const getWeekDates = (date: Date) => [
	startOfWeek(date, {
		weekStartsOn: 1
	}),
	endOfWeek(date, {
		weekStartsOn: 1
	})
];

/**
 * Функция для получения начала и конца переданного дня
 * @param {Date} date - дата
 * @returns {[Date, Date]} - кортеж из даты старта и даты конца
 */
const getDate = (date: Date) => [startOfDay(date), startOfDay(date)];

/**
 * Функция для получения дат начала и конца определенного промежутка (месяц, неделя, день)
 * @param {Date} date - дата, находящаяся в нужном промежутке времени
 * @param {string} view - вид календаря
 * @returns {[Date, Date]} - кортеж из даты старта и даты конца периода
 */
export const getDates = (date: Date, view: string) => {
	switch (view) {
		case 'month':
			return getMonthDates(date);
		case 'week':
			return getWeekDates(date);
		case 'work-week':
			return getWeekDates(date);
		case 'day':
			return getDate(date);
		default:
			throw new Error('Unsupported type of date');
	}
};

/**
 * Функция для получения даты формата dd-mm-YYYY
 * @param {Date} date - дата
 * @returns {string} - форматированная дата строкой
 */
export const getFormattedDate = (date: Date) =>
	`${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`;
