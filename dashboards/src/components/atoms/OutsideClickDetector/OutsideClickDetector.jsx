// @flow
import type {DivRef} from 'components/types';
import type {Props} from './types';
import React, {createRef, PureComponent} from 'react';

export class OutsideClickDetector extends PureComponent<Props> {
	ref: DivRef = createRef();

	componentDidMount () {
		document.addEventListener('mousedown', this.handleClickOutside);
	}

	componentWillUnmount () {
		document.removeEventListener('mousedown', this.handleClickOutside);
	}

	handleClickOutside = (e: MouseEvent) => {
		const {onClickOutside} = this.props;
		const element: any = e.target;
		const {current} = this.ref;

		if (current && !current.contains(element)) {
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
