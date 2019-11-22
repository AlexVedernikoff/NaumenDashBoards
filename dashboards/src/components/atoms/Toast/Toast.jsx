// @flow
import cn from 'classnames';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class Toast extends PureComponent<Props> {
	componentDidMount () {
		const {data, onMount} = this.props;
		onMount(data);
	}

	getClassName = () => {
		const {position, type} = this.props.data;
		return cn([styles.container, styles[position], styles[type]]);
	};

	render () {
		const {text} = this.props.data;

		return (
			<div className={this.getClassName()}>
				{text}
			</div>
		);
	}
}

export default Toast;
