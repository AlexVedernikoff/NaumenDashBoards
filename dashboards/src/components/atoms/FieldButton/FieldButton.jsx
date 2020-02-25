// @flow
import type {Props} from './types';
import React, {PureComponent} from 'react';
import {SimpleTooltip} from 'components/atoms';
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
			<SimpleTooltip text={tip}>
				<button className={styles.button} disabled={disabled} onClick={this.handleClick}>
					{children}
				</button>
			</SimpleTooltip>
		);
	}
}

export default FieldButton;
