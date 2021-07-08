// @flow
import {createRef, PureComponent} from 'react';
import {findDOMNode} from 'react-dom';
import type {Props} from './types';
import type {Ref} from 'components/types';

export class OutsideClickDetector extends PureComponent<Props> {
	ref: Ref<'div'> = createRef();
	node: Element | Text | null;

	componentDidMount () {
		document.addEventListener('mousedown', this.handleClickOutside);
		this.setNode();
	}

	componentDidUpdate () {
		this.setNode();
	}

	componentWillUnmount () {
		document.removeEventListener('mousedown', this.handleClickOutside);
	}

	handleClickOutside = (e: MouseEvent) => {
		const {onClickOutside} = this.props;
		const element: any = e.target;

		if (this.node && !this.node.contains(element)) {
			document.addEventListener('click', onClickOutside, {
				once: true
			});
		}
	};

	setNode = () => {
		// eslint-disable-next-line react/no-find-dom-node
		this.node = findDOMNode(this);
	};

	render () {
		return this.props.children;
	}
}

export default OutsideClickDetector;
