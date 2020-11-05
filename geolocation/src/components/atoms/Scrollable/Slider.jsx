// @flow
import cn from 'classnames';
import React, {Component} from 'react';
import styles from './Scrollable.less';

type Axis = 'x' | 'y';

type scrollbarColors = 'grey' | 'white';

export type Props = {
	/**
	 * На какой оси расположен компонент.
	 */
	axis: Axis,

	/**
	 * Обработчик события, когда клавиша мыши нажата над компонентом.
	 */
	onMouseDown: (e: MouseEvent, axis: Axis) => any,

	/**
	 * Обработчик нажатия на компонент.
	 */
	onTouch: (e: TouchEvent) => any,

	/**
	 * Обработчик события прокрутки колёсика мышки.
	 */
	onWheelScroll: (e: WheelEvent) => any,

	/**
	 * Состояние нажатого ползунка.
	 */
	pressed: boolean,

	/**
	 * Цветовая тема скроллбара.
	 *
	 * `type scrollbarColors = 'grey' | 'white'`
	 */
	scrollbarColors: scrollbarColors,

	/**
	 * Величина отступа ползунка от края.
	 */
	scrollPosition: number,

	/**
	 * Размер ползунка.
	 */
	sliderSize: number
};

export class Slider extends Component<Props> {
	props: Props;

	static defaultProps = {
		axis: 'y',
		pressed: false,
		scrollbarColors: 'grey',
		scrollPosition: 0,
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
		const {axis, pressed, scrollbarColors, scrollPosition, sliderSize} = this.props;
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
			ref: this.setSliderRef,
			onMouseDown: this.handleMouseDown,
			onTouchStart: this.handleTouch,
			style
		};

		return <div {...props} />;
	}
}

export default Slider;
