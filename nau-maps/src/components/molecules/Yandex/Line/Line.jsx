// @flow
import {connect} from 'react-redux';
import {functions, props} from './selectors';
import {Polyline} from 'react-yandex-maps';
import type {Props, State} from './types';
import React, {Component} from 'react';

class Line extends Component<Props, State> {
	showSingle = () => {
		const {part: {data, type, geopositions: [positions]}, setSingleObject} = this.props;

		setSingleObject({data, geoposition: positions, type});
	};

	render () {
		const {color, part} = this.props;
		const {data: {header}, geopositions} = part;

		const positions = geopositions.map(geoposition => [geoposition.latitude, geoposition.longitude]);

		return (
			<Polyline
				geometry={positions}
				key={part.data.uuid}
				onClick={this.showSingle}
				options={{
					balloonCloseButton: false,
					strokeColor: color,
					strokeWidth: 5
				}}
				properties={{
					hintContent: header
				}}>
			</Polyline>

		);
	}
}

export default connect(props, functions)(Line);
