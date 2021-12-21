// @flow
import {createPortal} from 'react-dom';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class Message extends PureComponent<Props> {
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
		const {position, text} = this.props;

		if (position) {
			let {x, y} = position;
			const windowWidth = window.screen.width;

			if (x + 210 > windowWidth) {
				x = x - 215;
			}

			const css = {left: x + 5, top: y + 20};

			return <div className={styles.tooltip} style={css}>{text}</div>;
		}

		return null;
	};

	render () {
		const {position, text} = this.props;

		if (!this.container) {
			this.container = this.createContainer();
		}

		if (text && position) {
			return createPortal(this.renderPortal(), this.container);
		}

		return null;
	}
}

export default Message;
