// @flow
import {Component} from 'react';
import type {OnSelectEvent} from 'src/components/types';
import type {Props} from './types';

export class SelectOrCondition extends Component<Props> {
	handleSelect = ({value}: OnSelectEvent) => {
		const {onChange, transform, value: condition} = this.props;
		const data = transform ? transform(value) : value;

		onChange({...condition, data});
	};

	render () {
		const {render, value} = this.props;

		return render({
			onSelect: this.handleSelect,
			value: value.data
		});
	}
}

export default SelectOrCondition;
