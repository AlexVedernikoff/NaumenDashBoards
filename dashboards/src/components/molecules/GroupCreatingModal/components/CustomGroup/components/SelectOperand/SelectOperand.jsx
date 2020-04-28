// @flow
import {Component} from 'react';
import type {Props, Value} from './types';

export class SelectOperand extends Component<Props> {
	handleSelect = (name: string, data: Value) => {
		const {convert, onChange, operand} = this.props;

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
