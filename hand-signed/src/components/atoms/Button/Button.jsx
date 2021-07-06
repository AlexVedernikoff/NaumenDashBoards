// @flow
import type {Props} from './types';
import React from 'react';
import styles from './Button.less';

const Button = (props: Props) => {
	const {icon, nameButton, onClick: handleClick, disabled = false} = props;

	return (
		<button
			disabled={disabled}
			className={styles.button}
			onClick={handleClick}
		>
			{icon && <div className={styles.icon}>{icon}</div>}
			<span className={styles.label}>{nameButton}</span>
		</button>
    );
};

export default Button;
