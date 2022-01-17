// @flow
import CheckIconButtonGroup from 'components/molecules/CheckIconButtonGroup';
import type {OnChangeEvent} from 'components/types';
import {options} from './constants';
import type {Props} from 'components/molecules/CheckIconButtonGroup/types';
import React, {PureComponent} from 'react';
import {translateObjectsArray} from 'localization';

export class FontStyleControl extends PureComponent<Props> {
	static defaultProps = {
		...CheckIconButtonGroup.defaultProps,
		options: options
	};

	handleChange = ({value: newValue}: OnChangeEvent<string>) => {
		const {name, onChange, value} = this.props;

		onChange({
			name,
			value: value === newValue ? null : newValue
		});
	};

	render () {
		const {name, options, value} = this.props;
		const tOptions = translateObjectsArray('title', options);

		return <CheckIconButtonGroup name={name} onChange={this.handleChange} options={tOptions} value={value} />;
	}
}

export default FontStyleControl;
