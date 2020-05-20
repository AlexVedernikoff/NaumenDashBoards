// @flow
import cn from 'classnames';
import {Icon} from 'components/atoms';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class IconButton extends PureComponent<Props> {
	static defaultProps = {
		className: '',
		tip: ''
	};

	render () {
		const {className, name, onClick, tip} = this.props;

		return (
			<button className={cn(styles.button, className)} onClick={onClick} title={tip}>
				<Icon name={name} />
			</button>
		);
	}
}

export default IconButton;
