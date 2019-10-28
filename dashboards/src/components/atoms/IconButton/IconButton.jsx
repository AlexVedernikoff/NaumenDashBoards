// @flow
import type {Props} from './types';
import React, {Fragment, PureComponent} from 'react';
import ReactTooltip from 'react-tooltip';
import styles from './styles.less';

export class IconButton extends PureComponent<Props> {
	static defaultProps = {
		tip: ''
	};

	renderButton = () => {
		const {children, onClick, tip} = this.props;

		return (
			<button
				className={styles.button}
				data-tip={tip}
				onClick={onClick}
				type="button"
			>
				{children}
			</button>
		);
	};

	renderTip = () => this.props.tip && <ReactTooltip effect="solid" type="info" />;

	render () {
		return (
			<Fragment>
				{this.renderButton()}
				{this.renderTip()}
			</Fragment>
		);
	}
}

export default IconButton;
