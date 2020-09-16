// @flow
import {connect} from 'react-redux';
import {divIconMarker} from 'helpers/icon';
import {Marker} from 'react-leaflet';
import PopupMultipleMarker from 'components/atoms/PopupMultipleMarker';
import type {Props, State} from './types';
import {props} from './selectors';
import React, {Component} from 'react';
import TooltipMarker from 'components/atoms/TooltipMarker';

export class MultipleMarker extends Component<Props, State> {
	constructor (props: Props) {
		super(props);

		this.state = {
			type: 'multiple',
			open: false
		};
	}

	handleMouseOver = () => this.state.type !== 'multipleHover' && this.setState({type: 'multipleHover'});

	handleMouseOut = () => !this.state.open && this.setState({type: 'multiple'});

	openPopup = () => this.setState({open: !this.state.open}, () => this.handleMouseOut());

	render () {
		const {color, count, marker} = this.props;
		const {data} = marker;
		const {type} = this.state;
		const icon = divIconMarker(type, color, count);

		return (
			<Marker
				onMouseOver={this.handleMouseOver}
				onMouseOut={this.handleMouseOut}
				icon={icon}
				position={[marker.geoposition.latitude, marker.geoposition.longitude]}
			>
				<TooltipMarker title={data[0].header} />
				{/* <PopupMultipleMarker marker={data} openToggle={this.openPopup} /> */}
			</Marker>
		);
	}
}
export default connect(props)(MultipleMarker);
