// @flow
import {Children, cloneElement, createRef, PureComponent} from 'react';
import {debounce} from 'src/helpers';
import type {DivRef} from 'components/types';
import type {Props, State} from './types';
import ResizeObserver from 'resize-observer-polyfill';

export class ResizeDetector extends PureComponent<Props, State> {
	static defaultProps = {
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
		const {current: element} = this.ref;
		this.observer = new ResizeObserver(debounce(this.handleResize, debounceRate));

		element && this.observer.observe(element);
	}

	componentWillUnmount () {
		this.observer.disconnect();
	}

	handleResize = (entries: Array<ResizeObserverEntry>) => {
		const {onResize, skipOnMount} = this.props;
		const {mounted} = this.state;
		const {height, width} = entries[0].contentRect;

		if (!mounted && skipOnMount) {
			return this.setState({mounted: true});
		}

		onResize(width, height);
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

export default ResizeDetector;
