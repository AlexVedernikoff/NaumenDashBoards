// @flow
import BackIcon from 'icons/BackIcon';
import Button from 'components/atoms/Button';
import {connect} from 'react-redux';
import DrawingStage from 'components/atoms/DrawingStage';
import {flattenArray} from 'helpers/array';
import Konva from 'konva';
import {functions, props} from './selectors';
import type {Props, SizesAndCoords} from './types';
import React, {Fragment, useCallback, useEffect, useRef} from 'react';
import SaveIcon from 'icons/SaveIcon';
import SignatureTemplate from 'components/molecules/SignatureTemplate';
import {STROKE_WIDTH} from 'components/atoms/DrawingStage/DrawingStage';

const SignatureEditState = (props: Props) => {
	const {data, addSignature, sendSignature} = props;
	const layerRef = useRef(null);
	const buttonIsActive = Boolean(data.length);

	useEffect(() => {
		const handleResize = () => {
			addSignature([]);
		};

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	const handleBackButton = useCallback(() => {
		addSignature(data.slice(0, -1));
	});

	const handleSaveButton = useCallback(() => {
		saveCanvasAsImageFile();
	});

	const handleNewPart = useCallback((signature) => {
		addSignature([...data, ...signature]);
	});

	/**
	 * Возвращает размеры нового холста и координаты подписи,
	 * по которым нужно найти подпись на текущем холсте и вырезать ее.
	 * Размеры вычисляются в зависимости от размера подписи.
	 * @return {SizesAndCoords} - возвращает размеры нового холста и координаты подписи.
	 */
	const getSizesAndCoords = (): SizesAndCoords => {
		const array = flattenArray(data);
		const coordsX = array.filter((item, index) => index % 2 !== 0);
		const coordsY = array.filter((item, index) => index % 2 === 0);

		const maxY = Math.max.apply(null, coordsX);
		const maxX = Math.max.apply(null, coordsY);

		const minY = Math.min.apply(null, coordsX);
		const minX = Math.min.apply(null, coordsY);

		const height = maxY - minY;
		const width = maxX - minX;

		return {
			height: height === 0 ? STROKE_WIDTH : height + Math.round(STROKE_WIDTH / 2) + 1,
			minY: minY < STROKE_WIDTH ? minY : minY - Math.round(STROKE_WIDTH / 2),
			minX: minX < STROKE_WIDTH ? minX : minX - Math.round(STROKE_WIDTH / 2),
			width: width === 0 ? STROKE_WIDTH : width + Math.round(STROKE_WIDTH / 2) + 1
		};
	};

	const saveCanvasAsImageFile = () => {
		const {height, minY, minX, width} = getSizesAndCoords();
		const id = 'container';
		const canvasPadding = 10;

		const div = document.createElement('div');
		div.id = id;

		if (document && document.body) {
			document.body.appendChild(div);
		}

		/*
			Подпись должна сместиться на 5 пунктов со всех краев холста.
			Слева и сверху смещается с помощью 'absolutePosition'.
			Справа и снизу смещается с помощью увеличения холста на 10 пунктов.
			5 пунктов подпись займет после смещения слева и сверху, остальные 5 будет пустое место.
		 */
		const stage = new Konva.Stage({
			container: id,
			height: height + canvasPadding,
			width: width + canvasPadding
		});

		const copy = layerRef.current.clip({
			x: minX,
			y: minY,
			width,
			height
		})
		/*
			Подпись может находиться в любых координатах.
			Необходимо ее скопировать с текущего местоположения и переместить в позицию x: 5, y: 5.
		 */
		.absolutePosition({
			x: 5 - minX,
			y: 5 - minY
		});

		stage.add(copy);

		sendSignature(stage.toDataURL());
	};

	return (
		<SignatureTemplate>
			<DrawingStage saveNewPartSignature={handleNewPart} layerRef={layerRef} />
			<Fragment>
				<Button
					disabled={!buttonIsActive}
					nameButton="Отменить"
					onClick={handleBackButton}
					icon={<BackIcon isActive={buttonIsActive}/>}
				/>
				<Button
					disabled={!buttonIsActive}
					icon={<SaveIcon isActive={buttonIsActive}/>}
					nameButton="Сохранить"
					onClick={handleSaveButton}
				/>
			</Fragment>
		</SignatureTemplate>
	);
};

export default connect(props, functions)(SignatureEditState);
