// @flow
import cn from 'classnames';
import React, {Component} from 'react';
import styles from './Scrollable.less';
import type {TrackProps as Props} from './types';

export class Slider extends Component<Props> {
	static defaultProps = {
		axis: 'y',
		pressed: false,
		scrollPosition: 0,
		scrollbarColors: 'grey',
		sliderSize: 0
	};

	slider: HTMLDivElement | null = null;

	handleMouseDown = (e: MouseEvent) => {
		// Предотвращаем выделение текста при движении курсора мышки.
		e.preventDefault();

		const {axis, onMouseDown} = this.props;

		onMouseDown && onMouseDown(e, axis);
	};

	handleTouch = (e: TouchEvent) => {
		const {onTouch} = this.props;
		onTouch && onTouch(e);
	};

	handleWheelScroll = (e: WheelEvent) => {
		// Предотвращаем скролл в документе целиком.
		e.preventDefault();

		const {onWheelScroll} = this.props;

		onWheelScroll && onWheelScroll(e);
	};

	setSliderRef = (element: HTMLDivElement | null) => {
		if (!this.slider && element) {
			element.addEventListener('wheel', this.handleWheelScroll, {passive: false});
		}

		if (this.slider && !element) {
			this.slider.removeEventListener('wheel', this.handleWheelScroll);
		}

		this.slider = element;
	};

	render () {
		const {axis, pressed, scrollPosition, scrollbarColors, sliderSize} = this.props;
		const style = {};

		if (axis === 'x') {
			style.left = `${scrollPosition}px`;
			// Дополнительно вычитаем 4px для учёта margin-left и margin-right элемента (каждый по 2px).
			style.width = `${sliderSize - 4}px`;
		} else {
			// Дополнительно вычитаем 4px для учёта margin-top и margin-bottom элемента (каждый по 2px).
			style.height = `${sliderSize - 4}px`;
			style.top = `${scrollPosition}px`;
		}

		const props = {
			className: cn({
				[styles.slider]: true,
				[styles.pressed]: pressed,
				[styles[scrollbarColors]]: true,
				[styles.x]: axis === 'x',
				[styles.y]: axis === 'y'
			}),
			onMouseDown: this.handleMouseDown,
			onTouchStart: this.handleTouch,
			ref: this.setSliderRef,
			style
		};

		return <div {...props} />;
	}
}

export default Slider;
