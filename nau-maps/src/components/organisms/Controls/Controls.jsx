// @flow
import cn from 'classnames';
import {connect} from 'react-redux';
import {functions, props} from './selectors';
import MapSelectIcon from 'icons/MapSelectIcon';
import type {Props, State} from './types';
import React, {Component} from 'react';
import ReloadIcon from 'icons/ReloadIcon';
import styles from './Controls.less';
import ZoomInIcon from 'icons/ZoomInIcon';
import ZoomOutIcon from 'icons/ZoomOutIcon';

export class Controls extends Component<Props, State> {
	renderMapSelect = () => {
		const {toggleMapPanel} = this.props;

		return (
			<button
				className={cn([styles.control, styles.controlBottom])}
				onClick={toggleMapPanel}
				title="Выбор карты"
			>
				<MapSelectIcon />
			</button>
		);
	};

	renderReloadControl = () => {
		const {fetchGeolocation} = this.props;

		return (
			<button
				className={cn([styles.control, styles.controlTop])}
				onClick={fetchGeolocation}
				title="Обновить"
			>
				<ReloadIcon />
			</button>
		);
	};

	renderZoomInControl = () => {
		const {zoomIn} = this.props;

		return (
			<button
				className={styles.control}
				onClick={zoomIn}
				title="Приблизить"
			>
				<ZoomInIcon />
			</button>
		);
	};

	renderZoomOutControl = () => {
		const {zoomOut} = this.props;

		return (
			<button
				className={styles.control}
				onClick={zoomOut}
				title="Отдалить"
			>
				<ZoomOutIcon />
			</button>
		);
	};

	render () {
		return (
			<div className={styles.controlsContainer}>
				{this.renderReloadControl()}
				{this.renderZoomInControl()}
				{this.renderZoomOutControl()}
				{this.renderMapSelect()}
			</div>
		);
	}
}

export default connect(props, functions)(Controls);
