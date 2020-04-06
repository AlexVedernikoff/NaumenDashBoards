// @flow
import {MaterialSelect} from 'components/molecules/index';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import type {SelectData} from 'store/customGroups/types';

export class SelectOperand extends PureComponent<Props> {
	static defaultProps = {
		data: {
			error: false,
			items: [],
			loading: true
		}
	};

	getOptionLabel = (option: SelectData) => option.title;

	getOptionValue = (option: SelectData) => option.uuid;

	handleSelect = (name: string, {title, uuid}: SelectData) => {
		const {onChange, operand} = this.props;
		const data = {
			title,
			uuid
		};

		onChange({...operand, data});
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
				onLoadOptions={onLoadData}
				onSelect={this.handleSelect}
				options={items}
				value={operand.data}
			/>
		);
	}
}

export default SelectOperand;
