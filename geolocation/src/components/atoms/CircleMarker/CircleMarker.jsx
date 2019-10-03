// @flow
import {Circle} from 'react-leaflet';
import React, {Component} from 'react';
import type {Props, State} from './types';

export class CircleMarker extends Component<Props, State> {
	render () {
		const {color, geoposition} = this.props;
		const {accuracy, latitude, longitude} = geoposition;

		return (
			<Circle
				center={[latitude, longitude]}
				fillColor={color}
				stroke={false}
				radius={accuracy}
			/>
		);
	}
}
export default CircleMarker;
