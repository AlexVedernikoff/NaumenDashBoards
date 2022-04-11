// @flow
import {connect} from 'react-redux';
import {functions, props} from './selectors';
import {LatLng} from 'leaflet/dist/leaflet-src.esm';
import {Polyline} from 'react-leaflet';
import type {Props, State} from './types';
import React, {Component} from 'react';
import TooltipPoint from 'components/atoms/TooltipPoint';

export class Line extends Component<Props, State> {
	showContentMenu = () => {
		const {part, toggleMapContextMenu} = this.props;
		toggleMapContextMenu(part);
	};

	showSingle = () => () => {
		const {part, setSingleObject} = this.props;
		setSingleObject(part);
	};

	render () {
		const {color, opacity = 1, part, weight = 8} = this.props;
		const {data, geopositions} = part;
		const {header} = data;

		const positions = geopositions.map(geoposition => new LatLng(geoposition.latitude, geoposition.longitude));

		return (
			<Polyline
				bubblingMouseEvents={false}
				color={color}
				dashArray={'0, 16'}
				onClick={this.showSingle()}
				onContextMenu={this.showContentMenu}
				opacity={opacity}
				positions={positions}
				weight={weight}
			>
				<TooltipPoint sticky={true} title={header} />
			</Polyline>
		);
	}
}

export default connect(props, functions)(Line);
