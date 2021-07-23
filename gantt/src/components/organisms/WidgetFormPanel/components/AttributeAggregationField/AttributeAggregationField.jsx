// @flow
import {getAggregationOptions} from './helpers';
import MiniSelect from 'components/molecules/MiniSelect';
import type {Props} from './types';
import React, {PureComponent} from 'react';

export class AttributeAggregationField extends PureComponent<Props> {
	static defaultProps = {
		usesNotApplicableAggregation: false
	};

	render () {
		const {attribute, onSelect, renderValue, usesNotApplicableAggregation, value} = this.props;
		const options = getAggregationOptions(attribute, usesNotApplicableAggregation);

		return (
			<MiniSelect
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
