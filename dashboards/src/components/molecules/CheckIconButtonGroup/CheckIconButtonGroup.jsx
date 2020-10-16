// @flow
import {CheckIconButton, Icon} from 'components/atoms';
import cn from 'classnames';
import type {Icon as IconType, Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class CheckIconButtonGroup extends PureComponent<Props> {
	static defaultProps = {
		className: '',
		disabled: false
	};

	renderIcon = (option: IconType) => {
		const {name, onChange, value: currentValue} = this.props;
		const {name: iconName, title, value} = option;

		return (
			<CheckIconButton
				checked={value === currentValue}
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
