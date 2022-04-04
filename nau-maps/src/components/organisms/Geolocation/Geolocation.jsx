// @flow
import 'leaflet/dist/leaflet.css';
import 'styles/styles.less';
import Controls from 'components/organisms/Controls';
import Copyright from 'components/atoms/Copyright';
import {GoogleMap, Marker} from 'react-google-maps';
import {Map as LeafletMap} from 'react-leaflet';
import {Map as YandexMap, YMaps} from 'react-yandex-maps';
import MapPanel from 'components/organisms/MapPanel';
import Panel from 'components/organisms/Panel';
import PointsList from 'components/molecules/PointsList';
import type {Props} from './types';
import React, {Component} from 'react';
import styles from './Geolocation.less';

export class Geolocation extends Component<Props> {
	constructor (props: Props) {
		super(props);

		this.mapRef = React.createRef();
	}

	yandexMapLoad () {
		/*
		* Задержка для корректной центровки после загрузки и инициализации обьектов на карте
		* */
		window.setTimeout(() => {
			this.mapRef.current.setBounds(this.mapRef.current.geoObjects.getBounds());
		}, 150);
	}

	componentDidUpdate (prevProps: Props) {
		const {bounds, mapSelect, showSingleObject, singleObject, timeUpdate, zoom} = this.props;

		if (this.mapRef.current) {
			if (showSingleObject) {
				const {geoposition: {latitude, longitude}} = singleObject;

				switch (mapSelect) {
					case 'Yandex':
						this.mapRef.current.setCenter([latitude, longitude]);
						break;
					case 'Google':
						break;
					default:
						this.mapRef.current.leafletElement.panTo([latitude, longitude]);
				}
			}

			if (prevProps.zoom !== zoom) {
				switch (mapSelect) {
					case 'Yandex':
						this.mapRef.current.setZoom(zoom, { duration: 600 });
						break;
					case 'Google':
						this.mapRef.current.setZoom(zoom);
						break;
					default:
						this.mapRef.current.leafletElement.setZoom(zoom);
				}
			}

			if (prevProps.timeUpdate !== timeUpdate) {
				switch (mapSelect) {
					case 'Yandex':
						this.mapRef.current.setBounds(this.mapRef.current.geoObjects.getBounds());
						break;
					case 'Google':
						this.mapRef.current.fitBounds(bounds);
						break;
					default:
						this.mapRef.current.leafletElement.fitBounds([
							[bounds._northEast.lat, bounds._northEast.lng],
							[bounds._southWest.lat, bounds._southWest.lng]
						]);
				}
			}
		}
	}

	renderGoogleMap () {
		const {mapSelect, zoom} = this.props;

		return (
			<GoogleMap
				defaultCenter={{lat: 0, lng: 0}}
				defaultZoom={zoom}
			>
				<Marker position={{lat: 0, lng: 0}} />
				<PointsList typeMap={mapSelect} />
			</GoogleMap>
		);
	}

	renderYandexMap () {
		const {mapSelect, resetSingleObject, zoom} = this.props;

		return (
			<YMaps
				query={{apikey: '9e8e2fc4-5970-4ca6-95c5-3e620095e8e3'}}
			>
				<YandexMap
					className={styles.mapContainer}
					instanceRef={this.mapRef}
					modules={['geoObject.addon.balloon', 'geoObject.addon.hint']}
					onClick={resetSingleObject}
					onLoad={this.yandexMapLoad.bind(this)}
					options={{
						maxZoom: 15,
						minZoom: 5
					}}
					state={{
						center: [0, 0],
						zoom: zoom
					}}
				>
					<PointsList typeMap={mapSelect} />
				</YandexMap>
			</YMaps>
		);
	}

	renderOpenMap () {
		const {mapSelect, resetSingleObject, zoom} = this.props;

		return (
			<LeafletMap
				animate={true}
				center={[0, 0]}
				className={styles.mapContainer}
				closePopupOnClick={false}
				doubleClickZoom={true}
				dragging={true}
				maxZoom={15}
				minZoom={5}
				onClick={resetSingleObject}
				ref={this.mapRef}
				scrollWheelZoom={true}
				zoom={zoom}
				zoomControl={false}
			>
				<PointsList typeMap={mapSelect} />
				<Copyright />
			</LeafletMap>
		);
	}

	renderTypeMap () {
		const {mapSelect} = this.props;

		switch (mapSelect) {
			case 'Yandex':
				return this.renderYandexMap();
			case 'Google':
				return this.renderGoogleMap();
			default:
				return this.renderOpenMap();
		}
	}

	render () {
		return (
			<div className={styles.mainContainer}>
				{this.renderTypeMap()}
				<Controls />
				<Panel />
				<MapPanel />
			</div>
		);
	}
}

export default Geolocation;
