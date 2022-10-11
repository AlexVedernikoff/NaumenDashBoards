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

	const [option, setOption] = useState({maxX: 0, maxY: 0, minY: 0});
	const [offset, setOffset] = useState({x: 0, y: 0});
	const [points, setPoints] = useState([]);
	const [lines, setLines] = useState([]);

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
		const filterPoints = data.filter(e => e.type === 'point');

		sortPointCorrect(filterPoints);

		const {bufferPoints, options} = pointsCreateCoordinate(filterPoints);
		const {connectors, customOptions} = conversionSearchPosition(bufferPoints, options);

		setLines(data.filter(e => e.type === 'line'));
		setPoints(connectors);
		setOption({maxX: customOptions.maxX + 50, maxY: customOptions.maxY, minY: customOptions.minY - 25});
		setOffset({x: 0, y: customOptions.maxY + customOptions.minY});
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
		let newScale = scale;

		if (deltaY < 0) {
			if (scale === 2) {
				return;
			}

			if (scale >= 1) {
				newScale = scale + 0.5;
			} else {
				newScale = scale * 2;
			}
		} else {
			if (scale === 0.25) {
				return;
			}

			if (scale >= 1) {
				newScale = scale - 0.5;
			} else {
				newScale = scale / 2;
			}
		}

		setScale(newScale);
		setOffset({x: x - x / newScale, y: y - y / newScale + (option.maxY + option.minY)});
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
				{lines.map(line => {
					const from = points.find(s => s.id === line.from);
					const to = points.find(s => s.id === line.to);

					return <Lines
						entity={line}
						handleContextMenu={handleContextMenu}
						key={line.id}
						onClick={setActiveElement}
						onHover={setHoverElement}
						points={{fromX: from.x, fromY: from.y, toX: to.x, toY: to.y}} />;
				})}
				{points.map(point => {
					return <Points
						className={styles.hover}
						entity={point}
						handleContextMenu={handleContextMenu}
						key={point.id}
						onClick={setActiveElement}
						onHover={setHoverElement}
						x={point.x}
						y={point.y} />;
				})}
			</Layer>
		</Stage>
	);
};

export default connect(props, functions)(Content);
