// @flow
import {PLACEMENTS} from 'components/atoms/Tooltip/constants';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';
import {Tooltip} from 'components/atoms';

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
		<Tooltip text={this.props.tip} placement={PLACEMENTS.BOTTOM}>
			{this.renderButton()}
		</Tooltip>
	);

	render () {
		const {tip} = this.props;
		return tip ? this.renderButtonWithTip() : this.renderButton();
	}
}

export default IconButton;
