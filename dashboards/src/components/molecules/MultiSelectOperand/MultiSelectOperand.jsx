// @flow
import type {Data} from 'store/sources/attributesData/types';
import {MaterialMultiSelect} from 'components/molecules';
import type {Props} from './types';
import React, {PureComponent} from 'react';

export class MultiSelectOperand extends PureComponent<Props> {
	getOptionLabel = (option: Data) => option.title;

	getOptionValue = (option: Data) => option.uuid;

	handleClear = () => {
		const {onChange, type} = this.props;

		onChange({
			data: [],
			type
		});
	};

	handleRemove = (value: string) => {
		const {data: currentData, onChange, type} = this.props;
		const data = currentData.filter(option => this.getOptionValue(option) !== value);

		onChange({
			data,
			type
		});
	};

	handleSelect = (name: string, value: Data) => {
		const {data, onChange, type} = this.props;

		data.push(value);
		onChange({data, type});
	};

	render () {
		const {data, onClickShowMore, options, showMore} = this.props;

		return (
			<MaterialMultiSelect
				getOptionLabel={this.getOptionLabel}
				getOptionValue={this.getOptionValue}
				onClear={this.handleClear}
				onClickShowMore={onClickShowMore}
				onRemove={this.handleRemove}
				onSelect={this.handleSelect}
				options={options}
				showMore={showMore}
				values={data}
			/>
		);
	}
}

export default MultiSelectOperand;
