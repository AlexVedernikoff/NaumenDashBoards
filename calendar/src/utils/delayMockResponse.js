// @flow
/**
 * Возвращает промис с задержкой в 600 мс для эмулирования запроса на сервер
 * @param {Object} data - мок результат обращения к серверу
 * @returns {Promise<Оbject>} - промис, возвращающий мок результат обращения к серверу
 */
const delayMockResponse = (data: Object): Promise<Object> =>
	new Promise((resolve) => {
		setTimeout(() => resolve(data), 600);
	});

export default delayMockResponse;
