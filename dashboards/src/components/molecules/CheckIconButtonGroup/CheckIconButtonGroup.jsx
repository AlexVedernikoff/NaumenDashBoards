// @flow
import CheckIconButton from 'components/atoms/CheckIconButton';
import cn from 'classnames';
import Icon from 'components/atoms/Icon';
import type {Option, Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class CheckIconButtonGroup extends PureComponent<Props> {
	static defaultProps = {
		className: '',
		disabled: false,
		value: ''
	};

	renderOption = (option: Option) => {
		const {name, onChange, value: currentValue} = this.props;
		const {active, name: iconName, title, value} = option;
		const checked = active || value === currentValue;
		const content = iconName ? <Icon name={iconName} /> : title;

		return (
			<CheckIconButton
				checked={checked}
				key={value}
				name={name}
				onChange={onChange}
				title={title}
				value={value}
			>
				{content}
			</CheckIconButton>
		);
	};

	render () {
		const {className, disabled, options} = this.props;
		const CN = cn({
			[styles.container]: true,
			[styles.disabled]: disabled,
			[className]: true
		});

		return (
			<div className={CN}>
				{options.map(this.renderOption)}
			</div>
		);
	}
}

export default CheckIconButtonGroup;
