// @flow

/**
 * На текущий момент у окружения метода нет полифилов к es6. Для стабильной работы на старых браузерах все ответы
 * перепарсиваются согласно окружению внутреннего приложения.
 * @param {Function} restCallModule - метод для осуществления запросов к модулям
 * @returns {void}
 */
const decorateRestCallModule = (restCallModule: Function) => {
	window.jsApi.restCallModule = async (...params) => {
		const data = await restCallModule(...params);
		return JSON.parse(JSON.stringify(data));
	};
};

export default decorateRestCallModule;
