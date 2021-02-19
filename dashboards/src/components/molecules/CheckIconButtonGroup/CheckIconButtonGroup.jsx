// @flow
import CheckIconButton from 'components/atoms/CheckIconButton';
import cn from 'classnames';
import Icon from 'components/atoms/Icon';
import type {Icon as IconType, Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class CheckIconButtonGroup extends PureComponent<Props> {
	static defaultProps = {
		className: '',
		disabled: false,
		value: ''
	};

	renderIcon = (option: IconType) => {
		const {name, onChange, value: currentValue} = this.props;
		const {active, name: iconName, title, value} = option;
		const checked = active || value === currentValue;

		return (
			<CheckIconButton
				checked={checked}
				key={value}
				name={name}
				onChange={onChange}
				title={title}
				value={value}
			>
				<Icon name={iconName} />
			</CheckIconButton>
		);
	};

	render () {
		const {className, disabled, icons} = this.props;
		const CN = cn({
			[styles.container]: true,
			[styles.disabled]: disabled,
			[className]: true
		});

		return (
			<div className={CN}>
				{icons.map(this.renderIcon)}
			</div>
		);
	}
}

export default CheckIconButtonGroup;
