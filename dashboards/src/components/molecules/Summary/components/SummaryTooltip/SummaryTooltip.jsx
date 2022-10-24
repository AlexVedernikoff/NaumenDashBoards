// @flow
import {createPortal} from 'react-dom';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class SummaryTooltip extends PureComponent<Props> {
	container: HTMLDivElement | null;

	componentWillUnmount () {
		if (document.body !== null && this.container) {
			document.body.removeChild(this.container);
		}

		this.container = null;
	}

	createContainer = () => {
		const div = document.createElement('div');

		div.className = styles.container;

		if (document.body !== null) {
			document.body.appendChild(div);
		}

		return div;
	};

	renderPortal = () => {
		const {indicator, period, value, x, y} = this.props;
		const css = {left: x + 10, top: y + 10};
		return (
			<div className={styles.tooltip} style={css}>
				<div className={styles.title}>Выбор детализации</div>
				<div className={styles.indicator}>{indicator} {value}</div>
				<div className={styles.period}>{period}</div>
			</div>
		);
	};

	render () {
		if (!this.container) {
			this.container = this.createContainer();
		}

		// $FlowFixMe
		return createPortal(this.renderPortal(), this.container);
	}
}

export default SummaryTooltip;
