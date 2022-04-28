// @flow
import {connect} from 'react-redux';
import {functions, props} from './selectors';
import {Polyline} from 'react-yandex-maps';
import type {Props, State} from './types';
import React, {Component} from 'react';

class Line extends Component<Props, State> {
	showContentMenu = () => {
		const {part, toggleMapContextMenu} = this.props;
		toggleMapContextMenu(part);
	};

	showSingle = () => {
		const {part, setSingleObject} = this.props;
		setSingleObject(part);
	};

	render () {
		const {color, opacity = 1, part, weight = 6} = this.props;
		const {data: {header = ''}, geopositions} = part;

		const positions = geopositions.map(geoposition => [geoposition.latitude, geoposition.longitude]);

		return (
			<Polyline
				geometry={positions}
				key={part.data.uuid}
				onClick={this.showSingle}
				onContextMenu={this.showContentMenu}
				options={{
					balloonCloseButton: false,
					opacity: opacity,
					strokeColor: color,
					strokeStyle: [1, 2],
					strokeWidth: weight
				}}
				properties={{
					hintContent: header
				}}>
			</Polyline>

		);
	}
}

export default connect(props, functions)(Line);
