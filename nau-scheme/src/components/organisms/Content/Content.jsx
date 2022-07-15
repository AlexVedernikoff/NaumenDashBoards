// @flow
import {connect} from 'react-redux';
import Element from 'components/organisms/Element';
import {functions, props} from './selectors';
import {Layer, Stage} from 'react-konva';
import type {Props} from 'components/organisms/Content/types';
import React, {useEffect, useState} from 'react';

const Content = ({data}: Props) => {
	const [option, setOption] = useState({maxX: 0, maxY: 0, minY: 0});
	const [points, setPoint] = useState([]);
	const [lines, setLine] = useState([]);
	const [connectors, setConnectors] = useState([]);

	useEffect(() => {
		const filterPoint = data.filter(e => e.type === 'point');
		let minY = 0;
		let maxY = 0;
		let maxX = 0;

		const filterLine = data.filter(e => e.type === 'line');

		setLine(filterLine);

		let bufferConnectors = [];

		filterPoint.map((entity, index, origins) => {
			let x = 0;
			let y = 0;
			const shift = 300;
			const from = bufferConnectors.find(s => s.id === entity.from);
			const connects = origins.filter(s => s.from === entity.from);
			const isEven = !!(connects.length % 2);
			const evenConnect = connects.length; // число отвлетвлений
			const countSectors = evenConnect + (isEven ? 1 : 2); // число секторов кол-во линий + 2 боковых сектора
			const angleStep = 180 / countSectors; // узнаем шаг угла для каждого ответвления
			const connectIndex = bufferConnectors.filter(s => s.from === entity.from).length + 1; // текущий индекc отвлетвления

			if (!from) { // если первый элемент то на стартовую позицию
				x = 60;
				y = 0;
			} else {
				x = from.x + shift;

				maxX = x;

				if (connects.length === 1 || (connectIndex === evenConnect / 2 + 0.5 && isEven)) { // если соединение одно или в середине списка, сдвигаем по горизонту
					y = from.y;
				} else { // если соединений несколько, вычесляем угол и координаты сдвига
					if (connectIndex < evenConnect) { // верхняя область
						const yShift = shift * Math.tan((angleStep * connectIndex) * Math.PI / 180); // длина гор. катера на тан. угла
						y = from.y - yShift; // - (1000 / angleStep * connectIndex);
						// x = x - (1000 / angleStep * connectIndex);

						if (minY > y) minY = y;
					} else { // нижняя область
						const yShift = shift * Math.tan((angleStep * +(connectIndex - connects.length + 1)) * Math.PI / 180); // индекс считаем с начала для второй половины
						y = from.y + yShift;

						if (maxY < y) maxY = y;
					}
				}
			}

			const connector = {x, y, ...entity};
			bufferConnectors = [...bufferConnectors, connector];

			return connector;
		});

		const conversionTreePosition = (point, parent, y = 200) => { // сдвиг дерева на заданный шаг
			for (const entity of point) {
				if (entity.from === parent.id) {
					entity.y -= y;

					if (minY > entity.y) minY = entity.y;

					conversionTreePosition(point, entity, y);
				}
			}
			return point;
		};

		const conversionSearchPosition = connectors => {
			for (const entity of connectors) {
				const shiftPoint = 50;
				const [search] = connectors.filter(s => {
					return s.id !== entity.id
					&& s.x + shiftPoint > entity.x && entity.x > s.x - shiftPoint
					&& s.y + shiftPoint > entity.y && entity.y > s.y - shiftPoint;
				});

				if (search) { // найдено соприкосновение позиций точек
					const parent = connectors.find(s => s.id === search.from);
					const connects = connectors.filter(s => s.from === parent.id);

					if (connects.length > 1) { // несколько соединений  TODO луч не центральный
						conversionTreePosition(connectors, parent); // TODO: определение сектора и установка сдвига по y
						break;
					}
				}
			}
			return connectors;
		};

		setConnectors(conversionSearchPosition(bufferConnectors));

		setPoint(filterPoint);

		setOption({maxX: maxX + 50 * 2, maxY: maxY + 50 * 2, minY: minY - 50 * 2});
	}, []);

	return (
		<Stage height={-option.minY + option.maxY} width={option.maxX + 300}>
			<Layer>
				{lines.map(line => {
					const from = connectors.find(s => s.id === line.from);
					const to = connectors.find(s => s.id === line.to);
					return <Element entity={line} key={line.id} points={{fromX: from.x, fromY: from.y + -option.minY, toX: to.x, toY: to.y + -option.minY}} />;
				})}
				{points.map(point => {
					const connector = connectors.find(s => s.id === point.id);
					return <Element entity={point} key={point.id} x={connector.x} y={connector.y + -option.minY} />;
				})}
			</Layer>
		</Stage>
	);
};

export default connect(props, functions)(Content);
