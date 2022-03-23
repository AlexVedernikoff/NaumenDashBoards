// @flow
import {connect} from 'react-redux';
import {functions, props} from './selectors';
import {LatLng} from 'leaflet/dist/leaflet-src.esm';
import Line from 'components/atoms/Line';
import type {Props, State} from './types';
import React, {Component} from 'react';
import TooltipPoint from 'components/atoms/TooltipPoint';

export class Part extends Component<Props, State> {
	constructor (props: Props) {
		super(props);

		this.state = {
			open: false
		};
	}

	shouldComponentUpdate (nextProps: Props) {
		return nextProps.color !== this.props.color;
	}

	showSingle = () => () => {
		const {part, setSingleObject} = this.props;
		const data = {
			data: part.data,
			geoposition: part.geopositions[0],
			type: part.type
		};

		this.setState({open: true});
		setSingleObject(data);
	};

	render () {
		const {color, part} = this.props;
		const {data, geopositions} = part;
		const {header} = data;

		const positions = geopositions.map(geoposition => new LatLng(geoposition.latitude, geoposition.longitude));

		return (
			<Line color={color} geopositions={positions} onClick={this.showSingle()}>
				<TooltipPoint sticky={true} title={header} />
			</Line>
		);
	}
}

export default connect(props, functions)(Part);
