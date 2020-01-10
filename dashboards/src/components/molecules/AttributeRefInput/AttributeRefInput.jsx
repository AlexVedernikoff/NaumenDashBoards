// @flow
import {getAggregateOptions, getGroupOptions} from './helpers';
import {MiniSelect} from 'components/molecules';
import type {Props, State} from './types';
import React, {PureComponent} from 'react';
import {TYPES} from './constants';

export class AttributeRefInput extends PureComponent<Props, State> {
	static defaultProps = {
		mixin: {}
	};

	state = {
		options: []
	};

	static getDerivedStateFromProps (props: Props) {
		const {attribute, type} = props;
		const options = type === TYPES.GROUP ? getGroupOptions(attribute) : getAggregateOptions(attribute);

		return {
			options
		};
	}

	getTip = (type: string) => {
		const {AGGREGATION, COMPUTE, GROUP} = TYPES;

		switch (type) {
			case AGGREGATION:
				return 'Агрегация';
			case COMPUTE:
				return 'Редактировать поле';
			case GROUP:
				return 'Группировка';
		}
	};

	getProps = () => {
		const {mixin, name, onSelect, renderValue, type, value} = this.props;
		const {options} = this.state;
		const tip = this.getTip(type);

		return {
			name,
			onSelect,
			options,
			renderValue,
			tip,
			value,
			...mixin
		};
	};

	render () {
		const props = this.getProps();
		return <MiniSelect {...props} />;
	}
}

export default AttributeRefInput;
