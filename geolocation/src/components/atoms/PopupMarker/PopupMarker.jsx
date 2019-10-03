// @flow
import React, {Component} from 'react';
import {Popup} from 'react-leaflet';
import type {Props, State} from './types';
import styles from './PopupMarker.less';

export class PopupMarker extends Component<Props, State> {
	renderOption = () => (option: Object, id: number) => {
		const {label, value} = option;
		const key = `option_${id}`;

		return (
			<div key={key} className={styles.popupOption}>
				{label && <span className={styles.popupOptionLeft}>{label}:</span>}
				{value && <span className={styles.popupOptionRight}>{value}</span>}
			</div>
		);
	};

	renderOptions = () => {
		const {marker} = this.props;
		const {options} = marker;

		return options.map(this.renderOption());
	};

	renderAction = () => (action: Object, id: number) => {
		const {link, name} = action;
		const key = `action_${id}`;

		return (
			<a href={link} key={key}>{name}</a>
		);
	};

	renderActions = () => {
		const {marker} = this.props;
		const {actions} = marker;

		return actions.map(this.renderAction());
	};

	render () {
		const {marker} = this.props;

		return (
			<Popup autoClose={false} className='requestPopup'>
				<div className={styles.popupLable} >{marker.header}</div>
				<div className={styles.popupContent}>
					<div className={styles.popupOptions}>
						{/* {this.renderOptions()} */}
					</div>
					<div className={styles.popupActions}>
						{/* {this.renderActions()} */}
					</div>
				</div>
			</Popup>
		);
	}
}
export default PopupMarker;
