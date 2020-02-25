// @flow
import type {Props} from './types';
import React, {PureComponent} from 'react';
import {SimpleTooltip} from 'components/atoms';
import styles from './styles.less';

export class IconButton extends PureComponent<Props> {
	static defaultProps = {
		tip: ''
	};

	renderButton = () => {
		const {children, onClick} = this.props;

		return (
			<button
				className={styles.button}
				onClick={onClick}
				type="button"
			>
				{children}
			</button>
		);
	};

	renderButtonWithTip = () => (
		<SimpleTooltip className={styles.tooltip} text={this.props.tip}>
			{this.renderButton()}
		</SimpleTooltip>
	);

	render () {
		return this.props.tip ? this.renderButtonWithTip() : this.renderButton();
	}
}

export default IconButton;
