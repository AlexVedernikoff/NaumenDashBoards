// @flow
import {Circle} from 'react-leaflet';
import type {Props, State} from './types';
import React, {Component} from 'react';

export class CircleMarker extends Component<Props, State> {
	render () {
		const {color, geoposition} = this.props;
		const {accuracy, latitude, longitude} = geoposition;

		return (
			<Circle
				center={[latitude, longitude]}
				fillColor={color}
				radius={accuracy || 20}
				stroke={false}
			/>
		);
	}
}
export default CircleMarker;
