// @flow
import classnames from 'classnames';
import type {Node} from 'react';
import Plus from 'icons/form/plus.svg';
import type {Props} from './types';
import React, {Component} from 'react';
import styles from './styles.less';

const icons = {
	plus: Plus
};

export class Label extends Component<Props> {
	static defaultProps: {
		className: '',
		icon: ''
	};

	renderContent = (): Node => {
		const {className, icon, name} = this.props;
		const classProps: string = classnames(
			className,
			styles.textWithIcon
		);

		return (
			<div className={classProps}>
				<p className={styles.name}>{name}</p>
				{icon && this.renderIcon()}
			</div>
		);
	};

	renderIcon = (): Node => {
		const {icon, onClick} = this.props;
		const Icon = icons[icon];

		return (
			<div className={styles.icon}>
				<Icon onClick={onClick} />
			</div>
		);
	};

	render () {
		return this.renderContent();
	}
}

export default Label;
