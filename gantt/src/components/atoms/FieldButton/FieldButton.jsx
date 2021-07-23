// @flow
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class FieldButton extends PureComponent<Props> {
	static defaultProps = {
		disabled: false
	};

	handleClick = (e: SyntheticMouseEvent<HTMLButtonElement>) => {
		const {onClick} = this.props;

		e.preventDefault();
		onClick();
	};

	render () {
		const {children, disabled, tip} = this.props;

		return (
			<button className={styles.button} disabled={disabled} onClick={this.handleClick} title={tip}>
				{children}
			</button>
		);
	}
}

export default FieldButton;
