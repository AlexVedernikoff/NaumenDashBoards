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

	getProps = () => {
		const {mixin, name, onSelect, type, value} = this.props;
		const {options} = this.state;
		const tip = type === TYPES.GROUP ? 'Группировка' : 'Агрегация';

		return {
			name,
			onSelect,
			options,
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
