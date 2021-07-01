// @flow
import {connect} from 'react-redux';
import type {Props} from './types';
import {props} from './selectors';
import React, {useCallback, useEffect, useState} from 'react';
import {Stage, Layer, Line} from 'react-konva';
import styles from './DrawingStage.less';

const STROKE_COLOR = "#000000";
const STROKE_WIDTH = 2;

const DrawingStage = (props: Props) => {
	const {data, saveNewPartSignature, stageRef} = props;
	const [newLines, setNewLines] = useState([...data]);
	const [isDrawing, setIsDrawing] = useState(false);
	const [area, setArea] = useState({
		height: window.innerHeight,
		width: window.innerWidth,
	});

	useEffect(() => {
		const handleResize = () => {
			setArea({
				height: window.innerHeight,
				width: window.innerWidth,
			})
		}
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener(handleResize);
	}, []);

	const handleMouseDown = useCallback((e: SyntheticEvent<EventTarget>) => {
		setIsDrawing(true);
		const pos = e.target.getStage().getPointerPosition();
		setNewLines([...newLines, [pos.x, pos.y, pos.x, pos.y]]);
	}, []);

	const handleMouseMove = useCallback((e: SyntheticEvent<EventTarget>) => {
		if (!isDrawing) {
			return;
		}

		const stage = e.target.getStage();
		const point = stage.getPointerPosition();

		addNewPoint(point);
	});

	const handleMouseUp = useCallback(() => {
		if (!isDrawing) {
			return;
		}
		setIsDrawing(false);
		setNewLines([]);
		saveNewPartSignature(newLines);
	});

	const addNewPoint = (point) => {
		const copyLines = [...newLines];
		copyLines[copyLines.length - 1] = [...copyLines[copyLines.length - 1], point.x, point.y];
		setNewLines(copyLines);
	};

	const renderLayer = () => (
		<Layer className={styles.layer}>
			{[...data, ...newLines].map(renderLine)}
		</Layer>
	);

	const renderLine = (line, i) => (
		<Line
			key={i}
			lineCap="round"
			points={line}
			stroke={STROKE_COLOR}
			strokeWidth={STROKE_WIDTH}
		/>
	);

	const renderStage = () => (
		<Stage
			ref={stageRef}
			className={styles.stage}
			height={area.height - 80}
			width={area.width - 28}
			onMouseDown={handleMouseDown}
			onMouseLeave={handleMouseUp}
			onMousemove={handleMouseMove}
			onMouseup={handleMouseUp}
			onTouchEnd={handleMouseUp}
			onTouchMove={handleMouseMove}
			onTouchStart={handleMouseDown}
		>
			{renderLayer()}
		</Stage>
	);

	return renderStage();
};

export default connect(props)(DrawingStage);
