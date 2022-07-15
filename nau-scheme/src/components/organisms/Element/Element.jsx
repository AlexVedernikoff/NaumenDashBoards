// @flow
import {Group, Image, Line, Rect, Text} from 'react-konva';
import type {Props} from 'components/organisms/Element/types';
import React from 'react';
import useImage from 'use-image';

const Element = ({entity, points, x, y}: Props) => {
	if (entity.type === 'point') {
		const text = `id: ${entity.id} from ${entity.from}`;
		const [image] = useImage('image/point.svg');
		return (
			<>
				<Image
					image={image}
					x={x - 22}
					y={y - 20}
				/>
				<Group
					x={x - 54}
					y={y + 22}
				>
					<Rect
						cornerRadius={4}
						fill="#fff"
						height={58}
						opacity={0.9}
						width={108}
					/>
					<Text
						align="center"
						fill="#323232"
						fontFamily="Roboto"
						fontSize={10}
						fontStyle="bold"
						height={22}
						padding={4}
						text={text}
						verticalAlign="middle"
						width={100}
						x={4}
						y={4}
					/>
					<Text
						align="center"
						fill="#737373"
						fontFamily="Roboto"
						fontSize={10}
						fontStyle="bold"
						height={22}
						text={text + ' ' + text}
						verticalAlign="middle"
						width={100}
						x={4}
						y={34}
					/>
				</Group>
			</>
		);
	}

	const text = `id: ${entity.id} from ${entity.from} to ${entity.to}`;
	const {fromX, fromY, toX, toY} = points;
	const catetX = toX - fromX;
	const catetY = toY - fromY;
	const rotation = toY === fromY ? 0 : Math.atan(catetY / catetX) * (180 / Math.PI);

	return (
		<>
			<Group
				rotation={rotation}
				x={fromX + catetX / 2 - 50 - (rotation / 2)}
				y={fromY + catetY / 2 - 30 - (rotation / 2.2)}
			>
				<Rect
					cornerRadius={4}
					fill="#fff"
					height={58}
					opacity={0.9}
					width={108}
				/>
				<Text
					align="center"
					fill="#323232"
					fontFamily="Roboto"
					fontSize={10}
					fontStyle="bold"
					height={22}
					text={text}
					verticalAlign="middle"
					width={100}
					x={4}
					y={4}
				/>
				<Text
					align="center"
					fill="#737373"
					fontFamily="Roboto"
					fontSize={10}
					fontStyle="bold"
					height={22}
					text={text + ' ' + text}
					verticalAlign="middle"
					width={100}
					x={4}
					y={34}
				/>
			</Group>
			<Line
				key={entity.id}
				points={[fromX, fromY, toX, toY]}
				stroke="#595959"
				strokeWidth={2}
			/>
		</>
	);
};

export default Element;
