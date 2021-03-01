// @flow
import type {Props} from './types';
import React, {PureComponent} from 'react';

export class Container extends PureComponent<Props> {
	render () {
		const {children, className, onClick} = this.props;

		return (
			<div className={className} onClick={onClick}>
				{children}
			</div>
		);
	}
}

export default Container;
