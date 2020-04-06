// @flow
import {MaterialSelect} from 'components/molecules/index';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import type {SelectData} from 'store/customGroups/types';

export class MultiSelectOperand extends PureComponent<Props> {
	static defaultProps = {
		data: {
			error: false,
			items: [],
			loading: true
		}
	};

	getOptionLabel = (option: Object) => option.title;

	getOptionValue = (option: Object) => option.uuid;

	handleClear = () => {
		const {onChange, operand} = this.props;

		onChange({
			...operand,
			data: []
		});
	};

	handleRemove = (value: string) => {
		const {onChange, operand} = this.props;
		const {data: currentData} = operand;
		const data = currentData.filter(option => this.getOptionValue(option) !== value);

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
		const {data, onLoadData, operand} = this.props;
		const {items, loading} = data;

		return (
			<MaterialSelect
				async={true}
				getOptionLabel={this.getOptionLabel}
				getOptionValue={this.getOptionValue}
				loading={loading}
				multiple={true}
				onClear={this.handleClear}
				onLoadOptions={onLoadData}
				onRemove={this.handleRemove}
				onSelect={this.handleSelect}
				options={items}
				values={operand.data}
			/>
		);
	}
}

export default MultiSelectOperand;
