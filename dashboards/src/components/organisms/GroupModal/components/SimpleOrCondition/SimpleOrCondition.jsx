// @flow
import MaterialTextInput from 'src/components/atoms/MaterialTextInput';
import type {Props} from './types';
import React, {PureComponent} from 'react';

export class SimpleOrCondition extends PureComponent<Props> {
	static defaultProps = {
		float: false,
		onlyNumber: false
	};

	handleChange = (e: SyntheticInputEvent<HTMLInputElement>) => {
		const {float, onChange, value} = this.props;
		let {value: data} = e.currentTarget;

		if (float) {
			data = data.replace(/,/g, '.');
		}

		onChange({...value, data});
	};

	render () {
		const {onlyNumber, value} = this.props;

		return <MaterialTextInput onChange={this.handleChange} onlyNumber={onlyNumber} value={value.data} />;
	}
}

export default SimpleOrCondition;
