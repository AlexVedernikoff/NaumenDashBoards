// @flow
import Button from 'components/atoms/Button';
import {connect} from 'react-redux';
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
			/>
		</SignatureTemplate>
	);
};

export default connect(props, functions)(SignatureStartState);
