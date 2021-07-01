// @flow
import {connect} from 'react-redux';
import ErrorIcon from 'icons/ErrorIcon';
import {truncatedText} from 'components/atoms/TruncatedText';
import SignatureTemplate from 'components/molecules/SignatureTemplate';
import {props} from './selectors';
import type {Props} from './types';
import React from 'react';
import styles from './SignatureErrorState.less';

const SignatureErrorState = (props: Props) => {
	const {error} = props;

	return (
		<SignatureTemplate>
			<div className={styles.error}>
				<ErrorIcon/>
				<div className={styles.message}>{truncatedText(error)}</div>
			</div>
		</SignatureTemplate>
	);
};

export default connect(props)(SignatureErrorState);
