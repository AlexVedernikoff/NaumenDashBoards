// @flow
import {Group, Line, Rect, Text} from 'react-konva';
import type {Props} from './types';
import React, {useEffect, useRef, useState} from 'react';

const Lines = ({activeElement, entity, handleContextMenu, onClick, onHover, points, scale, searchObjects}: Props) => {
	const isSearch = searchObjects.some(point => entity.uuid === point.uuid);
	const sizeLine = entity.uuid && (isSearch || (activeElement && activeElement.uuid === entity.uuid)) ? 4 / scale : 2;
	const [action] = entity.actions || [];

	const {fromX, fromY, toX, toY} = points;
	const catetX = toX - fromX;
	const catetY = toY - fromY;
	const tileW = 108;
	const tileH = 58;
	const paddingText = 4;
	const rotation = toY === fromY ? 0 : Math.atan(catetY / catetX) * (180 / Math.PI);
	// корректировка центровки плитки с описанием из за поворота вдоль линии
	// смещение по центру линии, рисуем относительно линии снизу треугольник, катеты это сдвиг
	const hypotenuse1 = tileW / 2 - rotation / 4;
	const a1 = hypotenuse1 * Math.sin(rotation * Math.PI / 180); // катет а
	const b1 = hypotenuse1 * Math.cos(rotation * Math.PI / 180); // катет б
	// смешение по центру плитки с описанием, рисуем относительно линии сверху треугольник, катеты это сдвиг
	const hypotenuse2 = tileH / 2;
	const a2 = hypotenuse2 * Math.sin((90 - rotation) * Math.PI / 180); // катет а, угол разница от 90
	const b2 = hypotenuse2 * -Math.cos((90 - rotation) * Math.PI / 180); // катет б, угол разница от 90 и реверс знака

	const refTitle = useRef(null);
	const refDesc = useRef(null);
	const [titleHeight, setTitleHeight] = useState(tileH / 2);
	const [descHeight, setDescHeight] = useState(tileH / 2);
	const [titleHeightTrim, setTitleHeightTrim] = useState('auto');
	const [descHeightTrim, setDescHeightTrim] = useState('auto');

	useEffect(() => {
		if (refTitle.current && refTitle.current.height() < tileH / 2) {
			setTitleHeight(refTitle.current.height());
		} else {
			setTitleHeightTrim(tileH / 2);
		}

		if (refDesc.current && refDesc.current.height() < tileH / 2) {
			setDescHeight(refDesc.current.height());
		} else {
			setDescHeightTrim(tileH / 2);
		}
	}, [refTitle, refDesc]);

	const handleOnClick = () => {
		if (action) {
			const {link} = action;

			if (link) {
				onClick(entity);
			}
		}
	};

	const handleOnHover = hover => () => {
		if (action) {
			const {link} = action;

			if (link) {
				onHover(hover);
			}
		}
	};

	return (
		<Group
			onClick={handleOnClick}
			onContextMenu={handleContextMenu}
			onMouseOut={handleOnHover(false)}
			onMouseOver={handleOnHover(true)}
			onTouchEnd={handleOnHover(false)}
			onTouchStart={handleOnHover(true)}
		>
			<Group
				rotation={rotation}
				x={fromX + catetX / 2 - b1 - b2}
				y={fromY + catetY / 2 - a1 - a2}
			>
				{entity.header && <Rect
					cornerRadius={[paddingText, paddingText, 0, 0]}
					fill='#fff'
					height={titleHeight}
					opacity={0.9}
					width={tileW}
					y={tileH / 2 - titleHeight}
				/>}
				{entity.desc && <Rect
					cornerRadius={[0, 0, paddingText, paddingText]}
					fill='#fff'
					height={descHeight}
					opacity={0.9}
					width={tileW}
					y={tileH / 2}
				/>}
				{entity.header && <Text
					align="center"
					fill="#323232"
					fontFamily="Roboto"
					fontSize={10}
					fontStyle="bold"
					height={titleHeightTrim}
					padding={paddingText}
					ref={refTitle}
					text={entity.header}
					verticalAlign="middle"
					width={tileW}
					x={0}
					y={tileH / 2 - titleHeight}
				/>}
				{entity.desc && <Text
					align="center"
					fill="#737373"
					fontFamily="Roboto"
					fontSize={10}
					fontStyle="bold"
					height={descHeightTrim}
					padding={paddingText}
					ref={refDesc}
					text={entity.desc}
					verticalAlign="middle"
					width={tileW}
					x={0}
					y={tileH / 2}
				/>}
			</Group>
			<Line
				key={entity.id}
				points={[fromX, fromY, toX, toY]}
				stroke="#595959"
				strokeWidth={sizeLine}
			/>
		</Group>
	);
};

export default Lines;
