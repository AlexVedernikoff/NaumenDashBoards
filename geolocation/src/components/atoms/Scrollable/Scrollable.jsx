// @flow
import cn from 'classnames';
import {MIN_SLIDER_SIZE, WHEEL_DELTA} from './constants';
import type {Node} from 'react';
import React, {Component} from 'react';
import Slider from './Slider';
import styles from './Scrollable.less';
import Track from './Track';

type Axis = 'x' | 'y';

type scrollbarColors = 'grey' | 'white';

export type Props = {
	/**
	 * Внутреннее содержимое компонента.
	 */
	attachRef?: (HTMLDivElement | null) => void,
	/**
	 * Внутреннее содержимое компонента.
	 */
	children?: Node,

	/**
	 * Внешний `css`-класс.
	 */
	className?: string,

	/**
	 * Обработчик клика мыши.
	 */
	onClick?: MouseEventHandler,

	/**
	 * Обработчик события, когда клавиша мыши нажата над компонентом.
	 */
	onMouseDown?: MouseEventHandler,

	/**
	 * Обработчик наведения курсора мыши на компонент.
	 */
	onMouseEnter?: MouseEventHandler,

	/**
	 * Обработчик перемещения курсора мыши за границы компонента.
	 */
	onMouseLeave?: MouseEventHandler,

	/**
	 * Обработчик события, когда клавиша мыши отпущена над компонентом.
	 */
	onMouseUp?: MouseEventHandler,

	/**
	 * Обработчик события прокрутки.
	 */
	onScroll?: () => void,

	/**
	 * Цветовая тема скроллбара.
	 *
	 * `type scrollbarColors = 'grey' | 'white'`
	 */
	scrollbarColors: scrollbarColors
};

export type State = {
	containerHeight: number,
	containerWidth: number,
	contentHeight: number,
	contentWidth: number,
	mouseDownOnSliderX: boolean,
	mouseDownOnSliderY: boolean,
	scrollXIsActive: boolean,
	scrollYIsActive: boolean,
	scrollXPosition: number,
	scrollYPosition: number,
	shiftIsPressed: boolean,
	sliderXWidth: number,
	sliderYHeight: number
};

export class Scrollable extends Component<Props, State> {
	props: Props;
	state: State;

	static defaultProps = {
		scrollbarColors: 'grey'
	};

	constructor (props: Props) {
		super(props);

		this.state = {
			containerHeight: 0,
			containerWidth: 0,
			contentHeight: 0,
			contentWidth: 0,
			mouseDownOnSliderX: false,
			mouseDownOnSliderY: false,
			scrollXIsActive: false,
			scrollYIsActive: false,
			scrollXPosition: 0,
			scrollYPosition: 0,
			shiftIsPressed: false,
			sliderXWidth: 0,
			sliderYHeight: 0
		};
	}

	inner: HTMLDivElement | null = null;

	componentDidMount () {
		this.setScrollableState();

		document.addEventListener('keydown', this.handleKeyDown);
		document.addEventListener('keyup', this.handleKeyUp);
		window.addEventListener('blur', this.handleBlur);
	}

	componentWillUnmount () {
		document.removeEventListener('keydown', this.handleKeyDown);
		document.removeEventListener('keyup', this.handleKeyUp);
		window.removeEventListener('blur', this.handleBlur);
	}

	componentDidUpdate () {
		this.setScrollableState();
	}

	handleBlur = () => {
		// Удаляем глобальные обработчики при потере окном фокуса.
		document.removeEventListener('keydown', this.handleKeyDown);
		document.removeEventListener('keyup', this.handleKeyUp);

		// При возвращении фокуса снова устанавливаем обработчики.
		const handleFocus = () => {
			document.addEventListener('keydown', this.handleKeyDown);
			document.addEventListener('keyup', this.handleKeyUp);
			window.removeEventListener('focus', handleFocus);
		};

		window.addEventListener('focus', handleFocus);
	};

	handleClick = (e: MouseEvent) => {
		const {onClick} = this.props;
		onClick && onClick(e);
	};

	handleKeyDown = (e: KeyboardEvent) => {
		if (e.keyCode === 16) {
			this.setState({
				shiftIsPressed: true
			});
		}
	};

	handleKeyUp = (e: KeyboardEvent) => {
		if (e.keyCode === 16) {
			this.setState({
				shiftIsPressed: false
			});
		}
	};

	handleMouseDown = (e: MouseEvent) => {
		const {onMouseDown} = this.props;
		onMouseDown && onMouseDown(e);
	};

	handleMouseDownScroll = (e: MouseEvent, axis: Axis) => {
		const {
			containerHeight,
			containerWidth,
			contentHeight,
			contentWidth,
			sliderXWidth,
			sliderYHeight
		} = this.state;

		let initialMouseCoordinate = 0;
		let initialScroll = 0;
		let containerSize = 0;
		let contentSize;
		let sliderSize;

		if (this.inner) {
			if (axis === 'x') {
				initialMouseCoordinate = e.clientX;
				initialScroll = this.inner.scrollLeft;
				containerSize = containerWidth;
				contentSize = contentWidth;
				sliderSize = sliderXWidth;

				this.setState({
					mouseDownOnSliderX: true
				});
			} else {
				initialMouseCoordinate = e.clientY;
				initialScroll = this.inner.scrollTop;
				containerSize = containerHeight;
				contentSize = contentHeight;
				sliderSize = sliderYHeight;

				this.setState({
					mouseDownOnSliderY: true
				});
			}
		}

		const handleMouseMove = (e: MouseEvent) => {
			const clientCoordinate = axis === 'x' ? e.clientX : e.clientY;
			const ratio = (contentSize - containerSize) / (containerSize - sliderSize);
			const delta = (clientCoordinate - initialMouseCoordinate) * ratio;

			if (this.inner) {
				if (axis === 'x') {
					this.inner.scrollLeft = initialScroll + delta;
				} else {
					this.inner.scrollTop = initialScroll + delta;
				}
			}

			this.handleScroll();
		};

		const handleMouseUp = () => {
			document.removeEventListener('mousemove', handleMouseMove);
			document.removeEventListener('mouseup', handleMouseUp);

			this.setState({
				mouseDownOnSliderX: false,
				mouseDownOnSliderY: false
			});
		};

		document.addEventListener('mousemove', handleMouseMove);
		document.addEventListener('mouseup', handleMouseUp);
	};

	handleMouseEnter = (e: MouseEvent) => {
		const {onMouseEnter} = this.props;
		this.setScrollableState();
		onMouseEnter && onMouseEnter(e);
	};

	handleMouseLeave = (e: MouseEvent) => {
		const {onMouseLeave} = this.props;
		onMouseLeave && onMouseLeave(e);
	};

	handleMouseUp = (e: MouseEvent) => {
		const {onMouseUp} = this.props;
		onMouseUp && onMouseUp(e);
	};

	handleScroll = () => {
		const {onScroll} = this.props;

		onScroll && onScroll();
		this.updateSlider('x');
		this.updateSlider('y');
	};

	handleTouchScroll = (e: TouchEvent) => {
		if (!this.inner) {
			return;
		}
		const {
			containerHeight,
			containerWidth,
			contentHeight,
			contentWidth,
			sliderXWidth,
			sliderYHeight
		} = this.state;

		const initialMouseCoordinateX = e.touches[0].clientX;
		const initialMouseCoordinateY = e.touches[0].clientY;
		const initialScrollX = this.inner.scrollLeft;
		const initialScrollY = this.inner.scrollTop;

		const handleTouchMove = (e: TouchEvent) => {
			const ratioX = (contentWidth - containerWidth) / (containerWidth - sliderXWidth);
			const ratioY = (contentHeight - containerHeight) / (containerHeight - sliderYHeight);
			const deltaX = (e.touches[0].clientX - initialMouseCoordinateX) * ratioX;
			const deltaY = (e.touches[0].clientY - initialMouseCoordinateY) * ratioY;

			if (!this.inner) {
				return;
			}

			this.inner.scrollLeft = initialScrollX + deltaX;
			this.inner.scrollTop = initialScrollY + deltaY;

			this.handleScroll();
		};

		const handleTouchEnd = () => {
			document.removeEventListener('touchmove', handleTouchMove);
			document.removeEventListener('touchend', handleTouchEnd);
		};

		document.addEventListener('touchmove', handleTouchMove);
		document.addEventListener('touchend', handleTouchEnd);
	};

	handleWheelScroll = (e: WheelEvent) => {
		const {
			containerHeight,
			containerWidth,
			contentHeight,
			contentWidth,
			shiftIsPressed
		} = this.state;

		let containerSize: number = 0;
		let contentSize: number = 0;
		let deltaY;
		let scroll: number = 0;

		if (this.inner) {
			if (!shiftIsPressed) {
				containerSize = containerHeight;
				contentSize = contentHeight;
				scroll = this.inner.scrollTop;
			} else {
				containerSize = containerWidth;
				contentSize = contentWidth;
				scroll = this.inner.scrollLeft;
			}
		}

		// Если значение deltaY браузера по умолчанию слишком маленькое, то устанавливаем усреднённое значение.
		if (Math.abs(e.deltaY) <= 5) {
			deltaY = e.deltaY > 0 ? WHEEL_DELTA : -WHEEL_DELTA;
		} else {
			deltaY = e.deltaY;
		}

		if (deltaY > 0 && contentSize <= scroll + containerSize) {
			return;
		}

		if (deltaY < 0 && scroll <= 0) {
			return;
		}

		if (this.inner) {
			if (!this.state.shiftIsPressed) {
				this.inner.scrollTop += deltaY;
			} else {
				this.inner.scrollLeft += deltaY;
			}

			this.handleScroll();
		}
	};

	setInnerRef = (element: HTMLDivElement | null) => {
		const {attachRef} = this.props;
		this.inner = element;
		attachRef && attachRef(element);
	};

	setScrollableState = () => {
		if (this.inner) {
			if (
				this.state.contentHeight !== this.inner.scrollHeight
				|| this.state.contentWidth !== this.inner.scrollWidth
				|| this.state.containerHeight !== this.inner.offsetHeight
				|| this.state.containerWidth !== this.inner.offsetWidth
			) {
				let containerHeight = this.inner.offsetHeight;
				let containerWidth = this.inner.offsetWidth;
				let contentHeight = this.inner.scrollHeight;
				let contentWidth = this.inner.scrollWidth;
				const scrollXIsActive = containerWidth < contentWidth;
				const scrollYIsActive = containerHeight < contentHeight;

				this.setState({
					containerHeight,
					containerWidth,
					contentHeight,
					contentWidth,
					scrollXIsActive,
					scrollYIsActive
				}, () => {
					this.updateSlider('x');
					this.updateSlider('y');
				});
			}
		}
	};

	updateSlider = (axis: Axis) => {
		if (axis === 'x') {
			if (!this.inner) {
				return;
			}

			let {containerWidth, contentWidth, scrollXIsActive, scrollYIsActive} = this.state;

			if (scrollXIsActive && scrollYIsActive) {
				// Дополнительный отступ если отображаются оба скроллбара.
				containerWidth -= 7;
			}

			if (scrollXIsActive) {
				let sliderXWidth = (containerWidth / contentWidth) * containerWidth;

				if (sliderXWidth < MIN_SLIDER_SIZE) {
					sliderXWidth = MIN_SLIDER_SIZE;
				}

				const scrollLeft = this.inner.scrollLeft;
				let scrollXPosition = (scrollLeft / (contentWidth - containerWidth)) * (containerWidth - sliderXWidth);

				if (scrollXPosition + sliderXWidth >= containerWidth) {
					scrollXPosition = containerWidth - sliderXWidth;
				}

				this.setState({
					scrollXPosition,
					sliderXWidth
				});
			}
		}

		if (axis === 'y') {
			if (!this.inner) {
				return;
			}

			let {containerHeight, contentHeight, scrollXIsActive, scrollYIsActive} = this.state;

			if (scrollXIsActive && scrollYIsActive) {
				// Дополнительный отступ если отображаются оба скроллбара.
				containerHeight -= 7;
			}

			if (scrollYIsActive) {
				let sliderYHeight = (containerHeight / contentHeight) * containerHeight;

				if (sliderYHeight < MIN_SLIDER_SIZE) {
					sliderYHeight = MIN_SLIDER_SIZE;
				}

				const scrollTop = this.inner.scrollTop;
				let scrollYPosition = (scrollTop / (contentHeight - containerHeight)) * (containerHeight - sliderYHeight);

				if (scrollYPosition + sliderYHeight >= containerHeight) {
					scrollYPosition = containerHeight - sliderYHeight;
				}

				this.setState({
					scrollYPosition,
					sliderYHeight
				});
			}
		}
	};

	renderInactiveZone () {
		const {scrollXIsActive, scrollYIsActive} = this.state;

		if (!(scrollXIsActive && scrollYIsActive)) {
			return null;
		}

		return <div className={styles.inactiveZone} />;
	}

	renderInner () {
		const {children} = this.props;
		const props = {};
		const style = {};

		props.className = styles.inner;
		props.ref = this.setInnerRef;
		props.style = style;

		return <div {...props}>{children}</div>;
	}

	renderScrollbars () {
		const {
			mouseDownOnSliderX,
			mouseDownOnSliderY,
			scrollXIsActive,
			scrollYIsActive,
			scrollXPosition,
			scrollYPosition,
			sliderXWidth,
			sliderYHeight
		} = this.state;
		const {scrollbarColors} = this.props;

		const props = {
			scrollbarColors,
			onMouseDown: this.handleMouseDownScroll,
			onTouch: this.handleTouchScroll,
			onWheelScroll: this.handleWheelScroll
		};

		const sliderXProps = {
			axis: 'x',
			scrollPosition: scrollXPosition,
			sliderSize: sliderXWidth,
			pressed: mouseDownOnSliderX
		};

		const sliderYProps = {
			axis: 'y',
			scrollPosition: scrollYPosition,
			sliderSize: sliderYHeight,
			pressed: mouseDownOnSliderY
		};

		const scrollbarX = scrollXIsActive && (
			<div>
				<Slider {...props} {...sliderXProps} />
				<Track {...props} axis="x" />
			</div>
		);

		const scrollbarY = scrollYIsActive && (
			<div>
				<Slider {...props} {...sliderYProps} />
				<Track {...props} axis="y" />
			</div>
		);

		return (
			<div>
				{scrollbarX}
				{scrollbarY}
			</div>
		);
	}

	render () {
		const {className} = this.props;

		const props = {
			className: cn({
				[className || '']: !!className,
				[styles.scrollable]: true
			}),
			onMouseEnter: this.handleMouseEnter,
			onScroll: this.handleScroll
		};

		return (
			<div {...props}>
				{this.renderScrollbars()}
				{this.renderInner()}
				{this.renderInactiveZone()}
			</div>
		);
	}
}

export default Scrollable;
