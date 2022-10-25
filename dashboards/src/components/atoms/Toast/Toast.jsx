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

		if (document.body && topOffset && position === 'byElement') {
			const documentOffset = document.body.offsetHeight - topOffset;

			if (documentOffset >= 200) {
				css.top = topOffset;
			} else {
				css.bottom = documentOffset;
			}
		}

		return (
			<div className={this.getClassName()} style={css}>
				{text}
			</div>
		);
	}
}

export default Toast;
