// @flow
import type {Data} from 'store/sources/attributesData/types';
import {MaterialSelect} from 'components/molecules';
import type {Props} from './types';
import React, {PureComponent} from 'react';

export class MultiSelectOperand extends PureComponent<Props> {
	getOptionLabel = (option: Data) => option.title;

	getOptionValue = (option: Data) => option.uuid;

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

	handleSelect = (name: string, value: Data) => {
		const {onChange, operand} = this.props;

		operand.data.push(value);
		onChange(operand);
	};

	render () {
		const {onClickShowMore, operand, options, showMore} = this.props;

		return (
			<MaterialSelect
				getOptionLabel={this.getOptionLabel}
				getOptionValue={this.getOptionValue}
				onClear={this.handleClear}
				onClickShowMore={onClickShowMore}
				onRemove={this.handleRemove}
				onSelect={this.handleSelect}
				options={options}
				showMore={showMore}
				values={operand.data}
			/>
		);
	}
}

export default MultiSelectOperand;
