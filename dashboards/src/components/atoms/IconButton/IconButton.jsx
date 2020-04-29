// @flow
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class IconButton extends PureComponent<Props> {
	static defaultProps = {
		tip: ''
	};

	render () {
		const {children, onClick, tip} = this.props;

		return (
			<button
				className={styles.button}
				onClick={onClick}
				title={tip}
				type="button"
			>
				{children}
			</button>
		);
	}
}

export default IconButton;
