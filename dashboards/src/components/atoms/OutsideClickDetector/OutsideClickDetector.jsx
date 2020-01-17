// @flow
import type {Props} from './types';
import React, {createRef, PureComponent} from 'react';

export class OutsideClickDetector extends PureComponent<Props> {
	ref = createRef();

	componentDidMount () {
		document.addEventListener('mousedown', this.handleClickOutside);
	}

	componentWillUnmount () {
		document.removeEventListener('mousedown', this.handleClickOutside);
	}

	handleClickOutside = (e: Event) => {
		const {onClickOutside} = this.props;
		const {current} = this.ref;

		if (current && !current.contains(e.target)) {
			onClickOutside();
		}
	};

	render () {
		const {children} = this.props;

		return (
			<div ref={this.ref}>
				{children}
			</div>
		);
	}
}

export default OutsideClickDetector;
