// @flow
import {FONT_FAMILIES} from 'store/widgets/data/constants';
import type {Props} from 'components/molecules/Select/types';
import React, {PureComponent} from 'react';
import Select from 'components/molecules/Select';
import styles from './styles.less';

export class FontFamilySelect extends PureComponent<Props> {
	static defaultProps = {
		className: styles.select,
		options: FONT_FAMILIES
	};

	render () {
		const {className, name, onSelect, options, value} = this.props;

		return (
			<Select
				className={className}
				name={name}
				onSelect={onSelect}
				options={options}
				value={value}
			/>
		);
	}
}

export default FontFamilySelect;
