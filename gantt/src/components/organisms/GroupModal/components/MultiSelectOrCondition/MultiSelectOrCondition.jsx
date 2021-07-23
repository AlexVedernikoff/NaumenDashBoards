// @flow
import {Component} from 'react';
import type {OnSelectEvent} from 'src/components/types';
import type {Props} from './types';

export class MultiSelectOrCondition extends Component<Props> {
	static defaultProps = {
		data: []
	};

	handleClear = () => {
		const {onChange, type} = this.props;

		onChange({data: [], type});
	};

	handleRemove = (index: number) => {
		const {data, onChange, type} = this.props;
		const newData = data.filter((o, i) => i !== index);

		onChange({
			data: newData,
			type
		});
	};

	handleSelect = ({value}: OnSelectEvent) => {
		const {data, getOptionValue, onChange, transform, type} = this.props;
		const selectData = transform ? transform(value) : value;
		const index = data.findIndex(currentValue => getOptionValue(currentValue) === getOptionValue(selectData));
		const newData = index > -1 ? data.filter((o, i) => i !== index) : [...data, selectData];

		onChange({
			data: newData,
			type
		});
	};

	render () {
		const {data, render} = this.props;

		return render({
			onClear: this.handleClear,
			onRemove: this.handleRemove,
			onSelect: this.handleSelect,
			values: data
		});
	}
}

export default MultiSelectOrCondition;
