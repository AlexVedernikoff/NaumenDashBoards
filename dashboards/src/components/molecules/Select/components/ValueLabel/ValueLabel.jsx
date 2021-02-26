// @flow
import type {Props} from './types';
import React, {PureComponent} from 'react';

export class ValueLabel extends PureComponent<Props> {
	render () {
		const {className, label} = this.props;

		return <div className={className}>{label}</div>;
	}
}

export default ValueLabel;
