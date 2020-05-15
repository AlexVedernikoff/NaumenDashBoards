// @flow
import cn from 'classnames';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class Toggle extends PureComponent<Props> {
	static defaultProps = {
		name: ''
	};

	handleClick = () => {
		const {name, onChange, value} = this.props;
		onChange({name, value});
	};

	render () {
		const {checked} = this.props;
		const toggleCN = cn({
			[styles.toggle]: true,
			[styles.checked]: checked
		});

		return <span className={toggleCN} onClick={this.handleClick} />;
	}
}

export default Toggle;
