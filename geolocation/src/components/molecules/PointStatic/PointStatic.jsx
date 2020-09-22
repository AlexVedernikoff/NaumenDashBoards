// @flow
import {connect} from 'react-redux';
import {iconMarker} from 'helpers/icon';
import {Marker} from 'react-leaflet';
import type {Props, State} from './types';
import {functions, props} from './selectors';
import React, {Component} from 'react';
import TooltipMarker from 'components/atoms/TooltipMarker';

export class PointStatic extends Component<Props, State> {
	constructor (props: Props) {
		super(props);

		this.state = {
			open: false,
			type: 'static'
		};
	}

	handleMouseOver = () => this.setState({type: 'staticHover'});

	handleMouseOut = () => !this.state.open && this.setState({type: 'static'});

	showSingle = () => () => {
		const {point, setSinglePoint} = this.props;

		this.setState({open: true});
		setSinglePoint(point);
	};

	componentDidUpdate (prevProps: Props) {
		const {active} = this.props;

		if (prevProps.active && !active) {
			this.setState({open: false, type: 'static'});
		}
		if (!prevProps.active && active) {
			this.setState({open: true, type: 'staticHover'});
		}
	}

	render () {
		const {color, point} = this.props;
		const {data} = point;
		const {type} = this.state;
		const icon = iconMarker(type, color);

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
}
export default connect(props, functions)(PointStatic);
