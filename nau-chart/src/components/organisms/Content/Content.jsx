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

const Content = ({data, exportTo, openContextMenu, position, scale, setActiveElement, setExportTo, setPosition}: Props) => {
	const stageRef = useRef(null);
	const [isDrag, setIsDrag] = useState(false);
	const [hoverElement, setHoverElement] = useState(null);

	const [option, setOption] = useState({maxX: 0, maxY: 0, minY: 0});
	const [points, setPoints] = useState([]);
	const [lines, setLines] = useState([]);

	useEffect(() => {
		if (stageRef.current) {
			if (exportTo === 'jpg' || exportTo === 'png') {
				downloadUri(stageRef.current, `scheme.${exportTo}`);
			} else if (exportTo === 'pdf') {
				downloadPdf(stageRef.current, 'scheme.pdf');
			}

			setExportTo(null);
		}
	}, [exportTo]);

	useEffect(() => {
		const filterPoints = data.filter(e => e.type === 'point');

		sortPointCorrect(filterPoints);

		const {bufferPoints, options} = pointsCreateCoordinate(filterPoints);

		const {connectors, customOptions} = conversionSearchPosition(bufferPoints, options);

		setLines(data.filter(e => e.type === 'line'));
		setPoints(connectors);
		setOption({maxX: customOptions.maxX + 50 * 2, maxY: customOptions.maxY + 50 * 2, minY: customOptions.minY - 50 * 2});
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

	const classNames = cn({
		[styles.hover]: hoverElement,
		[styles.drag]: isDrag
	});

	return (
		<Stage
			className={classNames}
			draggable
			height={window.innerHeight}
			onClick={handleCloseContextMenu}
			onDragEnd={handleDragEnd}
			onDragStart={handleDragStart}
			ref={stageRef}
			scaleX={scale}
			scaleY={scale}
			width={window.innerWidth}
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
						points={{fromX: from.x, fromY: from.y - option.minY, toX: to.x, toY: to.y - option.minY}} />;
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
						y={point.y - option.minY} />;
				})}
			</Layer>
		</Stage>
	);
};

export default connect(props, functions)(Content);
