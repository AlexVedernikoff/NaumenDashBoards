// @flow
import cn from 'classnames';
import React, {Component} from 'react';
import type {SliderProps as Props} from './types';
import styles from './Scrollable.less';

export class Track extends Component<Props> {
	props: Props;

	static defaultProps = {
		axis: 'y',
		scrollbarColors: 'grey'
	};

	track: HTMLDivElement | null = null;

	handleWheelScroll = (e: WheelEvent) => {
		// Предотвращаем скролл в документе целиком.
		e.preventDefault();

		const {onWheelScroll} = this.props;

		onWheelScroll && onWheelScroll(e);
	};

	setTrackRef = (element: HTMLDivElement | null) => {
		if (!this.track && element) {
			element.addEventListener('wheel', this.handleWheelScroll, {passive: false});
		}

		if (this.track && !element) {
			this.track.removeEventListener('wheel', this.handleWheelScroll);
		}

		this.track = element;
	};

	render () {
		const {axis, scrollbarColors} = this.props;

		const props = {
			className: cn({
				[styles.track]: true,
				[styles[scrollbarColors]]: true,
				[styles.x]: axis === 'x',
				[styles.y]: axis === 'y'
			}),
			ref: this.setTrackRef
		};

		return <div {...props} />;
	}
}

export default Track;
