// @flow
import ChevronDown from 'icons/form/chevron-down.svg';
import type {OptionType} from 'react-select/src/types';
import type {Props} from './types';
import React, {Component} from 'react';
import ReactSelect from 'react-select';
import styles from './styles.less';

const DropdownIndicator = () => <ChevronDown className={styles.icon}/>;

const defaultComponents = {
	DropdownIndicator,
	IndicatorSeparator: null
};

/* Компонент является декоратором для Select библиотеки react-select.
* !!! Все props пробрасываются дальше в компонент Select.
*/
export class Select extends Component<Props> {
	static defaultProps = {
		small: false
	};

	handleSelect = (value: OptionType) => {
		const {onSelect, name} = this.props;
		onSelect(name, value);
	};

	render () {
		const {components, small, ...props} = this.props;
		const selectCN = small ? styles.selectSizeSmall : styles.selectSizeNormal;

		return (
			<ReactSelect
				className={selectCN}
				classNamePrefix={styles.multiselect}
				components={{...defaultComponents, ...components}}
				onChange={this.handleSelect}
				{...props}
			/>
		);
	}
}

export default Select;
