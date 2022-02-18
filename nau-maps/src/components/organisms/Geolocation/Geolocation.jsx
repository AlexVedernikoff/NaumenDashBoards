// @flow
import 'leaflet/dist/leaflet.css';
import 'styles/styles.less';
import Controls from 'components/atoms/Controls';
import Copyright from 'components/atoms/Copyright';
import PointsList from 'components/molecules/PointsList';
import {Map as LeafletMap} from 'react-leaflet';
import Panel from 'components/organisms/Panel';
import type {Props} from './types';
import React, {Component} from 'react';
import styles from './Geolocation.less';

export class Geolocation extends Component<Props> {
	mapRef: {current: any};

	constructor (props: Props) {
		super(props);

		this.mapRef = React.createRef();
	}

	resetSingleObject = () => () => {
		const {resetSingleObject} = this.props;
		resetSingleObject();
	};

	componentDidUpdate (prevProps: Props) {
		const {bounds, panelRightPadding, timeUpdate} = this.props;

		if (prevProps.timeUpdate !== timeUpdate) {
			this.mapRef.current.leafletElement.fitBounds(bounds, {paddingBottomRight: [panelRightPadding, 0]});
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
					onClick={this.resetSingleObject()}
					ref={this.mapRef}
					scrollWheelZoom={true}
					zoomControl={false}
				>
					<PointsList />
					<Controls />
					<Copyright />
				</LeafletMap>
				<Panel />
			</div>
		);
	}
}

export default Geolocation;
