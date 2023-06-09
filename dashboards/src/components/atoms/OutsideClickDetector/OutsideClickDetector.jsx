// @flow
import {createRef, PureComponent} from 'react';
import type {DivRef} from 'components/types';
import {findDOMNode} from 'react-dom';
import type {Props} from './types';

export class OutsideClickDetector extends PureComponent<Props> {
	ref: DivRef = createRef();
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
		document.removeEventListener('click', this.props.onClickOutside);
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
