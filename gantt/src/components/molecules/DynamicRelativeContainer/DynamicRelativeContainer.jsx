// @flow
import cn from 'classnames';
import type {Props, State} from './types';
import React, {createRef, PureComponent} from 'react';
import type {Ref} from 'components/types';
import styles from './styles.less';

export class DynamicRelativeContainer extends PureComponent<Props, State> {
	containerRef: Ref<'div'> = createRef();
	elementRef: Ref<any> = createRef();

	state = {
		top: 0
	};

	handleMouseMove = (e: MouseEvent) => {
		const {current: container} = this.containerRef;
		const {current: element} = this.elementRef;

		if (element && container && !element.contains(e.target)) {
			const containerRect = container.getBoundingClientRect();
			const elementRect = element.getBoundingClientRect();
			const y = e.clientY - containerRect.top;
			const top = Math.min(Math.max(y - elementRect.height / 2, 0), containerRect.height - elementRect.height);

			this.setState({top});
		}
	};

	renderAbsoluteElement = () => {
		const {renderAbsoluteElement} = this.props;
		const {top} = this.state;

		return renderAbsoluteElement({
			className: styles.element,
			ref: this.elementRef,
			top
		});
	};

	render () {
		const {children, className, onMouseDown} = this.props;

		return (
			<div
				className={cn(className, styles.container)}
				onMouseDown={onMouseDown}
				onMouseMove={this.handleMouseMove}
				ref={this.containerRef}
			>
				{children}
				{this.renderAbsoluteElement()}
			</div>
		);
	}
}

export default DynamicRelativeContainer;
