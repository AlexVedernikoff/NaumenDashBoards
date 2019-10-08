// @flow
import ChevronDown from 'icons/form/chevron-down.svg';
import type {OptionType} from 'react-select/src/types';
import type {Props} from './types';
import React, {Component} from 'react';
import Select from 'react-select';
import styles from './styles.less';

const DropdownIndicator = () => <ChevronDown className={styles.icon}/>;

const components = {
	DropdownIndicator,
	IndicatorSeparator: null
};

/* Компонент является декоратором для Select библиотеки react-select.
* !!! Все props пробрасываются дальше в компонент Select.
*/
export class MultiSelect extends Component<Props> {
	handleSelect = (value: OptionType) => {
		const {onSelect, name} = this.props;
		onSelect(name, value);
	};

	render () {
		return (
			<Select
				classNamePrefix={styles.multiselect}
				components={components}
				onChange={this.handleSelect}
				{...this.props}
			/>
		);
	}
}

export default MultiSelect;
