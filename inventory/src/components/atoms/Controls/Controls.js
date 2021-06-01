// @flow
import {connect} from 'react-redux';
import Control from 'react-leaflet-control';
import {functions, props} from './selectors';
import PanelIcon from 'icons/PanelIcon';
import type {Props, State} from './types';
import React, {Component} from 'react';
import ReloadIcon from 'icons/ReloadIcon';
import styles from './Controls.less';
import {toast} from 'react-toastify';
import {ZoomControl} from 'react-leaflet';

export class Controls extends Component<Props, State> {
	constructor (props: Object) {
		super(props);
		this.state = {
			filterHover: false,
			panelHover: false,
			reloadHover: false
		};
	}

	openFilter = () => {
		const {toggleFilter} = this.props;
		toggleFilter();
	};

	openPanel = () => {
		const {togglePanel} = this.props;
		togglePanel();
	};

	reloadActiveMarkers = () => {
		const {fetchGeolocation, updatePointsMode} = this.props;

		toast.dismiss();

		if (updatePointsMode === 'getTrails') {
			fetchGeolocation();
		}
	};

	togglePanelHover = () => this.setState({panelHover: !this.state.panelHover});

	toggleReloadHover = () => this.setState({reloadHover: !this.state.reloadHover});

	renderPanelControl = (panelIconColor) =>
		<Control position="topright">
			<div
				className={styles.controlIcon}
				onClick={this.openPanel}
				onMouseEnter={this.togglePanelHover}
				onMouseLeave={this.togglePanelHover}
				title="Панель"
			>
				<PanelIcon color={panelIconColor} />
			</div>
		</Control>;

	renderReloadControl = (reloadIconColor) =>
		<Control position="topright">
			<div
				className={styles.controlIcon}
				onClick={this.reloadActiveMarkers}
				onMouseEnter={this.toggleReloadHover}
				onMouseLeave={this.toggleReloadHover}
				title="Обновить"
			>
				<ReloadIcon color={reloadIconColor} />
			</div>
		</Control>;

	renderZoomControl = () => <ZoomControl zoomInTitle="Приблизить" zoomOutTitle="Отдалить" position="topright" />;

	render () {
		const activeColor = '#EBEBEB';
		const defaultColor = '#FFFFFF';
		const {panelOpen} = this.props;
		const {panelHover, reloadHover} = this.state;
		const panelIconColor = (panelHover || panelOpen) ? activeColor : defaultColor;
		const reloadIconColor = reloadHover ? activeColor : defaultColor;

		return (
			<div className={styles.controlsContainer}>
				{this.renderPanelControl(panelIconColor)}
				{this.renderReloadControl(reloadIconColor)}
				{this.renderZoomControl()}
			</div>
		);
	}
}

export default connect(props, functions)(Controls);
