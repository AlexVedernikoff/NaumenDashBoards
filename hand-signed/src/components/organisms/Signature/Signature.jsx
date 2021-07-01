// @flow
import {connect} from 'react-redux';
import type {Props} from './types';
import {props} from './selectors';
import React from 'react';
import SignatureContent from 'components/molecules/SignatureContent';
import styles from './Signature.less';
import 'styles/styles.less';
import {isIOS} from 'react-device-detect';

export const Signature = (props: Props) => {
	const {loading} = props;

	return (
		<div className={`${styles.wrapper} ${isIOS && styles.ios}`}>
			<SignatureContent isLoading={loading}/>
		</div>
	);
};

export default connect(props)(Signature);
