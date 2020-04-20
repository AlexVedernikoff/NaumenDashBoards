// @flow
import {Children, cloneElement, createRef, PureComponent} from 'react';
import type {DivRef} from 'components/types';
import type {Props} from './types';

export class OutsideClickDetector extends PureComponent<Props> {
	ref: DivRef = createRef();

	componentDidMount () {
		document.addEventListener('click', this.handleClickOutside);
	}

	componentWillUnmount () {
		document.removeEventListener('click', this.handleClickOutside);
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
		const child = Children.only(this.props.children);

		if (child.ref) {
			this.ref = child.ref;
		}

		return cloneElement(child, {
			...child.props,
			ref: this.ref
		});
	}
}

export default OutsideClickDetector;
