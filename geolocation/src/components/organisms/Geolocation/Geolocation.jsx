// @flow
import 'leaflet/dist/leaflet.css';
import 'styles/styles.less';
import Controls from 'components/atoms/Controls';
import Copyright from 'components/atoms/Copyright';
import Filter from 'components/atoms/Filter';
import MarkersList from 'components/molecules/MarkersList';
import {Map as LeafletMap} from 'react-leaflet';
import Panel from 'components/molecules/Panel';
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

	componentDidUpdate (prevProps: Props) {
		const {bounds, loading} = this.props;
		const {reloadBound} = this.state;

		if (prevProps.loading !== loading || reloadBound) {
			this.mapRef.current.leafletElement.fitBounds(bounds);
			this.setState({reloadBound: false});
		}
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
				maxZoom={19}
				minZoom={2}
				ref={this.mapRef}
				scrollWheelZoom={true}
				zoomControl={false}
			>
				<MarkersList />
				<Controls setBounds={this.reloadBound} />
				<Filter />
				<Panel />
				<Copyright />
			</LeafletMap>
		);
	}
}

export default Geolocation;
