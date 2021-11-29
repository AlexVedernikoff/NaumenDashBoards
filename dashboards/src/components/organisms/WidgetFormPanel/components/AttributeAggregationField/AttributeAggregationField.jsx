// @flow
import {getAggregationOptions} from './helpers';
import MiniSelect from 'components/molecules/MiniSelect';
import type {Props, State} from './types';
import React, {PureComponent} from 'react';

export class AttributeAggregationField extends PureComponent<Props, State> {
	static defaultProps = {
		hasPercentAggregation: true,
		usesNotApplicableAggregation: false
	};

	state = {
		options: getAggregationOptions(null)
	};

	checkValueInOptions = (value: string) => {
		const {name, onSelect} = this.props;
		const {options} = this.state;

		if (options.findIndex(option => option.value === value) === -1) {
			onSelect(name, options[0].value);
		}
	};

	componentDidMount () {
		const {attribute, hasPercentAggregation, usesNotApplicableAggregation, value} = this.props;
		const options = getAggregationOptions(attribute, hasPercentAggregation, usesNotApplicableAggregation);

		this.setState({options}, () => this.checkValueInOptions(value));
	}

	componentDidUpdate (prevProps: Props) {
		const {attribute, hasPercentAggregation, usesNotApplicableAggregation, value} = this.props;

		if (
			prevProps.attribute !== attribute
			|| prevProps.usesNotApplicableAggregation !== usesNotApplicableAggregation
			|| prevProps.hasPercentAggregation !== hasPercentAggregation
		) {
			const options = getAggregationOptions(attribute, hasPercentAggregation, usesNotApplicableAggregation);

			this.setState({options}, () => this.checkValueInOptions(value));
		}

		if (prevProps.value !== value) {
			this.checkValueInOptions(value);
		}
	}

	render () {
		const {onSelect, renderValue, value} = this.props;
		const {options} = this.state;
		const showCaret = options.length > 1;

		return (
			<MiniSelect
				isDisabled={!showCaret}
				onSelect={onSelect}
				options={options}
				renderValue={renderValue}
				showCaret={showCaret}
				tip="Агрегация"
				value={value}
			/>
		);
	}
}

export default AttributeAggregationField;
