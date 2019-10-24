// @flow
import CircleMarker from 'components/atoms/CircleMarker';
import {connect} from 'react-redux';
import type {Geoposition} from 'types/geoposition';
import {iconMarker} from 'helpers/icon';
import {Marker} from 'react-leaflet';
import PopupMarker from 'components/atoms/PopupMarker';
import type {Props, State} from './types';
import {props} from './selectors';
import React, {Component} from 'react';
import TooltipMarker from 'components/atoms/TooltipMarker';

export class DynamicMarker extends Component<Props, State> {
	constructor (props: Props) {
		super(props);

		this.state = {
			open: false,
			type: 'dynamic'
		};
	}

	renderCircle = (geoposition: Geoposition, color: string) => (<CircleMarker geoposition={geoposition} color={color} />);

	handleMouseOver = () => this.setState({type: 'dynamicHover'});

	handleMouseOut = () => !this.state.open && this.setState({type: 'dynamic'});

	openPopup = () => this.setState({open: !this.state.open}, () => this.handleMouseOut());

	render () {
		const {marker, geoposition, color} = this.props;
		const {type} = this.state;
		const icon = iconMarker(type, color);

		return (
			<Marker
				onMouseOver={this.handleMouseOver}
				onMouseOut={this.handleMouseOut}
				icon={icon}
				position={[geoposition.latitude, geoposition.longitude]}
			>
				{this.renderCircle(marker.geoposition, color)}
				<TooltipMarker title={marker.header} />
				<PopupMarker marker={marker} openToggle={this.openPopup}/>
			</Marker>
		);
	}
}
export default connect(props)(DynamicMarker);
