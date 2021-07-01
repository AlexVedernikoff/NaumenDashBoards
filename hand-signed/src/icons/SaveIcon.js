// @flow
import React from 'react';
import styles from './styles.less';

const SaveIcon = ({isActive = false}: Object) => (
	<svg className={isActive ? styles.enabled : styles.disabled} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path fillRule="evenodd" clipRule="evenodd" d="M9.00 16.19L4.80 11.99L3.40 13.39L9.00 18.99L21 6.99L19.6 5.59L9.00 16.19Z"/>
	</svg>
);

export default SaveIcon;
