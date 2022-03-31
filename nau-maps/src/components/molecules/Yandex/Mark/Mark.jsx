// @flow
import {connect} from 'react-redux';
import {functions, props} from './selectors';
import {getCustomOrDefaultIconMarker} from 'helpers/icon';
import {Placemark} from 'react-yandex-maps';
import type {Props, State} from './types';
import React, {Component} from 'react';

export class Mark extends Component<Props, State> {
	showSingle = () => {
		const {point, setSingleObject} = this.props;

		setSingleObject(point);
	};

	render () {
		const {active, point} = this.props;
		const {data, geopositions, icon} = point;
		const [positions] = geopositions;
		const {equipType, header, type} = data;
		const {options: {iconUrl}} = getCustomOrDefaultIconMarker(equipType || type, active, icon);

		return (
			<Placemark
				geometry={[positions.latitude, positions.longitude]}
				onClick={this.showSingle}
				options={{
					iconImageHref: iconUrl,
					iconImageSize: [30, 30],
					iconLayout: 'default#image',
					iconOffset: [15, 15]
				}}
				properties={{
					hintContent: header
				}}
			>
			</Placemark>
		);
	}
}

export default connect(props, functions)(Mark);