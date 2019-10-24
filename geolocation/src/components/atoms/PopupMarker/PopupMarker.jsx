// @flow
import {Popup} from 'react-leaflet';
import PopupActions from 'components/atoms/PopupActions';
import PopupHeader from 'components/atoms/PopupHeader';
import PopupOptions from 'components/atoms/PopupOptions';
import type {Props, State} from './types';
import React, {Component} from 'react';

class PopupMarker extends Component<Props, State> {
	constructor (props: Props) {
		super(props);

		this.state = {
			actionsShadow: false,
			headerShadow: false
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

	render () {
		const {marker} = this.props;
		const {actions, header, options} = marker;
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
			</Popup>
		);
	}
}

export default PopupMarker;
