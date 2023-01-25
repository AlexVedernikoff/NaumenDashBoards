// @flow
import {Group, Image, Rect, Text} from 'react-konva';
import type {Props} from './types';
import React, {useEffect, useRef, useState} from 'react';
import useImage from 'use-image';

const Points = ({activeElement, entity, handleContextMenu, onClick, onHover, scale, searchObjects, x, y}: Props) => {
	const tileW = 108;
	const tileH = 58;
	const paddingText = 4;
	const [image] = useImage(entity.icon || 'image/point.svg');
	const refTitle = useRef(null);
	const refDesc = useRef(null);
	const [titleHeight, setTitleHeight] = useState(tileH / 2);
	const [descHeight, setDescHeight] = useState(tileH / 2);
	const [titleHeightTrim, setTitleHeightTrim] = useState('auto');
	const [descHeightTrim, setDescHeightTrim] = useState('auto');
	const isSearch = searchObjects.some(point => entity.uuid === point.uuid);
	const sizeImage = entity.uuid && (isSearch || (activeElement && activeElement.uuid === entity.uuid)) ? 66 / (scale < 1 ? scale * 2 : 1) : 44;
	const [action] = entity.actions || [];

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

	const handleOnHover = (hover: boolean) => () => {
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
			<Image
				height={sizeImage}
				image={image}
				width={sizeImage}
				x={x - sizeImage / 2}
				y={y - sizeImage / 2}
			/>
			<Group
				x={x - tileW / 2}
				y={y + sizeImage / 2}
			>
				{entity.header && <Rect
					cornerRadius={[paddingText, paddingText, 0, 0]}
					fill='#fff'
					height={titleHeight}
					opacity={0.9}
					width={tileW}
				/>}
				{entity.desc && <Rect
					cornerRadius={[0, 0, paddingText, paddingText]}
					fill='#fff'
					height={descHeight}
					opacity={0.9}
					width={tileW}
					y={titleHeight}
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
					width={tileW}
					x={0}
					y={0}
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
					width={tileW}
					x={0}
					y={titleHeight}
				/>}

			</Group>
		</Group>
	);
};

export default Points;
