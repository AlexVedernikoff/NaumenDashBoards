// @flow
import {connect} from 'react-redux';
import Control from 'react-leaflet-control';
import {functions, props} from './selectors';
import React, {Component} from 'react';
import ReloadIcon from 'icons/ReloadIcon';
import styles from './Controls.less';
import type {Props, State} from './types';
import {ZoomControl} from 'react-leaflet';

export class Controls extends Component<Props, State> {
	constructor (props: Object) {
		super(props);
		this.state = {
			hover: false
		};
	}
	reloadActiveMarkers = () => {
		const {reloadGeolocation, dynamicMarkersUuids} = this.props;
		dynamicMarkersUuids && reloadGeolocation(dynamicMarkersUuids);
	}

	toggleHover = () => this.setState({hover: !this.state.hover})

	render () {
		return (
			<div>
				<Control position='topright'>
					<div
						className={styles.reloadPoints}
						onClick={this.reloadActiveMarkers}
						onMouseEnter={this.toggleHover}
						onMouseLeave={this.toggleHover}
					>
						<ReloadIcon color={this.state.hover ? '#EBEBEB' : '#FFFFFF'} />
					</div>
				</Control>
				<ZoomControl zoomInTitle='Приблизить' zoomOutTitle='Отдалить' position='topright' />
			</div>
		);
	}
}
export default connect(props, functions)(Controls);
