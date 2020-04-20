// @flow
import {createPortal} from 'react-dom';
import type {Props, State} from './types';
import React, {Component} from 'react';
import {root} from 'src';
import styles from './styles.less';

export class AbsolutePortal extends Component<Props, State> {
	state = {
		height: 0,
		left: 0,
		top: 0,
		width: 0
	}

	componentDidMount () {
		const {container} = this.props;

		container && container.addEventListener('scroll', this.updatePosition);
		this.updatePosition();
	}

	componentWillUnmount () {
		const {container} = this.props;
		container && container.removeEventListener('scroll', this.updatePosition);
	}

	updatePosition = () => {
		const {children, elem} = this.props;
		const {height, left, top, width} = elem.getBoundingClientRect();

		children && this.setState({height, left, top, width});
	}

	renderPortal = () => {
		const {children} = this.props;
		const {height, left, top, width} = this.state;

		if (children) {
			return (
				<div className={styles.portal} style={{height, left, top, width}}>
					{children}
				</div>
			);
		}

		return null;
	};

	render () {
		return root ? createPortal(this.renderPortal(), root) : null;
	}
}

export default AbsolutePortal;
