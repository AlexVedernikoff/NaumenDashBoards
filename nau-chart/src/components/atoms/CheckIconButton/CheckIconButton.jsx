// @flow
import cn from 'classnames';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class CheckIconButton extends PureComponent<Props> {
	static defaultProps = {
		checked: false,
		name: '',
		title: ''
	};

	handleClick = () => {
		const {name, onChange, value} = this.props;

		onChange({name, value});
	};

	handleMouseDown = (e: MouseEvent) => e.preventDefault();

	render () {
		const {checked, children, title} = this.props;
		const buttonCN = cn({
			[styles.button]: true,
			[styles.checked]: checked
		});

		return (
			<button
				className={buttonCN}
				onClick={this.handleClick}
				onMouseDown={this.handleMouseDown}
				title={title}>
				{children}
			</button>
		);
	}
}

export default CheckIconButton;
