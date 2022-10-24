// @flow
import cn from 'classnames';
import {connect} from 'react-redux';
import {
	conversionSearchPosition,
	downloadPdf,
	downloadUri,
	pointsCreateCoordinate,
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

const Content = ({data, exportTo, openContextMenu, position, scale, setActiveElement, setExportTo, setPosition, setScale}: Props) => {
	const stageRef = useRef(null);
	const [isDrag, setIsDrag] = useState(false);
	const [hoverElement, setHoverElement] = useState(null);
	const [offset, setOffset] = useState({x: 0, y: 0});
	const [mousePosition, setMousePosition] = useState({x: 0, y: 0});
	const [schemes, setSchemes] = useState([]);

	useEffect(() => {
		const handleResize = () => {
			stageRef.current.width(window.innerWidth);
			stageRef.current.height(window.innerHeight);
		};

		if (stageRef.current) {
			window.addEventListener('resize', handleResize);
		}

		return () => window.removeEventListener('resize', handleResize);
	}, []);

	useEffect(() => {
		if (stageRef.current) {
			if (exportTo === 'jpeg' || exportTo === 'png') {
				downloadUri(stageRef.current, exportTo);
				setExportTo(null);
			} else if (exportTo === 'pdf') {
				downloadPdf(stageRef.current);
				setExportTo(null);
			}
		}
	}, [exportTo]);

	useEffect(() => {
		data.forEach((entities: Entity[]) => {
			const filterPoints = entities.filter(e => e.type === 'point');
			const filterLines = entities.filter(e => e.type === 'line');

			sortPointCorrect(filterPoints); // приведения к правильному порядку основываясь на зависимости от id и родитель/ребенок
			const {bufferPoints, options} = pointsCreateCoordinate(filterPoints); // первичная выкладка элементов на схеме
			const {connectors, customOptions} = conversionSearchPosition(bufferPoints, options); // корректировка выкладки для устранения пересечений

			setSchemes(oldArray => [...oldArray, {lines: filterLines, options: customOptions, points: connectors}]);
		});
	}, [data]);

	const handleCloseContextMenu = () => {
		openContextMenu(null);
		setIsDrag(false);
	};

	const handleContextMenu = e => {
		e.evt.preventDefault();
		openContextMenu(e);
		setIsDrag(false);
	};

	const handleDragStart = () => {
		setIsDrag(true);
	};

	const handleDragEnd = e => {
		setPosition({x: e.target.x(), y: e.target.y()});
		setIsDrag(false);
	};

	const handleWheelZoom = e => {
		e.evt.preventDefault();
		const {deltaY, x, y} = e.evt;
		const newScale = setScale(deltaY < 0);

		if (newScale) {
			setOffset({
				x: x - x / newScale - (position.x - position.x / newScale),
				y: y - y / newScale - (position.y - position.y / newScale)
			});
			setMousePosition({x, y});
		}
	};

	const renderSchemeItems = () => {
		let widthMax = 0;
		let offsetX = 0;
		let offsetY = 0;
		let isIndividual = false;

		return schemes.map(({lines, options, points}) => {
			if (widthMax < options.maxX) { // максимальная ширина схем
				widthMax = options.maxX;
			}

			if (points.length === 1) { // одинарный элемент
				if (isIndividual) {
					offsetX += 150;
				}

				isIndividual = true;
			} else {
				isIndividual = false;
				offsetX = 0;
			}

			if (!isIndividual) { // сдвиг в низ на холсте для отрисовки схем
				offsetY += -options.minY + 25;
			} else if (offsetX > widthMax) { // если не помещаются одинарные в линию
				offsetX = 0;
				offsetY += 180;
			}

			const schemeItems = [];
			lines.forEach(line => {
				const from = points.find(s => s.id === line.from);
				const to = points.find(s => s.id === line.to);

				schemeItems.push(<Lines
					entity={line}
					handleContextMenu={handleContextMenu}
					key={line.id}
					onClick={setActiveElement}
					onHover={setHoverElement}
					points={{fromX: from.x + offsetX, fromY: from.y + offsetY, toX: to.x + offsetX, toY: to.y + offsetY}} />);
			});
			points.forEach(point => {
				schemeItems.push(<Points
					className={styles.hover}
					entity={point}
					handleContextMenu={handleContextMenu}
					key={point.id}
					onClick={setActiveElement}
					onHover={setHoverElement}
					x={point.x + offsetX}
					y={point.y + offsetY} />);
			});

			if (!isIndividual) { // если многомерная схема то сдвигаем вниз на 350
				offsetY += options.maxY + 350;
			}

			return schemeItems;
		});
	};

	const classNames = cn({
		[styles.hover]: hoverElement,
		[styles.drag]: isDrag
	});

	return (
		<Stage
			className={classNames}
			draggable
			height={window.innerHeight - 2}
			offset={offset}
			onClick={handleCloseContextMenu}
			onDragEnd={handleDragEnd}
			onDragStart={handleDragStart}
			onWheel={handleWheelZoom}
			ref={stageRef}
			scaleX={scale}
			scaleY={scale}
			width={window.innerWidth - 2}
			x={position.x}
			y={position.y}
		>
			<Layer>
				{renderSchemeItems()}
			</Layer>
		</Stage>
	);
};

export default connect(props, functions)(Content);
