// @flow
import {connect} from 'react-redux';
import {divIconMarker} from 'helpers/icon';
import {Marker} from 'react-leaflet';
import type {Props, State} from './types';
import {functions, props} from './selectors';
import React, {Component} from 'react';
import TooltipMarker from 'components/atoms/TooltipMarker';

export class PointMultiple extends Component<Props, State> {
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

	showSingle = () => () => {
		const {point, setSinglePoint} = this.props;

		this.setState({open: true});
		setSinglePoint(point);
	};

	componentDidUpdate (prevProps: Props) {
		const {active} = this.props;

		if (prevProps.active && !active) {
			this.setState({open: false, type: 'multiple'});
		}
		if (!prevProps.active && active) {
			this.setState({open: true, type: 'multipleHover'});
		}
	}

	render () {
		const {color, count, point} = this.props;
		const {data} = point;
		const {type} = this.state;
		const icon = divIconMarker(type, color, count);

		return (
			<Marker
				onMouseOver={this.handleMouseOver}
				onMouseOut={this.handleMouseOut}
				icon={icon}
				position={[point.geoposition.latitude, point.geoposition.longitude]}
				onClick={this.showSingle()}
			>
				<TooltipMarker title={data[0].header} />
			</Marker>
		);
	}
}export default connect(props, functions)(PointMultiple);
