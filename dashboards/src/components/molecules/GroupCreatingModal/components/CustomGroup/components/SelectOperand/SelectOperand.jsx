// @flow
import {Component} from 'react';
import type {Props} from './types';
import type {SelectData} from 'store/customGroups/types';

export class SelectOperand extends Component<Props> {
	handleSelect = (name: string, {title, uuid}: SelectData) => {
		const {onChange, operand} = this.props;
		const data = {
			title,
			uuid
		};

		onChange({...operand, data});
	};

	render () {
		const {operand, render} = this.props;

		return render({
			onSelect: this.handleSelect,
			value: operand.data
		});
	}
}

export default SelectOperand;
