// @flow
import {getAggregationOptions} from './helpers';
import MiniSelect from 'components/molecules/MiniSelect';
import type {Props, State} from './types';
import React, {PureComponent} from 'react';

export class AttributeAggregationField extends PureComponent<Props, State> {
	static defaultProps = {
		usesNotApplicableAggregation: false
	};

	state = {
		options: getAggregationOptions(null, false)
	};

	checkValueInOptions = (value: string) => {
		const {name, onSelect} = this.props;
		const {options} = this.state;

		if (options.findIndex(option => option.value === value) === -1) {
			onSelect(name, options[0].value);
		}
	};

	componentDidMount () {
		const {attribute, usesNotApplicableAggregation} = this.props;
		const options = getAggregationOptions(attribute, usesNotApplicableAggregation);

		this.setState({options});
	}

	componentDidUpdate (prevProps: Props) {
		const {attribute, usesNotApplicableAggregation, value} = this.props;

		if (prevProps.attribute !== attribute || prevProps.usesNotApplicableAggregation !== usesNotApplicableAggregation) {
			const options = getAggregationOptions(attribute, usesNotApplicableAggregation);

			this.setState({options}, () => this.checkValueInOptions(value));
		}

		if (prevProps.value !== value) {
			this.checkValueInOptions(value);
		}
	}

	render () {
		const {onSelect, renderValue, value} = this.props;
		const {options} = this.state;

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
