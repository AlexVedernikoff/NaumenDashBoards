// @flow
import CheckIconButtonGroup from 'components/molecules/CheckIconButtonGroup';
import {options} from './constants';
import type {Props} from 'components/molecules/CheckIconButtonGroup/types';
import React, {PureComponent} from 'react';

export class TextAlignControl extends PureComponent<Props> {
	static defaultProps = {
		...CheckIconButtonGroup.defaultProps,
		options: options
	};

	render () {
		const {name, onChange, options, value} = this.props;

		return <CheckIconButtonGroup name={name} onChange={onChange} options={options} value={value} />;
	}
}

export default TextAlignControl;
