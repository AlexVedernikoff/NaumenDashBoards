// @flow
import 'leaflet/dist/leaflet.css';
import 'styles/styles.less';
import Controls from 'components/atoms/Controls';
import Copyright from 'components/atoms/Copyright';
import React, {Component} from 'react';
import {Map as LeafletMap} from 'react-leaflet';
import MarkersList from 'components/molecules/MarkersList';
import styles from './Geolocation.less';
import type {Props} from './types';

export class Geolocation extends Component<Props> {
	render () {
		const {bounds} = this.props;

		return (
			<LeafletMap
				bounds={bounds}
				className={styles.leafletContainer}
				doubleClickZoom={true}
				scrollWheelZoom={true}
				zoomControl={false}
				dragging={true}
				animate={true}
				easeLinearity={0.35}
			>
				<MarkersList />
				<Controls />
				<Copyright />
			</LeafletMap>
		);
	}
}

export default Geolocation;
