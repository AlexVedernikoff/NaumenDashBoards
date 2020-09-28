// @flow
import 'leaflet/dist/leaflet.css';
import 'styles/styles.less';
import Controls from 'components/atoms/Controls';
import Copyright from 'components/atoms/Copyright';
import Filter from 'components/molecules/Filter';
import L from 'leaflet';
import PointsList from 'components/molecules/PointsList';
import {Map as LeafletMap} from 'react-leaflet';
import Panel from 'components/organisms/Panel';
import type {Props, State} from './types';
import React, {Component} from 'react';
import styles from './Geolocation.less';

export class Geolocation extends Component<Props, State> {
	mapRef: {current: any};

	constructor (props: Props) {
		super(props);

		this.state = {
			reloadBound: false
		};

		this.mapRef = React.createRef();
	}

	reloadBound = () => this.setState({reloadBound: true});

	centerOnSinglePoint () {
		const {singlePoint} = this.props;
		const {geoposition} = singlePoint;
		const {latitude, longitude} = geoposition;

		this.mapRef.current.leafletElement.panTo(new L.LatLng(latitude, longitude));
	}

	resetSinglePoint = () => () => {
		const {resetSinglePoint} = this.props;

		resetSinglePoint();
	};

	componentDidUpdate (prevProps: Props) {
		const {bounds, loading, showSinglePoint} = this.props;
		const {reloadBound} = this.state;

		if (showSinglePoint) {
			this.centerOnSinglePoint();
		} else {
			this.mapRef.current.leafletElement.fitBounds(bounds);
		}

		if (prevProps.loading !== loading || reloadBound) {
			this.mapRef.current.leafletElement.fitBounds(bounds);
			this.setState({reloadBound: false});
		}
	}

	render () {
		return (
			<div className={styles.mainContainer}>
				<LeafletMap
					animate={true}
					className={styles.leafletContainer}
					closePopupOnClick={false}
					doubleClickZoom={true}
					dragging={true}
					easeLinearity={0.35}
					maxZoom={19}
					minZoom={2}
					onClick={this.resetSinglePoint()}
					ref={this.mapRef}
					scrollWheelZoom={true}
					zoomControl={false}
				>
					<PointsList />
					<Controls setBounds={this.reloadBound} />
					<Copyright />
				</LeafletMap>
				<Filter />
				<Panel />
			</div>
		);
	}
}

export default Geolocation;
