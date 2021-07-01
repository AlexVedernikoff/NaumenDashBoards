// @flow
import Button from 'components/atoms/Button';
import {connect} from 'react-redux';
import PenIcon from 'icons/PenIcon';
import type {Props} from './types';
import {props, functions} from './selectors';
import React, {useCallback} from 'react';
import {SIGNATURE_STATE} from 'store/signature/constants';
import SignatureTemplate from 'components/molecules/SignatureTemplate/';

const SignatureStartState = (props: Props) => {
	const {drawingStartButtonName, setNewState} = props;

	const handleStartButton = useCallback(() => {
		return setNewState(SIGNATURE_STATE.EDIT_STATE);
	}, []);

	return (
		<SignatureTemplate>
			<Button
				nameButton={drawingStartButtonName}
				onClick={handleStartButton}
				icon={<PenIcon/>}
			/>
		</SignatureTemplate>
	);
};

export default connect(props, functions)(SignatureStartState);
