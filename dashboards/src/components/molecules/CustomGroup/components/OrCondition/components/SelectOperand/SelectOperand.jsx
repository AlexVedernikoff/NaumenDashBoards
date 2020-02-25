// @flow
import type {Data} from 'store/sources/attributesData/types';
import {MaterialSelect} from 'components/molecules';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import type {SelectData} from 'store/customGroups/types';

export class SelectOperand extends PureComponent<Props> {
	getOptionLabel = (option: Data) => option.title;

	getOptionValue = (option: Data) => option.uuid;

	handleSelect = (name: string, data: SelectData) => {
		const {onChange, operand} = this.props;
		onChange({...operand, data});
	};

	render () {
		const {onClickShowMore, operand, options, showMore} = this.props;

		return (
				<MaterialSelect
					getOptionLabel={this.getOptionLabel}
					getOptionValue={this.getOptionValue}
					onClickShowMore={onClickShowMore}
					onSelect={this.handleSelect}
					options={options}
					showMore={showMore}
					value={operand.data}
				/>
		);
	}
}

export default SelectOperand;
