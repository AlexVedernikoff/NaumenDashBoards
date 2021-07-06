// @flow
import {Circle, Layer, Line, Stage} from 'react-konva';
import {connect} from 'react-redux';
import type {Props} from './types';
import {props} from './selectors';
import React, {Fragment, useCallback, useEffect, useState} from 'react';
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
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	const handleMouseDown = useCallback((e: SyntheticEvent<EventTarget>) => {
		setIsDrawing(true);
		const pos = e.target.getStage().getPointerPosition();
		setNewLines([...newLines, [pos.x, pos.y]]);
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
		saveNewPartSignature(newLines);
		setIsDrawing(false);
		setNewLines([]);
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

	const renderLine = (line, i) => {
		const [beginX, beginY] = line;
		return (
			<Fragment key={i}>
				<Circle
					radius={Math.round(STROKE_WIDTH / 2)}
					fill={STROKE_COLOR}
					x={beginX}
					y={beginY}
				/>
				<Line
					lineCap="round"
					points={line}
					stroke={STROKE_COLOR}
					strokeWidth={STROKE_WIDTH}
				/>
			</Fragment>
		);
	};

	const renderStage = () => (
		<Stage
			ref={stageRef}
			className={styles.stage}
			height={area.height - 56}
			width={area.width - 4}
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
