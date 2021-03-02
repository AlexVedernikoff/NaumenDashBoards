// @flow
import {Component} from 'react';
import type {OnSelectEvent} from 'src/components/types';
import type {Props} from './types';

export class SelectOperand extends Component<Props> {
	handleSelect = ({value}: OnSelectEvent) => {
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
