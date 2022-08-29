// @flow
import {connect} from 'react-redux';
import {
	conversionSearchPosition,
	downloadPdf,
	downloadUri,
	getBigConnectAngle,
	getSmallConnectAngle,
	sortPointCorrect
} from './helpers';
import type {Entity} from 'store/entity/types';
import {functions, props} from './selectors';
import {Layer, Stage} from 'react-konva';
import Lines from 'components/organisms/Element/Lines';
import Points from 'components/organisms/Element/Points';
import type {Props} from './types';
import React, {useEffect, useRef, useState} from 'react';
import styles from './styles.less';

const Content = ({data, exportTo, openContextMenu, scale, setActiveElement}: Props) => {
	const stageRef = useRef(null);
	const [option, setOption] = useState({maxX: 0, maxY: 0, minY: 0});
	const [points, setPoints] = useState([]);
	const [lines, setLines] = useState([]);
	const [connectors, setConnectors] = useState([]);
	const [hoverElement, setHoverElement] = useState(null);

	useEffect(() => {
		if (stageRef.current) {
			if (exportTo === 'jpg' || exportTo === 'png') {
				downloadUri(stageRef.current, `scheme.${exportTo}`);
			} else if (exportTo === 'pdf') {
				downloadPdf(stageRef.current, 'scheme.pdf');
			}
		}
	}, [exportTo]);

	useEffect(() => {
		const options = {
			maxX: 0,
			maxY: 0,
			minY: 0
		};
		const bufferConnectors = [];

		const filterPoints = data.filter(e => e.type === 'point');

		const filterLines = data.filter(e => e.type === 'line');

		sortPointCorrect(filterPoints);

		filterPoints.map((entity: Entity, index: string, origins: Entity[]) => {
			let x;
			let y;
			let angle;

			const parent = bufferConnectors.find(s => s.id === entity.from);

			if (!parent) { // если первый элемент то на стартовую позицию
				x = 60;
				y = 0;
			} else {
				const shift = 300;
				const children = origins.filter(s => s.from === entity.id);
				const connects = origins.filter(s => s.from === entity.from);
				const connectsLength = connects.length; // число отвлетвлений
				const connectsCountSmall = connectsLength < 5; // градация уменьшения угла развертки
				const angleStep = connectsCountSmall ? 180 / (connectsLength + 1) : 30;

				const connectIndex = bufferConnectors.filter(s => s.from === entity.from).length; // текущий индекc отвлетвления

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

				if (options.minY > y) options.minY = y;

				if (options.maxY < y) options.maxY = y;

				if (options.maxX < x) options.maxX = x;
			}

			const connector = {angle, x, y, ...entity};

			bufferConnectors.push(connector);

			return connector;
		});

		const {connectors, customOptions} = conversionSearchPosition(bufferConnectors, options);

		setConnectors(connectors);
		setLines(filterLines);
		setPoints(filterPoints);
		setOption({maxX: customOptions.maxX + 50 * 2, maxY: customOptions.maxY + 50 * 2, minY: customOptions.minY - 50 * 2});
	}, []);

	const handleCloseContextMenu = () => {
		openContextMenu(null);
	};

	return (
		<Stage
			className={(hoverElement ? styles.hover : '')}
			height={-option.minY + option.maxY}
			onClick={handleCloseContextMenu}
			ref={stageRef}
			scaleX={scale}
			scaleY={scale}
			width={option.maxX + 300}
		>
			<Layer>
				{lines.map(line => {
					const from = connectors.find(s => s.id === line.from);
					const to = connectors.find(s => s.id === line.to);
					return <Lines
						entity={line}
						handleContextMenu={openContextMenu}
						key={line.id}
						onClick={setActiveElement}
						onHover={setHoverElement}
						points={{fromX: from.x, fromY: from.y + -option.minY, toX: to.x, toY: to.y + -option.minY}} />;
				})}
				{points.map(point => {
					const connector = connectors.find(s => s.id === point.id);
					return <Points
						className={styles.hover}
						entity={point}
						handleContextMenu={openContextMenu}
						key={point.id}
						onClick={setActiveElement}
						onHover={setHoverElement}
						x={connector.x}
						y={connector.y + -option.minY} />;
				})}
			</Layer>
		</Stage>
	);
};

export default connect(props, functions)(Content);
