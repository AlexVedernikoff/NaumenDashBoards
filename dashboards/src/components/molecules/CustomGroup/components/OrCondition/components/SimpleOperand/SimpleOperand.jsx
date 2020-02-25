// @flow
import {MaterialTextInput} from 'components/atoms';
import type {Props} from './types';
import React, {PureComponent} from 'react';

export class SimpleOperand extends PureComponent<Props> {
	handleChange = (e: SyntheticInputEvent<HTMLInputElement>) => {
		const {float, onChange, operand} = this.props;
		let {value: data} = e.currentTarget;

		if (float) {
			data = data.replace(/,/g, '.');
		}

		onChange({...operand, data});
	};

	render () {
		const {onlyNumber, operand} = this.props;

		return (
			<MaterialTextInput
				onChange={this.handleChange}
				onlyNumber={onlyNumber}
				value={operand.data}
			/>
		);
	}
}

export default SimpleOperand;
