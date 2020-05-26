// @flow
import {Component} from 'react';
import type {Props, Value} from './types';

export class SelectOperand extends Component<Props> {
	handleSelect = (name: string, value: Value) => {
		const {convert, onChange, operand} = this.props;
		let data = value;

		if (convert) {
			data = convert(data);
		}

		onChange({...operand, data});
	};

	render () {
		const {operand, render} = this.props;

		return render({
			onSelect: this.handleSelect,
			value: operand.data
		});
	}
}

export default SelectOperand;
