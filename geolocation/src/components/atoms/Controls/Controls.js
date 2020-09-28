// @flow
import {connect} from 'react-redux';
import Control from 'react-leaflet-control';
import {functions, props} from './selectors';
import FilterIcon from 'icons/FilterIcon';
import React, {Component} from 'react';
import PanelIcon from 'icons/PanelIcon';
import ReloadIcon from 'icons/ReloadIcon';
import styles from './Controls.less';
import {toast} from 'react-toastify';
import type {Props, State} from './types';
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

	reloadActiveMarkers = () => {
		const {fetchGeolocation, reloadGeolocation, setBounds, updatePointsMode} = this.props;

		if (updatePointsMode === 'getPoints') {
			toast.dismiss();
			/*
				Ждем закртыия всех toasts
			*/
			setTimeout(() => fetchGeolocation(), 500);
		} else {
			reloadGeolocation();
		}
		setBounds();
	};

	openFilter = () => {
		const {toggleFilter} = this.props;

		toggleFilter();
	};

	openPanel = () => {
		const {togglePanel} = this.props;

		togglePanel();
	};

	togglePanelHover = () => this.setState({panelHover: !this.state.panelHover});

	toggleReloadHover = () => this.setState({reloadHover: !this.state.reloadHover});

	toggleFilterHover = () => this.setState({filterHover: !this.state.filterHover});

	render () {
		const activeColor = '#EBEBEB';
		const defaultColor = '#FFFFFF';
		const {filterActive, filterOpen, filterShow, panelOpen} = this.props;
		const {filterHover, panelHover, reloadHover} = this.state;
		const panelIconColor = (panelHover || panelOpen) ? activeColor : defaultColor;
		const filterIconColor = (filterHover || filterOpen) ? activeColor : defaultColor;
		const reloadIconColor = reloadHover ? activeColor : defaultColor;

		return (
			<div>
				<Control position='topright'>
					<div className={styles.controlIcon} />
				</Control>
				<Control position='topright'>
					<div
						className={styles.controlIcon}
						onClick={this.openPanel}
						onMouseEnter={this.togglePanelHover}
						onMouseLeave={this.togglePanelHover}
						title="Панель"
					>
						<PanelIcon color={panelIconColor} />
					</div>
				</Control>
				{filterShow && <Control position='topright'>
					<div
						className={styles.controlIcon}
						onClick={this.openFilter}
						onMouseEnter={this.toggleFilterHover}
						onMouseLeave={this.toggleFilterHover}
						title="Фильтр"
					>
						<FilterIcon color={filterIconColor} active={filterActive} />
					</div>
				</Control>}
				<Control position='topright'>
					<div
						className={styles.controlIcon}
						onClick={this.reloadActiveMarkers}
						onMouseEnter={this.toggleReloadHover}
						onMouseLeave={this.toggleReloadHover}
						title="Обновить"
					>
						<ReloadIcon color={reloadIconColor} />
					</div>
				</Control>
				<ZoomControl zoomInTitle='Приблизить' zoomOutTitle='Отдалить' position='topright' />
			</div>
		);
	}
}
export default connect(props, functions)(Controls);
