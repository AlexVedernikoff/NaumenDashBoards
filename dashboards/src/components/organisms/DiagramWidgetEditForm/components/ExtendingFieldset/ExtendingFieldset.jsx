// @flow
import cn from 'classnames';
import ExtendButton from 'components/atoms/ExtendButton';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class ExtendingFieldset extends PureComponent<Props> {
	static defaultProps = {
		className: '',
		disabled: false
	};

	renderChildren = () => {
		const {children, show} = this.props;

		if (show) {
			return children;
		}
	};

	renderExtendButton = () => {
		const {onClick, show, text} = this.props;

		return <ExtendButton active={show} onClick={onClick} text={text} />;
	};

	render () {
		const {className, disabled} = this.props;
		const CN = cn({
			[className]: true,
			[styles.disabled]: disabled
		});

		return (
			<div className={CN}>
				{this.renderExtendButton()}
				{this.renderChildren()}
			</div>
		);
	}
}

export default ExtendingFieldset;
