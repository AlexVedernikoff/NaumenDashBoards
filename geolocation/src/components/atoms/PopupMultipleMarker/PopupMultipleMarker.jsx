// @flow
import NavLeft from 'icons/NavLeft';
import NavRight from 'icons/NavRight';
import {Popup} from 'react-leaflet';
import PopupActions from 'components/atoms/PopupActions';
import PopupHeader from 'components/atoms/PopupHeader';
import PopupOptions from 'components/atoms/PopupOptions';
import type {Props, State} from './types';
import React, {Component} from 'react';
import styles from './PopupMultipleMarker.less';

export class PopupMultipleMarker extends Component<Props, State> {
	constructor (props: Props) {
		super(props);

		const {marker} = props;

		this.state = {
			actionsShadow: false,
			count: marker.data.length,
			dataMarkers: marker.data,
			headerShadow: false,
			markerNumber: 0,
			nextActive: true,
			prevActive: false,
			tmpMarker: marker.data[0]
		};
	}

	togglePopup = () => this.props.openToggle();

	setShadow = (block: 'actionsShadow' | 'headerShadow', shadow: boolean) => {
		if (block === 'actionsShadow') {
			shadow !== this.state.actionsShadow && this.setState({actionsShadow: shadow});
		} else if (block === 'headerShadow') {
			shadow !== this.state.headerShadow && this.setState({headerShadow: shadow});
		}
	};

	togglePopup = () => this.props.openToggle();

	setMarker = (direction: 'prev' | 'next') => () => {
		const {count, dataMarkers, markerNumber, nextActive, prevActive} = this.state;
		let newMarkerNumber = markerNumber;
		let newPrevActive = prevActive;
		let newNextActive = nextActive;

		if (direction === 'prev' && prevActive) {
			newMarkerNumber = markerNumber - 1;
			newPrevActive = newMarkerNumber !== 0;
			newNextActive = true;
		} else if (direction === 'next' && nextActive) {
			newMarkerNumber = markerNumber + 1;
			newPrevActive = true;
			newNextActive = newMarkerNumber !== count - 1;
		}

		this.setState({
			markerNumber: newMarkerNumber,
			nextActive: newNextActive,
			prevActive: newPrevActive,
			tmpMarker: dataMarkers[newMarkerNumber]
		});
	};

	renderNavigation = () => {
		const {count, markerNumber} = this.state;

		return (
			<div className={styles.nav}>
				<div className={styles.navLeft}>
					<div className={styles.iconLeft} onClick={this.setMarker('prev')}>
						<NavLeft />
					</div>
				</div>
				<div className={styles.navCenter} >
					{markerNumber + 1} из {count}
				</div>
				<div className={styles.navRight}>
					<div className={styles.iconRight} onClick={this.setMarker('next')}>
						<NavRight />
					</div>
				</div>
			</div>
		);
	};

	render () {
		const {actions, header, options} = this.state.tmpMarker;
		const {actionsShadow, headerShadow} = this.state;

		return (
			<Popup
				autoClose={false}
				autoPan={true}
				closeButton={true}
				className='requestPopup'
				closeOnEscapeKey={false}
				onOpen={this.togglePopup}
				onClose={this.togglePopup}
			>
				{header && <PopupHeader header={header} classShadow={headerShadow} />}
				{options && <PopupOptions options={options} toggleShadow={this.setShadow} />}
				{actions && <PopupActions actions={actions} classShadow={actionsShadow} />}
				{this.renderNavigation()}
			</Popup>
		);
	}
}
export default PopupMultipleMarker;
