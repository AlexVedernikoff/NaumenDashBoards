// @flow
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';
import {Tip} from 'components/atoms';

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
			<Tip text={tip}>
				<button className={styles.button} disabled={disabled} onClick={this.handleClick}>
					{children}
				</button>
			</Tip>
		);
	}
}

export default FieldButton;
