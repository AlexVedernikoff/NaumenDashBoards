// @flow
import {getAggregationOptions} from './helpers';
import {MiniSelect} from 'components/molecules';
import type {Props} from './types';
import React, {PureComponent} from 'react';

export class AttributeAggregationField extends PureComponent<Props> {
	render () {
		const {attribute, name, onSelect, renderValue, value} = this.props;
		const options = getAggregationOptions(attribute);

		return (
			<MiniSelect
				name={name}
				onSelect={onSelect}
				options={options}
				renderValue={renderValue}
				tip="Агрегация"
				value={value}
			/>
		);
	}
}

export default AttributeAggregationField;
