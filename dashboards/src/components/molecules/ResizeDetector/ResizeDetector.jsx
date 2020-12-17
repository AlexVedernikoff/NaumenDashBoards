// @flow
import {debounce} from 'src/helpers';
import type {DivRef} from 'components/types';
import type {Props, State} from './types';
import React, {createRef, PureComponent} from 'react';
import ResizeObserver from 'resize-observer-polyfill';

export class ResizeDetector extends PureComponent<Props, State> {
	static defaultProps = {
		className: '',
		debounceRate: 500,
		skipOnMount: false
	};

	state = {
		mounted: false
	};

	observer: Object;
	ref: DivRef = createRef();

	componentDidMount () {
		const {debounceRate} = this.props;
		const {current: element} = this.getRef();
		this.observer = new ResizeObserver(debounce(this.handleResize, debounceRate));

		element && this.observer.observe(element);
	}

	componentWillUnmount () {
		this.observer.disconnect();
	}

	getRef = () => this.props.forwardedRef || this.ref;

	handleResize = (entries: Array<ResizeObserverEntry>) => {
		const {onResize, skipOnMount} = this.props;
		const {mounted} = this.state;
		const {height, width} = entries[0].contentRect;

		if (!mounted && skipOnMount) {
			return this.setState({mounted: true});
		}

		onResize && onResize(width, height);
	};

	render () {
		const {children, className, onClick, style} = this.props;

		return (
			<div className={className} onClick={onClick} ref={this.getRef()} style={style}>
				{children}
			</div>
		);
	}
}

export default ResizeDetector;
