// @flow
import {connect} from 'react-redux';
import {functions, props} from './selectors';
import {getCustomOrDefaultIconMarker} from 'helpers/icon';
import {Marker} from 'react-leaflet';
import type {Props, State} from './types';
import React, {Component} from 'react';
import TooltipPoint from 'components/atoms/TooltipPoint';

export class Mark extends Component<Props, State> {
	showContentMenu = () => {
		const {point, toggleMapContextMenu} = this.props;
		toggleMapContextMenu(point);
	};

	showSingle = () => () => {
		const {point, setSingleObject} = this.props;
		setSingleObject(point);
	};

	render () {
		const {active, point} = this.props;
		const {data, geopositions: [positions], icon, tooltip} = point;
		const {equipType, header = '', type} = data;
		const iconMarker = getCustomOrDefaultIconMarker(equipType || type, active, icon);
		return (
			<Marker
				icon={iconMarker}
				onClick={this.showSingle()}
				onContextMenu={this.showContentMenu}
				position={[positions.latitude, positions.longitude]}
			>
				<TooltipPoint title={tooltip || header} />
			</Marker>
		);
	}
}

export default connect(props, functions)(Mark);
