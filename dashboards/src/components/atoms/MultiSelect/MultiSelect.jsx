// @flow
import ChevronDown from 'icons/form/chevron-down.svg';
import type {OptionType} from 'react-select/src/types';
import type {Props} from './types';
import React, {Component, Fragment} from 'react';
import Select from 'react-select';
import styles from './styles.less';

const DropdownIndicator = () => <ChevronDown className={styles.icon}/>;

const components = {
	DropdownIndicator,
	IndicatorSeparator: null
};

export class MultiSelect extends Component<Props> {
	static defaultProps = {
		isLoading: false,
		label: ''
	};

	handleChange = (value: OptionType) => {
		const {name, onChange} = this.props;
		onChange(name, value);
	};

	renderLabel = () => {
		const {label, value} = this.props;
		return label ? <label className={styles.label} htmlFor={value}>{label}</label> : null;
	};

	renderSelect = () => {
		const {
			getOptionLabel,
			getOptionValue,
			name,
			noOptionsMessage,
			options,
			placeholder,
			value
		} = this.props;

		return (
			<Select
				classNamePrefix={styles.multiselect}
				components={components}
				getOptionLabel={getOptionLabel}
				getOptionValue={getOptionValue}
				onChange={this.handleChange}
				id={name}
				noOptionsMessage={noOptionsMessage}
				options={options}
				placeholder={placeholder}
				value={value}
			/>
		);
	};

	render () {
		return (
			<Fragment>
				{this.renderLabel()}
				{this.renderSelect()}
			</Fragment>
		);
	}
}

export default MultiSelect;
