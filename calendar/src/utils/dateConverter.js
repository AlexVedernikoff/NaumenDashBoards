// @flow

/**
 * Функция для получения дат начала и конца месяца переданного дня
 * @param {Date} date - дата, находящаяся в нужном месяце
 * @returns {[Date, Date]} - кортеж из даты старта и даты конца месяца
 */
const getMonthDates = (date: Date) => {
	const dateFrom = new Date(date.getFullYear(), date.getMonth(), 1);
	const dateTo = new Date(date.getFullYear(), date.getMonth() + 1, 0);
	return [dateFrom, dateTo];
};

/**
 * Функция для получения дат начала и конца недели переданного дня
 * @param {Date} date - дата, находящаяся в нужной неделе
 * @returns {[Date, Date]} - кортеж из даты старта и даты конца недели
 */
const getWeekDates = (date: Date) => {
	const dateCopy = new Date(
		date.getFullYear(),
		date.getMonth(),
		date.getDate()
	);
	const dayOfWeek = dateCopy.getDay();
	const currentDay = dateCopy.getDate();
	const firstDay = currentDay - dayOfWeek + 1;
	const lastDay = firstDay + 6;
	return [
		new Date(dateCopy.setDate(firstDay)),
		new Date(dateCopy.setDate(lastDay))
	];
};

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
		case 'day':
			return [date, date];
		default:
			throw new Error('Unsupported type of date');
	}
};
