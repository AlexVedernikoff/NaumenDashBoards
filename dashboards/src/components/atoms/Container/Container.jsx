// @flow
import type {Props} from './types';
import React, {PureComponent} from 'react';

export class Container extends PureComponent<Props> {
	render () {
		const {children, className, onClick, style, title} = this.props;

		return (
			<div className={className} onClick={onClick} style={style} title={title}>
				{children}
			</div>
		);
	}
}

export default Container;
