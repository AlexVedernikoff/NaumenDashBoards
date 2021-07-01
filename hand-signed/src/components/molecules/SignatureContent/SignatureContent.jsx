// @flow
import {connect} from 'react-redux';
import {SIGNATURE_STATE} from '../../../store/signature/constants';
import type {Props} from './types';
import {props} from './selectors';
import React from 'react';
import SignatureEditState from 'components/molecules/SignatureEditState';
import SignatureErrorState from 'components/molecules/SignatureErrorState';
import SignatureFinalState from 'components/molecules/SignatureFinalState';
import SignatureStartState from 'components/molecules/SignatureStartState';
import WithLoading from 'components/hocs/WithLoading';

const SignatureContent = (props: Props) => {
	const {state} = props;

	switch (state) {
		case SIGNATURE_STATE.EDIT_STATE:
			return <SignatureEditState/>;
		case SIGNATURE_STATE.ERROR_STATE:
			return <SignatureErrorState/>;
		case SIGNATURE_STATE.FINAL_STATE:
			return <SignatureFinalState/>;
		case SIGNATURE_STATE.START_STATE:
			return <SignatureStartState/>;
	}
};

export default connect(props)(WithLoading(SignatureContent));
