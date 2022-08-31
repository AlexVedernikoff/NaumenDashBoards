// @flow
import {Group, Line, Rect, Text} from 'react-konva';
import type {Props} from 'components/organisms/Element/types';
import React from 'react';

const Lines = ({entity, handleContextMenu, onClick, onHover, points}: Props) => {
	const text = `id: ${entity.id} from ${entity.from} to ${entity.to}`;
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

	const handleOnClick = () => {
		onClick(entity);
	};

	const handleOnHover = hover => () => {
		onHover(hover);
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
				<Rect
					cornerRadius={[paddingText, paddingText, 0, 0]}
					fill="#fff"
					height={tileH / 2}
					opacity={0.9}
					width={tileW}
				/>
				<Rect
					cornerRadius={[0, 0, paddingText, paddingText]}
					fill="#fff"
					height={tileH / 2}
					opacity={0.9}
					width={tileW}
					y={tileH / 2}
				/>
				<Text
					align="center"
					fill="#323232"
					fontFamily="Roboto"
					fontSize={10}
					fontStyle="bold"
					height={tileH / 2 - paddingText * 3}
					text={text + ' ' + text}
					verticalAlign="middle"
					width={tileW - paddingText * 2}
					x={paddingText}
					y={paddingText}
				/>
				<Text
					align="center"
					fill="#737373"
					fontFamily="Roboto"
					fontSize={10}
					fontStyle="bold"
					height={tileH / 2 - paddingText * 3}
					opacity={1}
					text={text + ' ' + text}
					verticalAlign="middle"
					width={tileW - paddingText * 2}
					x={paddingText}
					y={tileH / 2 + paddingText * 2}
				/>
			</Group>
			<Line
				key={entity.id}
				points={[fromX, fromY, toX, toY]}
				stroke="#595959"
				strokeWidth={2}
			/>
		</Group>
	);
};

export default Lines;
