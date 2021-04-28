// @flow
import {Component} from 'react';
import type {OnSelectEvent} from 'src/components/types';
import type {Props} from './types';

export class SelectOrCondition extends Component<Props> {
	handleSelect = ({value: option}: OnSelectEvent) => {
		const {onChange, value} = this.props;

		onChange({...value, data: option});
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
