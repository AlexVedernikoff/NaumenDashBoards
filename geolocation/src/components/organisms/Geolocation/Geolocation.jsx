// @flow
import 'leaflet/dist/leaflet.css';
import 'styles/styles.less';
import Controls from 'components/atoms/Controls';
import Copyright from 'components/atoms/Copyright';
import MarkersList from 'components/molecules/MarkersList';
import {Map as LeafletMap} from 'react-leaflet';
import {notify} from 'helpers/notify';
import type {Props} from './types';
import React, {Component} from 'react';
import styles from './Geolocation.less';

export class Geolocation extends Component<Props> {
	mapRef: {current: any};

	constructor (props: Props) {
		super(props);
		this.mapRef = React.createRef();
	}

	componentDidMount () {
		const {reloadInterval, reloadGeolocation} = this.props;
		reloadInterval ? setInterval(() => reloadGeolocation(), reloadInterval * 1000) : notify('common', 'info', 'Отправлен запрос на получение информации о местоположении. Обновите через пару минут.');
	}

	componentDidUpdate () {
		const {bounds} = this.props;

		this.mapRef.current.leafletElement.fitBounds(bounds);
	}

	render () {
		return (
			<LeafletMap
				animate={true}
				className={styles.leafletContainer}
				closePopupOnClick={false}
				doubleClickZoom={true}
				dragging={true}
				easeLinearity={0.35}
				ref={this.mapRef}
				scrollWheelZoom={true}
				zoomControl={false}
			>
				<MarkersList />
				<Controls />
				<Copyright />
			</LeafletMap>
		);
	}
}

export default Geolocation;
