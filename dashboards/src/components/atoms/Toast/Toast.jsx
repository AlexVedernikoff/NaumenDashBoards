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
		const {position, text, topOffset} = this.props.data;
		const css = {};

		if (topOffset && position === 'byElement') {
			css.top = topOffset;
		}

		return (
			<div className={this.getClassName()} style={css}>
				{text}
			</div>
		);
	}
}

export default Toast;
