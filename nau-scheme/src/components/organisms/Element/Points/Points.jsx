// @flow
import {Group, Image, Rect, Text} from 'react-konva';
import type {Props} from 'components/organisms/Element/types';
import React from 'react';
import useImage from 'use-image';

const Points = ({entity, handleContextMenu, onClick, onHover, x, y}: Props) => {
	const [image] = useImage('image/point.svg');

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
					text={`id: ${entity.id} ${entity.title}`}
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
					text={`id: ${entity.id} ${entity.desc}`}
					verticalAlign="middle"
					width={100}
					x={4}
					y={34}
				/>
			</Group>
		</Group>
	);
};

export default Points;
