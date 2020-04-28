// @flow
import {createPortal} from 'react-dom';
import {OutsideClickDetector} from 'components/atoms';
import type {Props, State} from './types';
import React, {Children, cloneElement, Component, createRef} from 'react';
import type {Ref} from 'components/types';
import styles from './styles.less';

export class AbsolutePortal extends Component<Props, State> {
	static defaultProps = {
		minOffset: 25
	}

	childRef: Ref<any> = createRef();
	container: HTMLDivElement;

	state = {};

	componentDidMount () {
		this.setChildPosition();
	}

	componentWillUnmount () {
		if (document.body !== null) {
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
	}

	getElementRect = () => {
		const {current: element} = this.props.elementRef;
		return element && element.getBoundingClientRect();
	}

	getRelativePosition = (parentPosition: number, position: number, additionalPosition: number, additionalLimit: number) => {
		const {minOffset} = this.props;
		const relativePosition = position - parentPosition;

		if (position < minOffset) {
			return relativePosition + Math.abs(position) + minOffset;
		}

		if (additionalPosition > additionalLimit) {
			return relativePosition - (additionalPosition - additionalLimit) - minOffset;
		}

		return relativePosition;
	};

	setChildPosition = () => {
		const {current: child} = this.childRef;
		const elementRect = this.getElementRect();

		if (child && elementRect) {
			const childRect = child.getBoundingClientRect();
			const {left: elementLeft, top: elementTop} = elementRect;
			const {bottom: childBottom, left: childLeft, right: childRight, top: childTop} = childRect;

			this.setState({childPosition: {
				left: this.getRelativePosition(elementLeft, childLeft, childRight, window.innerWidth),
				top: this.getRelativePosition(elementTop, childTop, childBottom, window.innerHeight)
			}});
		}
	}

	renderContent = () => {
		const {children, onClickOutside} = this.props;
		const {childPosition} = this.state;
		const child = Children.only(children);
		const {props, ref} = child;
		let {style} = props;

		if (childPosition) {
			style = {
				...style = {},
				...childPosition
			};
		}

		if (ref) {
			this.childRef = ref;
		}

		const childElement = cloneElement(child, {
			...child.props,
			ref: this.childRef,
			style
		});

		return (
			<OutsideClickDetector onClickOutside={onClickOutside}>
				{childElement}
			</OutsideClickDetector>
		);
	};

	renderPortal = () => {
		const rect = this.getElementRect();

		if (rect) {
			const {height, left, top, width} = rect;

			return (
				<div className={styles.portal} style={{height, left, top, width}}>
					{this.renderContent()}
				</div>
			);
		}

		return null;
	};

	render () {
		if (!this.container) {
			this.container = this.createContainer();
		}

		return createPortal(this.renderPortal(), this.container);
	}
}

export default AbsolutePortal;
