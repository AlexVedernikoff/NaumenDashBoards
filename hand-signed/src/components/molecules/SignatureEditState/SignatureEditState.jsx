// @flow
import BackIcon from 'icons/BackIcon';
import Button from 'components/atoms/Button';
import {connect} from 'react-redux';
import DrawingStage from 'components/atoms/DrawingStage';
import {functions, props} from './selectors';
import type {Props} from './types';
import React, {Fragment, useCallback, useEffect, useRef} from 'react';
import SaveIcon from 'icons/SaveIcon';
import SignatureTemplate from 'components/molecules/SignatureTemplate';

const SignatureEditState = (props: Props) => {
	const {data, addSignature, sendSignature} = props;
	const stageRef = useRef(null);
	const buttonIsActive = Boolean(data.length);

	useEffect(() => {
		const handleResize = () => {
			addSignature([])
		}
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener(handleResize);
	}, []);

	const handleBackButton = useCallback(() => {
		addSignature(data.slice(0, -1));
	});

	const handleSaveButton = useCallback(() => {
		saveCanvasAsImageFile();
	}, []);

	const handleNewPart = useCallback((signature) => {
		addSignature([...data, ...signature])
	});

	const saveCanvasAsImageFile = () => {
		sendSignature(stageRef.current.toDataURL());
	};

	return (
		<SignatureTemplate>
			<DrawingStage saveNewPartSignature={handleNewPart} stageRef={stageRef} />
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
