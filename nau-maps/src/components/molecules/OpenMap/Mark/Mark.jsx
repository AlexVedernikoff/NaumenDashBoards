// @flow
import {connect} from 'react-redux';
import {functions, props} from './selectors';
import {getCustomOrDefaultIconMarker} from 'helpers/icon';
import {Marker} from 'react-leaflet';
import type {Props, State} from './types';
import React, {Component} from 'react';
import TooltipPoint from 'components/atoms/TooltipPoint';

export class Mark extends Component<Props, State> {
	showSingle = () => () => {
		const {point, setSingleObject} = this.props;
		setSingleObject(point);
	};

	render () {
		const {active, point} = this.props;
		const {data, geopositions: [positions], icon} = point;
		const {equipType, type} = data;
		const iconMarker = getCustomOrDefaultIconMarker(equipType || type, active, icon);

		return (
			<Marker
				icon={iconMarker}
				onClick={this.showSingle}
				position={[positions.latitude, positions.longitude]}
			>
				<TooltipPoint title={data.header} />
			</Marker>
		);
	}
}

export default connect(props, functions)(Mark);
