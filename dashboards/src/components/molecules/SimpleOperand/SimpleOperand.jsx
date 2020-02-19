// @flow
import {MaterialTextInput} from 'components/atoms';
import type {Props} from './types';
import React, {PureComponent} from 'react';

export class SimpleOperand extends PureComponent<Props> {
	handleChange = (e: SyntheticInputEvent<HTMLInputElement>) => {
		const {float, onChange, type} = this.props;
		let {value: data} = e.currentTarget;

		if (float) {
			data = data.replace(/,/g, '.');
		}

		onChange({data, type});
	};

	render () {
		const {data, onlyNumber} = this.props;

		return (
			<MaterialTextInput
				onChange={this.handleChange}
				onlyNumber={onlyNumber}
				value={data}
			/>
		);
	}
}

export default SimpleOperand;
