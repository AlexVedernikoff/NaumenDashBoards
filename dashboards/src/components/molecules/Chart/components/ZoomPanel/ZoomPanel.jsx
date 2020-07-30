// @flow
import {IconButton} from 'components/atoms';
import {ICON_NAMES} from 'components/atoms/Icon';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';
import {TOOLBAR_HANDLERS, ZOOM_MODES} from 'components/molecules/Chart/constants';

export class ZoomPanel extends PureComponent<Props> {
	handleClickPan = () => {
		const {onChangeIcon, toolbarHandler} = this.props;

		onChangeIcon(ZOOM_MODES.PAN);
		toolbarHandler(TOOLBAR_HANDLERS.TOGGLE_PANNING);
	};

	handleClickZoom = () => {
		const {onChangeIcon, toolbarHandler} = this.props;

		onChangeIcon(ZOOM_MODES.ZOOM);
		toolbarHandler(TOOLBAR_HANDLERS.ZOOM_SELECTION);
	};

	handleClickZoomIn = () => this.props.toolbarHandler(TOOLBAR_HANDLERS.ZOOM_IN);

	handleClickZoomOut = () => this.props.toolbarHandler(TOOLBAR_HANDLERS.ZOOM_OUT);

	handleClickZoomReset = () => this.props.toolbarHandler(TOOLBAR_HANDLERS.ZOOM_RESET);

	render () {
		const {zoomMode} = this.props;
		const {MINUS, ONE_TO_ONE, PAN, PLUS, ZOOM} = ICON_NAMES;

		return (
			<div className={styles.container}>
				<IconButton icon={MINUS} onClick={this.handleClickZoomOut} round={false} tip="Уменьшить" />
				<IconButton icon={PLUS} onClick={this.handleClickZoomIn} round={false} tip="Увеличить" />
				<IconButton icon={ONE_TO_ONE} onClick={this.handleClickZoomReset} round={false} tip="Масштаб по умолчанию" />
				<IconButton
					active={zoomMode === ZOOM_MODES.ZOOM}
					icon={ZOOM}
					onClick={this.handleClickZoom}
					round={false}
					tip="Выделение области"
				/>
				<IconButton
					active={zoomMode === ZOOM_MODES.PAN}
					icon={PAN}
					onClick={this.handleClickPan}
					round={false}
					tip="Перемещение по оси"
				/>
			</div>
		);
	}
}

export default ZoomPanel;
