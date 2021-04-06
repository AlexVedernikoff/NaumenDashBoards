// @flow
import {Component} from 'react';
import type {OnSelectEvent} from 'components/types';
import type {Props} from './types';

export class MultiSelectOperand extends Component<Props> {
	handleClear = () => {
		const {onChange, operand} = this.props;

		onChange({
			...operand,
			data: []
		});
	};

	handleRemove = (value: string) => {
		const {getOptionValue, onChange, operand} = this.props;
		const {data: currentData} = operand;
		const data = currentData.filter(option => getOptionValue(option) !== value);

		onChange({
			...operand,
			data
		});
	};

	handleSelect = ({value}: OnSelectEvent) => {
		const {convert, getOptionValue, onChange, operand} = this.props;
		const index = operand.data.findIndex(currentValue => getOptionValue(currentValue) === getOptionValue(value));
		let {data} = operand;
		let dataValue = value;

		if (convert) {
			dataValue = convert(value);
		}

		index > -1 ? data.splice(index, 1) : data.push(dataValue);

		onChange({
			...operand,
			data: [...data]
		});
	};

	render () {
		const {operand, render} = this.props;

		return render({
			onClear: this.handleClear,
			onRemove: this.handleRemove,
			onSelect: this.handleSelect,
			values: operand.data
		});
	}
}

export default MultiSelectOperand;
