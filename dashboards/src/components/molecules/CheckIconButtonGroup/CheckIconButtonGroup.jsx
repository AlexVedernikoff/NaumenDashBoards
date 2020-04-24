// @flow
import {CheckIconButton, Icon} from 'components/atoms';
import cn from 'classnames';
import type {Icon as IconType, Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class CheckIconButtonGroup extends PureComponent<Props> {
	static defaultProps = {
		className: ''
	};

	renderIcon = (option: IconType) => {
		const {name, onChange, value: currentValue} = this.props;
		const {name: iconName, value} = option;

		return (
			<CheckIconButton
				checked={value === currentValue}
				name={name}
				onChange={onChange}
				value={value}
			>
				<Icon name={iconName} />
			</CheckIconButton>
		);
	}

	render () {
		const {className, icons} = this.props;

		return (
			<div className={cn(styles.container, className)}>
				{icons.map(this.renderIcon)}
			</div>
		);
	}
}

export default CheckIconButtonGroup;