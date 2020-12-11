// @flow
import type {Props} from './types';
import React, {PureComponent} from 'react';

export class Container extends PureComponent<Props> {
	render () {
		const {children, className} = this.props;

		return (
			<div className={className}>
				{children}
			</div>
		);
	}
}

export default Container;
