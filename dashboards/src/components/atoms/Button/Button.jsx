// @flow
import cn from 'classnames';
import type {Props} from './types';
import React, {Component} from 'react';
import styles from './styles.less';

export class Button extends Component<Props> {
	static defaultProps = {
		block: false,
		className: '',
		disabled: false,
		outline: false,
		type: 'button',
		variant: 'info'
	};

	getClassNames = () => {
		const {block, className, variant} = this.props;
		const mixins = [styles[variant]];

		if (block) {
			mixins.push(styles.block);
		}

		if (className) {
			mixins.push(className);
		}

		return cn([styles.button, ...mixins]);
	};

	render () {
		const {children, disabled, onClick, type} = this.props;

		const className = this.getClassNames();
		const props = {
			children,
			className,
			disabled,
			onClick,
			type
		};

		return (
			<button {...props}>
				{children}
			</button>
		);
	}
}

export default Button;
