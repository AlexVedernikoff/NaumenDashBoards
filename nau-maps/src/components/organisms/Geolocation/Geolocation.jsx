// @flow
import 'leaflet/dist/leaflet.css';
import 'styles/styles.less';
import Controls from 'components/organisms/Controls';
import Copyright from 'components/atoms/Copyright';
import {GoogleMap, Marker} from 'react-google-maps';
import {Map as LeafletMap} from 'react-leaflet';
import {Map as YandexMap, YMaps} from 'react-yandex-maps';
import MapContentMenu from 'components/organisms/MapContentMenu';
import MapPanel from 'components/organisms/MapPanel';
import Panel from 'components/organisms/Panel';
import PointsList from 'components/molecules/PointsList';
import type {Props} from './types';
import React, {Component} from 'react';
import styles from './Geolocation.less';

export class Geolocation extends Component<Props> {
	constructor (props: Props) {
		super(props);

		this.maxZoom = 16;
		this.minZoom = 3;
		this.mapRef = React.createRef();
	}

	handleChangeAutoZoom = () => {
		const {changeZoom, mapSelect} = this.props;

		let newZoom;

		switch (mapSelect) {
			case 'yandex':
				newZoom = this.mapRef.current.getZoom();
				break;
			case 'google':
				newZoom = this.mapRef.current.getZoom();
				break;
			default:
				newZoom = this.mapRef.current.leafletElement.getZoom();
		}

		changeZoom(newZoom);
	};

	leafletMapLoad = () => {
		const {bounds} = this.props;

		if (bounds && this.mapRef.current) {
			this.mapRef.current.leafletElement.fitBounds(bounds);
		}
	};

	yandexMapLoad = () => {
		const {bounds} = this.props;

		if (bounds && this.mapRef.current) {
			this.mapRef.current.setBounds(bounds);
			this.handleChangeAutoZoom();
		}
	};

	componentDidUpdate (prevProps: Props) {
		const {bounds, goToElement, mapSelect, singleObject, timeUpdate, zoom} = this.props;

		if (this.mapRef.current) {
			if (goToElement) {
				const {geopositions: [position]} = singleObject;
				const {latitude, longitude} = position;
				switch (mapSelect) {
					case 'yandex':
						this.mapRef.current.setCenter([latitude, longitude]);
						break;
					case 'google':
						break;
					default:
						this.mapRef.current.leafletElement.panTo([latitude, longitude]);
				}
			}

			if (prevProps.zoom !== zoom) {
				switch (mapSelect) {
					case 'yandex':
						this.mapRef.current.setZoom(zoom, { duration: 600 });
						break;
					case 'google':
						this.mapRef.current.setZoom(zoom);
						break;
					default:
						this.mapRef.current.leafletElement.setZoom(zoom);
				}
			}

			if (prevProps.timeUpdate !== timeUpdate) {
				switch (mapSelect) {
					case 'yandex':
						this.mapRef.current.setBounds(bounds);
						break;
					case 'google':
						this.mapRef.current.fitBounds(bounds);
						break;
					default:
						this.mapRef.current.leafletElement.fitBounds(bounds);
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
		const {mapSelect, mapsKeyList: {yandex}, resetSingleObject, zoom} = this.props;

		return (
			<YMaps
				query={{apikey: yandex}}
			>
				<YandexMap
					className={styles.mapContainer}
					defaultState={{
						center: [0, 0],
						zoom: zoom
					}}
					instanceRef={this.mapRef}
					modules={['geoObject.addon.balloon', 'geoObject.addon.hint']}
					onClick={resetSingleObject}
					onLoad={e => {
						this.yandexMapLoad(e);
					}}
					options={{
						maxZoom: this.maxZoom,
						minZoom: this.minZoom
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
				center={[0, 0]}
				className={styles.mapContainer}
				maxZoom={this.maxZoom}
				minZoom={this.minZoom}
				onClick={resetSingleObject}
				onzoomend={this.handleChangeAutoZoom}
				ref={this.mapRef}
				whenReady={this.leafletMapLoad}
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
			case 'yandex':
				return this.renderYandexMap();
			case 'google':
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
				<MapContentMenu />
			</div>
		);
	}
}

export default Geolocation;
