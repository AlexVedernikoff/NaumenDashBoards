// @flow
import {connect} from 'react-redux';
import CircleMarker from 'components/atoms/CircleMarker';
import {functions, props} from './selectors';
import type {Geoposition} from 'types/geoposition';
import {iconMarker} from 'helpers/icon';
import {Marker} from 'react-leaflet';
import type {Point} from 'types/point';
import PopupMarker from 'components/atoms/PopupMarker';
import type {Props, State} from './types';
import React, {Component} from 'react';
import TooltipMarker from 'components/atoms/TooltipMarker';

export class MarkersList extends Component<Props, State> {
	checkActive = (dateMarker: string) => {
		const {params} = this.props;
		const dataMarker = dateMarker.split(' ');
		let date = dataMarker[0].split('.').reverse().join('.') + ' ' + dataMarker[1];
		const dataMarkerTimestamp = new Date(date).getTime();
		const isActivePoint = new Date().getTime() - dataMarkerTimestamp < params.timeIntervalInactivity.length * 1000;

		return isActivePoint ? 'colorDynamicActivePoint' : 'colorDynamicInactivePoint';
	};

	getColor = (markerType: string) => this.props.params[markerType];

	renderCircle = (geoposition: Geoposition, color: string) => (<CircleMarker geoposition={geoposition} color={color} />);

	renderStaticMarker = (marker: Point, id: string) => {
		const {geoposition, header, type} = marker;
		const {latitude, longitude} = geoposition;

		return (
			<Marker
				key={'marker' + id}
				icon={iconMarker(type, this.getColor('colorStaticPoint'))}
				position={[latitude, longitude]}
			>
				<TooltipMarker title={header} />
				<PopupMarker marker={marker}/>
			</Marker>
		);
	};

	renderDynamicMarker = (marker: Point, id: string) => {
		const {geoposition, header, type} = marker;
		const {latitude, longitude} = geoposition;
		const markerActive = this.checkActive(geoposition.date);
		const color = this.getColor(markerActive);

		return (
			<Marker
				key={'marker' + id}
				icon={iconMarker(type, color)}
				position={[latitude, longitude]}
			>
				{this.renderCircle(geoposition, color)}
				<TooltipMarker title={header} />
				<PopupMarker marker={marker}/>
			</Marker>
		);
	};

	renderMarkers = (marker: Point, i: string) => marker.type === 'dynamic' ? this.renderDynamicMarker(marker, i) : this.renderStaticMarker(marker, i);

	render () {
		const {dataMarkers} = this.props;

		return (
			<div>
				{ Object.keys(dataMarkers).map(uuid => this.renderMarkers(dataMarkers[uuid], uuid))}
			</div>
		);
	}
}
export default connect(props, functions)(MarkersList);
