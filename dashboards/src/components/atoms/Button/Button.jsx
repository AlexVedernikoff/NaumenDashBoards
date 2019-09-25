// @flow
import cn from 'classnames';
import type {Props} from './types';
import React, {Component} from 'react';
import styles from './styles.less';

export class Button extends Component<Props> {
	static defaultProps = {
		type: 'button',
		variant: 'info'
	};

	getVariant = () => {
		const {outline, variant} = this.props;
		return styles[outline ? `outline-${variant}` : variant];
	};

	render () {
		const {children, onClick, type} = this.props;

		return (
			<button className={cn([styles.btn, this.getVariant()])} onClick={onClick} type={type}>
				{children}
			</button>
		);
	}
}

export default Button;
