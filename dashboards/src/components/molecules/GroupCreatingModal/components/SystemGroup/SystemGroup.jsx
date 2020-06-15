// @flow
import {FormControl, Select} from 'components/molecules/index';
import {GROUP_WAYS} from 'store/widgets/constants';
import type {Props, State} from './types';
import React, {PureComponent} from 'react';

export class SystemGroup extends PureComponent<Props, State> {
	state = {
		value: ''
	};

	componentDidMount () {
		const {defaultValue, group, onSelect, options, setSubmit} = this.props;
		let value = defaultValue;

		if (options.findIndex(o => o.value === group.data) > -1) {
			value = group.data;
		}

		this.setState({value});
		onSelect && onSelect(value);
		setSubmit(this.submit);
	}

	handleSelect = ({value: selectValue}: Object) => {
		const {onSelect} = this.props;
		const {value} = selectValue;

		this.setState({value});
		onSelect && onSelect(value);
	};

	submit = () => {
		const {defaultValue, onSubmit} = this.props;
		const {value} = this.state;

		onSubmit({data: value || defaultValue, way: GROUP_WAYS.SYSTEM});
	};

	render () {
		const {className, options, show} = this.props;

		if (show && options.length > 0) {
			const value = options.find(o => o.value === this.state.value) || null;

			return (
				<FormControl className={className} label="Форматирование">
					<Select
						onSelect={this.handleSelect}
						options={options}
						placeholder="Форматирование"
						value={value}
					/>
				</FormControl>
			);
		}

		return null;
	}
}

export default SystemGroup;
