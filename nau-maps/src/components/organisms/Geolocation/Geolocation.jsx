// @flow
import 'leaflet/dist/leaflet.css';
import 'styles/styles.less';
import Controls from 'components/atoms/Controls';
import Copyright from 'components/atoms/Copyright';
import {GoogleMap, Marker, withGoogleMap, withScriptjs} from 'react-google-maps';
import {Map as LeafletMap} from 'react-leaflet';
import {Map, YMaps} from 'react-yandex-maps';
import Panel from 'components/organisms/Panel';
import PointsList from 'components/molecules/PointsList';
import type {Props} from './types';
import React, {Component} from 'react';
import styles from './Geolocation.less';

export class Geolocation extends Component<Props> {
	static defaultProps = {
		googleMapUrl: 'https://maps.googleapis.com/maps/api/js?key=AIzaSySEDDFRGFQSw2OjzDEE1-tDsN7vw&v=3.exp&libraries=geometry,drawing,places'
	};

	constructor (props: Props) {
		super(props);

		this.yMaps = null;
		this.mapRef = React.createRef();
	}

	resetSingleObject = () => {
		const {resetSingleObject} = this.props;
		resetSingleObject();
	};

	componentDidUpdate (prevProps: Props) {
		const {bounds, panelRightPadding, timeUpdate} = this.props;

		if (prevProps.timeUpdate !== timeUpdate && this.mapRef.current) {
			this.mapRef.current.leafletElement.fitBounds(bounds, {paddingBottomRight: [panelRightPadding, 0]});
		}
	}

	renderGoogleMap () {
		return (
			<GoogleMap
				defaultCenter={{lat: -34.397, lng: 150.644}}
				defaultZoom={8}
			>
				<Marker position={{lat: -34.397, lng: 150.644}} />
				<PointsList typeMap={'Google'} />
			</GoogleMap>
		);
	}

	renderYandexMap () {
		return (
			<YMaps
				query={{apikey: '9e8e2fc4-5970-4ca6-95c5-3e620095e8e3'}}
			>
				<Map
					className={styles.mapContainer}
					instanceRef={this.mapRef}
					modules={['geoObject.addon.balloon', 'geoObject.addon.hint']}
					onClick={this.resetSingleObject}
					options={{
						size: 'small'
					}}
					state={{
						center: [57.8, 60.61],
						zoom: 8
					}}
				>
					<PointsList typeMap={'Yandex'} />
				</Map>
			</YMaps>
		);
	}

	renderOpenMap () {
		return (
			<LeafletMap
				animate={true}
				className={styles.mapContainer}
				closePopupOnClick={false}
				doubleClickZoom={true}
				dragging={true}
				easeLinearity={0.35}
				maxZoom={19}
				minZoom={2}
				onClick={this.resetSingleObject}
				ref={this.mapRef}
				scrollWheelZoom={true}
				zoomControl={false}
			>
				<PointsList />
				<Controls />
				<Copyright />
			</LeafletMap>
		);
	}

	render () {
		return (
			<div className={styles.mainContainer}>
				{this.renderYandexMap()}
				<Panel />
			</div>
		);
	}
}

export default Geolocation;
