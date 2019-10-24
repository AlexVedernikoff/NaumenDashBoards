// @flow
import {connect} from 'react-redux';
import {iconMarker} from 'helpers/icon';
import {Marker} from 'react-leaflet';
import PopupMarker from 'components/atoms/PopupMarker';
import type {Props, State} from './types';
import {props} from './selectors';
import React, {Component} from 'react';
import TooltipMarker from 'components/atoms/TooltipMarker';

export class StaticMarker extends Component<Props, State> {
	constructor (props: Props) {
		super(props);

		this.state = {
			open: false,
			type: 'static'
		};
	}

	handleMouseOver = () => this.setState({type: 'staticHover'});

	handleMouseOut = () => !this.state.open && this.setState({type: 'static'});

	openPopup = () => this.setState({open: !this.state.open}, () => this.handleMouseOut());

	render () {
		const {color, marker} = this.props;
		const {type} = this.state;
		const icon = iconMarker(type, color);

		return (
			<Marker
				onMouseOver={this.handleMouseOver}
				onMouseOut={this.handleMouseOut}
				icon={icon}
				position={[marker.geoposition.latitude, marker.geoposition.longitude]}
			>
				<TooltipMarker title={marker.header} />
				<PopupMarker marker={marker} openToggle={this.openPopup} />
			</Marker>
		);
	}
}
export default connect(props)(StaticMarker);
