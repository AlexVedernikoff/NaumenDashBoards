// @flow
import {ExtendButton} from 'components/atoms';
import {FormField} from 'components/molecules';
import type {Props} from './types';
import React, {Fragment, PureComponent} from 'react';

export class ExtendingFieldset extends PureComponent<Props> {
	handleClick = () => {
		const {index, onClick} = this.props;
		onClick(index);
	};

	renderChildren = () => {
		const {children, show} = this.props;

		if (show) {
			return children;
		}
	};

	renderExtendButton = () => {
		const {show, text} = this.props;

		return (
			<FormField>
				<ExtendButton active={show} onClick={this.handleClick} text={text} />
			</FormField>
		);
	};

	render () {
		return (
			<Fragment>
				{this.renderExtendButton()}
				{this.renderChildren()}
			</Fragment>
		);
	}
}

export default ExtendingFieldset;
