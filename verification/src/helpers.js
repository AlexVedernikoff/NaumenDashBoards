// @flow
/**
 * Возвращает функцию, которая не будет срабатывать, пока продолжает вызываться
 * @param {Function} func - функция, которую необходимо обернуть
 * @param {number} ms - количество миллисекунд для проверки повторного вызова
 * @returns {Function} - обернутая функция
 */
function debounce (func: Function, ms: number) {
	let timer = null;

	return function () {
		clearTimeout(timer);
		timer = setTimeout(() => func(...arguments), ms);
	};
}

/**
 * Функция для обхода ошибки flow о несоответствии типов при использовании Object.values
 * @param {object} map - объект
 * @returns {Array<any>} - массив значений объекта
 */
function getMapValues<T> (map: $Shape<{[key: string]: T}>): Array<T> {
	return Object.keys(map).map(key => map[key]);
}

/**
 * Функция проверяет является ли переменная объектом
 * @param {any} item - проверяемая переменная
 * @returns {boolean}
 */
const isObject = (item: any): boolean => item && typeof item === 'object' && !Array.isArray(item);

/**
 * Объединяет 2 объекта с учетом вложенности
 * @param {object} target - исходный объект
 * @param {object} source - объект, содержащий значения, которые необходимо заменить в исходном объекте
 * @returns {object}
 */
const extend = (target: Object, source: Object): Object => {
	let output = {...target};

	if (isObject(target) && isObject(source)) {
		Object.keys(source).forEach(key => {
			if (isObject(source[key])) {
				if (key in target) {
					output[key] = extend(target[key], source[key]);
				} else {
					output = {...output, [key]: source[key]};
				}
			} else {
				output = {...output, [key]: source[key]};
			}
		});
	}

	return output;
};

/**
 * Реализует глубокое копирование объекта
 * @param {object} object - исходный объект
 * @returns {object}
 */
const deepClone = (object: Object) => JSON.parse(JSON.stringify(object));

/**
 * Проверяет относится ли операционная система пользователя к семейству MasOS
 * @returns {boolean}
 */
const isMacOS = () => ['MacIntel', 'Mac68K', 'MacPPC'].includes(navigator.platform);

/**
 * На текущий момент у окружения метода нет полифилов к es6. Для стабильной работы в старых браузерах все ответы
 * преобразуются согласно окружению внутреннего приложения.
 * @param {Function} restCallModule - метод для осуществления запросов к модулям
 * @returns {void}
 */
const decorateRestCallModule = (restCallModule: Function) => {
	window.jsApi.restCallModule = async (...params) => {
		const data = await restCallModule(...params);

		return JSON.parse(JSON.stringify(data));
	};
};

/**
 * Экранирует специальные символы строки
 * TODO: RegExp.esacape https://github.com/tc39/proposal-regex-escaping
 * @param {string} string - строка
 * @returns {string}
 */
const escapeString = (string: string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Создает копию объета obj без поля [key]
 * @param {object} obj - объект для копирования
 * @param {string} key - ключ объекта obj
 * @returns {object} - копия obj без ключа key
 */
function omit<T: Object> (obj: T, key: string): T {
	if (key in obj) {
		const newObj = {...obj};

		delete newObj[key];

		return newObj;
	}

	return obj;
}

export {
	debounce,
	decorateRestCallModule,
	deepClone,
	escapeString,
	extend,
	getMapValues,
	isMacOS,
	isObject,
	omit
};
