// @flow
import AddSignatureIcon from 'icons/AddSignatureIcon';
import React from 'react';
import SignatureTemplate from 'components/molecules/SignatureTemplate';
import styles from './SignatureFinalState.less';

const SignatureFinalState = () => {
	return (
		<SignatureTemplate>
			<div className={styles.wrapper}>
				<AddSignatureIcon/>
				<p className={styles.message}>Подпись добавлена</p>
			</div>
		</SignatureTemplate>
	);
};

export default SignatureFinalState;
