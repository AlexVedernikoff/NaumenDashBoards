// @flow
import cn from 'classnames';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class CheckIconButton extends PureComponent<Props> {
	static defaultProps = {
		checked: false,
		name: ''
	};

	handleClick = () => {
		const {name, onChange, value} = this.props;
		onChange({name, value});
	};

	render () {
		const {checked, children} = this.props;
		const buttonCN = cn({
			[styles.button]: true,
			[styles.checked]: checked
		});

		return <button className={buttonCN} onClick={this.handleClick}>{children}</button>;
	}
}

export default CheckIconButton;
