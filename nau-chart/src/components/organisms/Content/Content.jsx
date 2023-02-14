// @flow
import cn from 'classnames';
import {connect} from 'react-redux';
import {
	conversionSearchPosition,
	convertSchemesPositions,
	downloadPdf,
	downloadUri,
	isFitsPointsOnScreen,
	pointsCreateCoordinate,
	pointsRoundCreateCoordinate,
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
const Content = ({
	activeElement,
	centerPointUuid,
	data,
	editingGlobal,
	exportTo,
	goToPoint,
	openContextMenu,
	position,
	saveEntitiesLocationSettings,
	scale,
	searchObjects,
	setActiveElement,
	setExportTo,
	setPosition,
	setScale
}: Props) => {
	const stageRef = useRef(null);
	const [isDragCursor, setIsDragCursorCursor] = useState(false);
	const [isHoverCursor, setIsHoverCursor] = useState(null);
	const [isDraggable, setIsDraggable] = useState(false);
	const [startPositionEdit, setStartPositionEdit] = useState({x: 0, y: 0});
	const [selectElements, setSelectElements] = useState([]);
	const [offset, setOffset] = useState({x: 0, y: 0});
	const [schemes, setSchemes] = useState([]);

	useEffect(() => {
		if (centerPointUuid) {
			const points = schemes.flat().reduce((accumulator, {lines, points}) => {
				const filterLines = lines.filter(({uuid}) => centerPointUuid === uuid);
				const filterPoints = points.filter(({uuid}) => centerPointUuid === uuid);
				return [...accumulator, ...filterLines, ...filterPoints];
			}, []);

			if (points.length) { // найдена хотя бы одна совпадающая точка или линия
				const fromX = Math.min(...points.map(o => o.x)); // нахождение максимально отдаленных координат
				const toX = Math.max(...points.map(o => o.x));
				const fromY = Math.min(...points.map(o => o.y));
				const toY = Math.max(...points.map(o => o.y));
				let x = window.innerWidth / 2 - (fromX + (toX - fromX) / 2) * scale;
				let y = (offset.y - (fromY + (toY - fromY) / 2)) * scale + window.innerHeight / 2;

				if (points.length > 1) { // если найдено несколько точек, подстраиваем зум чтобы были видны все
					let distanceX = (toX - fromX) * scale;
					let distanceY = (toY - fromY) * scale;
					let isShowFull = isFitsPointsOnScreen(distanceX, distanceY);
					let newScale = scale;

					while (!isShowFull && newScale > 0.25) {
						newScale = setScale(false); // уменьшаем зум
						distanceX = (toX - fromX) * newScale;
						distanceY = (toY - fromY) * newScale;
						isShowFull = isFitsPointsOnScreen(distanceX, distanceY);
						x = window.innerWidth / 2 - (fromX + (toX - fromX) / 2) * newScale;
						y = (offset.y - (fromY + (toY - fromY) / 2)) * newScale + window.innerHeight / 2;
					}
				}

				setPosition({x, y: y});
			}
		}
	}, [centerPointUuid, scale, offset]);

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
		const bufferSchemes = [];

		(Array.isArray(data) ? data : [data]).forEach((entities: Entity[], index: number) => {
			const points = entities.filter(e => e.type === 'point');
			const lines = entities.filter(e => e.type === 'line');

			const isRoundLayout = points.filter(e => e.roundLayout).length === points.length;

			if (isRoundLayout) {
				const {bufferPoints, options} = pointsRoundCreateCoordinate(points); // выкладка элементов на круговой схеме

				bufferSchemes.push({lines: lines, options, points: bufferPoints});

				if (index === 0) {
					setOffset({x: 0, y: -options.minY - window.innerHeight / 2});
				}
			} else {
				sortPointCorrect(points); // приведения к правильному порядку основываясь на зависимости от id и родитель/ребенок
				const {bufferPoints, options} = pointsCreateCoordinate(points); // первичная выкладка элементов на схеме
				const {connectors, customOptions} = conversionSearchPosition(bufferPoints, options); // корректировка выкладки для устранения пересечений

				bufferSchemes.push({lines: lines, options: customOptions, points: connectors});

				if (index === 0) {
					setOffset({x: 0, y: -customOptions.minY - window.innerHeight / 2});
				}
			}
		});

		setSchemes(convertSchemesPositions(bufferSchemes));
	}, [data]);

	const handleCloseContextMenu = () => {
		openContextMenu(null);

		if (!isDragCursor) {
			goToPoint(null);
		}

		setIsDragCursorCursor(false);
	};

	const handleContextMenu = e => {
		e.evt.preventDefault();
		openContextMenu(e);
		setIsDragCursorCursor(false);
		setSelectElements([]);
	};

	const handleDragStart = e => {
		console.log('handleDragStart', selectElements);
		setIsDragCursorCursor(true);

		if (selectElements.length) {
			if (editingGlobal) {
				setIsDraggable(true);
				setStartPositionEdit({x: e.evt.pageX, y: e.evt.pageY});
			} else {
				const [activeElements] = selectElements;
				setActiveElement(activeElements);
			}
		} else {
			if (activeElement) {
				setActiveElement(null);
			}
		}
	};

	const handleDragEnd = e => {
		setIsDragCursorCursor(false);

		if (editingGlobal) {
			setIsDraggable(false);

			schemes.map(({lines, points}) => {
				return {
					lines: lines.map(line => {
						line.saveFromX = line.fromX;
						line.saveFromY = line.fromY;

						line.saveToX = line.toX;
						line.saveToY = line.toY;

						return line;
					}),
					points: points.map(point => {
						point.saveX = point.x;
						point.saveY = point.y;

						return point;
					})
				};
			});
		}
	};

	const handleMouseMove = e => {
		if (isDraggable && selectElements.length) {
			const shiftX = e.evt.pageX - startPositionEdit.x;
			const shiftY = e.evt.pageY - startPositionEdit.y;
			const idList = selectElements.map(element => element.id);
			const bufferPointPosition = [];
			const bufferSchemes = [];

			schemes.forEach(({lines, points}) => {
				bufferSchemes.push({
					lines: lines.map(line => {
						if (idList.indexOf(line.from) !== -1) {
							line.fromX = line.saveFromX + shiftX;
							line.fromY = line.saveFromY + shiftY;
						}

						if (idList.indexOf(line.to) !== -1) {
							line.toX = line.saveToX + shiftX;
							line.toY = line.saveToY + shiftY;
						}

						return line;
					}),
					points: points.map(point => {
						if (idList.indexOf(point.id) !== -1) {
							point.x = point.saveX + shiftX;
							point.y = point.saveY + shiftY;
						}

						bufferPointPosition.push({uuid: point.uuid, x: point.x, y: point.y});

						return point;
					})
				});
			});

			setSchemes([...bufferSchemes]);

			saveEntitiesLocationSettings(bufferPointPosition);
		}
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
		}
	};

	const handleIsHoverCursor = hover => {
		setIsHoverCursor(hover);
	};

	const handleActiveElement = (element, isCtrlKey) => { // клик по элементу и добавление его в массив активных
		if (editingGlobal && isCtrlKey) {
			const shouldAdd = !(selectElements.find(elem => elem.uuid === element.uuid));

			if (shouldAdd) {
				setSelectElements([...selectElements, element]);
			}
		} else {
			setSelectElements([element]);
		}
	};

	const renderSchemeItems = () => {
		return schemes.map(({lines, points}) => {
			const schemeItems = [];
			const props = {
				activeElement,
				centerPointUuid,
				handleActiveElement,
				handleContextMenu,
				handleIsHoverCursor,
				scale,
				searchObjects
			};

			lines.forEach(line => {
				schemeItems.push(<Lines
					{...props}
					entity={line}
					key={line.id}
					points={{fromX: line.fromX, fromY: line.fromY, toX: line.toX, toY: line.toY}}
				/>);
			});
			points.forEach(point => {
				schemeItems.push(<Points
					{...props}
					className={styles.hover}
					entity={point}
					key={point.id}
					x={point.x}
					y={point.y} />);
			});
			return schemeItems;
		});
	};

	const classNames = cn({
		[styles.hover]: isHoverCursor,
		[styles.drag]: isDragCursor
	});

	return (
		<Stage
			className={classNames}
			draggable={!isDraggable}
			height={window.innerHeight - 2}
			offset={offset}
			onClick={handleCloseContextMenu}
			onMouseDown={handleDragStart}
			onMouseMove={handleMouseMove}
			onMouseUp={handleDragEnd}
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
