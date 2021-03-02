// @flow
import type {Props} from './types';
import React, {PureComponent} from 'react';

export class Value extends PureComponent<Props> {
	render () {
		const {className, label, onClick} = this.props;

		return <div className={className} onClick={onClick}>{label}</div>;
	}
}

export default Value;
