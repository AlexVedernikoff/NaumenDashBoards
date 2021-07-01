// @flow
import {connect} from 'react-redux';
import {props} from './selectors';
import type {Props} from './types';
import React from 'react';
import styles from './SignatureTemplate.less';

const SignatureTemplate = (props: Props) => {
	const {children} = props;

	return (
		<div className={styles.wrapper}>
			<div className={styles.stage}>
				{children[0] || children}
			</div>
			<div className={styles.group}>
				{children[1] && children[1]}
			</div>
		</div>
	);
};

export default connect(props)(SignatureTemplate);
