// @flow
import type {Node} from 'react';

export type Axis = 'x' | 'y';

export type scrollbarColors = 'grey' | 'white';

export type ScrollableProps = {
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

export type SliderProps = {
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

export type TrackProps = {
	/**
	 * На какой оси расположен компонент.
	 */
	axis: Axis,

	/**
	 * Обработчик события прокрутки колёсика мышки.
	 */
	onWheelScroll: (e: WheelEvent) => any,

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
