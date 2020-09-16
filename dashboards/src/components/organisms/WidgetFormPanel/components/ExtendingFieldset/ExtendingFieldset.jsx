// @flow
import {ExtendButton} from 'components/atoms';
import type {Props} from './types';
import React, {PureComponent} from 'react';

export class ExtendingFieldset extends PureComponent<Props> {
	static defaultProps = {
		className: ''
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
		const {className} = this.props;

		return (
			<div className={className}>
				{this.renderExtendButton()}
				{this.renderChildren()}
			</div>
		);
	}
}

export default ExtendingFieldset;
