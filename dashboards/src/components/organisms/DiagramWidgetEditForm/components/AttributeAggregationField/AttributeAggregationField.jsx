// @flow
import {getAggregationOptions} from './helpers';
import {MiniSelect} from 'components/molecules';
import type {Props} from './types';
import React, {PureComponent} from 'react';

export class AttributeAggregationField extends PureComponent<Props> {
	static defaultProps = {
		usesNotApplicableAggregation: false
	};

	render () {
		const {attribute, name, onSelect, renderValue, usesNotApplicableAggregation, value} = this.props;
		const options = getAggregationOptions(attribute, usesNotApplicableAggregation);

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
