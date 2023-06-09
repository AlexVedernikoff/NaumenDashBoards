// @flow
import {Children, cloneElement, createRef, isValidElement, PureComponent} from 'react';
import {debounce} from 'helpers';
import type {Props, State} from './types';
import type {Ref} from 'components/types';
import ResizeObserver from 'resize-observer-polyfill';

export class ResizeDetector extends PureComponent<Props, State> {
	static defaultProps = {
		className: '',
		debounceRate: 500,
		forwardedRefKey: 'forwardedRef',
		skipOnMount: false
	};

	state = {
		mounted: false
	};

	observer: Object;
	elementRef: Ref<string> = createRef();

	componentDidMount () {
		const {debounceRate} = this.props;
		const {current: element} = this.elementRef;

		this.observer = new ResizeObserver(debounce(this.handleResize, debounceRate));

		element && this.observer.observe(element);
	}

	componentWillUnmount () {
		this.observer.disconnect();
	}

	cloneComponentElement = (child: React$Element<typeof React$Component>) => {
		const {forwardedRefKey} = this.props;
		let {props} = child;

		if (props[forwardedRefKey]) {
			this.elementRef = props[forwardedRefKey];
		} else {
			props = {
				...props,
				[forwardedRefKey]: this.elementRef
			};
		}

		return cloneElement(child, props);
	};

	cloneDOMElement = (child: React$Element<'string'>) => {
		let {props, ref} = child;

		if (ref) {
			this.elementRef = ref;
		} else {
			props = {
				...props,
				ref: this.elementRef
			};
		}

		return cloneElement(child, props);
	};

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
		const child = Children.only(this.props.children);

		if (isValidElement(child)) {
			return typeof child.type === 'function' ? this.cloneComponentElement(child) : this.cloneDOMElement(child);
		}

		return child;
	}
}

export default ResizeDetector;
