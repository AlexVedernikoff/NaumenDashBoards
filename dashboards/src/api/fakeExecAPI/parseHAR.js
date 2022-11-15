#!/bin/node
/*
 * Скрипт для парсинга "HAR"-файлов, которые мы получаем с клиентских стендов, и преобразования их в
 * моки данных для дашборда.
 *
 * Входные данные:
 *   - Файл "request.har" в этом каталоге. Желательно получать из хрома;
 *   - Файл "frame.js" с помеченным местом для внедрения моков.
 *
 * Выходные данные:
 *   - Набор *.json файлов;
 *   - Измененный frame.js с импортами json.
 *
 * Для использования скрипта необходимо:
 * 1. Положить "HAR"-файл открытия дашборда, полученный от пользователя, в текущий каталог
 * 2. Дать файлу имя "request.har";
 * 3. Файл "frame.js" не коммитить. В нем должны быть строчки:
 * - // [imports]
 * - const fakeDataList = [];
 * 4. Запустить скрипт командой `node parseHAR.js`
 * После запуска в каталоге появятся файлы:
 * - "getSettings.json" - файл с данными по дашборду;
 * - "getDataSources.json" - файл с данными по источникам;
 * - "getUserData.json" - файл с данными пользователя;
 * - "wp[8-uuid].json" - файл с данными виджетов.
 * Также изменится файл "frame.js" - строчки, указанные выше, заменятся на подключение этих файлов.
 * Изменения, полученные на этом шаге, не коммитить;
 * 5. Проверить, что дашборды запущены в develop режиме с API_DRIVER=exec-dev.
 */

const fs = require('fs');
const path = require('path');

/**
 * Структура "HAR"-файла
 * @typedef {object} HARFile
 * @property {HARFileLog} log - корневой элемент "HAR"-файла.
 */

/**
 * Корневой элемент "HAR"-файла
 * @typedef {object} HARFileLog
 * @property {Array<HARFileRecord>} entries - перечень сетевых запросов.
 */

/**
 * Сетевой запрос в "HAR"-файле
 * @typedef {object} HARFileRecord
 * @property {HARFileRequest} request - описание запроса.
 * @property {HARFileResponse} response - описание ответа.
 */

/**
 * Описание запроса в "HAR"-файле
 * @typedef {object} HARFileRequest
 * @property {HARFileRequestPostData | undefined} postData - описание POST данных запроса.
 * @property {Array<HARFileRequestQueryStringItem>} queryString - список элементов строки запроса.
 */

/**
 * Элемент строки запроса
 * @typedef {object} HARFileRequestQueryStringItem
 * @property {string} name - название.
 * @property {string} value - значение.
 */

/**
 * Элемент POST данных запроса
 * @typedef {object} HARFileRequestPostData
 * @property {string} mimeType - тип POST запроса.
 * @property {string} text - body POST запроса.
 */

/**
 * Описание ответа сервера в "HAR"-файле
 * @typedef {object} HARFileResponse
 * @property {number} status - статус ответа.
 * @property {HARFileResponseContent} content - Содержимое ответа сервера.
 */

/**
 * Описание содержимого ответа сервера в "HAR"-файле
 * @typedef {object} HARFileResponseContent
 * @property {number} size - размер ответа.
 * @property {string} mimeType - тип ответа.
 * @property {string} text - содержимое ответа.
 * @property {string} encoding - кодировка содержимого.
 */

/**
 * Описание объекта содержимого для импорта
 * @typedef {object} ImportItem
 * @property {string} body - строка, которая должна содержаться в теле запроса.
 * @property {string} filename - имя файла для сохранения.
 * @property {string} text - mock данные.
 * @property {string} url - строка, которая должна содержаться в строке запроса.
 */

/**
 * Данные для проверки "HAR"-файла
 * @typedef {object} CheckImportsValue
 * @property {boolean} usedDataSource - признак присутствия данных источников в "HAR"-файле.
 * @property {boolean} usedSettings - признак присутствия данных дашборда в "HAR"-файле.
 * @property {boolean} usedUserData - признак присутствия данных пользователя в "HAR"-файле.
 * @property {number} widgetCount - количество виджетов в "HAR"-файле.
 */

/**
 * Чтение "HAR"-файла
 * @returns {HARFile} - распарсенный "HAR"-файл.
 */
const getHARFile = () => JSON.parse(
	fs.readFileSync(path.join(__dirname, 'request.har'), {encoding: 'utf-8'})
);

/**
 * Базовое формирование объекта импорта.
 * @param {string} method - название функции вызова.
 * @param {string} module - название модуля функции вызова.
 * @param {HARFileResponse} response - объект ответа из "HAR" файла.
 * @returns {ImportItem} - объект для мока данных.
 */
const makeBaseImport = (method, module, response) => ({
	body: '',
	filename: method,
	text: response.content.text,
	url: `func=${module}.${method}`
});

/**
 * Формирование объекта импорта для данных виджета.
 * @param {string} method - название функции получения данных для виджета.
 * @param {HARFileRequest} request - объект запроса из "HAR"-файла.
 * @param {HARFileResponse} response - объект ответа из "HAR"-файла.
 * @returns {ImportItem | null} - объект для мока данных.
 */
const makeWidgetImport = (method, request, response) => {
	const postData = JSON.parse(request.postData.text);
	const {widgetKey} = postData;
	const lastIndex = widgetKey.lastIndexOf('-');

	if (lastIndex >= 0) {
		const widgetKeyId = widgetKey.slice(lastIndex + 1);
		const filename = `wp${widgetKeyId}`;
		const {text} = response.content;

		return {
			body: widgetKey,
			filename,
			text,
			url: `func=modules.dashboardDataSet.${method}`
		};
	}

	return null;
};

/**
 * Сохраняет данные по файлам
 * @param {Array<ImportItem>} importList - массив с информацией о моках.
 * @returns {void}
 */
const makeFiles = importList => importList.forEach(({filename, text}) => {
	fs.writeFileSync(path.join(__dirname, `${filename}.json`), text, {encoding: 'utf8'});
});

/**
 * Преобразование мока данных в код
 * @param {Array<ImportItem>} importList - массив с информацией о моках.
 * @returns {[Array<string>, Array<string>]} - 2 массива с кодом.
 */
const makeImports = importList => {
	const imports = [];
	const fakeDataItems = [];

	importList.forEach(({body, filename, url}) => {
		imports.push(`import ${filename} from './${filename}.json';`);
		fakeDataItems.push(`\t{\n\t\tbody: '${body}',\n\t\tdata: ${filename},\n\t\turl: '${url}'\n\t}`);
	});

	return [imports, fakeDataItems];
};

/**
 * Сохранение кода в файл "frame.js"
 * @param {Array<string>} imports - js-код с импортами.
 * @param {Array<string>} fakeDataList - js-код с описанием моков.
 * @returns {void}
 */
const updateSourceFile = (imports, fakeDataList) => {
	const frameFile = path.join(__dirname, `frame.js`);
	const text = fs
		.readFileSync(frameFile, {encoding: 'utf-8'})
		.replace(/\/\/ \[imports\]/, imports.sort().join('\n'))
		.replace(/const fakeDataList = \[\];/, `const fakeDataList = [\n${fakeDataList.join(',\n')}\n];`);

	fs.writeFileSync(frameFile, text, {encoding: 'utf8'});
};

/**
 * Проверка парсинга данных из "HAR"-файла
 * @param {CheckImportsValue} data - информация о парсинге "HAR"-файла.
 * @returns {boolean} - возвращает true, если параметр не содержит описаний ошибок.
 */
const checkImports = ({usedDataSource, usedSettings, usedUserData, widgetCount}) => {
	if (!usedDataSource) {
		console.error('В "HAR"-файле нет данных по источникам');
		return false;
	}

	if (!usedSettings) {
		console.error('В "HAR"-файле нет данных по дашборду');
		return false;
	}

	if (!usedUserData) {
		console.error('В "HAR"-файле нет данных по пользователю');
		return false;
	}

	if (widgetCount === 0) {
		console.error('В "HAR"-файле нет данных по виджетам');
		return false;
	}

	return true;
};

/**
 * Основной код
 * @returns {void}
 */
const main = () => {
	const request = getHARFile();
	const {entries} = request.log;
	const importList = [];
	const allNeeded = {
		usedDataSource: false,
		usedSettings: false,
		usedUserData: false,
		widgetCount: 0
	};

	// eslint-disable-next-line no-unused-vars
	for (const entry of entries) {
		const {request, response} = entry;
		let item = null;

		if (request.queryString.some(qs => qs.name === 'func' && qs.value === 'modules.dashboardSettings.getSettings')) {
			item = makeBaseImport('getSettings', 'modules.dashboardSettings', response);
			allNeeded.usedSettings = true;
		}

		if (request.queryString.some(qs => qs.name === 'func' && qs.value === 'modules.dashboards.getDataSources')) {
			item = makeBaseImport('getDataSources', 'modules.dashboards', response);
			allNeeded.usedDataSource = true;
		}

		if (request.queryString.some(qs => qs.name === 'func' && qs.value === 'modules.dashboardSettings.getUserData')) {
			item = makeBaseImport('getUserData', 'modules.dashboardSettings', response);
			allNeeded.usedUserData = true;
		}

		if (request.queryString.some(qs => qs.name === 'func' && qs.value === 'modules.dashboardDataSet.getDataForCompositeDiagram')) {
			item = makeWidgetImport('getDataForCompositeDiagram', request, response);
			allNeeded.widgetCount += 1;
		}

		if (request.queryString.some(qs => qs.name === 'func' && qs.value === 'modules.dashboardDataSet.getDataForTableDiagram')) {
			item = makeWidgetImport('getDataForTableDiagram', request, response);
			allNeeded.widgetCount += 1;
		}

		item && importList.push(item);
	}

	if (checkImports(allNeeded)) {
		const [imports, fakeDataList] = makeImports(importList);

		makeFiles(importList);
		updateSourceFile(imports, fakeDataList);

		console.info('Файлы сформированы');
	} else {
		console.warn('"HAR"-файл не содержит нужной информации');
	}
};

main();
