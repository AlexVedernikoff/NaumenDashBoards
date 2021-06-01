// @flow
import {Polyline} from 'react-leaflet';
import type {Props, State} from './types';
import React, {Component} from 'react';

export class Line extends Component<Props, State> {
	static defaultProps = {
		opacity: 1,
		weight: 5
	};

	render () {
		const {children, color, geopositions, onClick, opacity, weight} = this.props;

		return (
			<Polyline
				bubblingMouseEvents={false}
				color={color}
				onClick={onClick}
				opacity={opacity}
				positions={geopositions}
				weight={weight}
			>
				{children}
			</Polyline>
		);
	}
}

export default Line;
