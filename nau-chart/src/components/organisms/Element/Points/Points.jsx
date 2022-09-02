// @flow
import {Group, Image, Rect, Text} from 'react-konva';
import type {Props} from 'components/organisms/Element/types';
import React from 'react';
import useImage from 'use-image';

const Points = ({entity, handleContextMenu, onClick, onHover, x, y}: Props) => {
	const tileW = 108;
	const tileH = 58;
	const paddingText = 4;

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
				y={y - 22}
			/>
			<Group
				x={x - tileW / 2}
				y={y + 22}
			>
				<Rect
					cornerRadius={[paddingText, paddingText, 0, 0]}
					fill="#fff"
					height={tileH / 2}
					opacity={entity.title ? 0.9 : 0}
					width={tileW}
				/>
				<Rect
					cornerRadius={[0, 0, paddingText, paddingText]}
					fill="#fff"
					height={tileH / 2}
					opacity={entity.desc ? 0.9 : 0}
					width={tileW}
					y={entity.title ? tileH / 2 : 0}
				/>
				<Text
					align="center"
					fill="#323232"
					fontFamily="Roboto"
					fontSize={10}
					fontStyle="bold"
					height={tileH / 2 - paddingText * 3}
					opacity={entity.title ? 1 : 0}
					text={entity.title}
					verticalAlign="top"
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
					opacity={entity.desc ? 1 : 0}
					text={entity.desc}
					verticalAlign="top"
					width={tileW - paddingText * 2}
					x={paddingText}
					y={entity.title ? tileH / 2 + paddingText * 2 : paddingText}
				/>
			</Group>
		</Group>
	);
};

export default Points;
