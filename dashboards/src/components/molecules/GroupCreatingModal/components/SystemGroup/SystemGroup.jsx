// @flow
import {DEFAULT_SYSTEM_GROUP, GROUP_WAYS} from 'store/widgets/constants';
import {MaterialSelect} from 'components/molecules/index';
import type {Props, State} from './types';
import React, {PureComponent} from 'react';

export class SystemGroup extends PureComponent<Props, State> {
	static defaultProps = {
		defaultValue: DEFAULT_SYSTEM_GROUP.OVERLAP,
		options: []
	};

	state = {
		value: ''
	};

	componentDidMount () {
		const {defaultValue, group, options} = this.props;
		let value = defaultValue;

		if (options.findIndex(o => o.value === group.data) > -1) {
			value = group.data;
		}

		this.setState({value});
	}

	handleSelect = (name: string, {value}: Object) => this.setState({value});

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
				<div className={className}>
					<MaterialSelect
						onSelect={this.handleSelect}
						options={options}
						placeholder="Форматирование"
						value={value}
					/>
				</div>
			);
		}

		return null;
	}
}

export default SystemGroup;
