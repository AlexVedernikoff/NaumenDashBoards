// @flow
import type {Connector, OptionsSizeCanvas} from './types';
import type {Entity} from 'store/entity/types';
import {jsPDF} from 'jspdf';
/**
 * Сохранение графического файла.
 * @param {object} canvas - холст
 * @param {string} exportTo - название файла
 */
function downloadUri (canvas: HTMLCanvasElement, exportTo: string) {
	let element = canvas;

	if (exportTo === 'jpeg') {
		const { height, width } = canvas.attrs;
		element = document.createElement('canvas');
		const ctx = element.getContext('2d');
		element.width = width;
		element.height = height;
		ctx.fillStyle = '#FFFFFF';
		ctx.fillRect(0, 0, width, height);
		ctx.drawImage(canvas.toCanvas(), 0, 0, width, height);
	}

	const imgData = element.toDataURL({
		mimeType: `image/${exportTo}`,
		quality: 1.0
	});
	const link = document.createElement('a');
	link.download = `scheme.${exportTo}`;
	link.href = imgData;
	link.click();
}

/**
 * Сохранение pdf файла.
 * @param {object} canvas - холст
 */
function downloadPdf (canvas: HTMLCanvasElement) {
	const imgData = canvas.toDataURL({quality: 1.0});
	const { height, width } = canvas.attrs;
	// eslint-disable-next-line new-cap
	const pdf = new jsPDF({
		format: [width, height],
		hotfixes: ['px_scaling'],
		orientation: 'l',
		unit: 'px'
	});
	pdf.addImage(imgData, 'png', 0, 0);

	pdf.save('scheme.pdf');
}

/**
 * Востановление корректного порядка точек перез выводов.
 * @param {Array} points - массив точек
 */
function sortPointCorrect (points: Connector[]) {
	points.sort((a: Connector, b: Connector) => {
		if (a.from > b.from) {
			return 1;
		} else if (a.from < b.from) {
			return -1;
		}

		if (b.from === null) { // начальная точка всегда в начале и не имеет родителя
			return 1;
		}

		const countChildrenA = points.filter(s => s.from === a.id).length;
		const countChildrenB = points.filter(s => s.from === b.id).length;
		return countChildrenB - countChildrenA;
	});
}

/**
 * Присвоение точкам первичных позиций и угла.
 * @param {Entity[]} points - массив точек
 * @returns {{bufferPoints: Connector[], options: OptionsSizeCanvas}} - обьект с точками и параметрами сдвига на холсте
 */
function pointsCreateCoordinate (points: Entity[]): {bufferPoints: Connector[], options: OptionsSizeCanvas} {
	const options = {
		maxX: 0,
		maxY: 0,
		minY: 0
	};
	const bufferPoints = [];

	points.forEach((entity: Entity, index: string, origins: Entity[]) => {
		let x;
		let y;
		let angle = 0;

		const parent = bufferPoints.find(s => s.id === entity.from);

		if (parent) { // если элемент не первый то расчитываем позицию и угол
			const shift = 300;
			const children = origins.filter(s => s.from === entity.id);
			const connects = origins.filter(s => s.from === entity.from);
			const connectsLength = connects.length; // число отвлетвлений
			const connectsCountSmall = connectsLength < 5; // градация уменьшения угла развертки
			const angleStep = connectsCountSmall ? 180 / (connectsLength + 1) : 30;

			const connectIndex = bufferPoints.filter(s => s.from === entity.from).length; // текущий индекc отвлетвления

			if (connects.length === 1) { // если соединение одно, сдвигаем по горизонту
				y = parent.y;
				x = parent.x + shift;
				angle = 0;
			} else { // если соединений несколько, вычесляем угол и координаты сдвига
				let shiftRatioAngle = shift + 50;

				const initialAngle = -(angleStep * connectIndex);
				const finishAngle = connectsCountSmall ? getSmallConnectAngle(initialAngle, parent.angle, connectsLength, angleStep) : getBigConnectAngle(initialAngle, parent.angle);

				if (finishAngle === 0 && children && children.length > 1) { // удлиняем горизонтальный луч если есть дети
					shiftRatioAngle += 200;
				}

				const a = shiftRatioAngle * Math.sin(finishAngle * Math.PI / 180); // катет а
				const b = shiftRatioAngle * -Math.cos(finishAngle * Math.PI / 180); // катет б

				y = parent.y - a;
				x = parent.x - b;
				angle = finishAngle;
			}

			if (options.minY > y) {
				options.minY = y;
			}

			if (options.maxY < y) {
				options.maxY = y;
			}

			if (options.maxX < x) {
				options.maxX = x;
			}
		} else { // если первый сдвигаем горизонтально
			x = 60;
			y = 0;
		}

		bufferPoints.push({...entity, angle, x, y});
	});

	return {bufferPoints, options};
}

/**
 * Подсчет количества соединения относительно начала.
 *
 * @param {Array} points - массив точек
 * @param {Array} children - массив дочерних точек
 * @param initialCount Стартовое кол-во
 * @returns {number} - кол-во соединений
 */
function countToStartPoints (points: Connector[], children: Connector[], initialCount = 0) {
	const parent = points.find(s => children.from === s.id);

	if (parent) {
		return countToStartPoints(points, parent, initialCount + 1);
	}

	return initialCount;
}

/**
 * Направленность первого угла относительно начала.
 *
 * @param {Array} points - массив точек
 * @param {Array} children - массив дочерних точек
 * @returns {number} - первый угол
 */
function checkAngleStartLine (points: Connector[], children: Connector) {
	const parent = points.find(s => children.from === s.id);

	if (parent && children.angle !== 0) {
		return checkAngleStartLine(points, parent, children.angle);
	}

	return children.angle;
}

/**
 * Поиск пересечения линий.
 * @param {number} x1 - точка координат первой линии
 * @param {number} y1 - точка координат первой линии
 * @param {number} x2 - точка координат первой линии
 * @param {number} y2 - точка координат первой линии
 * @param {number} x3 - точка координат второй линии
 * @param {number} y3 - точка координат второй линии
 * @param {number} x4 - точка координат второй линии
 * @param {number} y4 - точка координат второй линии
 * @returns {boolean} - флаг пересечения
 */
function searchCross (x1, y1, x2, y2, x3, y3, x4, y4) {
	let n;
	let isCross;

	if (y2 - y1 !== 0) { // a(y)
		const q = (x2 - x1) / (y1 - y2);
		const sn = (x3 - x4) + (y3 - y4) * q;

		if (sn === 0) { // c(x) + c(y)*q
			isCross = false;
		}

		const fn = (x3 - x1) + (y3 - y1) * q; // b(x) + b(y)*q
		n = fn / sn;
	} else {
		if (y3 - y4 === 0) { // линии паралельны
			isCross = false;
		}

		n = (y3 - y1) / (y3 - y4); // c(y)/b(y)
	}

	const x = x3 + (x4 - x3) * n; // x3 + (-b(x))*n
	// const y = y3 + (y4 - y3) * n; // y3 +(-b(y))*n TODO: Понадобится для последующей доработки

	if (isCross === undefined) {
		isCross = x > x1 && x > x3 && x < x2 && x < x4; // точка пересечения линий должна находится в области обоих линий
	}

	return isCross;
}

/**
 * Смещение отвлетвления на заданные координаты.
 * @param {Array} points - массив точек
 * @param {object} parent - родительская точка от котрой делать сдвиг
 * @param {number} x - сдвиг по горизонтале
 * @param {number} y - сдвиг по вертикале
 * @param {object} options Размеры холста
 * @returns {OptionsSizeCanvas} - Новые размеры холста
 */
function conversionTreePosition (points: Connector[], parent, x = 0, y = 0, options: OptionsSizeCanvas) {
	const customOptions = options;
	// eslint-disable-next-line no-unused-vars
	for (const entity of points) {
		// eslint-disable-next-line padded-blocks
		if (entity.from === parent.id) {
			entity.x += x;
			entity.y += y;

			if (customOptions.minY > entity.y) {
				customOptions.minY = entity.y;
			}

			if (customOptions.maxY < entity.y) {
				customOptions.maxY = entity.y;
			}

			if (customOptions.maxX < entity.x) {
				customOptions.maxX = entity.x;
			}

			conversionTreePosition(points, entity, x, y, customOptions);
		}
	}
	return customOptions;
}

/**
 * Поиск соприкосновений точек и линий между собой и их перестроение.
 * @param {Array} connectors Массив точек исходный
 * @param {object} options Размеры холста
 * @returns {number} - Массив точек с обработанными данными координат
 */
function conversionSearchPosition (connectors: Connector[], options: OptionsSizeCanvas) {
	let searchPoint;
	let searchLine;
	let customOptions = options;
	const shiftPointW = 120;
	const shiftPointH = 150;

	// eslint-disable-next-line no-unused-vars
	for (const entity of connectors) {
		// eslint-disable-next-line padded-blocks
		searchPoint = connectors.find(s =>
			s.id !== entity.id // пропускаем текущий поинт
			&& ((s.x + shiftPointW >= entity.x && s.x - shiftPointW <= entity.x // в оба бока
				&& entity.y <= s.y && entity.y >= s.y - shiftPointH))); // от центра и в низ

		searchLine = connectors.find(s => {
			const parentItem = connectors.find(p => s.from === p.id);
			const parentEntity = connectors.find(p => entity.from === p.id);

			if (!parentEntity || !parentItem
				|| parentEntity.id === s.id || parentItem.id === entity.id
				|| parentItem.id === parentEntity.id || s.id === entity.id) return false; // если имеют общию точку

			const x1 = parentEntity.x;
			const x2 = entity.x;
			const x3 = parentItem.x;
			const x4 = s.x;
			const y1 = convertY(parentEntity.y, customOptions.minY);
			const y2 = convertY(entity.y, customOptions.minY);
			const y3 = convertY(parentItem.y, customOptions.minY);
			const y4 = convertY(s.y, customOptions.minY);

			return searchCross(x1, y1, x2, y2, x3, y3, x4, y4);
		});

		if (searchPoint) { // найдено соприкосновение позиций точек снизу
			let current = entity;
			let search = searchPoint;
			let parent = connectors.find(s => search.from === s.id);

			if (countToStartPoints(connectors, entity) > countToStartPoints(connectors, searchPoint)) {
				parent = connectors.find(s => entity.from === s.id);
				current = searchPoint;
				search = entity;
			}

			if (current.angle >= 0) { // если развертка верхняя то стремимся сдвинуть по углу родителя
				const adShiftPoint = 0;// Math.max((current.x - search.x), -(current.y - search.y));

				const shiftX = (shiftPointW + adShiftPoint) * -Math.cos(parent.angle * Math.PI / 180);
				const shiftY = (shiftPointH + adShiftPoint) * Math.sin(parent.angle * Math.PI / 180);

				parent.x += -shiftX;
				parent.y += -shiftY;
				customOptions = {...conversionTreePosition(connectors, parent, -shiftX, -shiftY, customOptions)};
			} else { // сдвинуть вниз/вправо по углу родителя
				const adShiftPoint = 0;// Math.max((current.x - search.x), (current.y - search.y));

				const shiftX = (shiftPointW + adShiftPoint) * Math.cos(parent.angle * Math.PI / 180);
				const shiftY = (shiftPointH + adShiftPoint) * Math.sin(parent.angle * Math.PI / 180);

				parent.x += shiftX;
				parent.y += -shiftY;
				customOptions = {...conversionTreePosition(connectors, parent, shiftX, -shiftY, customOptions)};
			}
		}

		if (searchLine) {
			const parentEntity = connectors.find(s => entity.from === s.id);
			const parentSearch = connectors.find(s => searchLine.from === s.id);

			if (checkAngleStartLine(connectors, entity) < 0 || checkAngleStartLine(connectors, searchLine) < 0) { // пересечение линии снизу
				if (parentEntity.y > parentSearch.y) { // линия заходит снизу
					const adShiftPoint = Math.max((entity.x - searchLine.x), -(entity.y - searchLine.y));

					const shiftX = (shiftPointW + adShiftPoint) * Math.cos(parentEntity.angle * Math.PI / 180);
					const shiftY = (shiftPointH + adShiftPoint) * Math.sin(parentEntity.angle * Math.PI / 180);
					parentEntity.x += shiftX;
					parentEntity.y += shiftY;
					customOptions = {...conversionTreePosition(connectors, parentEntity, shiftX, shiftY, customOptions)};
				} else {
					// TODO: при появлении проблем добавить зеркальность
				}
			} else {
				if (parentEntity.y < parentSearch.y) { // линия заходит сверху
					const adShiftPoint = Math.max((entity.x - searchLine.x), (entity.y - searchLine.y));

					const shiftX = (shiftPointW + adShiftPoint) * Math.cos(parentEntity.angle * Math.PI / 180);
					const shiftY = (shiftPointH + adShiftPoint) * Math.sin(parentEntity.angle * Math.PI / 180);
					parentEntity.x += shiftX;
					parentEntity.y -= shiftY;
					customOptions = {...conversionTreePosition(connectors, parentEntity, shiftX, -shiftY, customOptions)};
				} else {
					// TODO: при появлении проблем добавить зеркальность
				}
			}
		}
	}

	if (!searchPoint || !searchLine) {
		return {connectors, customOptions};
	} else {
		return conversionSearchPosition(connectors, customOptions);
	}
}

/**
 * Координаты сдвига в относительные.
 * @param {number} y - координаты сдвига в относительные
 * @param {number} minY - координаты сдвига в относительные
 * @returns {number} - координата
 */
function convertY (y, minY) {
	return y < 0 ? -(minY - y) : -minY + y;
}

/**
 * Изменение/добавление коофицента угла при малом количестве лучей.
 * @param initialAngle стартовый угол
 * @param parentAngle угол родителя
 * @param connectsLength кол-во соединений
 * @param angleStep шаг угла
 * @returns {number} - угол
 */
const getSmallConnectAngle = (initialAngle: number, parentAngle: number, connectsLength: number, angleStep: number) => {
	const angle = initialAngle + (connectsLength - 1) * angleStep / 2;

	if (parentAngle > 0) {
		return angle + 30;
	} else if (parentAngle < 0) {
		return angle - 30;
	}

	return angle;
};

/**
 * Изменение/добавление коофицента угла при большом количестве лучей.
 * @param initialAngle стартовый угол
 * @param parentAngle угол родителя
 * @returns {number} - угол
 */
const getBigConnectAngle = (initialAngle: number, parentAngle: number) => {
	let angle = initialAngle;

	if (parentAngle > 0) {
		angle += 30;

		if (Math.abs(angle + 180 - parentAngle) <= 10) {
			angle -= 150;
		}

		return angle;
	} else if (parentAngle < 0) {
		return angle - 90;
	}

	return angle;
};

export {
	downloadUri,
	downloadPdf,
	checkAngleStartLine,
	conversionSearchPosition,
	convertY,
	conversionTreePosition,
	countToStartPoints,
	getSmallConnectAngle,
	getBigConnectAngle,
	sortPointCorrect,
	searchCross,
	pointsCreateCoordinate
};
