// @flow
import cn from 'classnames';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class IconButton extends PureComponent<Props> {
	static defaultProps = {
		className: '',
		tip: ''
	};

	render () {
		const {children, className, onClick, tip} = this.props;

		return (
			<button className={cn(styles.button, className)} onClick={onClick} title={tip}>
				{children}
			</button>
		);
	}
}

export default IconButton;
