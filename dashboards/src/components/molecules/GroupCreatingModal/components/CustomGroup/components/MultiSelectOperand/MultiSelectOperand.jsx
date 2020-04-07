// @flow
import {Component} from 'react';
import type {Props} from './types';
import type {SelectData} from 'store/customGroups/types';

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

	handleSelect = (name: string, {title, uuid}: SelectData) => {
		const {onChange, operand} = this.props;
		const index = operand.data.findIndex(i => i.uuid === uuid);
		let {data} = operand;

		index > -1 ? data.splice(index, 1) : data.push({title, uuid});

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
